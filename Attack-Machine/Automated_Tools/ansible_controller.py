import sys
import yaml
import pexpect
import uuid
import os
import time
import logging
#from configuration import Configuration
#from ruamel.yaml import YAML


class AnsibleController:

    def __init__(self, **kwargs):
        self.yml = yaml
        self.conf = kwargs["conf_obj"]
        self.file_path = None
        self.yml_script = None
        self.win_command = None
        self.task_type = None
        self.child_process = None
        self.output_file_path = None
        try:
            self.session_recorder = logging.getLogger(self.conf.get_dyanamic_property("session_id", category="common_tactic"))
        except:
            '''
            When called from flask_api for snapshot reverting.
            '''
            pass
    def select_file(self, task_type):
        if (task_type == "revert_to_snapshot"):
            self.file_path = self.conf.get_ansible_scripts(
                "revert_snapshot_file")

        elif(task_type == "copy_file_to_windows"):
            self.file_path = self.conf.get_ansible_scripts(
                "copy_file_to_windows_vm_file")

        elif(task_type == "execute_file_on_windows"):
            self.file_path = self.conf.get_ansible_scripts(
                "execute_file_on_windows_vm_file")

    def set_purpose(self, task_type, win_command=None):
        '''
        task type can be:
        
        revert_to_snapshot      [vm_name]
        copy_file_to_windows [source_file_path, destination_file_path]
        execute_file_on_windows [win_command, destination_file_path]
        '''

        self.task_type = task_type
        self.win_command = win_command
        self.select_file(task_type)

    def read_file(self):
        with open(self.file_path) as yml_file:
            self.yml_script = self.yml.load(yml_file)

    def write_file(self):
        self.output_file_path = self.file_path + str(uuid.uuid1())+".yml"
        # focus on file name it creates new file... //Todo
        with open(self.output_file_path, 'w') as yml_file:
            self.yml.dump(self.yml_script, yml_file)

    def prepare_playbook_for_snapshot_reverting(self):

        self.read_file()

        for tags in self.yml_script:
            for parameters in tags['tasks']:
                parameters['vmware_guest_snapshot']['name'] = self.conf.get_dyanamic_property(
                    "vm_name", category="target")
                parameters['vmware_guest_snapshot']['snapshot_name'] = self.conf.get_dyanamic_property(
                    "snapshot_name", category="target")
                break

        self.write_file()

    def prepare_playbook_for_executing_windows_command(self):

        self.read_file()

        for tags in self.yml_script:
            tags["hosts"] = self.conf.get_dyanamic_property("vm_name", category="target")
            for parameters in tags['tasks']:
                parameters['win_command'] = self.win_command
                parameters['args']['chdir'] = self.conf.get_dyanamic_property(
                    "generated_payload_destination_file_path", category="common_tactic")  # self.destination_file_path
                break

        self.write_file()

    def prepare_playbook_for_copying_file_to_windows_vm(self):

        self.read_file()
        self.temp_full_path = os.path.join(self.conf.get_dyanamic_property(
            "generated_payload_source_file_path", category="common_tactic"), self.conf.get_dyanamic_property("output_file_name", category="common_tactic"))
        for tags in self.yml_script:
            try:
                tags["hosts"] = self.conf.get_dyanamic_property("vm_name",category="target")
            except:
                self.session_recorder.info("[vm_name] key not found")
            for parameters in tags['tasks']:
                parameters['win_copy']['src'] = self.temp_full_path
                parameters['win_copy']['dest'] = self.conf.get_dyanamic_property(
                    "generated_payload_destination_file_path", category="common_tactic")
                break

        self.write_file()

    def execute_playbook(self):
        self.child_process = pexpect.spawn(
            'ansible-playbook '+self.output_file_path)
        self.child_process.interact()

        #delete the temp file
        if os.path.exists(self.output_file_path):
            os.remove(self.output_file_path)
        else:
            self.session_recorder.info("The file does not exist")


if __name__ == "__main__":
    ansible_handler_obj = AnsibleController()

    # ansible_handler_obj.set_purpose(task_type="revert_to_snapshot", vm_name="win_10_1511")
    # ansible_handler_obj.prepare_playbook_for_snapshot_reverting()
    # ansible_handler_obj.revert_to_snapshot()

    # ansible_handler_obj.set_purpose(task_type="copy_file_to_windows_vm", source_file_path="/home/Tools/Phantom-Evasion/check.exe", destination_file_path="%USERPROFILE%\\Downloads\\")
    # ansible_handler_obj.prepare_playbook_for_copying_file_to_windows_vm()
    # ansible_handler_obj.execute_playbook()

    # ansible_handler_obj.set_purpose(task_type="execute_file_on_windows_vm", destination_file_path="%USERPROFILE%\\Downloads\\", win_command="payload.exe")
    # ansible_handler_obj.prepare_playbook_for_executing_windows_command()
    # ansible_handler_obj.execute_playbook()
