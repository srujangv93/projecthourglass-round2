from flask import Flask, request, jsonify, send_from_directory
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = Flask(__name__, static_url_path='', static_folder='.')

# Supabase configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")




supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    print("WARNING: SUPABASE_URL or SUPABASE_KEY not found in environment. Database inserts will be skipped.")

@app.route('/')
def index():
    return send_from_directory('round-2', 'index.html')

@app.route('/api/verify-planetarium', methods=['POST'])
def verify_planetarium():
    data = request.json
    pwd = data.get('password', '').strip().upper()
    
    if pwd == '1A7A991B64':
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'INVALID CIPHER. SYNC DISTORTED.'})

@app.route('/api/verify-celestial-order', methods=['POST'])
def verify_celestial_order():
    data = request.json
    teamname = data.get('teamname', 'Unknown')
    order = data.get('order', [])
    timetaken = data.get('timetaken', 0)
    
    required_order = ['item-mars', 'item-jupiter', 'item-saturn', 'item-polaris', 'item-satellite']
    is_correct = order == required_order
    
    # Save to Supabase
    if supabase:
        try:
            submission_data = {
                "teamname": teamname,
                "answer": ",".join([str(o) for o in order if o is not None]),
                "iscorrect": is_correct,
                "timetaken": timetaken
            }
            supabase.table("round2_submissions").insert(submission_data).execute()
        except Exception as e:
            print(f"Error inserting into Supabase: {e}")
    
    if is_correct:
        return jsonify({'success': True})
    return jsonify({'success': False})

if __name__ == '__main__':
    print("Starting secure Planetarium backend server on port 8080...")

    app.run(host='0.0.0.0', port=8080)
