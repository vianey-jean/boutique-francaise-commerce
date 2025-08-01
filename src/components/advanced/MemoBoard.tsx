import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, CheckCircle, Circle, Star, Flag, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Memo {
  id: string;
  title: string;
  content: string;
  category: 'todo' | 'in-progress' | 'done' | 'urgent';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  dueDate?: Date;
  tags: string[];
}

export function MemoBoard() {
  const [memos, setMemos] = useState<Memo[]>([
    {
      id: '1',
      title: 'Préparer présentation client',
      content: 'Finaliser les slides pour la réunion de demain avec le nouveau client',
      category: 'in-progress',
      priority: 'high',
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      tags: ['client', 'présentation']
    },
    {
      id: '2',
      title: 'Rappeler Dr. Martin',
      content: 'Confirmer le rendez-vous de vendredi prochain',
      category: 'todo',
      priority: 'medium',
      createdAt: new Date(),
      tags: ['médical', 'rappel']
    },
    {
      id: '3',
      title: 'Facturation mensuelle',
      content: 'Envoyer les factures du mois en cours',
      category: 'done',
      priority: 'low',
      createdAt: new Date(),
      tags: ['comptabilité']
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);
  const [newMemo, setNewMemo] = useState({
    title: '',
    content: '',
    category: 'todo' as Memo['category'],
    priority: 'medium' as Memo['priority'],
    tags: ''
  });

  const categories = [
    { key: 'todo', label: 'À faire', color: 'bg-blue-100 text-blue-800', icon: Circle },
    { key: 'in-progress', label: 'En cours', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { key: 'done', label: 'Terminé', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { key: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800', icon: Flag }
  ];

  const priorities = [
    { key: 'low', label: 'Basse', color: 'bg-gray-100 text-gray-800' },
    { key: 'medium', label: 'Moyenne', color: 'bg-blue-100 text-blue-800' },
    { key: 'high', label: 'Haute', color: 'bg-red-100 text-red-800' }
  ];

  const addMemo = () => {
    if (!newMemo.title.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }

    const memo: Memo = {
      id: Date.now().toString(),
      title: newMemo.title,
      content: newMemo.content,
      category: newMemo.category,
      priority: newMemo.priority,
      createdAt: new Date(),
      tags: newMemo.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    setMemos(prev => [memo, ...prev]);
    setNewMemo({ title: '', content: '', category: 'todo', priority: 'medium', tags: '' });
    setShowAddForm(false);
    
    toast.success('📝 Mémo créé avec succès', {
      className: "bg-indigo-700 text-white border-indigo-600"
    });
  };

  const updateMemo = (memoId: string, updates: Partial<Memo>) => {
    setMemos(prev => prev.map(memo => 
      memo.id === memoId ? { ...memo, ...updates } : memo
    ));
    
    toast.success('📝 Mémo mis à jour', {
      className: "bg-indigo-700 text-white border-indigo-600"
    });
  };

  const deleteMemo = (memoId: string) => {
    setMemos(prev => prev.filter(memo => memo.id !== memoId));
    toast.success('🗑️ Mémo supprimé', {
      className: "bg-indigo-700 text-white border-indigo-600"
    });
  };

  const MemoCard = ({ memo }: { memo: Memo }) => {
    const category = categories.find(c => c.key === memo.category);
    const priority = priorities.find(p => p.key === memo.priority);
    const IconComponent = category?.icon || Circle;

    return (
      <Card className="luxury-card premium-shadow hover:scale-105 transition-transform duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-sm font-medium">{memo.title}</CardTitle>
            <div className="flex space-x-1">
              <Button
                onClick={() => setEditingMemo(memo)}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-blue-100"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => deleteMemo(memo.id)}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-red-100"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-3">{memo.content}</p>
          
          <div className="flex items-center justify-between">
            <Badge className={`${category?.color} text-xs`}>
              <IconComponent className="h-3 w-3 mr-1" />
              {category?.label}
            </Badge>
            
            <Badge className={`${priority?.color} text-xs`}>
              {memo.priority === 'high' && <Star className="h-3 w-3 mr-1" />}
              {priority?.label}
            </Badge>
          </div>

          {memo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {memo.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="text-xs text-gray-500">
            Créé: {memo.createdAt.toLocaleDateString()}
            {memo.dueDate && (
              <span className="block">
                Échéance: {memo.dueDate.toLocaleDateString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="luxury-card premium-shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="luxury-text-gradient flex items-center gap-2">
              📝 Tableau de Mémos Intelligent
            </CardTitle>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="premium-gradient text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau mémo
            </Button>
          </div>
        </CardHeader>
        
        {showAddForm && (
          <CardContent className="border-t space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Titre du mémo..."
                value={newMemo.title}
                onChange={(e) => setNewMemo(prev => ({ ...prev, title: e.target.value }))}
                className="form-input"
              />
              
              <div className="flex space-x-2">
                <select
                  value={newMemo.category}
                  onChange={(e) => setNewMemo(prev => ({ ...prev, category: e.target.value as Memo['category'] }))}
                  className="form-input flex-1"
                >
                  {categories.map(cat => (
                    <option key={cat.key} value={cat.key}>{cat.label}</option>
                  ))}
                </select>
                
                <select
                  value={newMemo.priority}
                  onChange={(e) => setNewMemo(prev => ({ ...prev, priority: e.target.value as Memo['priority'] }))}
                  className="form-input flex-1"
                >
                  {priorities.map(prio => (
                    <option key={prio.key} value={prio.key}>{prio.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <Textarea
              placeholder="Description du mémo..."
              value={newMemo.content}
              onChange={(e) => setNewMemo(prev => ({ ...prev, content: e.target.value }))}
              className="form-input"
            />
            
            <Input
              placeholder="Tags (séparés par des virgules)..."
              value={newMemo.tags}
              onChange={(e) => setNewMemo(prev => ({ ...prev, tags: e.target.value }))}
              className="form-input"
            />
            
            <div className="flex space-x-2">
              <Button onClick={addMemo} className="form-button">
                Créer le mémo
              </Button>
              <Button 
                onClick={() => setShowAddForm(false)}
                variant="outline"
                className="luxury-card"
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        )}
      </CardContent>
      </Card>

      {/* Categories View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(category => {
          const categoryMemos = memos.filter(memo => memo.category === category.key);
          
          return (
            <div key={category.key} className="space-y-4">
              <div className="flex items-center space-x-2">
                <category.icon className="h-5 w-5" />
                <h3 className="font-semibold">{category.label}</h3>
                <Badge className={category.color}>{categoryMemos.length}</Badge>
              </div>
              
              <div className="space-y-3">
                {categoryMemos.map(memo => (
                  <MemoCard key={memo.id} memo={memo} />
                ))}
                
                {categoryMemos.length === 0 && (
                  <Card className="luxury-card border-dashed">
                    <CardContent className="p-6 text-center text-gray-500">
                      Aucun mémo dans cette catégorie
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}