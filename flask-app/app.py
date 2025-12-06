from flask import Flask
from flask_socketio import SocketIO
from kafka import KafkaConsumer
import threading
import json
import eventlet
eventlet.monkey_patch()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

@app.route("/")
def home():
    return "Flask-SocketIO + Kafka consumer is running!"

# Listen Kafka then emit
def kafka_listener():
    consumer = KafkaConsumer(
        "ifc-progress",
        bootstrap_servers=["kafka:9092"],
        auto_offset_reset="earliest",
        enable_auto_commit=True,
        group_id="socketio-group",
        value_deserializer=lambda m: json.loads(m.decode('utf-8'))
    )

    print("Kafka listener started...")

    for message in consumer:
        data = message.value
        print("Received from Kafka:", data)

        # Emit ke client frontend
        socketio.emit("ifc_progress", data)


# Run Kafka listener in background
threading.Thread(target=kafka_listener, daemon=True).start()

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
