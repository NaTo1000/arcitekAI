import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Music, Image, BookOpen, Sparkles } from 'lucide-react'
import MusicStudio from './components/MusicStudio.jsx'
import ImageLab from './components/ImageLab.jsx'
import StoryWriter from './components/StoryWriter.jsx'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('music')

  return (
    <div className="dark min-h-screen gradient-bg">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-primary animate-pulse" />
            <h1 className="text-6xl font-bold neon-text">ArciTEK.AI</h1>
            <Sparkles className="w-12 h-12 text-accent animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground">
            Next-Level AI Creation Studio
          </p>
          <p className="text-sm text-primary mt-2">
            High-End Quality • Music • Images • Stories
          </p>
        </header>

        {/* Main Interface */}
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 glass-card mb-8 p-2">
              <TabsTrigger 
                value="music" 
                className="flex items-center gap-2 data-[state=active]:neon-border glow-hover"
              >
                <Music className="w-5 h-5" />
                <span className="hidden sm:inline">Music Studio</span>
              </TabsTrigger>
              <TabsTrigger 
                value="image" 
                className="flex items-center gap-2 data-[state=active]:neon-border glow-hover"
              >
                <Image className="w-5 h-5" />
                <span className="hidden sm:inline">Image Lab</span>
              </TabsTrigger>
              <TabsTrigger 
                value="story" 
                className="flex items-center gap-2 data-[state=active]:neon-border glow-hover"
              >
                <BookOpen className="w-5 h-5" />
                <span className="hidden sm:inline">Story Writer</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="music" className="space-y-4">
              <MusicStudio />
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <ImageLab />
            </TabsContent>

            <TabsContent value="story" className="space-y-4">
              <StoryWriter />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Branding Footer */}
      <div className="fixed bottom-4 left-4 infinite-brand text-sm z-50">
        infinite♾2025
      </div>
    </div>
  )
}

export default App

