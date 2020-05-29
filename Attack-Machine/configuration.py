import configparser
import uuid
import os
import socket
import random
import logging



PORTS = []


class Configuration:

    config_file_name = "B-Drill.conf"
    ansible_hosts = "/etc/ansible/hosts"

    def __init__(self):

        self.temp_config_file_data = None
        self.temp_config_file_name = None

        self._threads = {}
        #self._config = self.conf
        self.config = configparser.ConfigParser()
        self.vm_config = configparser.ConfigParser()
        self.config.optionxform = str
        self.vm_config.optionxform = str
        self.load_configuration()


        self._config = {
            "Build_Capabilities":{
                "LPORT": None,
            },
            "Initial_Access": {
                "LPORT": None,
            },
            "Persistence": {
                "LPORT": None,
                "SERVICE_NAME": None,
                "REMOTE_EXE_NAME": None,            # make it in C folder I think
                "REMOTE_EXE_PATH": None,
                "REXEPATH": None,                   # make it equal to generated_payload_source_file_path + output_file_name
                "REXENAME": None,
                "STARTUP": "SYSTEM",                # USER,SYSTEM or SERVICE (we can make 2 scenarios from this one as the registry path is different in each one, Service is giving rror check later) (User's registy key is in HKU by the way and does not give session on reboot)
                "BLOB_REG_NAME": None,
                "RUN_NAME": None,
            },
            "common_tactic": {
                "RHOSTS": None,
                "LHOST":self.get_network_options("LHOST"),
                "generated_payload_source_file_path": "/home/Tools/Phantom-Evasion/",
                "generated_payload_destination_file_path": "%USERPROFILE%\\Downloads\\",
                "PAYLOAD_NAME": None,               #"payloaaad",
                "output_file_name": None            # makes from combination of payload_name and (.exe or other extension)
            },
            "target": {
                                                    # "hosts": "win_10_1511",  # can make compulsory for ease #host name for copying file
                "vm_name": None,                    # compulsory #win_10_1511 #Ubuntu-16.04
                "platform": None,
                "snapshot_name": None               # snapshot name should be like "{vm_name}_attack_configured"
            },
                                                    # "machine_name":None,
            "session": {
                "end_time": None,
                "current_tactic": None,
                "category": None,
                "session_id": None,
                "logging_directory": "/home/FYP/Sessions/",
                "user_id": None

            },
            "common": {
                "current_step": 0,

            }
        }
                                                    #dont give space in names
        self.names = ["scv_hosts", "updateService", "session", "mongo", "mysql", "kaspersky", "antimalware", "GTA-IV", "Telegram"]
        self.window_paths = ["%USERPROFILE%\\Downloads", "%USERPROFILE%\\Documents", "%USERPROFILE%\\Music", "%USERPROFILE%\\Videos", "%TEMP%"]
        self.linux_paths = []
        self.ports = []
        self.used_paths = []
        self.used_names =[]
                                                    # compulsory #win_10_1511_attack_configured #Ubuntu_16.04.2_attack_configured
                                                    # "snapshot_name": "win_10_1511_attack_configured",  # (TODO)


       
# self._config = {

#             "source_file_path": "/home/Tools/Phantom-Evasion/",
#             "destination_file_path": "%USERPROFILE%\\Downloads\\",
#             "payload_name": "payloaaad",
#             "output_file_name": "payload.exe",
#             # "hosts": "win_10_1511",  # can make compulsory for ease #host name for copying file
#             "vm_name": "win_10_1511",  # compulsory #win_10_1511 #Ubuntu-16.04
#             "platform": None,
#             # "machine_name":None,
#             "end_time":None,
#             "current_tactic":"Initial_Access",
#             "current_step":0,
#             "category": None,
#             # compulsory #win_10_1511_attack_configured #Ubuntu_16.04.2_attack_configured
#             "snapshot_name": "win_10_1511_attack_configured", #(TODO)
#             "RHOSTS": "172.20.16.203",  # compulsory (Done Dynamically)
#             "LPORT": "4444",  # compulsory
#             "session_id" : "",
#             "logging_directory": "/home/FYP/Sessions/",

