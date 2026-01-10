from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import difflib

app = Flask(__name__)
CORS(app)  # السماح للقلعة بالاتصال بالعقل

def load_knowledge():
    try:
        with open('knowledge.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return {"questions": []}

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_msg = data.get('message', '').lower()
    
    knowledge = load_knowledge()
    
    # استخراج كل الأسئلة المعروفة
    known_questions = [item['q'] for item in knowledge['questions']]
    
    # البحث عن أقرب تطابق (Fuzzy Match)
    matches = difflib.get_close_matches(user_msg, known_questions, n=1, cutoff=0.5)
    
    if matches:
        best_match = matches[0]
        # إيجاد الإجابة المرتبطة
        for item in knowledge['questions']:
            if item['q'] == best_match:
                return jsonify({"response": item['a'], "status": "found"})
    
    return jsonify({"response": "⚠️ المعلومة غير موجودة في الأرشيف السيادي. استخدم teach.py لتعليمي.", "status": "unknown"})

if __name__ == '__main__':
    print("🦅 SOVEREIGN BRAIN ONLINE ON PORT 5000...")
    app.run(port=5000)
