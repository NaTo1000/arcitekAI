"""
Story Generation and Narration Service
Uses GPT-4 for story creation and OpenAI TTS for voice narration
"""

import os
import time
from openai import OpenAI

class StoryService:
    def __init__(self):
        self.client = OpenAI()
        self.output_dir = os.path.join(os.path.dirname(__file__), '..', 'outputs', 'stories')
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Story length configurations (word counts)
        self.lengths = {
            'flash': 500,
            'short': 2000,
            'medium': 10000,
            'long': 25000
        }
    
    def generate(self, prompt, genre, length):
        """
        Generate creative story from text prompt
        
        Args:
            prompt (str): Story concept/idea
            genre (str): Story genre
            length (str): Story length (flash, short, medium, long)
            
        Returns:
            dict: Generated story information
        """
        word_count = self.lengths.get(length, 2000)
        
        # Create detailed system prompt for story generation
        system_prompt = f"""You are an expert creative writer specializing in {genre} fiction.
Write engaging, well-structured stories with vivid descriptions, compelling characters, and strong narrative arcs.
Your writing should be immersive and professional quality."""

        user_prompt = f"""Write a {genre} story based on this concept: {prompt}

Requirements:
- Target length: approximately {word_count} words
- Include a compelling title
- Create vivid characters and settings
- Build tension and conflict
- Provide a satisfying resolution
- Use descriptive, engaging prose

Format the response as:
TITLE: [Story Title]

[Story content]"""

        try:
            print(f"Generating {length} {genre} story...")
            print(f"Target: ~{word_count} words")
            
            # Use available model (gpt-4.1-mini as per environment)
            response = self.client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.8,
                max_tokens=min(word_count * 2, 16000)  # Generous token limit
            )
            
            # Parse response
            full_text = response.choices[0].message.content.strip()
            
            # Extract title and content
            if "TITLE:" in full_text:
                parts = full_text.split("\n", 2)
                title = parts[0].replace("TITLE:", "").strip()
                content = parts[2].strip() if len(parts) > 2 else parts[1].strip()
            else:
                title = f"{genre.title()} Story"
                content = full_text
            
            # Calculate actual word count
            actual_word_count = len(content.split())
            
            print(f"✓ Generated story: '{title}'")
            print(f"  Word count: {actual_word_count}")
            
            # Save story to file
            filename = f"story_{int(time.time())}.txt"
            filepath = os.path.join(self.output_dir, filename)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(f"{title}\n\n{content}")
            
            return {
                'title': title,
                'content': content,
                'word_count': actual_word_count,
                'filename': filename,
                'filepath': filepath
            }
            
        except Exception as e:
            print(f"Error generating story: {e}")
            # Return demo story
            return self._create_demo_story(prompt, genre)
    
    def narrate(self, text, voice, speed):
        """
        Generate voice narration for story text
        
        Args:
            text (str): Story text to narrate
            voice (str): Voice model (alloy, echo, fable, onyx, nova, shimmer)
            speed (float): Narration speed (0.25 to 4.0)
            
        Returns:
            dict: Generated narration information
        """
        try:
            print(f"Generating voice narration with {voice} voice...")
            
            # Limit text length for TTS (OpenAI has 4096 char limit)
            max_chars = 4000
            if len(text) > max_chars:
                text = text[:max_chars] + "..."
                print(f"  Text truncated to {max_chars} characters")
            
            # Generate speech using OpenAI TTS
            response = self.client.audio.speech.create(
                model="tts-1-hd",  # High-quality model
                voice=voice,
                input=text,
                speed=speed
            )
            
            # Save audio file
            filename = f"narration_{int(time.time())}.mp3"
            filepath = os.path.join(self.output_dir, filename)
            
            response.stream_to_file(filepath)
            
            # Estimate duration (rough approximation: ~150 words per minute at 1.0 speed)
            word_count = len(text.split())
            duration = int((word_count / 150) * 60 / speed)
            
            print(f"✓ Generated narration: {filepath}")
            print(f"  Duration: ~{duration}s, Voice: {voice}, Speed: {speed}x")
            
            return {
                'url': f'/api/outputs/stories/{filename}',
                'filename': filename,
                'filepath': filepath,
                'duration': duration,
                'voice': voice,
                'speed': speed
            }
            
        except Exception as e:
            print(f"Error generating narration: {e}")
            raise
    
    def _create_demo_story(self, prompt, genre):
        """
        Create a demo story when API is unavailable
        """
        title = f"The {genre.title()} Tale"
        content = f"""In a world where {prompt}, extraordinary events were about to unfold.

This is a demonstration story generated by ArciTEK.AI. In the full version, this would be a complete, professionally-written {genre} story with rich characters, vivid descriptions, and an engaging plot.

The story would explore themes relevant to {genre} fiction, creating an immersive experience for the reader. Characters would be well-developed, the setting would be vividly described, and the narrative would build tension leading to a satisfying conclusion.

This demo showcases the story generation and narration capabilities of ArciTEK.AI, powered by advanced AI models and high-quality text-to-speech technology.

infinite♾2025"""
        
        word_count = len(content.split())
        
        return {
            'title': title,
            'content': content,
            'word_count': word_count,
            'filename': 'demo_story.txt',
            'filepath': os.path.join(self.output_dir, 'demo_story.txt')
        }

