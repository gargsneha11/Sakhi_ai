from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import re
import io
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

app = Flask(__name__)
CORS(app)

DB_PATH      = os.path.join(os.path.dirname(__file__), 'sakhi.db')
GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')
client       = Groq(api_key=GROQ_API_KEY)

# ─── Database setup ───────────────────────────────────────────────────────────

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password TEXT NOT NULL)''')
    c.execute('''CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_email TEXT NOT NULL,
        subject TEXT NOT NULL, exam_name TEXT, exam_date TEXT, daily_hours TEXT,
        topics TEXT, completed_topics TEXT, created_at TEXT,
        FOREIGN KEY (user_email) REFERENCES users(email))''')
    c.execute('''CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_email TEXT NOT NULL,
        subject_name TEXT NOT NULL, completed_topics INTEGER DEFAULT 0,
        total_topics INTEGER DEFAULT 0, progress_percentage REAL DEFAULT 0,
        FOREIGN KEY (user_email) REFERENCES users(email))''')
    c.execute('''CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT, user_email TEXT NOT NULL,
        note_text TEXT NOT NULL, created_at TEXT,
        FOREIGN KEY (user_email) REFERENCES users(email))''')
    c.execute('''CREATE TABLE IF NOT EXISTS roadmaps (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        title      TEXT NOT NULL,
        data       TEXT NOT NULL,
        saved_at   TEXT NOT NULL,
        FOREIGN KEY (user_email) REFERENCES users(email))''')
    conn.commit()
    conn.close()

# ─── PDF text extraction (pypdf only) ────────────────────────────────────────

def extract_pdf_text(raw_bytes):
    from pypdf import PdfReader
    reader = PdfReader(io.BytesIO(raw_bytes))
    parts  = []
    for page in reader.pages:
        t = page.extract_text()
        if t and t.strip():
            parts.append(t.strip())
    return '\n\n'.join(parts)

# ─── Auth ─────────────────────────────────────────────────────────────────────

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name, email, password = data.get('name','').strip(), data.get('email','').strip().lower(), data.get('password','').strip()
    if not name or not email or not password:
        return jsonify({'error': 'All fields are required.'}), 400
    conn = get_db()
    try:
        conn.execute('INSERT INTO users (name,email,password) VALUES (?,?,?)', (name,email,password))
        conn.commit()
        return jsonify({'success': True, 'user': {'name': name, 'email': email}})
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already registered.'}), 409
    finally:
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email, password = data.get('email','').strip().lower(), data.get('password','').strip()
    conn = get_db()
    user = conn.execute('SELECT * FROM users WHERE email=? AND password=?', (email,password)).fetchone()
    conn.close()
    if not user:
        return jsonify({'error': 'Invalid email or password.'}), 401
    return jsonify({'success': True, 'user': {'name': user['name'], 'email': user['email']}})

# ─── Goals ────────────────────────────────────────────────────────────────────

@app.route('/save-goals', methods=['POST'])
def save_goals():
    data = request.get_json()
    user_email = data.get('user_email','').lower()
    conn = get_db()
    conn.execute('DELETE FROM goals WHERE user_email=?', (user_email,))
    for g in data.get('goals', []):
        conn.execute(
            'INSERT INTO goals (user_email,subject,exam_name,exam_date,daily_hours,topics,completed_topics,created_at) VALUES (?,?,?,?,?,?,?,?)',
            (user_email, g.get('subject',''), g.get('examName',''), g.get('examDate',''),
             g.get('dailyHours',''), json.dumps(g.get('topics',[])), json.dumps(g.get('completedTopics',[])), g.get('createdAt',''))
        )
    conn.commit(); conn.close()
    return jsonify({'success': True})

@app.route('/get-goals/<email>', methods=['GET'])
def get_goals(email):
    conn = get_db()
    rows = conn.execute('SELECT * FROM goals WHERE user_email=?', (email.lower(),)).fetchall()
    conn.close()
    return jsonify({'goals': [{
        'id': r['id'], 'subject': r['subject'], 'examName': r['exam_name'],
        'examDate': r['exam_date'], 'dailyHours': r['daily_hours'],
        'topics': json.loads(r['topics'] or '[]'),
        'completedTopics': json.loads(r['completed_topics'] or '[]'),
        'createdAt': r['created_at']
    } for r in rows]})

# ─── Progress ─────────────────────────────────────────────────────────────────

@app.route('/save-progress', methods=['POST'])
def save_progress():
    data = request.get_json()
    user_email = data.get('user_email','').lower()
    conn = get_db()
    conn.execute('DELETE FROM progress WHERE user_email=?', (user_email,))
    for p in data.get('progress', []):
        conn.execute(
            'INSERT INTO progress (user_email,subject_name,completed_topics,total_topics,progress_percentage) VALUES (?,?,?,?,?)',
            (user_email, p.get('subject_name',''), p.get('completed_topics',0), p.get('total_topics',0), p.get('progress_percentage',0))
        )
    conn.commit(); conn.close()
    return jsonify({'success': True})

@app.route('/get-progress/<email>', methods=['GET'])
def get_progress(email):
    conn = get_db()
    rows = conn.execute('SELECT * FROM progress WHERE user_email=?', (email.lower(),)).fetchall()
    conn.close()
    return jsonify({'progress': [dict(r) for r in rows]})

# ─── Notes ────────────────────────────────────────────────────────────────────

@app.route('/save-notes', methods=['POST'])
def save_notes():
    data = request.get_json()
    user_email = data.get('user_email','').lower()
    conn = get_db()
    conn.execute('DELETE FROM notes WHERE user_email=?', (user_email,))
    for n in data.get('notes', []):
        conn.execute('INSERT INTO notes (user_email,note_text,created_at) VALUES (?,?,?)',
                     (user_email, n.get('text',''), n.get('date','')))
    conn.commit(); conn.close()
    return jsonify({'success': True})

@app.route('/get-notes/<email>', methods=['GET'])
def get_notes(email):
    conn = get_db()
    rows = conn.execute('SELECT * FROM notes WHERE user_email=?', (email.lower(),)).fetchall()
    conn.close()
    return jsonify({'notes': [{'id': r['id'], 'text': r['note_text'], 'date': r['created_at']} for r in rows]})

# ─── Chat ─────────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are Sakhi 🌸, a friendly and supportive AI study companion for students.
Help students with academic questions, study tips, motivation, and emotional support.
Keep responses concise, warm, and encouraging. Use emojis occasionally."""

@app.route('/chat', methods=['POST'])
def chat():
    if not GROQ_API_KEY:
        return jsonify({'error': 'Groq API key not configured.'}), 500
    data = request.get_json()
    messages = data.get('messages', [])
    if not messages:
        return jsonify({'error': 'No messages provided.'}), 400
    try:
        resp = client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[{'role': 'system', 'content': SYSTEM_PROMPT}] + messages,
            max_tokens=500, temperature=0.7)
        return jsonify({'reply': resp.choices[0].message.content.strip()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ─── PDF Extractor ────────────────────────────────────────────────────────────

@app.route('/extract-pdf', methods=['POST'])
def extract_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded.'}), 400
    try:
        text = extract_pdf_text(request.files['file'].read())
        if not text:
            return jsonify({'error': 'No text found. PDF may be image-based.'}), 400
        return jsonify({'text': text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ─── Quiz Generator ───────────────────────────────────────────────────────────

@app.route('/generate-quiz', methods=['POST'])
def generate_quiz():
    if not GROQ_API_KEY:
        return jsonify({'error': 'Groq API key not configured.'}), 500
    data  = request.get_json()
    topic = data.get('topic','').strip()
    count = int(data.get('count', 5))
    if not topic:
        return jsonify({'error': 'No topic provided.'}), 400
    prompt = f"""Generate exactly {count} multiple choice quiz questions about: "{topic}".
Return ONLY a valid JSON array. No explanation, no markdown.
Each object must have: "question", "options" (4 items), "answer", "explanation".
Example: [{{"question":"...","options":["A","B","C","D"],"answer":"A","explanation":"..."}}]"""
    try:
        resp  = client.chat.completions.create(model='llama-3.3-70b-versatile',
            messages=[{'role':'user','content':prompt}], max_tokens=2000, temperature=0.7)
        raw   = resp.choices[0].message.content.strip()
        match = re.search(r'\[.*\]', raw, re.DOTALL)
        if not match:
            return jsonify({'error': 'Could not parse quiz.'}), 500
        questions = json.loads(match.group())
        for i, q in enumerate(questions):
            q['id'] = i + 1
        return jsonify({'questions': questions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ─── Roadmap Generator ────────────────────────────────────────────────────────

@app.route('/generate-roadmap-ai', methods=['POST'])
def generate_roadmap_ai():
    if not GROQ_API_KEY:
        return jsonify({'error': 'Groq API key not configured.'}), 500

    topic_summary = ''
    is_pdf        = False

    if 'file' in request.files:
        file      = request.files['file']
        ext       = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else ''
        raw_bytes = file.read()

        if ext == 'pdf':
            is_pdf = True
            try:
                pdf_text = extract_pdf_text(raw_bytes)
            except Exception as e:
                return jsonify({'error': f'PDF read failed: {str(e)}'}), 400

            if not pdf_text:
                return jsonify({'error': 'This PDF is image-based (scanned). pypdf can only read text-based PDFs. Please open your PDF and check if you can select/copy text — if not, it cannot be used.'}), 400

            # Step 1: Summarize PDF with Groq
            try:
                summary_resp = client.chat.completions.create(
                    model='llama-3.3-70b-versatile',
                    messages=[{'role': 'user', 'content': f"""Read this PDF content and identify:
1. The main subject/topic
2. All key concepts, chapters, and subtopics
3. Difficulty level

PDF Content:
{pdf_text[:6000]}

Write a detailed structured summary of all topics covered."""}],
                    max_tokens=1000, temperature=0.3)
                topic_summary = summary_resp.choices[0].message.content.strip()
            except Exception as e:
                return jsonify({'error': f'PDF analysis failed: {str(e)}'}), 500
        else:
            topic_summary = raw_bytes.decode('utf-8', errors='ignore').strip()
    else:
        body          = request.get_json(force=True, silent=True) or {}
        topic_summary = body.get('text', '').strip()

    if not topic_summary:
        return jsonify({'error': 'No input provided.'}), 400

    # Step 2: Generate roadmap
    source_note = 'Topics MUST come directly from the PDF content above.' if is_pdf else 'Generate relevant topics for this subject.'
    try:
        resp  = client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[{'role': 'user', 'content': f"""Generate a structured learning roadmap based on:

{topic_summary}

Return ONLY valid JSON, no markdown:
{{"title":"<title>","stages":[
  {{"level":"Beginner","weeks":"Week 1-2","topics":["t1","t2","t3","t4","t5"],"practice":"..."}},
  {{"level":"Intermediate","weeks":"Week 3-5","topics":["t1","t2","t3","t4","t5"],"practice":"..."}},
  {{"level":"Advanced","weeks":"Week 6-8","topics":["t1","t2","t3","t4","t5"],"practice":"..."}}
]}}

IMPORTANT: {source_note}"""}],
            max_tokens=1500, temperature=0.5)
        raw   = resp.choices[0].message.content.strip()
        match = re.search(r'\{.*\}', raw, re.DOTALL)
        if not match:
            return jsonify({'error': 'Could not parse roadmap.'}), 500
        roadmap = json.loads(match.group())
        roadmap['input_topic'] = topic_summary[:120]
        return jsonify({'roadmap': roadmap})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ─── Daily Study Plan ─────────────────────────────────────────────────────────

@app.route('/generate-daily-plan', methods=['POST'])
def generate_daily_plan():
    if not GROQ_API_KEY:
        return jsonify({'error': 'Groq API key not configured.'}), 500
    data  = request.get_json()
    email = data.get('email','').lower()
    mood  = data.get('mood','neutral').lower()
    conn  = get_db()
    goals = conn.execute('SELECT * FROM goals WHERE user_email=?', (email,)).fetchall()
    prog  = conn.execute('SELECT * FROM progress WHERE user_email=?', (email,)).fetchall()
    conn.close()
    if not goals:
        return jsonify({'error': 'No goals found. Please add study goals first.'}), 400
    goals_info = []
    for g in goals:
        topics   = json.loads(g['topics'] or '[]')
        done     = json.loads(g['completed_topics'] or '[]')
        goals_info.append({'subject': g['subject'], 'exam_date': g['exam_date'] or 'Not set',
                           'remaining': [t for t in topics if t not in done]})
    progress_info = {p['subject_name']: p['progress_percentage'] for p in prog}
    context = json.dumps({'goals': goals_info, 'progress': progress_info}, indent=2)
    mood_map = {
        'stressed': 'Short easy topics, 20-30 min sessions, be gentle.',
        'tired':    'Revision only, 20-25 min sessions, be soft.',
        'motivated':'More topics, 45-60 min sessions, be energetic.',
        'confused': 'Step-by-step logical order, 30 min sessions.',
        'happy':    'Balanced plan, 30-45 min sessions, be cheerful.',
        'sad':      'Light easy topics, 20-30 min sessions, be warm.',
        'anxious':  '1-2 topics only, 20 min sessions, be calm.',
        'neutral':  'Balanced plan, 30-40 min sessions, be friendly.',
    }
    try:
        resp  = client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[{'role':'user','content':f"""You are Sakhi, a friendly AI study planner.
Mood: {mood} — {mood_map.get(mood, 'Balanced plan, 30-40 min.')}
Goals: {context}
Generate TODAY's study plan as a JSON array. Each item: "subject","topic","duration","motivation","steps"(3-5 items).
Return ONLY valid JSON array, no markdown."""}],
            max_tokens=1000, temperature=0.7)
        raw   = resp.choices[0].message.content.strip()
        match = re.search(r'\[.*\]', raw, re.DOTALL)
        if not match:
            return jsonify({'error': 'Could not parse plan.'}), 500
        return jsonify({'plan': json.loads(match.group()), 'mood': mood})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ─── Roadmap Save/Get/Delete ────────────────────────────────────────────────────────────────

@app.route('/save-roadmap', methods=['POST'])
def save_roadmap():
    data       = request.get_json()
    user_email = data.get('user_email', '').lower()
    roadmap    = data.get('roadmap', {})
    if not user_email or not roadmap:
        return jsonify({'error': 'Missing data.'}), 400
    conn = get_db()
    # Prevent duplicate titles per user
    existing = conn.execute(
        'SELECT id FROM roadmaps WHERE user_email=? AND title=?',
        (user_email, roadmap.get('title',''))
    ).fetchone()
    if existing:
        conn.close()
        return jsonify({'error': 'A roadmap with this title is already saved.'}), 409
    conn.execute(
        'INSERT INTO roadmaps (user_email, title, data, saved_at) VALUES (?,?,?,?)',
        (user_email, roadmap.get('title',''), json.dumps(roadmap), roadmap.get('saved_at',''))
    )
    conn.commit()
    conn.close()
    return jsonify({'success': True})


@app.route('/get-roadmaps/<email>', methods=['GET'])
def get_roadmaps(email):
    conn = get_db()
    rows = conn.execute(
        'SELECT * FROM roadmaps WHERE user_email=? ORDER BY id DESC',
        (email.lower(),)
    ).fetchall()
    conn.close()
    return jsonify({'roadmaps': [
        {'id': r['id'], 'title': r['title'], 'data': json.loads(r['data']), 'saved_at': r['saved_at']}
        for r in rows
    ]})


@app.route('/delete-roadmap/<int:roadmap_id>', methods=['DELETE'])
def delete_roadmap(roadmap_id):
    conn = get_db()
    conn.execute('DELETE FROM roadmaps WHERE id=?', (roadmap_id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})


# ─── Get Mood ─────────────────────────────────────────────────────────────────

@app.route('/get-mood/<email>', methods=['GET'])
def get_mood(email):
    return jsonify({'mood': 'neutral'})

@app.route('/')
def home():
    return "Sakhi AI backend is running successfully"
# ─── Run ──────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    init_db()
    port = int(os.environ.get("PORT", 10000))
    print(f"✅ Server running on port {port}")
    app.run(host="0.0.0.0", port=port)
