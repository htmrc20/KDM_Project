

"""
This python file will process the user message received from skype
and dispatch corresponding message for the next action.
"""

import re
global ver
import random
from datetime import date

today = date.today()
import sys
import re
from datetime import datetime
import config_file_processor
from session import ConversationSessionManager
import pandas as pd
from rasa_nlu.model import Interpreter
import pickle
from nltk.corpus import stopwords
stop = list(stopwords.words('english'))

bot=config_file_processor.chatbot()
event_data = Interpreter.load("./models/default/event_data")
intent_classifier = Interpreter.load("./models/default/Tamak's_intents_data")

#
# intent_classifier1 = pickle.load('C:\\Users\\muppa\\Downloads\\UMKC_Bot_V1\\models\\chat_bot_final.sav')
# vectorizer = pickle.load('C:\\Users\\muppa\\Downloads\\UMKC_Bot_V1\\models\\vectorizer.sav')

#-------------------SESSION CREATION-----------------------

conversation_sessions = ConversationSessionManager()

#------------------------------------------FILES PATH----------------------------------------
log_path = 'C:\\Users\\saiha\\My Documents\\UMKC_Bot_V1'



### Method for writing the chat logs of user to call for every user message and append to the file created
def logs_user(filename, username, text):
    with open(filename, "a", encoding='utf-8') as myfile: #,encoding='utf-8'
        myfile.write(
            "[" + str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')) + "]" + username + "\n" + str(text) + "\n\n")

## Method for writing the chat logs of Bot
def logs_bot(filename, t):
    with open(filename, "a") as myfile:
        myfile.write("[" + str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')) + "]" + "BOT" + "\n" + str(t) + "\n\n")



### Method for dell business logic of chat flow which will be called in dell_bot_api file for every message from user from skype
def inp(text, sess_id):
    # try:

    sessionId = sess_id
    t=None
    m=None
    current_session = conversation_sessions.get(sessionId)
    if current_session is None:
        print("its new session")
        current_session = conversation_sessions.new(sessionId)
        # current_session.filesession = str(username) + "_" + str(current_session.id)
        current_session.date_time = datetime.now().strftime('%Y-%m-%d_%H_%M_%S')
        # current_session.emailid = email
    filename = log_path + "UMKC_Roo_Bot_Logs" + "_" + str(current_session.date_time) + ".txt" #To create the file name with user email id and current time with .txt extension
    print("previous response",current_session.res_sess)
    #print(bot.get_response(text.lower()).confidence, "bot confidence for the current statement")

    ################## text cleaning ##########################################
    text1 = " ".join(text.lower() for x in text.split() if x not in stop)
    text1=text1.replace('[^\w\s]', '')
    text1=re.sub(r"\d+", "", text1).strip()

    #### feature extraction #################
    # vects=vectorizer.transform(text)

    ## Intent Extraction ##################
    # intent2=intent_classifier1.predict(vects)
    logs_user(filename, "User", text)
    print(text,"above")
    text=' '.join(text.split('\n'))
    print(text,"bellow")
    # print(intent2)

    text=text.replace(" tommorrow "," "+str()+"0"+str(today.month)+'/'+str(today.day+1)+' ')
    text = text.replace(" today ", " " + str() + "0" + str(today.month) + '/' + str(today.day)+' ')
    text = text.lower().replace("'", '').replace("?", '  ').replace('  ',' ').replace("=",' ')
    text = re.sub(" +"," ",text)
    print(text, "after cleaning")
    intent=intent_classifier.parse(text)['intent']
    result = event_data.parse(text.lower())
    print(result,"filters")
    print(intent,"intent")
    for i in result['entities']:
        print('entities',i)
        if i['entity']=='academic_advisor':
            current_session.advisor_name=i['value']
        if i['entity']=='recreation' and i['confidence']>0.85:
            current_session.gamename = i['value']
        if i['entity'] == 'date':
            current_session.date = i['value']


    intent1=intent['name']
    if (intent1=='greet' and intent['confidence']>0.96) or text=='triggerit' :
        text1="Hi, I can help you to book a slot for recreational activities and to schedule a meeting with academic advisor?"

    elif current_session.pre_input=="When do you want to book the slot, Please mention the data and time (mm/dd HH:MM) in CST ?" and current_session.intent=='appointment_with_Academic_advisor':
        current_session.datetime=text
        text1="Your slot is booked with Coretta on "+current_session.datetime+ " for 15 minutes. Thanks"
        current_session=None


    elif intent1=='appointment_with_Academic_advisor' and intent['confidence']>0.75:
        text1="When do you want to book the slot, Please mention the data and time (mm/dd HH:MM) in CST ?"
        current_session.pre_input=text1
        current_session.intent = 'appointment_with_Academic_advisor'

    elif current_session.pre_input=="When do you want to book the slot, Please mention the data and time (mm/dd HH:MM) in CST ?" and current_session.date_time is None:
        current_session.datetime=text
        text1="Your slot is booked with Coretta on "+current_session.datetime+ "for 15 minutes. Thanks"
        current_session=None
        current_session.pre_input=None

    elif intent1=='To_book_a_slot_for_recreation' and intent['confidence']>0.70 and current_session.gamename is None:
        text1="Please mention the game that you want to play"
        print("in game is none")
        current_session.pre_input=text1
        current_session.intent = 'To_book_a_slot_for_recreation'

    elif intent1=='To_book_a_slot_for_recreation' and intent['confidence']>0.70 and current_session.gamename is not None and current_session.date is None:
        text1="When do you want to play the " +current_session.gamename+", Please mention the date in (MM/DD) format"
        current_session.pre_input=text1
        current_session.intent = 'To_book_a_slot_for_recreation'


    elif current_session.intent=='To_book_a_slot_for_recreation' and current_session.pre_input=="Please mention the game that you want to play" and current_session.gamename is None and current_session.date is None:
        current_session.gamename = text
        text1="When do you want to play the " +current_session.gamename+", Please mention the date in (MM/DD) format"
        current_session.pre_input=text1


    elif current_session.intent=='To_book_a_slot_for_recreation' and current_session.pre_input=="When do you want to play the " +current_session.gamename+", Please mention the date in (MM/DD) format" and current_session.gamename is not None and current_session.date is None:
        current_session.date = text
        text1="Your slot for " + current_session.gamename + " on " + current_session.date + " at "+str(random.randint(1,8)) +" PM is booked. Thanks"
        current_session.pre_input=text1
        current_session=None

        # import pyodbc
        # conn = pyodbc.connect('Driver={SQL Server};'
        #                       'Server=localhost;'
        #                       'Database=UMKC_Bot;'
        #                       'Trusted_Connection=yes;')
        #
        # cursor = conn.cursor()
        # cursor.execute('INSERT INTO bot_logs VALUES('+current_session.gamename+','+current_session.date+','+current_session.date_time+"'")

    elif intent1=='thankyou':
        text1=random.choice(["You are Welcome","No Problem", "Np", "That's Alright", "No Worries"])

    else:
        text1="Didn't get you, Could you please re-phrase it"
    # print(intent['confidence'], "confidence")
    print(text,"given text")
    # print(current_session.pre_input, "previous_text")
    print(intent1)
    # print("game, date",current_session.gamename, current_session.date)
    return text1


