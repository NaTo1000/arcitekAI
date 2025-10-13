# ArciTEK.AI

**Next-Level AI Creation Studio** | infinite♾2025

A comprehensive, high-end quality web application for creating professional-grade music, lifelike images, and engaging stories using advanced AI technology.

## Features

### 🎵 Music Generation Studio
- **High-Quality Output**: 96kHz/24-bit WAV format
- **Multiple Genres**: Electronic, Orchestral, Jazz, Rock, Hip Hop, Ambient, Classical, Reggae
- **Customizable Duration**: 10-180 seconds
- **AI-Powered**: Text-to-music generation with natural language prompts

### 🖼️ Image Generation Lab
- **Ultra High Resolution**: Up to 8K (7680x4320) - 10+ megapixels
- **Multiple Styles**: Photorealistic, Artistic, Concept Art, Anime, 3D Render, Oil Painting, Cyberpunk, Fantasy
- **Professional Quality**: Lifelike images suitable for commercial use
- **Powered by DALL-E 3**: State-of-the-art image generation

### 📖 Story Writer & Reader
- **AI Story Generation**: Create engaging stories in multiple genres
- **Multiple Lengths**: Flash fiction to novellas (500-25,000 words)
- **Kindle-like Reader**: Beautiful reading interface with serif typography
- **Voice Narration**: High-quality text-to-speech with multiple voices
- **Adjustable Speed**: 0.5x to 2.0x reading speed
- **Export Options**: TXT and PDF formats

## Technology Stack

### Frontend
- **React 18+** with modern hooks
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Lucide Icons** for beautiful iconography
- **Futuristic Design**: Glassmorphism, neon effects, animated gradients

### Backend
- **Flask** (Python 3.11)
- **OpenAI API**: GPT-4, DALL-E 3, TTS
- **High-Quality Processing**: Professional-grade output formats

## Installation

### Prerequisites
- Node.js 22+ and pnpm
- Python 3.11+
- OpenAI API key

### Frontend Setup

```bash
cd arcitekAI
pnpm install
pnpm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd arcitekAI/backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Run the server
python app.py
```

The backend API will be available at `http://localhost:5000`

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```

## API Endpoints

### Music Generation
```http
POST /api/generate-music
Content-Type: application/json

{
  "prompt": "Epic orchestral soundtrack with powerful drums",
  "genre": "orchestral",
  "duration": 30
}
```

### Image Generation
```http
POST /api/generate-image
Content-Type: application/json

{
  "prompt": "A futuristic cityscape at sunset with neon lights",
  "style": "photorealistic",
  "resolution": "4k"
}
```

### Story Generation
```http
POST /api/generate-story
Content-Type: application/json

{
  "prompt": "A detective in a cyberpunk city investigates an AI uprising",
  "genre": "sci-fi",
  "length": "short"
}
```

### Voice Narration
```http
POST /api/narrate-story
Content-Type: application/json

{
  "text": "Story content to narrate...",
  "voice": "alloy",
  "speed": 1.0
}
```

## Design Philosophy

ArciTEK.AI features a **next-level advanced technology aesthetic** with:

- **Futuristic Color Scheme**: Cyan, purple, and neon blue accents on dark backgrounds
- **Glassmorphism**: Translucent cards with backdrop blur
- **Neon Effects**: Glowing borders and text shadows
- **Animated Gradients**: Smooth, flowing background animations
- **Particle Effects**: Ambient background elements
- **Responsive Design**: Optimized for all device sizes

## Output Quality

### Music
- Format: WAV
- Sample Rate: 96kHz
- Bit Depth: 24-bit
- Channels: Stereo

### Images
- Formats: PNG
- Resolutions: HD (1920x1080) to 8K (7680x4320)
- Quality: 10+ megapixels
- Color Depth: 24-bit RGB

### Stories
- Formats: TXT, PDF
- Lengths: 500 to 25,000 words
- Narration: MP3 (high quality)
- Voices: 6 professional options

## Development

### Frontend Development
```bash
cd arcitekAI
pnpm run dev    # Start dev server with hot reload
pnpm run build  # Build for production
pnpm run preview # Preview production build
```

### Backend Development
```bash
cd arcitekAI/backend
python app.py  # Run Flask server with auto-reload
```

## Deployment

### Frontend
Deploy to Vercel, Netlify, or any static hosting service:
```bash
pnpm run build
# Deploy the 'dist' folder
```

### Backend
Deploy to Railway, Render, or any Python hosting service:
```bash
# Ensure requirements.txt is present
# Set OPENAI_API_KEY environment variable
# Run: python app.py
```

## Project Structure

```
arcitekAI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MusicStudio.jsx
│   │   │   ├── ImageLab.jsx
│   │   │   ├── StoryWriter.jsx
│   │   │   └── ui/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── public/
│   └── package.json
├── backend/
│   ├── services/
│   │   ├── music_service.py
│   │   ├── image_service.py
│   │   └── story_service.py
│   ├── outputs/
│   │   ├── music/
│   │   ├── images/
│   │   └── stories/
│   ├── app.py
│   └── requirements.txt
└── README.md
```

## Contributing

This project is maintained by NaTo1000. Contributions are welcome!

## License

Copyright © 2025 infinite♾2025. All rights reserved.

## Branding

**infinite♾2025** - Next-Level Advanced Technology

---

Built with ❤️ using cutting-edge AI technology

