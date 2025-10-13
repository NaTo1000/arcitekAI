import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { Music, Download, Play, Loader2 } from 'lucide-react'

export default function MusicStudio() {
  const [prompt, setPrompt] = useState('')
  const [genre, setGenre] = useState('electronic')
  const [duration, setDuration] = useState([30])
  const [loading, setLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          genre,
          duration: duration[0]
        })
      })
      const data = await response.json()
      setAudioUrl(data.url)
    } catch (error) {
      console.error('Error generating music:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="glass-card border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl neon-text">
          <Music className="w-6 h-6" />
          Music Generation Studio
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Create high-quality music with AI • HD WAV Output (96kHz/24-bit)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="music-prompt" className="text-foreground">Music Description</Label>
          <Textarea
            id="music-prompt"
            placeholder="Describe the music you want to create... (e.g., 'Epic orchestral soundtrack with powerful drums and soaring strings')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] glass-card border-primary/30 focus:neon-border"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="genre" className="text-foreground">Genre</Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger id="genre" className="glass-card border-primary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-primary/30">
                <SelectItem value="electronic">Electronic</SelectItem>
                <SelectItem value="orchestral">Orchestral</SelectItem>
                <SelectItem value="jazz">Jazz</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="hiphop">Hip Hop</SelectItem>
                <SelectItem value="ambient">Ambient</SelectItem>
                <SelectItem value="classical">Classical</SelectItem>
                <SelectItem value="reggae">Reggae</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-foreground">
              Duration: {duration[0]} seconds
            </Label>
            <Slider
              id="duration"
              min={10}
              max={180}
              step={5}
              value={duration}
              onValueChange={setDuration}
              className="mt-2"
            />
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
              Generating Music...
            </>
          ) : (
            <>
              <Music className="mr-2 h-5 w-5" />
              Generate Music
            </>
          )}
        </Button>

        {audioUrl && (
          <Card className="glass-card border-accent/30 mt-6">
            <CardHeader>
              <CardTitle className="text-lg text-accent">Generated Music</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <audio controls className="w-full" src={audioUrl}>
                Your browser does not support the audio element.
              </audio>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-accent/30 hover:border-accent glow-hover"
                  onClick={() => window.open(audioUrl, '_blank')}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Play
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-accent/30 hover:border-accent glow-hover"
                  onClick={() => {
                    const a = document.createElement('a')
                    a.href = audioUrl
                    a.download = 'arcitekAI-music.wav'
                    a.click()
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download HD WAV
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}

