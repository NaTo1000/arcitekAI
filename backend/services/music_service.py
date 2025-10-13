"""
Music Generation Service
Uses AI APIs to generate high-quality music (96kHz/24-bit WAV)
"""

import os
import time
import requests
from openai import OpenAI

class MusicService:
    def __init__(self):
        self.client = OpenAI()
        self.output_dir = os.path.join(os.path.dirname(__file__), '..', 'outputs', 'music')
        os.makedirs(self.output_dir, exist_ok=True)
    
    def generate(self, prompt, genre, duration):
        """
        Generate music from text prompt
        
        Args:
            prompt (str): Description of the music to generate
            genre (str): Music genre
            duration (int): Duration in seconds
            
        Returns:
            dict: Generated music information
        """
        # Enhanced prompt with genre and style
        enhanced_prompt = f"{prompt}. Genre: {genre}. Duration: approximately {duration} seconds."
        
        # For demo purposes, we'll use a placeholder approach
        # In production, this would integrate with ElevenLabs Music API or similar
        
        # Simulate music generation (in production, call actual API)
        filename = f"music_{int(time.time())}.wav"
        filepath = os.path.join(self.output_dir, filename)
        
        # Create a placeholder WAV file header for demo
        # In production, this would be the actual generated music from API
        self._create_demo_wav(filepath, duration)
        
        return {
            'url': f'/api/outputs/music/{filename}',
            'filename': filename,
            'filepath': filepath,
            'duration': duration,
            'format': 'WAV',
            'sample_rate': '96kHz',
            'bit_depth': '24-bit'
        }
    
    def _create_demo_wav(self, filepath, duration):
        """
        Create a demo WAV file
        In production, this would be replaced with actual API call
        """
        # Simple WAV file header for demonstration
        # In production, use actual music generation API
        
        import wave
        import numpy as np
        
        sample_rate = 96000  # 96kHz
        num_channels = 2  # Stereo
        sample_width = 3  # 24-bit (3 bytes)
        
        # Generate silence or simple tone for demo
        num_samples = int(sample_rate * duration)
        
        # Create a simple sine wave for demonstration
        frequency = 440.0  # A4 note
        t = np.linspace(0, duration, num_samples)
        audio_data = np.sin(2 * np.pi * frequency * t) * 0.3
        
        # Convert to 24-bit PCM
        audio_data = (audio_data * (2**23 - 1)).astype(np.int32)
        
        # Write WAV file
        with wave.open(filepath, 'w') as wav_file:
            wav_file.setnchannels(num_channels)
            wav_file.setsampwidth(sample_width)
            wav_file.setframerate(sample_rate)
            
            # Write stereo data (duplicate mono to both channels)
            for sample in audio_data:
                # Convert to 24-bit bytes
                sample_bytes = sample.to_bytes(3, byteorder='little', signed=True)
                wav_file.writeframes(sample_bytes * num_channels)
        
        print(f"✓ Generated demo music: {filepath}")
        print(f"  Format: 96kHz/24-bit WAV, Duration: {duration}s")

