import os
import threading
import ctypes
import logging


class ThreadController():

    def __init__(self, **kwargs):
        self.conf = kwargs["conf_obj"]
        self.session_recorder = logging.getLogger(self.conf.get_dyanamic_property("session_id", category="session"))

    def raise_exception(self, thread_to_be_terminated):
        self.thread_id = self.get_id(
            thread_to_be_terminated)
        self.res = ctypes.pythonapi.PyThreadState_SetAsyncExc(ctypes.c_long(self.thread_id),
                                                              ctypes.py_object(SystemExit))

        if self.res > 1:
            ctypes.pythonapi.PyThreadState_SetAsyncExc(
                ctypes.c_long(self.thread_id), 0)
            self.session_recorder.critical('Exception raise failed')
        else:
            self.session_recorder.info("Exception Successfully Raised")

    def get_id(self, thread_obj):

            # returns id of the respective thread
            if hasattr(thread_obj, '_thread_id'):
                return thread_obj._thread_id
            for id, thread in threading._active.items():
                if thread is thread_obj:
                    return id

    def register_threads(self, step, thread_obj):
        self.conf.set_thread_entry(step, thread_obj)

    def stop_all_upper_step_threads(self, step):
        try:
            registered_threads = self.conf.get_all_threads()
            for key in registered_threads:

                if key >= step:
                    self.unregister_and_stop_thread(key)

        except:
            self.session_recorder.info("Exception caught")

    def unregister_and_stop_thread(self, step):
        try:
            thread = self.conf.get_thread_from_entry(step)
            self.raise_exception(thread)
            self.conf.remove_thread_entry(step)
        except:
            self.session_recorder.info("No thread found")
