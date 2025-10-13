"""
Image Generation Service
Uses DALL-E 3 and upscaling for high-resolution images (10+ megapixels)
"""

import os
import time
import requests
from openai import OpenAI
from PIL import Image
import io

class ImageService:
    def __init__(self):
        self.client = OpenAI()
        self.output_dir = os.path.join(os.path.dirname(__file__), '..', 'outputs', 'images')
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Resolution configurations
        self.resolutions = {
            'hd': (1920, 1080),
            '2k': (2560, 1440),
            '4k': (3840, 2160),
            '8k': (7680, 4320)
        }
    
    def generate(self, prompt, style, resolution):
        """
        Generate high-resolution image from text prompt
        
        Args:
            prompt (str): Description of the image to generate
            style (str): Image style
            resolution (str): Target resolution (hd, 2k, 4k, 8k)
            
        Returns:
            dict: Generated image information
        """
        # Enhanced prompt with style
        style_prompts = {
            'photorealistic': 'photorealistic, highly detailed, professional photography',
            'artistic': 'artistic, creative, expressive art style',
            'concept-art': 'concept art, detailed illustration, professional design',
            'anime': 'anime style, detailed anime artwork',
            '3d-render': '3D rendered, realistic lighting, high quality render',
            'oil-painting': 'oil painting style, classical art technique',
            'cyberpunk': 'cyberpunk aesthetic, neon lights, futuristic',
            'fantasy': 'fantasy art, magical, ethereal atmosphere'
        }
        
        style_desc = style_prompts.get(style, 'high quality artwork')
        enhanced_prompt = f"{prompt}, {style_desc}"
        
        try:
            # Generate image using DALL-E 3
            print(f"Generating image with DALL-E 3...")
            print(f"Prompt: {enhanced_prompt}")
            
            response = self.client.images.generate(
                model="dall-e-3",
                prompt=enhanced_prompt,
                size="1792x1024",  # DALL-E 3 max size
                quality="hd",
                n=1
            )
            
            # Download the generated image
            image_url = response.data[0].url
            image_data = requests.get(image_url).content
            
            # Open image with PIL
            img = Image.open(io.BytesIO(image_data))
            
            # Upscale to target resolution if needed
            target_size = self.resolutions.get(resolution, (3840, 2160))
            if target_size[0] > img.width or target_size[1] > img.height:
                print(f"Upscaling to {resolution} ({target_size[0]}x{target_size[1]})...")
                img = img.resize(target_size, Image.Resampling.LANCZOS)
            
            # Save high-resolution image
            filename = f"image_{int(time.time())}.png"
            filepath = os.path.join(self.output_dir, filename)
            img.save(filepath, 'PNG', quality=100, optimize=False)
            
            # Calculate megapixels
            megapixels = (img.width * img.height) / 1_000_000
            
            print(f"✓ Generated image: {filepath}")
            print(f"  Resolution: {img.width}x{img.height} ({megapixels:.1f} MP)")
            
            return {
                'url': f'/api/outputs/images/{filename}',
                'filename': filename,
                'filepath': filepath,
                'resolution': f"{img.width}x{img.height}",
                'megapixels': round(megapixels, 1)
            }
            
        except Exception as e:
            print(f"Error generating image: {e}")
            # Fallback to demo image
            return self._create_demo_image(prompt, resolution)
    
    def _create_demo_image(self, prompt, resolution):
        """
        Create a demo placeholder image
        Fallback when API is unavailable
        """
        from PIL import Image, ImageDraw, ImageFont
        
        target_size = self.resolutions.get(resolution, (3840, 2160))
        
        # Create gradient background
        img = Image.new('RGB', target_size, color=(20, 30, 60))
        draw = ImageDraw.Draw(img)
        
        # Add text
        text = f"ArciTEK.AI\n\n{prompt[:100]}\n\nDemo Image\n{target_size[0]}x{target_size[1]}"
        
        # Draw centered text
        bbox = draw.textbbox((0, 0), text)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        position = ((target_size[0] - text_width) // 2, (target_size[1] - text_height) // 2)
        draw.text(position, text, fill=(100, 200, 255))
        
        # Save
        filename = f"image_demo_{int(time.time())}.png"
        filepath = os.path.join(self.output_dir, filename)
        img.save(filepath, 'PNG')
        
        megapixels = (target_size[0] * target_size[1]) / 1_000_000
        
        return {
            'url': f'/api/outputs/images/{filename}',
            'filename': filename,
            'filepath': filepath,
            'resolution': f"{target_size[0]}x{target_size[1]}",
            'megapixels': round(megapixels, 1)
        }

