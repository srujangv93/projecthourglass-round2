from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__, static_url_path='', static_folder='.')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

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
    order = data.get('order', [])
    
    required_order = ['item-mars', 'item-jupiter', 'item-saturn', 'item-polaris', 'item-satellite']
    
    if order == required_order:
        return jsonify({'success': True})
    return jsonify({'success': False})

if __name__ == '__main__':
    print("Starting secure Planetarium backend server on port 8080...")
    app.run(host='0.0.0.0', port=8080)
