from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import random
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'sovereign_data'
if not os.path.exists(UPLOAD_FOLDER): os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# ذاكرة بسيطة
chat_history = []

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
                        results.append(f"📘 {filename}: {snippet}")
    return results

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    msg = data.get('message', '').lower()
    
    # 1. أوامر النظام
    if msg == 'status': return jsonify({"response": "SYSTEM: OPTIMAL. STORAGE: " + str(len(os.listdir(UPLOAD_FOLDER))) + " FILES.", "source": "System"})
    if msg == 'clear': 
        global chat_history
        chat_history = []
        return jsonify({"response": "Memory Wiped.", "source": "System"})

    # 2. البحث في المعرفة
    docs = search_docs(msg)
    if docs: return jsonify({"response": "\n".join(docs), "source": "Archives"})

    # 3. الرد الحر (بدون مفاتيح)
    resp = "Processing: " + msg + "... [SOVEREIGN LOGIC APPLIED]."
    if "hello" in msg: resp = "Greetings, Architect. The system awaits."
    
    chat_history.append(msg)
    return jsonify({"response": resp, "source": "Free Core"})

# --- CLOUD API ---
@app.route('/api/files', methods=['GET'])
def list_files():
    files = []
    for f in os.listdir(UPLOAD_FOLDER):
        path = os.path.join(UPLOAD_FOLDER, f)
        size = os.path.getsize(path) / 1024
        type = 'file'
        if f.endswith(('.png','.jpg','.jpeg')): type = 'image'
        elif f.endswith(('.mp4','.webm')): type = 'video'
        files.append({"name": f, "size": f"{size:.1f} KB", "type": type})
    return jsonify(files)

@app.route('/api/upload', methods=['POST'])
def upload():
    if 'file' not in request.files: return jsonify({}), 400
    f = request.files['file']
    if f.filename: f.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(f.filename)))
    return jsonify({"success": True})

@app.route('/api/download/<path:filename>')
def download(filename): return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/api/storage')
def storage():
    total = sum(os.path.getsize(os.path.join(UPLOAD_FOLDER,f)) for f in os.listdir(UPLOAD_FOLDER))
    return jsonify({"used_kb": f"{total/1024:.2f}", "count": len(os.listdir(UPLOAD_FOLDER))})

if __name__ == '__main__':
    print("🦅 MIRACLE BRAIN ONLINE...")
    app.run(host='0.0.0.0', port=5000)
