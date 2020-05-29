from pyVim.connect import SmartConnectNoSSL
from pyVmomi import vim
from configuration import Configuration
from colorama import Fore, Style, init


class Vsphere_Controller():

    def __init__(self):

        #config = None
        self.smart_connect = None
        self.content = None
        self.children = None
        self.virtual_machine = None
        self.connection = True

        init()
        self.config = Configuration()
        try:
            self.smart_connect = SmartConnectNoSSL(host=self.config.get_vsphere_options("host"), user=self.config.get_vsphere_options("user"), pwd=self.config.get_vsphere_options("password"))
            self.content = self.smart_connect.RetrieveContent()
            self.children = self.content.rootFolder.childEntity
            self.connection = True
        except Exception as e:

            print(Fore.RED+"caused Exception : ", Style.RESET_ALL, e)
            self.connection = False

    def get_vm_moid_by_vm_name(self, vm_name):
        for datacenter in self.children:
            self.dc_name = self.get_data_center_name(datacenter)
            self.dc = vim.Datacenter(self.dc_name)
            self.dc._stub = self.smart_connect._stub
            for datastore in self.dc.datastore:
                for instance in datastore.vm:
                    if instance.name == vm_name:
                        self.virtual_machine = instance
                        instance = str(instance)[1:-1].split(":")
                        print("moid = ", instance[1])

    def get_vm_ticket_by_vm_name(self, vm_name):
        self.get_vm_moid_by_vm_name(vm_name)
            # self.config.get_dyanamic_property("vm_name"))
        try:
            self.ticket = self.virtual_machine.AcquireTicket("webmks")
            print(Fore.GREEN+"Ticket Found : ", Style.RESET_ALL)
            print(self.ticket)
            return(self.ticket.ticket)

        except Exception as e:
            print(Fore.RED+"caused Exception : ", Style.RESET_ALL, e)

    def get_data_center_name(self, child):
        child = str(child)[1:-1].split(":")
        print("datacenter = ", child[1])
        return child[1]


if __name__ == "__main__":
        t = Vsphere_Controller()
        if t.connection == True:
            t.get_vm_ticket_by_vm_name("win_10_1511")

'''

children = content.rootFolder.childEntity
for child in children:
    print (child)

# 'vim.Datacenter:datacenter-33'
# 'vim.Datacenter:datacenter-2'
print(children[0].name)
# '1000110'
dc = vim.Datacenter('datacenter-83')
dc._stub = smart_connect._stub
print(dc.name)
print(dc.datastore)
for a in dc.datastore:
    print(a)
print(dc.datastore[0].vm)
print(dc.datastore[0].vm[0].name)
# '1000110'

'''
