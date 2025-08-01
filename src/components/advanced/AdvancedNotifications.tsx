import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff, Smartphone, Mail, MessageCircle, Settings, Zap, Calendar, Clock, Star } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  type: 'appointment' | 'reminder' | 'urgent' | 'social';
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
    voice: boolean;
  };
  timing: {
    minutes: number[];
    customTimes: string[];
  };
  conditions: {
    keywords: string[];
    priority: 'all' | 'high' | 'urgent';
    participants: string[];
  };
  isActive: boolean;
  createdAt: Date;
}

interface NotificationLog {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  channel: 'push' | 'email' | 'sms' | 'voice';
  sentAt: Date;
  status: 'sent' | 'delivered' | 'failed' | 'read';
  appointmentId?: string;
}

export function AdvancedNotifications() {
  const [rules, setRules] = useState<NotificationRule[]>([
    {
      id: '1',
      name: 'Rappels Rendez-vous Urgents',
      description: 'Notifications pour les rendez-vous marqués comme urgents',
      type: 'urgent',
      channels: { push: true, email: true, sms: true, voice: true },
      timing: { minutes: [120, 60, 30, 15], customTimes: [] },
      conditions: { keywords: ['urgent', 'important'], priority: 'urgent', participants: [] },
      isActive: true,
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Confirmations Automatiques',
      description: 'Confirmations automatiques par SMS et email',
      type: 'appointment',
      channels: { push: false, email: true, sms: true, voice: false },
      timing: { minutes: [1440, 60], customTimes: ['09:00', '18:00'] },
      conditions: { keywords: [], priority: 'all', participants: [] },
      isActive: true,
      createdAt: new Date()
    }
  ]);

  const [logs, setLogs] = useState<NotificationLog[]>([
    {
      id: '1',
      title: 'Rappel: Rendez-vous Dr. Martin',
      message: 'Votre rendez-vous est dans 1 heure',
      type: 'info',
      channel: 'push',
      sentAt: new Date(Date.now() - 3600000),
      status: 'delivered',
      appointmentId: 'apt-123'
    },
    {
      id: '2',
      title: 'Confirmation par SMS',
      message: 'Rendez-vous confirmé pour demain 14h',
      type: 'success',
      channel: 'sms',
      sentAt: new Date(Date.now() - 7200000),
      status: 'sent'
    }
  ]);

  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    type: 'appointment' as NotificationRule['type'],
    channels: { push: true, email: false, sms: false, voice: false },
    timing: { minutes: [60], customTimes: [] },
    conditions: { keywords: [], priority: 'all' as NotificationRule['conditions']['priority'] }
  });

  const notificationTypes = [
    { key: 'appointment', label: 'Rendez-vous', icon: Calendar, color: 'bg-blue-100 text-blue-800' },
    { key: 'reminder', label: 'Rappel', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    { key: 'urgent', label: 'Urgent', icon: Zap, color: 'bg-red-100 text-red-800' },
    { key: 'social', label: 'Social', icon: MessageCircle, color: 'bg-green-100 text-green-800' }
  ];

  const channels = [
    { key: 'push', label: 'Push', icon: Bell, description: 'Notifications push dans l\'app' },
    { key: 'email', label: 'Email', icon: Mail, description: 'Notifications par email' },
    { key: 'sms', label: 'SMS', icon: Smartphone, description: 'Notifications par SMS' },
    { key: 'voice', label: 'Vocal', icon: MessageCircle, description: 'Notifications vocales' }
  ];

  const addRule = () => {
    if (!newRule.name.trim()) {
      toast.error('Le nom de la règle est obligatoire');
      return;
    }

    const rule: NotificationRule = {
      id: Date.now().toString(),
      name: newRule.name,
      description: newRule.description,
      type: newRule.type,
      channels: newRule.channels,
      timing: newRule.timing,
      conditions: {
        keywords: [],
        priority: newRule.conditions.priority,
        participants: []
      },
      isActive: true,
      createdAt: new Date()
    };

    setRules(prev => [rule, ...prev]);
    setNewRule({
      name: '',
      description: '',
      type: 'appointment',
      channels: { push: true, email: false, sms: false, voice: false },
      timing: { minutes: [60], customTimes: [] },
      conditions: { keywords: [], priority: 'all' }
    });
    setShowAddRule(false);
    
    toast.success('🔔 Règle de notification créée', {
      className: "bg-indigo-700 text-white border-indigo-600"
    });
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const testNotification = () => {
    const testLog: NotificationLog = {
      id: Date.now().toString(),
      title: 'Test de Notification',
      message: 'Ceci est un test de notification avancée',
      type: 'info',
      channel: 'push',
      sentAt: new Date(),
      status: 'sent'
    };

    setLogs(prev => [testLog, ...prev]);
    
    toast.success('🔔 Notification de test envoyée', {
      className: "bg-indigo-700 text-white border-indigo-600"
    });
  };

  const RuleCard = ({ rule }: { rule: NotificationRule }) => {
    const typeInfo = notificationTypes.find(t => t.key === rule.type);
    const IconComponent = typeInfo?.icon || Bell;

    return (
      <Card className={`luxury-card premium-shadow ${rule.isActive ? '' : 'opacity-60'}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${typeInfo?.color}`}>
                <IconComponent className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{rule.name}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
              </div>
            </div>
            <Switch
              checked={rule.isActive}
              onCheckedChange={() => toggleRule(rule.id)}
            />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Channels */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Canaux de notification:</h4>
            <div className="flex flex-wrap gap-2">
              {channels.map(channel => (
                <Badge
                  key={channel.key}
                  className={`${
                    rule.channels[channel.key as keyof typeof rule.channels]
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <channel.icon className="h-3 w-3 mr-1" />
                  {channel.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Timing */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Délais de rappel:</h4>
            <div className="flex flex-wrap gap-2">
              {rule.timing.minutes.map((minutes, index) => (
                <Badge key={index} className="bg-blue-100 text-blue-800">
                  {minutes >= 60 ? `${Math.floor(minutes / 60)}h` : `${minutes}min`} avant
                </Badge>
              ))}
              {rule.timing.customTimes.map((time, index) => (
                <Badge key={index} className="bg-purple-100 text-purple-800">
                  {time}
                </Badge>
              ))}
            </div>
          </div>

          {/* Conditions */}
          {rule.conditions.keywords.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Mots-clés déclencheurs:</h4>
              <div className="flex flex-wrap gap-2">
                {rule.conditions.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline">
                    #{keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 pt-2 border-t">
            Créée: {rule.createdAt.toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    );
  };

  const LogItem = ({ log }: { log: NotificationLog }) => {
    const channelInfo = channels.find(c => c.key === log.channel);
    const statusColors = {
      sent: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      read: 'bg-purple-100 text-purple-800'
    };

    return (
      <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200">
        <div className={`p-2 rounded-lg bg-gray-100`}>
          {channelInfo && <channelInfo.icon className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{log.title}</h4>
          <p className="text-sm text-gray-600 truncate">{log.message}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {log.sentAt.toLocaleString()}
            </span>
            <Badge className={statusColors[log.status]}>
              {log.status}
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="luxury-card premium-shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="luxury-text-gradient flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Système de Notifications Avancé
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                onClick={testNotification}
                variant="outline"
                className="luxury-card"
              >
                <Zap className="h-4 w-4 mr-2" />
                Test
              </Button>
              <Button
                onClick={() => setShowAddRule(!showAddRule)}
                className="premium-gradient text-white border-0"
              >
                <Settings className="h-4 w-4 mr-2" />
                Nouvelle règle
              </Button>
            </div>
          </div>
        </CardHeader>

        {showAddRule && (
          <CardContent className="border-t space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Nom de la règle..."
                value={newRule.name}
                onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                className="form-input"
              />
              
              <select
                value={newRule.type}
                onChange={(e) => setNewRule(prev => ({ ...prev, type: e.target.value as NotificationRule['type'] }))}
                className="form-input"
              >
                {notificationTypes.map(type => (
                  <option key={type.key} value={type.key}>{type.label}</option>
                ))}
              </select>
            </div>

            <Input
              placeholder="Description de la règle..."
              value={newRule.description}
              onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
              className="form-input"
            />

            <div>
              <h4 className="font-semibold text-sm mb-3">Canaux de notification:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {channels.map(channel => (
                  <label key={channel.key} className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-blue-50">
                    <input
                      type="checkbox"
                      checked={newRule.channels[channel.key as keyof typeof newRule.channels]}
                      onChange={(e) => setNewRule(prev => ({
                        ...prev,
                        channels: { ...prev.channels, [channel.key]: e.target.checked }
                      }))}
                      className="rounded"
                    />
                    <channel.icon className="h-4 w-4" />
                    <span className="text-sm">{channel.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={addRule} className="form-button">
                Créer la règle
              </Button>
              <Button 
                onClick={() => setShowAddRule(false)}
                variant="outline"
                className="luxury-card"
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Notification Rules */}
      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Règles de Notification ({rules.length})</h2>
        {rules.map(rule => (
          <RuleCard key={rule.id} rule={rule} />
        ))}
      </div>

      {/* Notification Logs */}
      <Card className="luxury-card premium-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Historique des Notifications
            <Badge className="bg-blue-100 text-blue-800 ml-2">{logs.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto premium-scroll">
            {logs.map(log => (
              <LogItem key={log.id} log={log} />
            ))}
            
            {logs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucune notification envoyée récemment
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}