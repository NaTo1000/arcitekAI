#!/usr/bin/env python3
"""
ArciTEK.AI Backend Server
High-end AI creation platform for music, images, and stories
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from dotenv import load_dotenv

from services.music_service import MusicService
from services.image_service import ImageService
from services.story_service import StoryService

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize services
music_service = MusicService()
image_service = ImageService()
story_service = StoryService()

# Configuration
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'outputs')
os.makedirs(OUTPUT_DIR, exist_ok=True)


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'online',
        'service': 'ArciTEK.AI Backend',
        'version': '1.0.0',
        'branding': 'infinite♾2025'
    })


@app.route('/api/generate-music', methods=['POST'])
def generate_music():
    """
    Generate high-quality music from text prompt
    
    Request body:
    {
        "prompt": "Epic orchestral soundtrack",
        "genre": "orchestral",
        "duration": 30
    }
    """
    try:
        data = request.json
        prompt = data.get('prompt')
        genre = data.get('genre', 'electronic')
        duration = data.get('duration', 30)
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        # Generate music
        result = music_service.generate(prompt, genre, duration)
        
        return jsonify({
            'success': True,
            'url': result['url'],
            'filename': result['filename'],
            'format': 'WAV',
            'quality': '96kHz/24-bit'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/generate-image', methods=['POST'])
def generate_image():
    """
    Generate high-resolution images from text prompt
    
    Request body:
    {
        "prompt": "A futuristic cityscape at sunset",
        "style": "photorealistic",
        "resolution": "4k"
    }
    """
    try:
        data = request.json
        prompt = data.get('prompt')
        style = data.get('style', 'photorealistic')
        resolution = data.get('resolution', '4k')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        # Generate image
        result = image_service.generate(prompt, style, resolution)
        
        return jsonify({
            'success': True,
            'url': result['url'],
            'filename': result['filename'],
            'resolution': result['resolution'],
            'megapixels': result['megapixels']
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/generate-story', methods=['POST'])
def generate_story():
    """
    Generate creative stories from text prompt
    
    Request body:
    {
        "prompt": "A detective in a cyberpunk city",
        "genre": "sci-fi",
        "length": "short"
    }
    """
    try:
        data = request.json
        prompt = data.get('prompt')
        genre = data.get('genre', 'sci-fi')
        length = data.get('length', 'short')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        # Generate story
        result = story_service.generate(prompt, genre, length)
        
        return jsonify({
            'success': True,
            'story': {
                'title': result['title'],
                'content': result['content'],
                'word_count': result['word_count']
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/narrate-story', methods=['POST'])
def narrate_story():
    """
    Generate voice narration for story text
    
    Request body:
    {
        "text": "Story content...",
        "voice": "alloy",
        "speed": 1.0
    }
    """
    try:
        data = request.json
        text = data.get('text')
        voice = data.get('voice', 'alloy')
        speed = data.get('speed', 1.0)
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # Generate narration
        result = story_service.narrate(text, voice, speed)
        
        return jsonify({
            'success': True,
            'url': result['url'],
            'filename': result['filename'],
            'duration': result['duration']
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/outputs/<path:filename>', methods=['GET'])
def serve_output(filename):
    """Serve generated output files"""
    try:
        file_path = os.path.join(OUTPUT_DIR, filename)
        if os.path.exists(file_path):
            return send_file(file_path)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("=" * 60)
    print("ArciTEK.AI Backend Server")
    print("infinite♾2025")
    print("=" * 60)
    print("Starting server on http://localhost:5000")
    print("API Endpoints:")
    print("  - POST /api/generate-music")
    print("  - POST /api/generate-image")
    print("  - POST /api/generate-story")
    print("  - POST /api/narrate-story")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5000)

