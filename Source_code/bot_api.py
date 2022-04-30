import sys
from flask import Flask, jsonify
import json, requests
from flask_cors import CORS, cross_origin
from flask import json
from flask.globals import request
# import os
# import email_notification as en
from datetime import datetime
import message_processor
import re
import traceback

# --------------------------------------------------------------------------------------------

app = Flask(__name__)
CORS(app)

#Method to stop the Flask_API before changes are done in config file, calling this in start_bot.BAT file
def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()

# # ----------------------------FAQ Classifier Called--------------------------------------------------------------------------

@app.route('/tamak-bot', methods=['POST'])
@cross_origin()
def GetFAQ():
    if request.method != 'POST':
        return json.dumps({"Status": "ERROR", "DATA": None, "Reason": "Only accept POST request"})
    if not request.headers['Content-Type'] == 'application/json':
        return json.dumps({"Status": "ERROR", "DATA": None, "Reason": "Only  accept Content-Type:application/json"})
    if not request.is_json:
        return json.dumps({"Status": "ERROR", "DATA": None,
                           "Reason": 'Expecting json data in the form {"data":"VALUE"}'})
    data = request.json
    print(data)
    if 'message' not in data:
        return json.dumps({"Status": "ERROR", "DATA": None, "Reason": 'Expecting key as data'})
    try:
        statement = data['message']
        print(statement)
        statement=statement.replace(','," ")
        statement = statement.replace('.', " ")
        print("data receiving from gui bot",data)
    except Exception as e:
        print("there is some issue")
        return json.dumps({"DATA": None,
                           })
    try:

        data=message_processor.inp(re.sub(" +"," ",statement.strip()), data['sender'])#, data['sess_id']#,data["email_id"],data["username"],data["Session_start_time"],data['Hit_count'])#data['Hit_count']
        print("------------------------------------------------------------------------------")
    except Exception as e:
        #print(os.getcwd())
        k = traceback.format_tb(e.__traceback__)
        with open("Input_exceptions.txt", "a", encoding='utf-8') as myfile:  # ,encoding='utf-8'
            myfile.write(
                "[" + str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')) + "]" +'('+str(data["sender"])+')' + "\n" +"User_Input: " + str(statement) + '\n'+'Error_Details: ' + str(e) +'\n'+"Traceback_details: "+str(k)+"\n\n")
        # print(en.send_email(e,statement,data["username"],data["email_id"]))
        print(e)
        return json.dumps({'Status": "ERROR", "DATA": None, "Reason": "Internal server error'})
    # print(session_id,"sessionid")
    # print(type(session_id), "sessionid")
    # print(data,"data")
    return json.dumps([{"Status": "SUCCESS", "text": data}])#, "recipient_id":session_id }])

@app.route('/shutdown', methods=['GET'])
def shutdown():
    shutdown_server()
    return 'Restarting the UMKC ROO BOT...'

# ---------------------------------------------------------------------------------------------------

def startAPIs():
    try:
        app.run("192.168.1.166", port=(5004), debug=False, threaded=False)
        app.run()
    except Exception as e:
        raise ("APIs not started Exception (startAPIs ) at : " + str("192.168.1.240") + ":" + str(5004) + " due to :" + str(
            e))
if __name__ == '__main__':
    startAPIs()
