import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { BookOpen, Download, Loader2, Play, Pause, Volume2, ChevronLeft, ChevronRight, FileText } from 'lucide-react'

export default function StoryWriter() {
  const [prompt, setPrompt] = useState('')
  const [genre, setGenre] = useState('sci-fi')
  const [length, setLength] = useState('short')
  const [loading, setLoading] = useState(false)
  const [story, setStory] = useState(null)
  const [isReading, setIsReading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [voiceSpeed, setVoiceSpeed] = useState([1.0])
  const [selectedVoice, setSelectedVoice] = useState('alloy')
  const [audioUrl, setAudioUrl] = useState(null)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          genre,
          length
        })
      })
      const data = await response.json()
      setStory(data.story)
      setCurrentPage(0)
    } catch (error) {
      console.error('Error generating story:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNarrate = async () => {
    if (!story) return
    
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/narrate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: story.content,
          voice: selectedVoice,
          speed: voiceSpeed[0]
        })
      })
      const data = await response.json()
      setAudioUrl(data.url)
      setIsReading(true)
    } catch (error) {
      console.error('Error narrating story:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleReading = () => {
    const audio = document.getElementById('story-audio')
    if (audio) {
      if (isReading) {
        audio.pause()
      } else {
        audio.play()
      }
      setIsReading(!isReading)
    }
  }

  return (
    <Card className="glass-card border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl neon-text">
          <BookOpen className="w-6 h-6" />
          AI Story Writer & Reader
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Create engaging stories with AI • Kindle-like Reader • Voice Narration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!story ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="story-prompt" className="text-foreground">Story Concept</Label>
              <Textarea
                id="story-prompt"
                placeholder="Describe your story idea... (e.g., 'A detective in a cyberpunk city investigates a mysterious AI uprising')"
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
                    <SelectItem value="sci-fi">Science Fiction</SelectItem>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                    <SelectItem value="mystery">Mystery</SelectItem>
                    <SelectItem value="thriller">Thriller</SelectItem>
                    <SelectItem value="romance">Romance</SelectItem>
                    <SelectItem value="horror">Horror</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="literary">Literary Fiction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="length" className="text-foreground">Story Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger id="length" className="glass-card border-primary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-primary/30">
                    <SelectItem value="flash">Flash Fiction (500 words)</SelectItem>
                    <SelectItem value="short">Short Story (2,000 words)</SelectItem>
                    <SelectItem value="medium">Novelette (10,000 words)</SelectItem>
                    <SelectItem value="long">Novella (25,000 words)</SelectItem>
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
                  Creating Story...
                </>
              ) : (
                <>
                  <BookOpen className="mr-2 h-5 w-5" />
                  Generate Story
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Kindle-like Reader Interface */}
            <Card className="glass-card border-accent/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-accent">{story.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {genre.charAt(0).toUpperCase() + genre.slice(1)} • {length} story
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-accent/30"
                  onClick={() => setStory(null)}
                >
                  New Story
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Reader Display */}
                <div className="bg-background/50 rounded-lg p-8 min-h-[400px] max-h-[600px] overflow-y-auto border border-accent/20">
                  <div className="prose prose-invert max-w-none">
                    <h2 className="text-2xl font-serif mb-4 text-primary">{story.title}</h2>
                    <div className="text-lg leading-relaxed whitespace-pre-wrap font-serif">
                      {story.content}
                    </div>
                  </div>
                </div>

                {/* Voice Narration Controls */}
                <Card className="glass-card border-secondary/30">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Voice Narration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="voice" className="text-foreground text-sm">Narrator Voice</Label>
                        <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                          <SelectTrigger id="voice" className="glass-card border-secondary/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass-card border-secondary/30">
                            <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                            <SelectItem value="echo">Echo (Male)</SelectItem>
                            <SelectItem value="fable">Fable (British Male)</SelectItem>
                            <SelectItem value="onyx">Onyx (Deep Male)</SelectItem>
                            <SelectItem value="nova">Nova (Female)</SelectItem>
                            <SelectItem value="shimmer">Shimmer (Soft Female)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="speed" className="text-foreground text-sm">
                          Reading Speed: {voiceSpeed[0].toFixed(1)}x
                        </Label>
                        <Slider
                          id="speed"
                          min={0.5}
                          max={2.0}
                          step={0.1}
                          value={voiceSpeed}
                          onValueChange={setVoiceSpeed}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    {!audioUrl ? (
                      <Button
                        onClick={handleNarrate}
                        disabled={loading}
                        className="w-full border-secondary/30 glow-hover bg-secondary/20 hover:bg-secondary/40"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Narration...
                          </>
                        ) : (
                          <>
                            <Volume2 className="mr-2 h-4 w-4" />
                            Generate Voice Narration
                          </>
                        )}
                      </Button>
                    ) : (
                      <>
                        <audio
                          id="story-audio"
                          src={audioUrl}
                          onEnded={() => setIsReading(false)}
                          className="hidden"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={toggleReading}
                            className="flex-1 border-secondary/30 glow-hover bg-secondary/20 hover:bg-secondary/40"
                          >
                            {isReading ? (
                              <>
                                <Pause className="mr-2 h-4 w-4" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Play Narration
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            className="border-secondary/30 hover:border-secondary"
                            onClick={() => {
                              const a = document.createElement('a')
                              a.href = audioUrl
                              a.download = 'arcitekAI-narration.mp3'
                              a.click()
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Download Options */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-accent/30 hover:border-accent glow-hover"
                    onClick={() => {
                      const blob = new Blob([story.content], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `${story.title}.txt`
                      a.click()
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Download TXT
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-accent/30 hover:border-accent glow-hover"
                    onClick={() => {
                      // In production, this would call backend to generate PDF
                      alert('PDF export will be available in the deployed version')
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </CardContent>
    </Card>
  )
}

