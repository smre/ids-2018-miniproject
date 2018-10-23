from flask import Flask, render_template, jsonify
import csv
import json

app = Flask(__name__)

@app.route("/")
def frontpage():
    return render_template('index.html')


# API
@app.route('/api/ticketAmounts')
def send_ticket_amounts():
    json_data = open('data/ticket_amounts.json', encoding="UTF-8").read()
    data = json.loads(json_data)
    return jsonify(data)


@app.route('/api/parking')
def send_parking():
    json_data = open('data/parking.json', encoding="UTF-8").read()
    data = json.loads(json_data)
    return jsonify(data)


@app.route('/api/serviceClusters')
def send_service_clusters():
    json_data = open('data/service_clusters.json', encoding="UTF-8").read()
    data = json.loads(json_data)
    return jsonify(data)







if __name__ == '__main__':
    app.run()
