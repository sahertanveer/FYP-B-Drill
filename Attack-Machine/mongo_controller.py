from pymongo import MongoClient
from bson.objectid import ObjectId
import colorama
from colorama import Fore, Style, init
import logging


class MongoController():

    def __init__(self, **kwargs):#attack_session_id):
        self.scenario_id = None
        self.conf_obj = kwargs["conf_obj"]
        self.mongo_client = MongoClient(self.conf_obj.get_mongodb_options('ip'), int(self.conf_obj.get_mongodb_options('port')))
        self.db = self.mongo_client[self.conf_obj.get_mongodb_options('db_name')]  # Evaluation-test
        self.user_collection = self.db["candidates"]  # Users
        self.evaluation_collection = self.db["attack_sessions_evaluations"]
        self.attack_sessions_collection = self.db["attack_sessions"]
        self.test_history_collection = self.db["test_history"]
        self.evaluation_id = None
        self.user_test_history = None
        self.attack_session_id = kwargs["attack_session_id"]
        self.session_recorder = logging.getLogger(kwargs["attack_session_id"])
        init()

    def continue_session(self):
        self.attack_session = self.attack_sessions_collection.find_one({'_id':ObjectId(self.attack_session_id)})
        print(self.attack_session)
        if (self.attack_session["in_progress"] == True):
            return True
        else:
            return False

    def set_evaluation_id(self, session_id):
        self.evaluation = self.evaluation_collection.find_one(
            {'attack_session_id': ObjectId(session_id)})
        self.evaluation_id = ObjectId(self.evaluation['_id'])
        self.session_recorder.info("evaluation id:" + str(self.evaluation_id))

    def set_scenario_id(self, scenario_id):
        self.scenario_id = scenario_id    #.replace('.', '_')
    

    def get_user_history(self, id):
        user_id = ObjectId(id)
        self.user_test_history = self.test_history_collection.find_one(
            {'user_id': user_id})
        return self.user_test_history
    
    def update_session_tactics(self, attacks):
        Fore.YELLOW
        self.session_recorder.info(
              "************************Updating Session Tactics**********************")
        Style.RESET_ALL
        self.attack_update_obj = {
            "$set":{
                "tactics":attacks
            }
        }
        self.result = self.attack_sessions_collection.update_one(
            {"_id": ObjectId(self.attack_session_id)}, self.attack_update_obj)

        if (self.result.matched_count == 1):
            self.session_recorder.info("Tacics list has been appended in list has been appended in evaluation")


    def update_scenario_evaluation(self, questions, actual_answers, try_count):
        Fore.YELLOW
        self.session_recorder.info(
              "************************Updating Evaluation form for user**********************")
        Style.RESET_ALL
        self.evaluation_update_obj = {
            "$set": {
                self.scenario_id: {
                    "questions": questions,
                    "actual_answers": actual_answers,
                    "user_answers": [],
                    "answered": False,
                    "score":{
                        "total_score":(len(actual_answers) * 10),
                        "obtained_score":0,
                        "try_count": try_count
                    }
                }
            },
            "$push": {
                "in_progress_scenarios": self.scenario_id
            }
        }
        #self.session_recorder.info(self.evaluation_update_obj)
        self.result = self.evaluation_collection.update_one(
            {"_id": self.evaluation_id}, self.evaluation_update_obj)

        if (self.result.matched_count == 1):
            self.session_recorder.info(self.scenario_id + " has been appended in evaluation")

    # def check(self):
    #     self.users = self.user_collection.find_one({'username':'mmali277'})
    #     self.users = self.user_collection.find_one({'_id': ObjectId('5dadcaaa63c1e30f9d547fc4')})
    #     self.evaluation = self.evaluation_collection.find_one({'user_id':ObjectId('5dadcaaa63c1e30f9d547fc4')})
    #     self.session_recorder.info("Mongo users")
    #     self.session_recorder.info(self.users)
    #     self.session_recorder.info("Session Evaluation:")
    #     self.session_recorder.info(self.evaluation['S.01.1190.1']["Questions"])

# if __name__ == "__main__":
#     mon =MongoController()
#     mon.set_evaluation_id(ObjectId('5db2d18298626859a007f8c4'))
#     mon.set_scenario_id("S.05.1089.2")
#     list_q = [' What is Ip address of Attacker?', ' Write the path of directory in which payload is present? ', ' What is the name of malicious software or service? ', " Write Attacker's port of listening?"]
#     list_a = ['172.20.16.203', '/home/Tools/Phantom-Evasion/', 'payloaaad', '4444']
#     mon.update_scenario_evaluation(list_q, list_a)
