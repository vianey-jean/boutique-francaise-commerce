import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Users, 
  Calendar, 
  TrendingUp, 
  Star, 
  Clock, 
  MessageSquare, 
  Share2,
  Mic,
  StickyNote,
  BarChart3,
  Bell,
  Crown,
  Sparkles
} from 'lucide-react';

// Import des nouveaux composants
import { VoiceBooking } from '../components/advanced/VoiceBooking';
import { MemoBoard } from '../components/advanced/MemoBoard';
import { PlanningShare } from '../components/advanced/PlanningShare';
import { AdvancedNotifications } from '../components/advanced/AdvancedNotifications';
import { PremiumAnalytics } from '../components/advanced/PremiumAnalytics';

export default function PremiumDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const quickStats = [
    { 
      title: 'Rendez-vous Aujourd\'hui', 
      value: '12', 
      change: '+3', 
      icon: Calendar, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Clients Actifs', 
      value: '89', 
      change: '+5', 
      icon: Users, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Chiffre d\'Affaires', 
      value: '€2,450', 
      change: '+12%', 
      icon: TrendingUp, 
      color: 'bg-purple-500' 
    },
    { 
      title: 'Satisfaction', 
      value: '4.8/5', 
      change: '+0.2', 
      icon: Star, 
      color: 'bg-yellow-500' 
    }
  ];

  const quickActions = [
    { 
      title: 'Assistant Vocal', 
      description: 'Prendre RDV par commande vocale',
      icon: Mic, 
      action: () => setActiveTab('voice'),
      color: 'premium-gradient'
    },
    { 
      title: 'Nouveau Mémo', 
      description: 'Créer une note ou tâche',
      icon: StickyNote, 
      action: () => setActiveTab('memos'),
      color: 'bg-green-500'
    },
    { 
      title: 'Partager Planning', 
      description: 'Collaboration en équipe',
      icon: Share2, 
      action: () => setActiveTab('share'),
      color: 'bg-blue-500'
    },
    { 
      title: 'Analytics', 
      description: 'Voir les performances',
      icon: BarChart3, 
      action: () => setActiveTab('analytics'),
      color: 'bg-purple-500'
    }
  ];

  const recentActivities = [
    {
      type: 'appointment',
      title: 'RDV confirmé: Sophie Martin',
      time: 'Il y a 5 min',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      type: 'voice',
      title: 'Commande vocale traitée',
      time: 'Il y a 12 min',
      icon: Mic,
      color: 'text-blue-600'
    },
    {
      type: 'memo',
      title: 'Nouveau mémo créé',
      time: 'Il y a 25 min',
      icon: StickyNote,
      color: 'text-yellow-600'
    },
    {
      type: 'notification',
      title: 'Rappel envoyé par SMS',
      time: 'Il y a 1h',
      icon: Bell,
      color: 'text-purple-600'
    }
  ];

  const StatCard = ({ stat }: { stat: typeof quickStats[0] }) => (
    <Card className="luxury-card premium-shadow premium-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold">{stat.value}</p>
              <Badge className="bg-green-100 text-green-800 text-xs">
                {stat.change}
              </Badge>
            </div>
          </div>
          <div className={`p-3 rounded-full ${stat.color}`}>
            <stat.icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ActionCard = ({ action }: { action: typeof quickActions[0] }) => (
    <Card 
      className="luxury-card premium-shadow premium-hover cursor-pointer group"
      onClick={action.action}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${action.color} group-hover:scale-110 transition-transform`}>
            <action.icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">{action.title}</h3>
            <p className="text-sm text-gray-600">{action.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-full premium-gradient">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold luxury-text-gradient">
                Dashboard Premium
              </h1>
              <p className="text-gray-600">
                Gestion professionnelle de rendez-vous et planning collaboratif
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="premium-gradient text-white border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Version Pro
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              <Zap className="h-3 w-3 mr-1" />
              Tous systèmes opérationnels
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 luxury-card">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center space-x-2">
              <Mic className="h-4 w-4" />
              <span className="hidden sm:inline">Assistant Vocal</span>
            </TabsTrigger>
            <TabsTrigger value="memos" className="flex items-center space-x-2">
              <StickyNote className="h-4 w-4" />
              <span className="hidden sm:inline">Mémos</span>
            </TabsTrigger>
            <TabsTrigger value="share" className="flex items-center space-x-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Partage</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="luxury-card premium-shadow-lg">
              <CardHeader>
                <CardTitle className="luxury-text-gradient">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <ActionCard key={index} action={action} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="luxury-card premium-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Activités Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100">
                      <div className={`p-2 rounded-full bg-gray-100`}>
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice">
            <VoiceBooking />
          </TabsContent>

          <TabsContent value="memos">
            <MemoBoard />
          </TabsContent>

          <TabsContent value="share">
            <PlanningShare />
          </TabsContent>

          <TabsContent value="notifications">
            <AdvancedNotifications />
          </TabsContent>

          <TabsContent value="analytics">
            <PremiumAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}