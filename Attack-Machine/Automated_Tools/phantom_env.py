import pexpect
import os
from Automated_Tools.ansible_controller import AnsibleController
from colorama import Fore, Style, init
import logging


class PhantomEnv:

    def __init__(self, **kwargs):
        self.in_progress_scenario = kwargs["in_prg_scenario"]
        self.attacks = kwargs["attks"]
        self.conf = kwargs["conf_obj"]
        self.session_recorder = logging.getLogger(self.conf.get_dyanamic_property("session_id", category="session"))
        self.commands_list = []
        self.child_process = None
        self.options = {}
        init()
        

    def parse_tool(self):

        if self.attacks[self.in_progress_scenario]["tool-name"] == "phantom-evasion":
                self.phantom_evasion()

    def phantom_evasion(self):

        Fore.YELLOW
        self.session_recorder.info("....................Spawning Phantom Evasion....................")
        Style.RESET_ALL
        self.session_recorder.info("Reason: " +
              str(self.attacks[self.in_progress_scenario]["name"]))
        self.options = self.attacks[self.in_progress_scenario]['options']
        self.set_options()
        self.execute_tool(
            self.get_absolute_path_to_phantom_file(), self.get_command())
        self.set_output_file_name()

    def get_absolute_path_to_phantom_file(self):
        return str(self.conf.get_tool_path_property("phantom-evasion"))

    def set_output_file_name(self):
        if ("window" in self.attacks[self.in_progress_scenario]["platform"].lower()):
            self.conf.set_dyanamic_property("common_tactic",
                "output_file_name", self.conf.get_dyanamic_property("PAYLOAD_NAME")+".exe")

    def get_command(self):
        return str(self.attacks[self.in_progress_scenario]["command-prefix"] +
                   " "+self.get_absolute_path_to_phantom_file())

    def execute_tool(self, path, cmd_prefix=None):
        self.child_process = pexpect.spawn(
            cmd_prefix, cwd=os.path.dirname(path))
        self.commands_list = self.attacks[self.in_progress_scenario]["input"]

        for a in self.commands_list:
            for key, value in a.items():
                self.child_process.expect(key)

                if "_$ref" in value:
                    self.child_process.sendline(
                        str(self.assign_option_values(value)))
                    self.session_recorder.info(str(key)+": "+str(self.assign_option_values(value)))

                else:
                    self.child_process.sendline(value)
                    self.session_recorder.info(str(key)+": "+str(value))

    def assign_option_values(self, option_key):
        return self.attacks[self.in_progress_scenario]['options'][option_key]

    def set_options(self):
        #self.session_recorder.info(self.options)
        #self.session_recorder.info(self.attacks[self.in_progress_scenario]['options'])
        for opt in self.options:
            if opt == 'LHOST_$ref':
                try:
                    self.attacks[self.in_progress_scenario]['options'][opt] = self.conf.get_network_options(
                        "LHOST")
                    print(self.conf.get_network_options(
                        "LHOST"))
                except:
                    self.session_recorder.info("['LHOST'] option not needed...")

            elif opt == 'LPORT_$ref':
                try:
                    self.attacks[self.in_progress_scenario]['options'][opt] = self.conf.get_dyanamic_property(
                        self.options[opt]) #"LPORT")
                except:
                    self.session_recorder.info("['LPORT'] option not needed...")

            elif opt == 'PAYLOAD_NAME_$ref':
                try:
                    self.attacks[self.in_progress_scenario]['options'][opt] = self.conf.get_dyanamic_property(
                        opt)
                        # "output_file_name", category="common_tactic")
                except:
                    self.session_recorder.info("['output_file_name'] option not needed...")

            else:
                self.session_recorder.error("option not found!")
