
from pymetasploit3.msfconsole import MsfRpcConsole
from pymetasploit3.msfrpc import MsfRpcClient
import time
import collections
from Mitre.asl import ASLEngine
from Automated_Tools.metasploit_env import MetasploitEnv
from Automated_Tools.ansible_controller import AnsibleController
from Automated_Tools.phantom_env import PhantomEnv
from Mitre.challenges import Challenge
import os
import threading
import ctypes
from thread_controller import ThreadController
from configuration import Configuration
from pymongo import MongoClient
from mongo_controller import MongoController
from bson.objectid import ObjectId
from colorama import Fore, Style, init
import logging


class Attack():

    # because for non metasploit hack it False will also break the program
    # connection_made = True

    def __init__(self, **kwargs):

        self.attacks_list = []
        self.attack = {}
        self.appended_evaluation = []
        self.parser_obj = None
        self.metasploit_obj = None
        self.tool = None
        self.in_progress_scenario = None
        self.custom_tools_obj = None
        self.ansible_handler_obj = None
        self.phantom_handler_obj = None
        self.challenges_obj = None
        self.params = kwargs
        # self.attack_session_id = kwargs["attack_session_id"]
        # self.user_id = kwargs["user_id"]
        init()
        #self.mongo_controller_obj.set_evaluation_id(ObjectId('5daf2bb1d7729b24c8e507ac'))

        self.conf = Configuration()
        self.build_environment()
        self.mongo_controller_obj = MongoController(attack_session_id = self.conf.get_dyanamic_property("session_id", category="session"), conf_obj = self.conf)
        # self.conf.set_session_recording_configuration()

        # self.conf.set_dyanamic_property("session_id", self.attack_session_id)
        # self.conf.set_dyanamic_property("platform", kwargs["platform"])
        # self.conf.set_dyanamic_property("category", kwargs["category"])
        # self.conf.set_dyanamic_property("end_time", kwargs["end_time"])
        # self.conf.set_dyanamic_property("vm_name", kwargs["machine_name"])
        # self.conf.load_machines()
        

        # self.session_recorder =  logging.getLogger(self.conf.get_dyanamic_property("session_id"))
        self.thread_controller_obj = ThreadController(conf_obj=self.conf)
        self.metasploit_obj = MetasploitEnv(conf_obj=self.conf, thread_controller_obj=self.thread_controller_obj)
        self.ansible_handler_obj = AnsibleController(conf_obj=self.conf)
        self.ansible_revert_to_snapshot()
        # self.script_delay = int(self.conf.get_attack_options("script_delay"))
        self.challenges_obj = Challenge(conf_obj=self.conf)
        

    # def raise_exception(self, thread_to_be_terminated):
    #     self.thread_id = thread_to_be_terminated.get_id(
    #         thread_to_be_terminated)
    #     self.res = ctypes.pythonapi.PyThreadState_SetAsyncExc(self.thread_id,
    #                                                           ctypes.py_object(SystemExit))
    #     if self.res > 1:
    #         ctypes.pythonapi.PyThreadState_SetAsyncExc(self.thread_id, 0)
    #         self.session_recorder.info('Exception raise failure')

    # def get_id(self, thread_obj):

    #         # returns id of the respective thread
    #         if hasattr(thread_obj, '_thread_id'):
    #             return thread_obj._thread_id
    #         for id, thread in threading._active.items():
    #             if thread is thread_obj:
    #                 return id

    # def execute_windows_command(self, cmd):

    #     def exec_windows_command_thread():
    #         Fore.YELLOW
    #         self.session_recorder.info("....................Executing Winows Command........................")
    #         Style.RESET_ALL
    #         time.sleep(self.script_delay)
    #         self.session_recorder.info(self.metasploit_obj.shell.run_shell_cmd_with_output(
    #             cmd, None, exit_shell=False))

    #     self.windows_command_thread = threading.Thread(
    #         target=exec_windows_command_thread, name="windows_command_thread")
    #     self.windows_command_thread.start()
    #     self.thread_controller_obj.register_threads(self.conf.get_dyanamic_property("current_step"),self.windows_command_thread)
    #     self.wait_count = 0
    #     self.terminate_count = 0

    #     while(True):
    #         time.sleep(self.script_delay)

    #         if(self.terminate_count >= 3):
    #             self.session_recorder.critical(
    #                 "Teminating Command Execution: Some Problem ocurred in windows command execution")
    #             # self.thread_controller_obj.raise_exception(self.windows_command_thread)
    #             self.thread_controller_obj.unregister_and_stop_thread(self.conf.get_dyanamic_property("current_step"))
    #             self.windows_command_thread.join()
    #             break

    #         elif(self.wait_count >= 5):
    #             self.session_recorder.error("Command took too long, Terminating Thread " +
    #                   self.windows_command_thread.name)
    #             # self.thread_controller_obj.raise_exception(self.windows_command_thread)
    #             self.thread_controller_obj.unregister_and_stop_thread(self.conf.get_dyanamic_property("current_step"))
    #             self.windows_command_thread.join()
    #             self.session_recorder.info("executing windows command thread again")
    #             self.windows_command_thread = threading.Thread(
    #                     target=exec_windows_command_thread, name="windows_command_thread")
    #             self.windows_command_thread.start()
    #             self.thread_controller_obj.register_threads(self.conf.get_dyanamic_property("current_step"),self.windows_command_thread)
    #             self.terminate_count += 1
    #             self.wait_count = 0

    #         elif self.windows_command_thread.is_alive() is False:
    #             self.session_recorder.info("Command Executed")
    #             break

    #         else:
    #             self.session_recorder.info("Waiting for Execution")
    #             self.wait_count += 1

    def start_attack(self):

        if self.tool == 'metasploit':
            self.metasploit_obj.initialize_variables(
                in_prg_scenario=self.in_progress_scenario, attks=self.attack)
            self.metasploit_obj.initial_metasploit()

            # try:
            #     if(self.attack[self.in_progress_scenario]["separate-thread"] == "yes"):
            #          self.session_recorder.info("Stssarting Another Thread")
            #          self.metsploit_thread = threading.Thread(
            #              target=self.metasploitObj.initial_metasploit, name="metasploit-thread")
            #          self.metsploit_thread.start()
            #          time.sleep(self.scriptDelay)
            #     else:
            #         self.metasploitObj.initial_metasploit()

            # except:
            #     self.session_recorder.info("Multi Threading not needed")
            #     self.metasploitObj.initial_metasploit()

        elif self.tool == 'cmd':
            #self.session_recorder.info(self.attack)
            # self.execute_windows_command(
            #     self.attack[self.in_progress_scenario]['command'])
            self.metasploit_obj.execute_windows_command(
                self.attack[self.in_progress_scenario]['command'])

        elif self.tool == 'meterpreter':
            if self.attack[self.in_progress_scenario]['type'] == "script":
                self.metasploit_obj.execute_meterpreter_script(
                    (self.attack[self.in_progress_scenario]['script']))
            else:
                self.metasploit_obj.execute_meterpreter_command(
                    (self.attack[self.in_progress_scenario]['command']))

        elif self.tool == 'phantom-evasion':
            self.phantom_handler_obj = PhantomEnv(
                in_prg_scenario=self.in_progress_scenario, attks=self.attack, conf_obj=self.conf)
            self.phantom_handler_obj.phantom_evasion()

        elif self.tool == 'ansible':
            if (self.attack[self.in_progress_scenario]["name"] == "copy_file_to_windows"):
                self.ansible_copy_file_to_windows()

            elif (self.attack[self.in_progress_scenario]["name"] == "execute_file_on_windows"):
                self.ansible_exexcute_win_command(
                    self.conf.get_dyanamic_property("output_file_name", category="common_tactic"))

        else:
            self.session_recorder.critical("tool not found")

    def end_attack(self):

        #destroying metasploit environment
        try:
            self.metasploit_obj.destroy_env()
        except:
            Fore.YELLOW 
            self.session_recorder.warning(
                  "....................No Session available to destroy........................")
            Style.RESET_ALL

        self.conf.remove_ports()
        # self.ansible_revert_to_snapshot()
        self.conf.drop_session_recording_configuration()

    def check_exceptions(self):
         if self.tool == 'metasploit':
            if "SESSION" in self.attack[self.in_progress_scenario]["options"]:
                self.metasploit_obj.execute_meterpreter_command("background")
            else:
                self.session_recorder.info("No Exceptions Found")

    def parser(self, category, attack_id=None, tactic=None):

        try:
            self.parser_obj = ASLEngine(t_Type=category, attack_id=attack_id, tactic=tactic, configuraion_obj=self.conf,
                                        mongo_controller_obj=self.mongo_controller_obj, user_id=self.conf.get_dyanamic_property("user_id", category="session"))
            # if category == "Campaign":
            #     self.parser_obj = ASLEngine(t_Type=category, id=id, tactic=tactic, configuraion_obj=self.conf,
            #                            mongo_controller_obj=self.mongo_controller_obj, user_id=self.user_id)
            # else:
            #     self.parser_obj = ASLEngine(t_Type=category, id=id, tactic=tactic, configuraion_obj=self.conf,
            #                            mongo_controller_obj=self.mongo_controller_obj, user_id=self.user_id)


            if category == "Campaign":
                self.attacks_list = self.parser_obj.campaign_parser()  # CampaignParser()

            elif category == "Scenario":
                self.attacks_list = self.parser_obj.scenario_parser()  # ScenarioParser()

            self.mongo_controller_obj.update_session_tactics(self.parser_obj.active_tactics)
            # return
            # for item in self.attacks_list:
            #for i in range(len(self.attacks_list)):
            index=0
            steps = 1
            one_round_of_errors = False
            back_propagation = False
            # current_step = i
            while index<len(self.attacks_list):

                '''
                check session has been ended.
                '''
                
                if(self.mongo_controller_obj.continue_session()):
                
                    try:
                        self.conf.set_dyanamic_property("common", "current_step",index)
                        if(back_propagation):
                            self.thread_controller_obj.stop_all_upper_step_threads(index)
            
                        back_propagation=False
                        item = self.attacks_list[index]
                        self.attack = dict(item)
                        
                        for scenario in item:
                            self.conf.set_dyanamic_property("session", "current_tactic", self.attack[scenario]['tactic'])
                            self.in_progress_scenario = scenario
                            self.tool = self.attack[scenario]['tool']
                            self.check_exceptions()
                            
                            self.start_attack()

                            if (self.tool == 'metasploit' and not self.metasploit_obj.connection_made):
                                self.end_attack()
                                return

                            # eval_tactic = self.attack[self.in_progress_scenario]['tactic']
                            eval_scenario = self.in_progress_scenario

                            '''
                            If some error occurs, then the already appended 
                            evaluation questions should not be appended again.
                            '''
                            
                            if eval_scenario not in self.appended_evaluation:
                                self.evaluation_data()
                                self.appended_evaluation.append(eval_scenario)
                            
                            Fore.CYAN
                            self.session_recorder.info("******[Scenario-ID: "+ scenario +"Tactic: "+self.attack[scenario]['tactic']+" executed]******")
                            Style.RESET_ALL
                            index +=1
                            

                    except Exception as e:
                        if(one_round_of_errors):
                            raise Exception("Ending Attack due to bulk of errors")
                        index -= steps
                        self.session_recorder.critical("Exception Occured somewhere!!")
                        self.session_recorder.info(e)
                        Fore.YELLOW
                        self.session_recorder.info(
                        "....................Going "+str(steps)+" step back........................")
                        Style.RESET_ALL
                        steps +=1
                        back_propagation = True
                        if(index < 0):
                            one_round_of_errors=True
                            index=0
                            steps = 1
                else:
                    index = len(self.attacks_list)
                    self.session_recorder.critical("Session timedout")
                    

            #self.metasploit_obj.execute_meterpreter_command("getuid") #remove later, check for privEsc
            self.end_attack()
        
        except Exception as e:
            self.session_recorder.critical(e)
            self.mongo_controller_obj.raise_error_flag_in_attack_session()
            self.session_recorder.critical("Final Exception, Execution Stopped for session id"+ self.conf.get_dyanamic_property("session_id", category="session"))
            self.thread_controller_obj.stop_all_upper_step_threads(0)
            self.end_attack()
        

    def evaluation_data(self):
        self.challenges_obj.explore_questions(
            self.attack[self.in_progress_scenario]['tactic'], self.in_progress_scenario)
        if self.challenges_obj.questions:
            self.mongo_controller_obj.set_scenario_id(
                self.in_progress_scenario)
            self.mongo_controller_obj.set_evaluation_id(self.conf.get_dyanamic_property("session_id", category="session"))
            self.mongo_controller_obj.update_scenario_evaluation(
                self.challenges_obj.questions, self.challenges_obj.actual_answers, self.attack[self.in_progress_scenario]["try_count"])
            #self.session_recorder.info(self.challenges_obj.questions)
            #self.session_recorder.info(self.challenges_obj.actual_answers)
    
    def build_environment(self):
        self.build_session_configuration()
        self.build_target_configuration()
        self.conf.load_machine_ip()
        self.conf.set_session_recording_configuration()
        self.session_recorder =  logging.getLogger(self.conf.get_dyanamic_property("session_id", category="session"))
        self.load_database()
        self.script_delay = int(self.conf.get_attack_options("script_delay"))
        self.conf.set_dyanamic_property("target", "snapshot_name", self.params["machine_name"]+"_attack_configured")

    def build_session_configuration(self):
        self.conf.set_dyanamic_property("session", "session_id", self.params["attack_session_id"])
        self.conf.set_dyanamic_property("session", "category", self.params["category"])
        self.conf.set_dyanamic_property("session", "end_time", self.params["end_time"])
        self.conf.set_dyanamic_property("session", "user_id", self.params["user_id"])
        
    def build_target_configuration(self):
        self.conf.set_dyanamic_property("target", "platform", self.params["platform"])
        self.conf.set_dyanamic_property("target", "vm_name", self.params["machine_name"])

    def load_database(self):
        self.mongo_client = MongoClient(self.conf.get_mongodb_options(
            "ip"), int(self.conf.get_mongodb_options("port")))
        self.db = self.mongo_client["Evaluation-test"]
        self.user_collection = self.db["Users"]
        self.evaluation_collection = self.db["Evaluation"]

    def ansible_copy_file_to_windows(self):

        self.ansible_handler_obj.set_purpose(
            task_type="copy_file_to_windows")
        self.ansible_handler_obj.prepare_playbook_for_copying_file_to_windows_vm()
        self.ansible_handler_obj.execute_playbook()

    def ansible_revert_to_snapshot(self):

        self.ansible_handler_obj.set_purpose(
            task_type="revert_to_snapshot")
        self.ansible_handler_obj.prepare_playbook_for_snapshot_reverting()
        self.ansible_handler_obj.execute_playbook()

    def ansible_exexcute_win_command(self, win_command=None):
        self.session_recorder.info("command is " + win_command)
        self.ansible_handler_obj.set_purpose(
            task_type="execute_file_on_windows", win_command=win_command)
        self.ansible_handler_obj.prepare_playbook_for_executing_windows_command()
        self.ansible_handler_obj.execute_playbook()


if __name__ == "__main__":

    AttackObject = Attack(user_id="5dc0f7ce94b55437f887807a")
    #AttackObject.parser("scenario", "S.01.1191.1", tactic="Initial_Access")

    #AttackObject.parser("campaign", "C1")
    #AttackObject.parser("scenario", None, tactic="Privilege_Escalation") #S.04.1088.1
    AttackObject.parser("scenario", None, tactic="Defense_Evasion")
    ###AttackObject.parser("scenario", "S.05.1089.1", tactic="Defense_Evasion")
    # AttackObject.parser("scenario", "S.24.1345.1", tactic="Build_Capabilities")
