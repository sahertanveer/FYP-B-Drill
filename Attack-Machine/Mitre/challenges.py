import json
from configuration import Configuration
#from Mitre.user_interaction import User
import time
import threading
from colorama import Fore, Style, init
import logging


class Challenge:

    def __init__(self,**kwargs):
        self.conf = kwargs["conf_obj"]
        self.session_recorder = logging.getLogger(self.conf.get_dyanamic_property("session_id", category="session"))
        self.actual_answers = [] #only answers
        self.user_answers = []
        self.questions_answers = {} #both questions answers
        self.questions = [] #only questions
        init()

    def explore_questions(self, tactic, scenario_id):
        Fore.YELLOW
        self.session_recorder.info(
                "**************************Exploring Evaluation**********************")
        Style.RESET_ALL
        self.questions.clear()
        self.actual_answers.clear()
        try:
            with open('Mitre/Challenges/'+tactic+'.json') as json_file:
                data = json.load(json_file)
        except:
            self.session_recorder.warning('Mitre/Challenges/'+tactic+'.json  not found')
            return

        if 'generalized_questions' in data:
            self.session_recorder.info("Appending Generalize questions_answers")
            self.questions_answers = data['generalized_questions']
        else:
            self.session_recorder.warning("No Generalized Questions For "+tactic+": "+scenario_id)

        if scenario_id in data:
            self.session_recorder.info("Appending scenario-specific questions_answers")
            self.questions_answers.update(data[scenario_id])
        else:
            self.session_recorder.warning("No scenario-specific questions_answers For "+tactic+": "+scenario_id)

        Fore.YELLOW
        if self.questions_answers:
            self.session_recorder.info(
                "*****************************Questions*****************************")
        Style.RESET_ALL
        self.session_recorder.info(self.questions_answers)
        return self.explore_actual_answers_questions()
        #return self.questions_answers

    
    def explore_actual_answers_questions(self):
        if self.questions_answers:
            for key in self.questions_answers:
                for value in self.questions_answers[key]:
                    if "_$ref" in self.questions_answers[key][value]:
                        self.temp_key = self.questions_answers[key][value]
                        self.questions.append(value)
                        self.actual_answers.append(self.conf.get_dyanamic_property(
                            self.temp_key))
                            # self.temp_key.replace("_$ref", "")))
                        #self.session_recorder.info(self.actual_answers)
                    else:
                        self.actual_answers.append(
                            (self.questions_answers[key][value]))
                        self.questions.append(value)
            Fore.YELLOW
            self.session_recorder.info(
                "*****************************Actual Answers*****************************")
            Style.RESET_ALL
            self.session_recorder.info(self.actual_answers)
            #self.session_recorder.info(self.questions)
        else:
                self.session_recorder.warning("No questions_answers available")
        self.questions_answers.clear()
        return self.questions, self.actual_answers

    def get_user_ans(self):

            for key in self.questions_answers:
                for value in self.questions_answers[key]:
                    self.session_recorder.info(key, ": ", value)
                    n = input("----->   ")
                    self.user_answers.append(n)

            self.match_answers(self.user_answers)

    def match_answers(self, user_ans):
        self.i = 0
        self.score = 0

        for answer in user_ans:
            if (answer == self.actual_answers[self.i]):
                self.score = self.score + 1
            self.i = self.i + 1

        self.ans_display(self.score)

    def ans_display(self, num):
        if num < 4:
            self.session_recorder.info("\nyour marks are ---> " +
                  Fore.RED + str(num)+Style.RESET_ALL)
        elif num < 8:
            self.session_recorder.info("\nyour marks are ---> " +
                  Fore.BLUE + str(num)+Style.RESET_ALL)
        else:
            self.session_recorder.info("\nyour marks are ---> " +
                  Fore.WHITE + str(num)+Style.RESET_ALL)


if __name__ == "__main__":
    c = Challenge()
    #c.user.scanerio_id()
    c.questions_answers("Initial_Access", "S.01.1190.1")
    c.get_user_ans()
