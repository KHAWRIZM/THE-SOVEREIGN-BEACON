from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import random
import requests
import json

app = Flask(__name__)
CORS(app)

# إعدادات Gemini (اختياري)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") 
OLLAMA_URL = "http://localhost:11434/api/generate"

def ask_gemini(prompt):
    if not GEMINI_API_KEY: return None
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}"
        payload = {"contents": [{"parts": [{"text": prompt + " (Answer as a Sovereign AI)"}]}]}
        headers = {"Content-Type": "application/json"}
        r = requests.post(url, json=payload, headers=headers, timeout=5)
        if r.status_code == 200:
            return r.json()['candidates'][0]['content']['parts'][0]['text']
    except:
        return None

def ask_ollama(prompt):
    try:
        payload = { "model": "llama3", "prompt": prompt, "stream": False }
        r = requests.post(OLLAMA_URL, json=payload, timeout=3)
        if r.status_code == 200: return r.json()['response']
    except: return None

def search_docs(query):
    results = []
    if os.path.exists('docs'):
        for filename in os.listdir('docs'):
            if filename.endswith('.md'):
                with open(os.path.join('docs', filename), 'r', encoding='utf-8') as f:
                    content = f.read()
                    if query in content.lower():
                        idx = content.lower().find(query)
                        snippet = content[idx:idx+200] + "..."
                        results.append(f"Found in {filename}: {snippet}")
    return results

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    msg = data.get('message', '').lower()
    
    # 1. البحث المحلي (أولوية للوثائق)
    docs = search_docs(msg)
    if docs: return jsonify({"response": "📚 ARCHIVE MATCH:\n" + "\n".join(docs), "source": "Local Docs"})

    # 2. محاولة Gemini (الذكاء الفائق)
    gemini_resp = ask_gemini(msg)
    if gemini_resp: return jsonify({"response": gemini_resp, "source": "Gemini (Cloud Sovereign)"})

    # 3. محاولة Ollama (الذكاء المحلي)
    ollama_resp = ask_ollama(msg)
    if ollama_resp: return jsonify({"response": ollama_resp, "source": "Llama3 (Local)"})

    # 4. الرد الافتراضي
    return jsonify({"response": "SYSTEM: No AI connected. Add GEMINI_API_KEY or install Ollama.", "source": "Fallback"})

if __name__ == '__main__':
    print("🦅 HYBRID BRAIN ONLINE (DOCS + GEMINI + OLLAMA)...")
    app.run(host='0.0.0.0', port=5000)
