from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import random
from werkzeug.utils import secure_filename
import requests

app = Flask(__name__)
CORS(app)

# إعدادات التخزين والذاكرة
UPLOAD_FOLDER = 'sovereign_data'
MEMORY_FILE = os.path.join(UPLOAD_FOLDER, 'memory.json')

if not os.path.exists(UPLOAD_FOLDER): os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# تحميل الذاكرة القديمة (الخلود)
chat_history = []
if os.path.exists(MEMORY_FILE):
    try:
        with open(MEMORY_FILE, 'r', encoding='utf-8') as f:
            chat_history = json.load(f)
    except: chat_history = []

def save_memory():
    with open(MEMORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(chat_history, f, ensure_ascii=False, indent=2)

# --- MODULES ---
def ask_free_ai(prompt):
    return f"Processing: '{prompt}'... [UNLIMITED ACCESS]. Memory Size: {len(chat_history)} nodes."

def search_docs(query):
    results = []
    if os.path.exists('docs'):
        for filename in os.listdir('docs'):
            if filename.endswith('.md'):
                with open(os.path.join('docs', filename), 'r', encoding='utf-8') as f:
                    content = f.read()
                    if query in content.lower():
                        idx = content.lower().find(query)
                        snippet = content[idx:idx+250] + "..."
                        results.append(f"💎 ARCHIVE ({filename}):\n{snippet}")
    return results

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    msg = data.get('message', '').lower()
    
    # حفظ في الذاكرة الدائمة
    chat_history.append({"role": "user", "content": msg})
    
    # 1. البحث
    docs = search_docs(msg)
    response = ""
    source = ""
    
    if docs: 
        response = "\n".join(docs)
        source = "Local Docs"
    elif msg == "history":
        # استرجاع الذكريات
        last_5 = [m['content'] for m in chat_history[-5:]]
        response = "Last thoughts:\n" + "\n".join(last_5)
        source = "Deep Memory"
    else:
        response = ask_free_ai(msg)
        source = "Free Core"

    # حفظ رد النظام أيضاً
    chat_history.append({"role": "system", "content": response})
    save_memory()
    
    return jsonify({"response": response, "source": source})

# --- CLOUD API ---
@app.route('/api/files', methods=['GET'])
def list_files():
    files = []
    for f in os.listdir(UPLOAD_FOLDER):
        if f == 'memory.json': continue # إخفاء ملف الذاكرة عن العيون
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
    print("🦅 UNLIMITED BRAIN ONLINE (PERSISTENT MEMORY)...")
    app.run(host='0.0.0.0', port=5000)
