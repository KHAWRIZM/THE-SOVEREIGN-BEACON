from flask import Flask, request, jsonify
import random

app = Flask(__name__)

@app.route('/api/chat', methods=['POST'])
def chat():
    # Here connects your Local LLM (DeepSeek/Llama)
    # No cloud API keys. Pure local inference.
    responses = [
        "The Cloud is a lie.",
        "Sovereignty is the only truth.",
        "I am running on your hardware, not theirs.",
        "System stable. No billing detected."
    ]
    return jsonify({"response": random.choice(responses)})

if __name__ == '__main__':
    print("🧠 SOVEREIGN BRAIN ONLINE ON PORT 5000")
    app.run(port=5000)
