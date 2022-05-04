from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def render_static():
    return render_template('/chatbox/chat.html')

if __name__ == '__main__':
    app.run("192.168.86.96",debug=True, threaded=True)
    # app.run("0.0.0.0", debug=False, threaded=True)