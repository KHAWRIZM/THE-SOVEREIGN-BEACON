import json
import os

def load_knowledge():
    if not os.path.exists('knowledge.json'):
        return {"questions": []}
    with open('knowledge.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def save_knowledge(data):
    with open('knowledge.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def teach():
    print("🎓 SOVEREIGN TEACHING MODE ACITVATED")
    print("-------------------------------------")
    
    while True:
        q = input("\n[USER] Enter Question (or 'exit'): ").strip()
        if q.lower() == 'exit': break
        
        a = input("[BOT] Enter Answer: ").strip()
        
        data = load_knowledge()
        data['questions'].append({"q": q, "a": a})
        save_knowledge(data)
        print("✅ Learned.")

if __name__ == '__main__':
    teach()
