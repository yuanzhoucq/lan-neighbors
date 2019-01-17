import threading
from flask import Flask, jsonify, make_response, send_from_directory
from neighbors import log_neighbors
from db import get_log


CHECK_INTERVAL = 300    # seconds

app = Flask(__name__)


t = threading.Thread(target=log_neighbors, args=(CHECK_INTERVAL,))
t.start()


@app.route('/')
def hello_world():
    return send_from_directory('static', 'index.html')


@app.route('/neighbors')
def neighbors():
    resp = make_response(jsonify(get_log()))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


if __name__ == '__main__':
    app.run(host="0.0.0.0")
