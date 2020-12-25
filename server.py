from flask import Flask, request, jsonify, render_template
import json
from downloader import getVideoInfoFrom

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/getvid', methods=['POST'])
def getvid():
    if request.method == 'POST':
        new_data = json.dumps(getVideoInfoFrom(request.json["url"]))
        return json.loads(new_data)
    else:
        return 'Invalid input'


if __name__ == "__main__":
    app.run(host="127.0.0.1", port="5000", debug=True)
