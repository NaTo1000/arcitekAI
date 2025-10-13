import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Image, Download, Loader2, Maximize2 } from 'lucide-react'

export default function ImageLab() {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('photorealistic')
  const [resolution, setResolution] = useState('4k')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style,
          resolution
        })
      })
      const data = await response.json()
      setImageUrl(data.url)
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="glass-card border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl neon-text">
          <Image className="w-6 h-6" />
          Image Generation Lab
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Create lifelike high-resolution images • 10+ Megapixels • 4K Quality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="image-prompt" className="text-foreground">Image Description</Label>
          <Textarea
            id="image-prompt"
            placeholder="Describe the image you want to create... (e.g., 'A futuristic cityscape at sunset with flying cars and neon lights')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] glass-card border-primary/30 focus:neon-border"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="style" className="text-foreground">Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger id="style" className="glass-card border-primary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-primary/30">
                <SelectItem value="photorealistic">Photorealistic</SelectItem>
                <SelectItem value="artistic">Artistic</SelectItem>
                <SelectItem value="concept-art">Concept Art</SelectItem>
                <SelectItem value="anime">Anime</SelectItem>
                <SelectItem value="3d-render">3D Render</SelectItem>
                <SelectItem value="oil-painting">Oil Painting</SelectItem>
                <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                <SelectItem value="fantasy">Fantasy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resolution" className="text-foreground">Resolution</Label>
            <Select value={resolution} onValueChange={setResolution}>
              <SelectTrigger id="resolution" className="glass-card border-primary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-primary/30">
                <SelectItem value="hd">HD (1920x1080)</SelectItem>
                <SelectItem value="2k">2K (2560x1440)</SelectItem>
                <SelectItem value="4k">4K (3840x2160)</SelectItem>
                <SelectItem value="8k">8K (7680x4320)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="w-full neon-border glow-hover bg-primary/20 hover:bg-primary/40"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Image...
            </>
          ) : (
            <>
              <Image className="mr-2 h-5 w-5" />
              Generate Image
            </>
          )}
        </Button>

        {imageUrl && (
          <Card className="glass-card border-accent/30 mt-6">
            <CardHeader>
              <CardTitle className="text-lg text-accent">Generated Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative group rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Generated"
                  className="w-full h-auto rounded-lg border border-accent/30"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="outline"
                    className="border-accent/50 hover:border-accent"
                    onClick={() => window.open(imageUrl, '_blank')}
                  >
                    <Maximize2 className="mr-2 h-4 w-4" />
                    View Full Size
                  </Button>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-accent/30 hover:border-accent glow-hover"
                onClick={() => {
                  const a = document.createElement('a')
                  a.href = imageUrl
                  a.download = 'arcitekAI-image.png'
                  a.click()
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Download High-Resolution Image
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}

