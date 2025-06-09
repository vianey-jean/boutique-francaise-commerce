
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AdminPageTitleProps {
  title: string;
  icon?: LucideIcon;
  description?: string;
  className?: string;
}

const AdminPageTitle: React.FC<AdminPageTitleProps> = ({ 
  title, 
  icon: Icon, 
  description, 
  className = "" 
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-2">
        {Icon && (
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
            <Icon className="h-6 w-6 text-white" />
          </div>
        )}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          {title}
        </h1>
      </div>
      {description && (
        <p className="text-gray-600 ml-11">{description}</p>
      )}
    </div>
  );
};

export default AdminPageTitle;