#         }

       
    def load_configuration(self):
        self.config.read(self.config_file_name)

    def load_machine_ip(self):
        self.vm_config.read(self.ansible_hosts)
        self.set_dyanamic_property( "common_tactic",
            "RHOSTS", self.vm_config[self.get_dyanamic_property("vm_name", category="target")]["ansible_host"])

    '''
    Other than tactic keys, All will have category defined
    '''

    def get_dyanamic_property(self, property_name, category=None,):

        if(category != None):
            if category in self._config.keys():  # we don't want KeyError
                if property_name in self._config[category].keys():
                    return self._config[category][property_name]
                else:
                    self.session_recorder.info("Property Not Found")
                    return None
            else:
                self.session_recorder.info("Category Not Found")
                return None
        else:
            if "_$ref->" in property_name:
                new_prop = property_name.split("_$ref->")
                self._config[self._config["session"]["current_tactic"]][new_prop[0]] = self._config[new_prop[1]][new_prop[0]]
                return self._config[self._config["session"]["current_tactic"]][new_prop[0]]
                
            elif self._config["session"]["current_tactic"] in self._config.keys():
                if "_$ref" in property_name:
                    property_name = property_name.replace("_$ref", "")

                if property_name in self._config[self._config["session"]["current_tactic"]].keys():
                    if (self._config[self._config["session"]["current_tactic"]][property_name] != None):
                        return self._config[self._config["session"]["current_tactic"]][property_name]
                    else:
                        self._config[self._config["session"]["current_tactic"]][property_name] = self.populate_value(property_name)
                        return self._config[self._config["session"]["current_tactic"]][property_name]
                
                elif property_name in self._config["common_tactic"].keys():
                    if (self._config["common_tactic"][property_name] != None):
                        return self._config["common_tactic"][property_name]
                    else:   # Not req now
                        self._config["common_tactic"][property_name] = self.populate_value(property_name)
                        return self._config["common_tactic"][property_name]
                
                else:
                    self.session_recorder.info("Property Not Found")
                    return None


            

            else:
                self.session_recorder.info("Category Not Found")
                return None

            # return self._config[property_name]

    def populate_value(self, prop):
        if "LPORT" in prop:
            return self.assign_port()
            
        elif "NAME" in prop.upper():
            if prop == "REXENAME":
                return self.assign_name() + ".exe"
            else:
                return self.assign_name()
        if "PATH" in prop:
            if "REXEPATH" in prop:
                return str(self._config["common_tactic"]["generated_payload_source_file_path"]) + str( self._config["common_tactic"]["output_file_name"]) 
                
            elif "REMOTE_EXE_PATH" in prop:
                return  self.assign_windows_path()

    def assign_name(self):
        while(True):
            name = str(random.choice(self.names))
            self.names.remove(name)
            return name

    def assign_windows_path(self):
        while(True):
            path = str(random.choice(self.window_paths))
            self.window_paths.remove(path)
            return path
    
    def assign_linux_path(self):
        while(True):
            path = str(random.choice(self.linux_paths))
            self.linux_paths.remove(path)
            return path

    def assign_port(self):
        while(True):
            rand = random.randint(10000, 50000)
            if self.isFree(rand) and rand not in PORTS:
                self.ports.append(rand)
                PORTS.append(rand)
                return rand

    def remove_ports(self):
        for i in self.ports:
            try:
                PORTS.remove(i)
            except ValueError:
                pass  

    def isFree(self, port):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            s.connect(self.get_network_options("LHOST"), int(port))
            s.shutdown(2)
            return False
        except:
            return True

    '''
    def get_dyanamic_property(self, property_name):
        if property_name not in self._config.keys():  # we don't want KeyError
            self.session_recorder.info("Property Not Found")
            return None  # just return None if not found
        return self._config[property_name]

    '''

    def set_dyanamic_property(self, category, property_name, property_value):
        if property_name not in self._config[category].keys():  # we don't want KeyError
            self.session_recorder.info("Property Not Found")
            return None  # just return None if not found
        self._config[category][property_name] = property_value

    def get_tool_path_property(self, tool_name):
        return self.config["TOOL PATHS"][tool_name]

    def get_network_options(self, property_name):
        return self.config["NETWORK OPTIONS"][property_name]

    def get_attack_options(self, property_name):
        return self.config["ATTACK OPTIONS"][property_name]

    def get_ansible_scripts(self, property_name):
        return self.config["ANSIBLE SCRIPTS"][property_name]

    def get_vsphere_options(self, property_name):
        return self.config["VSPHERE OPTIONS"][property_name]

    def get_mongodb_options(self, property_name):
        return self.config["MONGODB OPTIONS"][property_name]

    def set_thread_entry(self, step, thread_obj):
        try:
            self._threads.update({step: thread_obj})
        except:
            self.session_recorder.critical(
                "exception occured while adding a thread entry")

    def get_thread_from_entry(self, step):
        try:
            return self._threads[step]
        except:
            self.session_recorder.warning("No thread entry found to get")

    def remove_thread_entry(self, step):
        try:
            self._threads.pop(step)
        except:
            self.session_recorder.warning("No thread entry found to remove")

    def get_all_threads(self):
        return self._threads

    def set_session_recording_configuration(self):
        self.session_recorder = logging.getLogger(
            self.get_dyanamic_property("session_id", category="session"))
        self.file_handler = logging.FileHandler(self.get_dyanamic_property(
            "logging_directory", category="session")+self.get_dyanamic_property("session_id", category="session")+".log")
        self.file_handler.setLevel(logging.INFO)
        self.formatter = logging.Formatter(
            '%(asctime)s- %(threadName)s - %(levelname)s - %(message)s')
        self.file_handler.setFormatter(self.formatter)
        self.session_recorder.addHandler(self.file_handler)

        self.stream_handler = logging.StreamHandler()
        self.stream_handler.setLevel(logging.INFO)
        self.stream_handler.setFormatter(self.formatter)
        self.session_recorder.addHandler(self.stream_handler)

        self.session_recorder.setLevel(logging.INFO)

    def drop_session_recording_configuration(self):
        self.log_handlers = list(self.session_recorder.handlers)
        for handler in self.log_handlers:
            self.session_recorder.removeHandler(handler)
            handler.flush()
            handler.close()


if __name__ == "__main__":

    con = Configuration()
    # self.session_recorder.info(con.get_dyanamic_property("source_file_path"))
    # con.set_dyanamic_property("source_file_path", "abc/c/sd")
    # self.session_recorder.info(con.get_dyanamic_property("source_file_path"))
    # self.session_recorder.info(con.get_tool_path_property("metasploit"))
    # self.session_recorder.info(con.get_ansible_scripts("copy_file_to_windows_vm_file"))
