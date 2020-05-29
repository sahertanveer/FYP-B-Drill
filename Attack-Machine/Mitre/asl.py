import json
import copy
import configparser
from shutil import which
from colorama import Fore, Style, init
from configuration import Configuration
import logging
import random


class ASLEngine:

    def __init__(self, **kwargs):  # ,t_type, id, tactic=None, configuraion_obj=None

        self.file_data = None
        # self.file_name = None
        # self.temp = None
        # self.scenario_list = []
        self.tools = []
        self.tree = []
        self.active_tactics = []
        self.scenarios = None
        self.pre_req_scenarios = None
        self.post_req_scenarios = None
        self.platform = None
        self.history = None

        init()
        self.training_type = kwargs["t_Type"]
        self.tactic = kwargs["tactic"]
        self.training_id = kwargs["attack_id"]
        self.user_id = kwargs["user_id"]
        self.mongo_controller_obj = kwargs["mongo_controller_obj"]
        # self.conf = Configuration()
        self.conf = kwargs["configuraion_obj"]
        self.session_recorder = logging.getLogger(
            self.conf.get_dyanamic_property("session_id", category="session"))
        self.get_history()

        if (self.training_type == "Campaign"):
            self.file_name = "Mitre/campaigns.json"

        elif (self.training_type == "Scenario"):
            self.file_name = "Mitre/"+self.tactic+".json"

        else:
            self.session_recorder.info(
                "Training/Testing Type should be either campaign or scenario")

    def read_file(self, file_name):
         with open(file_name) as json_file:
            self.file_data = json.load(json_file)

    def campaign_parser(self):
        print(Fore.YELLOW)
        self.session_recorder.info(
            "....................Parsing the Campaign....................")
        print(Style.RESET_ALL)
        self.read_file(self.file_name)
        self.platform = (
            self.file_data[self.training_id]["environment"]["platform"]).lower()
        # for platform in self.file_data:
        #     self.session_recorder.info(platform)
        if self.platform.lower() == self.conf.get_dyanamic_property("platform", category="target"):

            self.read_file("Mitre/Initial_Access.json")
            self.scenarios = self.file_data[self.platform]

            score_list = []
            technique_list = []
            proc_count = 0
            for procedure_id in self.scenarios:
                if self.check_user_history("Initial_Access", procedure_id):
                    #TODO what to do when all are used by candidate
                    score_list.append(int(self.history["Initial_Access"][procedure_id]["max_score"]))
                    technique_list.append(procedure_id)
                    # pass
                    print("\nInitial access Pass\n")
                else:
                    self.training_id = procedure_id
                    self.dynamic_parser()
                    print("\nInitial access Regular\n")
                    break
                proc_count += 1

                if proc_count >= len(self.scenarios):
                        '''
                        if all scenarios are visited by candidate
                        and have same marks in all of them
                        '''
                        same = False
                        same = all(elem == score_list[0] for elem in score_list)
                        if(same):
                            print("\nInitial access Same\n")
                            rand_idx = random.randrange(len(score_list))
                            self.training_id = technique_list[rand_idx]
                            
                            '''
                            if all scenarios are visited by candidate
                            then select the one in which he/she has
                            min score.
                            '''
                        else:
                            print("\nInitial access Min\n")
                            ind = score_list.index(min(score_list))
                            self.training_id = technique_list[ind] 
                        self.dynamic_parser()
                        break                     

                # break

        else:
            self.session_recorder.info(False)

        self.session_recorder.info(self.tree)
        self.check_tools()
        # print(self.tree)
        return self.tree

    def get_history(self):

        self.history = self.mongo_controller_obj.get_user_history(self.user_id)
        #self.session_recorder.info(self.history)

    def check_user_history(self, tactic, procedure_id):

        # if self.history:
        #     for proc_obj in self.history[tactic]:
        #         if proc_obj["proc_id"] == procedure_id:
        try:
            if self.history and self.history[tactic]:
                if procedure_id in self.history[tactic]:
                    return True
        except:
            pass
        return False

    def dynamic_parser(self):
        
        while(True):

            score_list = []
            technique_list = []
            tactic_list = []

            if "dynamic_procedures" in self.scenarios[self.training_id]:

                proc_count = 0
                proc_len = len(self.scenarios[self.training_id]["dynamic_procedures"])
                self.root = Node(**self.scenarios[self.training_id])
                self.inorder_tree_exploring(self.root)

                for procs in self.scenarios[self.training_id]["dynamic_procedures"]:

                    #TODO check in user's history (Done...)
                    if self.check_user_history(procs["sub_procedure"]["scenario_tactic"], procs["sub_procedure"]["proc_id"]):
                        #TODO what to do when all are used by candidate
                        score_list.append(int(self.history[procs["sub_procedure"]["scenario_tactic"]][procs["sub_procedure"]["proc_id"]]["max_score"]))
                        technique_list.append(procs["sub_procedure"]["proc_id"])
                        tactic_list.append(procs["sub_procedure"]["scenario_tactic"])
                        print("\nOther Pass\n")
                        pass
                    else:

                        self.file_name = procs["sub_procedure"]["scenario_tactic"]
                        self.training_id = procs["sub_procedure"]["proc_id"]
                        self.read_file("Mitre/"+self.file_name+".json")
                        # requires exception handling (take care of case sensitivity)
                        self.scenarios = self.file_data[self.platform]
                        print("\nOther Regular\n")
                        break
                    proc_count += 1

                    if proc_count >= proc_len:
                        '''
                        if all scenarios are visited by candidate
                        and have same marks in all of them
                        '''
                        same = False
                        same = all(elem == score_list[0] for elem in score_list)
                        if(same):
                            rand_idx = random.randrange(len(score_list))
                            self.file_name = tactic_list[rand_idx]
                            self.training_id = technique_list[rand_idx]
                            self.read_file("Mitre/"+self.file_name+".json")
                            self.scenarios = self.file_data[self.platform]
                            print("\nOther Same\n")  
                            break
                            
                        else:
                            '''
                            if all scenarios are visited by candidate
                            then select the one in which he/she has
                            min score.
                            '''
                            ind = score_list.index(min(score_list))
                            self.file_name = tactic_list[ind]
                            self.training_id = technique_list[ind]
                            self.read_file("Mitre/"+self.file_name+".json")
                            self.scenarios = self.file_data[self.platform]
                            print("\nOther Min\n")
                            break                        

            else:
                self.root = Node(**self.scenarios[self.training_id])
                self.inorder_tree_exploring(self.root)
                break

    def scenario_parser(self):
        print(Fore.YELLOW)
        self.session_recorder.info(
            "....................Parsing Scenario....................")
        print(Style.RESET_ALL)
        self.platform = self.conf.get_dyanamic_property("platform", category="target")
        self.read_file(self.file_name)
        self.scenarios = self.file_data[self.platform]

        '''
        uncommentize following code if u want dynamic scenario parsing
        '''
        # for procedure_id in self.scenarios:
        #     if self.check_user_history(self.scenarios[procedure_id]["scenario_tactic"]["name"], procedure_id):
        #         #TODO what to do when all are used by candidate
        #         pass
        #     elif self.scenarios[procedure_id]["procedure"]["classification"]["scenario_type"] == "active_scenario":
        #         self.training_id = procedure_id
        #         break
        #     else:
        #         #TODO ensure that all ASL have scenario type defined correctly to prevent this part of code to execute
        #         pass


        self.root = Node(**self.scenarios[self.training_id])
        self.inorder_tree_exploring(self.root)

        self.session_recorder.info(self.tree)
        self.check_tools()
        return self.tree

    def inorder_tree_exploring(self, root):

        if root:
            if self.check_prereqs(root):
                for pre_req in root.pre_req:
                    self.inorder_tree_exploring(pre_req) #TODO check here if dont work

            self.tools.append(root.val['procedure']['execution']['tool'])
            self.append_in_tree(root)

            if self.check_postreqs(root):
                for post_req in root.post_req:
                    self.inorder_tree_exploring(post_req)

    def append_in_tree(self, root):

        tactic_name = root.val["scenario_tactic"]["name"]
        technique_id = root.val["procedure"]["classification"]["classification_id"]
        try_count = 1

        try:
            if(root.val["procedure"]["classification"]["scenario_type"] == "active_scenario"):
                self.active_tactics.append(str(root.val["scenario_tactic"]["name"]))
                try_count = int(self.get_try_count(tactic_name, technique_id) + 1)
                
        except:
            try_count = 1

        steps_of_execution = {
            "name": root.val['procedure']["classification"]["name"],
            "tactic": tactic_name,
            "try_count": try_count

        }

        steps_of_execution.update(root.val['procedure']["execution"])

        if "access" in steps_of_execution:
            del steps_of_execution["access"]

        if "prerequisite" in steps_of_execution:
            del steps_of_execution["prerequisite"]

        if "postrequisite" in steps_of_execution:
            del steps_of_execution["postrequisite"]

        self.tree.append(
            {

                technique_id: steps_of_execution
            }
        )

    def get_try_count(self, tactic, procedure_id):
        if self.history and self.history[tactic]:
            if procedure_id in self.history[tactic]:
                return self.history[tactic][procedure_id]["try_counts"]
        return 0

    def check_prereqs(self, root):
        execution_data = root.val["procedure"]["execution"]
        if ("prerequisite" in execution_data):
            #pre_req_len = len(execution_data["prerequisite"])
            #active_count = 0
            for prerequisite in execution_data["prerequisite"]:
                if prerequisite["type"] == "active_scenario" and self.training_type.lower() == "campaign":
                    pass
                    # active_count +=1 
                    #return False
                else:
                    self.prereq_id = prerequisite["proc_id"]
                    self.prereq_file_name = "Mitre/" + \
                       prerequisite["scenario_tactic"] + ".json"

                    self.read_file(self.prereq_file_name)
                    self.pre_req_scenarios = self.file_data[self.platform]
                    root.pre_req.append(Node(**self.pre_req_scenarios[self.prereq_id]))

                    #return True
            if len(root.pre_req) > 0:
                return True
            else:
                return False

        else:
            return False

    def check_postreqs(self, root):
        execution_data = root.val["procedure"]["execution"]
        if ("postrequisite" in execution_data):
            for postrequisite in execution_data["postrequisite"]:
                if postrequisite["type"] == "active_scenario" and self.training_type.lower() == "campaign":
                    pass
                #     return False
                else:
                    self.postreq_id = postrequisite["proc_id"]
                    self.postreq_file_name = "Mitre/" + \
                        postrequisite["scenario_tactic"] + ".json"

                    self.read_file(self.postreq_file_name)
                    self.post_req_scenarios = self.file_data[self.platform]
                    root.post_req.append(Node(**self.post_req_scenarios[self.postreq_id]))

                    # return True
            if len(root.post_req) > 0:
                return True
            else:
                return False

        else:
            return False

    def check_tools(self):
        print(Fore.YELLOW)
        self.session_recorder.info(
            "*****************************Check tools status*****************************")
        print(Style.RESET_ALL)
        self.session_recorder.info(self.tools)

        def colored_print(tool):
            if which(tool) is not None:
                self.session_recorder.info(
                    tool + " = "+Fore.GREEN+"True"+Style.RESET_ALL)
            else:
                self.session_recorder.info(
                    tool + " = "+Fore.RED+"False"+Style.RESET_ALL)

        for tool in self.tools:
            if tool == "phantom-evasion":
                try:
                    colored_print(self.conf.get_tool_path_property(tool))
                except:
                    self.session_recorder.error(
                        tool+" Tool not specified in configuration file")

            elif tool == "metasploit":
                colored_print('msfconsole')

            elif tool == "ansible":
                colored_print(tool)

            elif tool == "meterpreter":
                try:
                    self.session_recorder.info(tool + " = "+Fore.YELLOW +
                                               self.conf.get_tool_path_property(tool)+Style.RESET_ALL)
                except:
                    self.session_recorder.error(
                        tool+" Tool not specified in configuration file")

            elif tool == "cmd":
                try:
                    self.session_recorder.info(tool + " = "+Fore.YELLOW +
                                               self.conf.get_tool_path_property(tool)+Style.RESET_ALL)
                except:
                    self.session_recorder.info(
                        tool+" Tool not specified in configuration file")


class Node:
    def __init__(self, **key):
        self.pre_req = []
        self.post_req = []
        self.val = key

#

    # parserObj = ASLEngine("scenario", "TA01_T1190_P1", "Initial_Access")
    # self.session_recorder.info(parserObj.scenario_parser())

# "name": root.val['procedure']["classification"]["name"],
        # "tactic": root.val["scenario_tactic"]["name"]
        # dict(info.items() + steps_of_execution.items())
