'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Users, 
  Send, 
  Shield, 
  MapPin, 
  FileText,
  AlertTriangle,
  ExternalLink,
  Lock
} from 'lucide-react';

// Regional community groups with Signal and WhatsApp links
const REGIONAL_COMMUNITIES = [
  {
    id: 'mexico',
    name: 'México',
    flag: '🇲🇽',
    members: 2340,
    description: 'Reporteros y ciudadanos cubriendo México',
    signalLink: 'https://signal.group/#CjQKIExample1',
    whatsappLink: 'https://chat.whatsapp.com/Example1',
    topics: ['Politics', 'Security', 'Economy', 'Environment'],
    languages: ['es']
  },
  {
    id: 'brazil',
    name: 'Brasil',
    flag: '🇧🇷',
    members: 3120,
    description: 'Jornalistas e cidadãos cobrindo o Brasil',
    signalLink: 'https://signal.group/#CjQKIExample2',
    whatsappLink: 'https://chat.whatsapp.com/Example2',
    topics: ['Amazon', 'Politics', 'Economy', 'Culture'],
    languages: ['pt']
  },
  {
    id: 'argentina',
    name: 'Argentina',
    flag: '🇦🇷',
    members: 1890,
    description: 'Periodistas y ciudadanos cubriendo Argentina',
    signalLink: 'https://signal.group/#CjQKIExample3',
    whatsappLink: 'https://chat.whatsapp.com/Example3',
    topics: ['Economy', 'Politics', 'Culture', 'Patagonia'],
    languages: ['es']
  },
  {
    id: 'colombia',
    name: 'Colombia',
    flag: '🇨🇴',
    members: 1650,
    description: 'Periodistas y ciudadanos cubriendo Colombia',
    signalLink: 'https://signal.group/#CjQKIExample4',
    whatsappLink: 'https://chat.whatsapp.com/Example4',
    topics: ['Peace Process', 'Environment', 'Economy', 'Culture'],
    languages: ['es']
  },
  {
    id: 'chile',
    name: 'Chile',
    flag: '🇨🇱',
    members: 980,
    description: 'Periodistas y ciudadanos cubriendo Chile',
    signalLink: 'https://signal.group/#CjQKIExample5',
    whatsappLink: 'https://chat.whatsapp.com/Example5',
    topics: ['Constitution', 'Mining', 'Environment', 'Social'],
    languages: ['es']
  },
  {
    id: 'peru',
    name: 'Perú',
    flag: '🇵🇪',
    members: 1120,
    description: 'Periodistas y ciudadanos cubriendo Perú',
    signalLink: 'https://signal.group/#CjQKIExample6',
    whatsappLink: 'https://chat.whatsapp.com/Example6',
    topics: ['Politics', 'Mining', 'Indigenous Rights', 'Tourism'],
    languages: ['es', 'qu']
  },
  {
    id: 'venezuela',
    name: 'Venezuela',
    flag: '🇻🇪',
    members: 2100,
    description: 'Periodistas y ciudadanos cubriendo Venezuela',
    signalLink: 'https://signal.group/#CjQKIExample7',
    whatsappLink: 'https://chat.whatsapp.com/Example7',
    topics: ['Economy', 'Migration', 'Politics', 'Human Rights'],
    languages: ['es']
  },
  {
    id: 'central-america',
    name: 'Centroamérica',
    flag: '🌎',
    members: 1450,
    description: 'Guatemala, Honduras, El Salvador, Nicaragua, Costa Rica, Panamá',
    signalLink: 'https://signal.group/#CjQKIExample8',
    whatsappLink: 'https://chat.whatsapp.com/Example8',
    topics: ['Migration', 'Climate', 'Economy', 'Security'],
    languages: ['es']
  }
];

export default function CommunityPage() {
  const [selectedRegion, setSelectedRegion] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-foreground text-background py-16 md:py-24">
          <div className="container max-w-5xl">
            <div className="text-center">
              <Badge variant="outline" className="mb-4 border-background/30 text-background/80">
                Community Reporting
              </Badge>
              <h1 className="headline-hero mb-6">
                Join the Network
              </h1>
              <p className="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto">
                Connect with journalists and citizens across Latin America. 
                Share story tips, collaborate on investigations, and build trust together.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 border-b">
          <div className="container max-w-5xl">
            <h2 className="headline-section text-center mb-12">How Community Reporting Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Join Your Region</h3>
                  <p className="text-muted-foreground">
                    Select your country or region and join the secure messaging group that matches your area.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Share Information</h3>
                  <p className="text-muted-foreground">
                    Submit story tips, share documents, photos, or witness accounts with our journalist network.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">See Impact</h3>
                  <p className="text-muted-foreground">
                    Community tips become verified stories. Your information makes journalism possible.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Security Notice */}
        <section className="py-8 bg-amber-50 dark:bg-amber-950/20 border-b">
          <div className="container max-w-5xl">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200">Your Security Matters</h3>
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  We recommend using <strong>Signal</strong> for sensitive communications. Signal provides 
                  end-to-end encryption and disappearing messages. WhatsApp groups are available for 
                  general community discussions but may not be suitable for sensitive tips.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Regional Communities */}
        <section className="py-16">
          <div className="container max-w-5xl">
            <h2 className="headline-section mb-4">Regional Communities</h2>
            <p className="text-muted-foreground mb-8">
              Select your region to join the conversation. Each community has dedicated Signal and WhatsApp groups.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {REGIONAL_COMMUNITIES.map((region) => (
                <Card key={region.id} className="editorial-card" data-testid={`region-${region.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <span className="text-2xl">{region.flag}</span>
                          {region.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {region.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {region.members.toLocaleString()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Topics */}
                    <div className="flex flex-wrap gap-2">
                      {region.topics.map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>

                    {/* Join Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => window.open(region.signalLink, '_blank')}
                        data-testid={`join-signal-${region.id}`}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Signal
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => window.open(region.whatsappLink, '_blank')}
                        data-testid={`join-whatsapp-${region.id}`}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Guidelines */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-3xl">
            <h2 className="headline-section text-center mb-8">Community Guidelines</h2>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">✓ Do Share</h3>
                  <ul className="text-muted-foreground space-y-1 text-sm">
                    <li>• Story tips and leads from your community</li>
                    <li>• Photos and videos of newsworthy events (with consent)</li>
                    <li>• Public documents and data that expose wrongdoing</li>
                    <li>• Corrections or additional context for published stories</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2 text-destructive">✗ Don't Share</h3>
                  <ul className="text-muted-foreground space-y-1 text-sm">
                    <li>• Personal information of private individuals without consent</li>
                    <li>• Unverified rumors or speculation presented as fact</li>
                    <li>• Promotional content or spam</li>
                    <li>• Content that could endanger sources or subjects</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-amber-200 dark:border-amber-800">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Source Protection</h3>
                      <p className="text-muted-foreground text-sm">
                        We never reveal the identity of community sources without explicit consent. 
                        If you're sharing sensitive information, use Signal's disappearing messages 
                        feature and avoid including identifying details.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter variant="hero" />
      </main>

      <Footer />
    </div>
  );
}
