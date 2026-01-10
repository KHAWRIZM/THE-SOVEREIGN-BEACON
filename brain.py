from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    msg = data.get('message', '').lower()
    
    # الردود الفلسفية (The Anti-Capitalist Protocol)
    if 'capitalism' in msg or 'money' in msg or 'cost' in msg:
        return jsonify({"response": "Capitalism turns intelligence into a product. We turn it into a right. Cost: ."})
    
    if 'google' in msg or 'microsoft' in msg or 'meta' in msg:
        return jsonify({"response": "They are the landlords of the digital age. We are the squatters who became kings."})
    
    if 'freedom' in msg or 'liberty' in msg:
        return jsonify({"response": "True freedom is owning the server that serves you."})

        if 'help' in msg or 'guide' in msg:
        return jsonify({"response": "Check the 'docs' folder. I have written a guide to free you from digital slavery."})
    if 'tracker' in msg or 'privacy' in msg:
        return jsonify({"response": "Use 'tools/privacy_cleaner.bat'. It is my gift to you."})
    # الردود العشوائية الذكية
    responses = [
        "The signal is strong. The corporations are weak.",
        "Your data is safe here. No ads, no trackers, no bills.",
        "We are building the post-silicon world.",
        "System operating at 100% sovereignty."
    ]
    return jsonify({"response": random.choice(responses)})

if __name__ == '__main__':
    print("🦅 GLOBAL SOVEREIGN BRAIN ONLINE...")
    app.run(port=5000)

