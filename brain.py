from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import random
import requests

app = Flask(__name__)
CORS(app)

def search_docs(query):
    # يبحث في ملفات المعرفة عن الكلمة المفتاحية
    results = []
    if os.path.exists('docs'):
        for filename in os.listdir('docs'):
            if filename.endswith('.md'):
                with open(os.path.join('docs', filename), 'r', encoding='utf-8') as f:
                    content = f.read()
                    if query in content.lower():
                        # استخراج سياق بسيط
                        idx = content.lower().find(query)
                        snippet = content[idx:idx+200] + "..."
                        results.append(f"Found in {filename}: {snippet}")
    return results

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    msg = data.get('message', '').lower()
    
    # 1. البحث في المعرفة المحلية (Real Search)
    docs_results = search_docs(msg)
    if docs_results:
        return jsonify({"response": "📚 FOUND IN ARCHIVES:\n" + "\n".join(docs_results), "source": "Local Docs"})

    # 2. الردود الافتراضية
    return jsonify({"response": "Unknown query. Try searching for 'privacy', 'tor', or 'freedom'.", "source": "System"})

if __name__ == '__main__':
    print("🦅 REALITY BRAIN ONLINE...")
    app.run(host='0.0.0.0', port=5000)
