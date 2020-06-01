# docs @ http://flask.pocoo.org/docs/1.0/quickstart/

from flask import Flask, jsonify, request, render_template, Response
from flask_cors import CORS, cross_origin
from vsphere import Vsphere_Controller
from attack_engine import Attack
import threading
import pytz
from datetime import datetime
from dateutil import parser
from configuration import Configuration
from Automated_Tools.ansible_controller import AnsibleController

app = Flask(__name__)
CORS(app, support_credentials=True)

RUNNING_SESSIONS = {}


@cross_origin(supports_credentials=True)
@app.route('/post_command', methods=['GET', 'POST'])
def get_ticket():

    # POST request
    if request.method == 'POST':

        print(request.get_json())  # parse as JSON
        command = request.json.get("command")
        if command == "request_ticket":
            vsphere = Vsphere_Controller()
            if vsphere.connection == True and request.is_json:

                vm_name = request.json.get("vmname")
                user_id = request.json.get("user_id")
                token = request.json.get("token")

                if user_id in RUNNING_SESSIONS:
                    if not user_session_expired(user_id):
                        if RUNNING_SESSIONS[user_id]["machine_name"] == vm_name and RUNNING_SESSIONS[user_id]["token"]==token:
                            ticket = vsphere.get_vm_ticket_by_vm_name(vm_name)
                        else:
                            return Response("Invalid request", status=400)
                    else:
                        return Response("User session has expired", status=400)
                else:
                    return Response("User has no running sessions", status=400)
            else:
                print("connection not established with vcenter")
            return jsonify(ticket)
        
        elif command == "end_session":
            user_id = request.json.get("user_id")
            token = request.json.get("token")
            vm_name = request.json.get("machine_name")
            
            if user_id in RUNNING_SESSIONS:
                if RUNNING_SESSIONS[user_id]["token"] == token:
                    del RUNNING_SESSIONS[user_id]
                    snaphot_reverting_thread = threading.Thread(target=ansible_revert_to_snapshot, args=(vm_name,), name="snapshot-reverting-for-"+str(user_id))
                    snaphot_reverting_thread.start()
                    
                    return Response("Session Ended", status=200)
                else:
                    return Response("Unauthorized Request", status=401)
            else:
                return Response("Session already deleted", status=200)
        
        elif command == "check_ticket":
            user_id = request.json.get("user_id")
            vm_name = request.json.get("vmname")

            if user_id in RUNNING_SESSIONS:
                if not user_session_expired(user_id):
                    if RUNNING_SESSIONS[user_id]["machine_name"] == vm_name:
                        return jsonify("valid")
                    else:
                        return jsonify("Invalid")
                else:
                    return jsonify("Invalid")
            else:
                return jsonify("Invalid")
   
            
    # GET request
    else:
        message = {'greeting': 'Hello from Flask!'}
        return jsonify(message)  # serialize and use JSON headers


@app.route('/attack_request', methods=['GET', 'POST'])
def attack_request():
    if request.method == 'POST':
        if request.is_json:
            # try:
                # print(request.json)
                attack_session_id = request.json.get("attack_session_id")
                user_id = request.json.get("user_id")
                platform = request.json.get("platform")
                category = request.json.get("category")
                machine_name = request.json.get("machine_name")
                end_time = request.json.get("end_time")
                tactic_name = request.json.get("tactic_name")
                procedure_id = request.json.get("procedure_id")
                # token = request.json.get("token")

                session_already_running = session_handler(**request.json)
                print(session_already_running)
                if (session_already_running):
                    print("already\n")
                    print(RUNNING_SESSIONS)
                    return Response("Session Already Started", status=400)
                else:

                    print("not already\n")
                    print(RUNNING_SESSIONS)
                    # raise Exception("ee")
                    thread = threading.Thread(target=start_attack, args=(
                        attack_session_id, procedure_id, user_id, platform, category, machine_name, end_time, tactic_name,), name="session-for-"+attack_session_id)
                    thread.start()
                    print("attack executed")
                    return (jsonify("Starting Attack"))

            # except:
                return Response("Attack Machine Error", status=400)
        else:
            print("It Only accepts json requests")
    else:
        return jsonify("Get request")


def start_attack(attack_session_id, attack_id, user_id, platform, category, machine_name, end_time, tactic_name):
    try:
        AttackObject = Attack(attack_session_id=attack_session_id, user_id=user_id, platform=platform,
                              category=category, machine_name=machine_name, end_time=end_time, tactic_name=tactic_name)
        # Defense_Evasion
        AttackObject.parser(category, attack_id=attack_id, tactic=tactic_name)
    except Exception as e:
        print(e)
    #AttackObject.parser("campaign", "C1")
    #AttackObject.parser("scenario", "S.01.1091.1",tactic="Initial_Access", )  # S.01.1190.1


def session_handler(**kwargs):

    if kwargs["user_id"] in RUNNING_SESSIONS:

        try:
            if(user_session_expired(kwargs["user_id"])):
                session = {
                    kwargs["user_id"]:
                    {
                        "attack_session_id": kwargs["attack_session_id"],
                        "platform": kwargs["platform"],
                        "category": kwargs["category"],
                        "machine_name": kwargs["machine_name"],
                        "end_time": kwargs["end_time"],
                        "token": kwargs["token"]
                    }
                }
                RUNNING_SESSIONS.update(session)
                return False

        except:
            pass
        return True
    else:

        session = {
            kwargs["user_id"]:
            {
                "attack_session_id": kwargs["attack_session_id"],
                "platform": kwargs["platform"],
                "category": kwargs["category"],
                "machine_name": kwargs["machine_name"],
                "end_time": kwargs["end_time"],
                "token": kwargs["token"]
            }
        }
        RUNNING_SESSIONS.update(session)
        return False


def user_session_expired(user_id):
    end = parser.isoparse(RUNNING_SESSIONS[user_id]["end_time"])
    now = datetime.now(pytz.utc)
    try:
        if(now >= end):
            del RUNNING_SESSIONS[user_id]
            return True
        else:
            return False
    except:
        return False

def clear_finished_users_data():
    try:
        threading.Timer(30.0, clear_finished_users_data).start()

        '''
        To avoid "RunTimeError: dictionary changed size"
        Enforce a list to dict.
        '''

        for user in list(RUNNING_SESSIONS):
            print(user)
            user_session_expired(user)
            
    except:
        pass

def ansible_revert_to_snapshot(vm_name):
        conf_obj = Configuration()
        conf_obj.set_dyanamic_property("target", "vm_name", vm_name)
        conf_obj.set_dyanamic_property("target", "snapshot_name", vm_name+"_attack_configured")
        ansible_obj = AnsibleController(conf_obj=conf_obj)
        ansible_obj.set_purpose(
            task_type="revert_to_snapshot")
        ansible_obj.prepare_playbook_for_snapshot_reverting()
        ansible_obj.execute_playbook()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)


'''
@app.route('/test')
def test_page():
    # look inside `templates` and serve `index.html`
    return render_template('WebMKS_SDK_2.1.0/index.html')
'''
