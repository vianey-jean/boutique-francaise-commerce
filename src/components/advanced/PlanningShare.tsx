import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Share2, Link, Mail, Copy, QrCode, Users, Globe, Lock, Eye, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface SharedPlanning {
  id: string;
  name: string;
  description: string;
  shareUrl: string;
  qrCode: string;
  permissions: 'view' | 'edit' | 'admin';
  isPublic: boolean;
  expireDate?: Date;
  collaborators: Array<{
    email: string;
    name: string;
    role: 'viewer' | 'editor' | 'admin';
    status: 'pending' | 'accepted';
  }>;
  accessCount: number;
  createdAt: Date;
}

export function PlanningShare() {
  const [sharedPlannings, setSharedPlannings] = useState<SharedPlanning[]>([
    {
      id: '1',
      name: 'Planning Médical - Dr. Martin',
      description: 'Planning des consultations médicales',
      shareUrl: 'https://app.planning.com/share/dr-martin-2025',
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+',
      permissions: 'view',
      isPublic: false,
      expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      collaborators: [
        { email: 'assistant@clinic.com', name: 'Assistant Médical', role: 'editor', status: 'accepted' },
        { email: 'patient@email.com', name: 'Patient Martin', role: 'viewer', status: 'pending' }
      ],
      accessCount: 142,
      createdAt: new Date()
    }
  ]);

  const [showShareForm, setShowShareForm] = useState(false);
  const [newShare, setNewShare] = useState({
    name: '',
    description: '',
    isPublic: false,
    permissions: 'view' as SharedPlanning['permissions'],
    collaboratorEmail: ''
  });

  const generateShareUrl = () => {
    const id = Math.random().toString(36).substr(2, 9);
    return `https://app.planning.com/share/${id}`;
  };

  const createSharedPlanning = () => {
    if (!newShare.name.trim()) {
      toast.error('Le nom du planning partagé est obligatoire');
      return;
    }

    const planning: SharedPlanning = {
      id: Date.now().toString(),
      name: newShare.name,
      description: newShare.description,
      shareUrl: generateShareUrl(),
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+',
      permissions: newShare.permissions,
      isPublic: newShare.isPublic,
      collaborators: [],
      accessCount: 0,
      createdAt: new Date()
    };

    setSharedPlannings(prev => [planning, ...prev]);
    setNewShare({ name: '', description: '', isPublic: false, permissions: 'view', collaboratorEmail: '' });
    setShowShareForm(false);
    
    toast.success('🔗 Planning partagé créé avec succès', {
      className: "bg-indigo-700 text-white border-indigo-600"
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('🔗 Lien copié dans le presse-papier', {
      className: "bg-indigo-700 text-white border-indigo-600"
    });
  };

  const sendByEmail = (shareUrl: string, planningName: string) => {
    const subject = `Partage de planning: ${planningName}`;
    const body = `Voici le lien pour accéder au planning partagé:\n\n${shareUrl}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const addCollaborator = (planningId: string, email: string) => {
    if (!email.trim()) return;

    setSharedPlannings(prev => prev.map(planning => {
      if (planning.id === planningId) {
        return {
          ...planning,
          collaborators: [
            ...planning.collaborators,
            {
              email,
              name: email.split('@')[0],
              role: 'viewer',
              status: 'pending'
            }
          ]
        };
      }
      return planning;
    }));

    toast.success('👥 Collaborateur invité', {
      className: "bg-indigo-700 text-white border-indigo-600"
    });
  };

  const ShareCard = ({ planning }: { planning: SharedPlanning }) => (
    <Card className="luxury-card premium-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{planning.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{planning.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={planning.isPublic ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
              {planning.isPublic ? <Globe className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
              {planning.isPublic ? 'Public' : 'Privé'}
            </Badge>
            <Badge className="bg-gray-100 text-gray-800">
              <Eye className="h-3 w-3 mr-1" />
              {planning.accessCount} vues
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Share URL */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-blue-800 truncate flex-1 mr-2">
              {planning.shareUrl}
            </span>
            <div className="flex space-x-1">
              <Button
                onClick={() => copyToClipboard(planning.shareUrl)}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => sendByEmail(planning.shareUrl, planning.name)}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                <Mail className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Collaborators */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Collaborateurs ({planning.collaborators.length})
            </h4>
          </div>
          
          <div className="space-y-2">
            {planning.collaborators.map((collab, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{collab.name}</p>
                  <p className="text-xs text-gray-500">{collab.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    className={`text-xs ${
                      collab.status === 'accepted' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {collab.status === 'accepted' ? 'Accepté' : 'En attente'}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    {collab.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Add Collaborator */}
          <div className="flex space-x-2">
            <Input
              placeholder="Email du collaborateur..."
              className="form-input text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addCollaborator(planning.id, e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addCollaborator(planning.id, input.value);
                input.value = '';
              }}
              size="sm"
              className="premium-gradient text-white border-0"
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <span>Créé: {planning.createdAt.toLocaleDateString()}</span>
          {planning.expireDate && (
            <span>Expire: {planning.expireDate.toLocaleDateString()}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="luxury-card premium-shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="luxury-text-gradient flex items-center gap-2">
              <Share2 className="h-6 w-6" />
              Partage de Planning Collaboratif
            </CardTitle>
            <Button
              onClick={() => setShowShareForm(!showShareForm)}
              className="premium-gradient text-white border-0"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Nouveau partage
            </Button>
          </div>
        </CardHeader>

        {showShareForm && (
          <CardContent className="border-t space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Nom du planning partagé..."
                value={newShare.name}
                onChange={(e) => setNewShare(prev => ({ ...prev, name: e.target.value }))}
                className="form-input"
              />
              
              <select
                value={newShare.permissions}
                onChange={(e) => setNewShare(prev => ({ ...prev, permissions: e.target.value as SharedPlanning['permissions'] }))}
                className="form-input"
              >
                <option value="view">Lecture seule</option>
                <option value="edit">Lecture et modification</option>
                <option value="admin">Administration complète</option>
              </select>
            </div>

            <Input
              placeholder="Description du planning..."
              value={newShare.description}
              onChange={(e) => setNewShare(prev => ({ ...prev, description: e.target.value }))}
              className="form-input"
            />

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newShare.isPublic}
                  onChange={(e) => setNewShare(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Planning public (accessible sans invitation)</span>
              </label>
            </div>

            <div className="flex space-x-2">
              <Button onClick={createSharedPlanning} className="form-button">
                Créer le partage
              </Button>
              <Button 
                onClick={() => setShowShareForm(false)}
                variant="outline"
                className="luxury-card"
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Shared Plannings List */}
      <div className="grid gap-6">
        {sharedPlannings.map(planning => (
          <ShareCard key={planning.id} planning={planning} />
        ))}

        {sharedPlannings.length === 0 && (
          <Card className="luxury-card border-dashed">
            <CardContent className="p-12 text-center">
              <Share2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Aucun planning partagé
              </h3>
              <p className="text-gray-500 mb-4">
                Créez votre premier planning partagé pour collaborer avec votre équipe
              </p>
              <Button 
                onClick={() => setShowShareForm(true)}
                className="premium-gradient text-white border-0"
              >
                Créer un partage
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}