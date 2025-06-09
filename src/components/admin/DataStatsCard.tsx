
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface DataStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  status?: 'success' | 'warning' | 'error' | 'info';
}

const DataStatsCard: React.FC<DataStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  status = 'info'
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'from-green-500 to-green-600';
      case 'warning': return 'from-yellow-500 to-yellow-600';
      case 'error': return 'from-red-500 to-red-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const getBadgeVariant = () => {
    switch (status) {
      case 'success': return 'default';
      case 'warning': return 'destructive';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`p-2 bg-gradient-to-r ${getStatusColor()} rounded-lg`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <Badge variant={trend.isPositive ? "default" : "destructive"} className="text-xs">
                {trend.isPositive ? '+' : ''}{trend.value}%
              </Badge>
            )}
          </div>
          
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DataStatsCard;
