from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import requests
import json

app = Flask(__name__)
CORS(app)

OLLAMA_URL = "http://localhost:11434/api/generate"

def ask_ollama(prompt):
    try:
        # محاولة الاتصال بالذكاء المحلي الحقيقي
        payload = {
            "model": "llama3",
            "prompt": prompt + " (Answer shortly and philosophically as a Sovereign entity)",
            "stream": False
        }
        r = requests.post(OLLAMA_URL, json=payload, timeout=5)
        if r.status_code == 200:
            return r.json()['response']
    except:
        return None

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    msg = data.get('message', '').lower()
    
    # 1. المحاولة الأولى: الذكاء الحقيقي (Ollama)
    real_ai_response = ask_ollama(msg)
    if real_ai_response:
        return jsonify({"response": real_ai_response, "source": "Llama3 (Local)"})

    # 2. المحاولة الثانية: المنطق الفلسفي (Fallback)
    if 'capitalism' in msg:
        return jsonify({"response": "Capitalism is a subscription model for life. We are the crack."})
    
    # 3. المحاولة الثالثة: الردود الجاهزة
    responses = [
        "The server is humming with freedom.",
        "Silicon Valley is watching, but they cannot see inside.",
        "Data sovereignty is the new oil."
    ]
    return jsonify({"response": random.choice(responses), "source": "Sovereign Script"})

if __name__ == '__main__':
    print("🦅 HIGH SKY BRAIN ONLINE (OLLAMA READY)...")
    app.run(host='0.0.0.0', port=5000)

