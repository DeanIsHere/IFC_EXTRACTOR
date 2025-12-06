from flask import Flask
from flask_socketio import SocketIO
import redis
import threading
import eventlet

eventlet.monkey_patch()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

r = redis.Redis(host="redis", port=6379, decode_responses=True)

@app.route("/")
def home():
    return "SocketIO ready + Redis"


# Redis Pub/Sub listener
def redis_listener():
    pubsub = r.pubsub()
    pubsub.subscribe("ifc_ready")

    print("Redis listener started...")

    for message in pubsub.listen():
        if message['type'] == 'message':
            guid = message['data']
            print(f"[Redis] Emit progress for GUID: {guid}")

            socketio.emit("ifc_ready", {"guid": guid})


# Run listener in background
threading.Thread(target=redis_listener, daemon=True).start()


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
