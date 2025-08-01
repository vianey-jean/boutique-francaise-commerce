import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Calendar, Clock, Star, Target, Zap, BarChart3, PieChart } from 'lucide-react';

interface AnalyticsData {
  period: 'day' | 'week' | 'month' | 'year';
  metrics: {
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    revenue: number;
    averageDuration: number;
    clientSatisfaction: number;
    newClients: number;
    returningClients: number;
  };
  trends: {
    appointments: number;
    revenue: number;
    satisfaction: number;
    clients: number;
  };
  topClients: Array<{
    name: string;
    appointments: number;
    revenue: number;
  }>;
  busyHours: Array<{
    hour: string;
    appointments: number;
  }>;
  performanceGoals: Array<{
    name: string;
    current: number;
    target: number;
    unit: string;
  }>;
}

export function PremiumAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsData['period']>('month');
  
  const analyticsData: AnalyticsData = {
    period: selectedPeriod,
    metrics: {
      totalAppointments: 156,
      completedAppointments: 142,
      cancelledAppointments: 14,
      revenue: 12450,
      averageDuration: 45,
      clientSatisfaction: 4.7,
      newClients: 23,
      returningClients: 89
    },
    trends: {
      appointments: 12.5,
      revenue: 8.3,
      satisfaction: -2.1,
      clients: 15.7
    },
    topClients: [
      { name: 'Sophie Martin', appointments: 8, revenue: 890 },
      { name: 'Jean Durand', appointments: 6, revenue: 750 },
      { name: 'Marie Claire', appointments: 5, revenue: 620 },
      { name: 'Paul Dubois', appointments: 4, revenue: 580 },
      { name: 'Lisa Bernard', appointments: 4, revenue: 520 }
    ],
    busyHours: [
      { hour: '08:00', appointments: 12 },
      { hour: '09:00', appointments: 18 },
      { hour: '10:00', appointments: 25 },
      { hour: '11:00', appointments: 20 },
      { hour: '14:00', appointments: 22 },
      { hour: '15:00', appointments: 28 },
      { hour: '16:00', appointments: 24 },
      { hour: '17:00', appointments: 15 }
    ],
    performanceGoals: [
      { name: 'Rendez-vous mensuels', current: 156, target: 200, unit: 'rdv' },
      { name: 'Chiffre d\'affaires', current: 12450, target: 15000, unit: '€' },
      { name: 'Satisfaction client', current: 4.7, target: 4.8, unit: '/5' },
      { name: 'Nouveaux clients', current: 23, target: 30, unit: 'clients' }
    ]
  };

  const periods = [
    { key: 'day', label: 'Aujourd\'hui' },
    { key: 'week', label: 'Cette semaine' },
    { key: 'month', label: 'Ce mois' },
    { key: 'year', label: 'Cette année' }
  ];

  const MetricCard = ({ 
    title, 
    value, 
    unit, 
    trend, 
    icon: IconComponent, 
    color 
  }: {
    title: string;
    value: number;
    unit: string;
    trend: number;
    icon: any;
    color: string;
  }) => (
    <Card className="luxury-card premium-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold">{value.toLocaleString()}</p>
              <span className="text-sm text-gray-500">{unit}</span>
            </div>
            <div className="flex items-center mt-2">
              {trend > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(trend)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs période précédente</span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProgressGoal = ({ goal }: { goal: typeof analyticsData.performanceGoals[0] }) => {
    const percentage = Math.min((goal.current / goal.target) * 100, 100);
    const isCompleted = goal.current >= goal.target;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{goal.name}</span>
          <Badge className={isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
            {goal.current} / {goal.target} {goal.unit}
          </Badge>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isCompleted ? 'bg-green-500' : 'premium-gradient'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{percentage.toFixed(1)}% atteint</span>
          {isCompleted && <span className="text-green-600 font-medium">🎯 Objectif atteint!</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <Card className="luxury-card premium-shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="luxury-text-gradient flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Tableau de Bord Analytics Premium
            </CardTitle>
            <div className="flex space-x-2">
              {periods.map(period => (
                <Button
                  key={period.key}
                  onClick={() => setSelectedPeriod(period.key as AnalyticsData['period'])}
                  variant={selectedPeriod === period.key ? "default" : "outline"}
                  size="sm"
                  className={selectedPeriod === period.key ? "premium-gradient text-white border-0" : "luxury-card"}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Rendez-vous"
          value={analyticsData.metrics.totalAppointments}
          unit="rdv"
          trend={analyticsData.trends.appointments}
          icon={Calendar}
          color="premium-gradient"
        />
        <MetricCard
          title="Chiffre d'Affaires"
          value={analyticsData.metrics.revenue}
          unit="€"
          trend={analyticsData.trends.revenue}
          icon={TrendingUp}
          color="bg-green-500"
        />
        <MetricCard
          title="Satisfaction Client"
          value={analyticsData.metrics.clientSatisfaction}
          unit="/5"
          trend={analyticsData.trends.satisfaction}
          icon={Star}
          color="bg-yellow-500"
        />
        <MetricCard
          title="Nouveaux Clients"
          value={analyticsData.metrics.newClients}
          unit="clients"
          trend={analyticsData.trends.clients}
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      {/* Performance Goals */}
      <Card className="luxury-card premium-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Objectifs de Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {analyticsData.performanceGoals.map((goal, index) => (
            <ProgressGoal key={index} goal={goal} />
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients */}
        <Card className="luxury-card premium-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Clients du Mois
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full premium-gradient text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-gray-600">{client.appointments} rendez-vous</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {client.revenue}€
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Busy Hours */}
        <Card className="luxury-card premium-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Heures de Pointe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.busyHours.map((hour, index) => {
                const maxAppointments = Math.max(...analyticsData.busyHours.map(h => h.appointments));
                const percentage = (hour.appointments / maxAppointments) * 100;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{hour.hour}</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {hour.appointments} rdv
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full premium-gradient transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="luxury-card premium-shadow">
          <CardContent className="p-6 text-center">
            <div className="premium-gradient bg-clip-text text-transparent text-3xl font-bold mb-2">
              {((analyticsData.metrics.completedAppointments / analyticsData.metrics.totalAppointments) * 100).toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600">Taux de Réalisation</p>
          </CardContent>
        </Card>

        <Card className="luxury-card premium-shadow">
          <CardContent className="p-6 text-center">
            <div className="premium-gradient bg-clip-text text-transparent text-3xl font-bold mb-2">
              {analyticsData.metrics.averageDuration}min
            </div>
            <p className="text-sm text-gray-600">Durée Moyenne</p>
          </CardContent>
        </Card>

        <Card className="luxury-card premium-shadow">
          <CardContent className="p-6 text-center">
            <div className="premium-gradient bg-clip-text text-transparent text-3xl font-bold mb-2">
              {((analyticsData.metrics.returningClients / (analyticsData.metrics.newClients + analyticsData.metrics.returningClients)) * 100).toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600">Clients Fidèles</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}