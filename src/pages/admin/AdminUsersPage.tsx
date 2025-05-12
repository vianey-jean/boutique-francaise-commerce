
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';
import { Card } from '../../components/ui/card';
import api from '../../services/api';

interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  createdAt: string;
  password?: string;
  passwordUnique?: string;
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/users');
      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.put(`/api/users/${userId}/role`, { role: newRole });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success('Rôle mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du rôle');
    }
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsUserDialogOpen(true);
  };

  const deleteUser = async (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await api.delete(`/api/users/${userId}`);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        toast.success('Utilisateur supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500 hover:bg-red-600';
      case 'staff':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des utilisateurs</h1>

      <div className="mb-6">
        <Input
          placeholder="Rechercher par nom, prénom, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Card className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.prenom} {user.nom}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewUserDetails(user)}
                        >
                          Détails
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selectedUser && (
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedUser.prenom} {selectedUser.nom}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date d'inscription</p>
                <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rôle actuel</p>
                <Badge className={getRoleBadgeColor(selectedUser.role)}>
                  {selectedUser.role}
                </Badge>
              </div>
              <div className="pt-4">
                <p className="text-sm text-gray-500 mb-2">Changer le rôle</p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={selectedUser.role === 'user' ? 'default' : 'outline'}
                    onClick={() => handleRoleChange(selectedUser.id, 'user')}
                  >
                    Utilisateur
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedUser.role === 'staff' ? 'default' : 'outline'}
                    onClick={() => handleRoleChange(selectedUser.id, 'staff')}
                  >
                    Staff
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedUser.role === 'admin' ? 'default' : 'outline'}
                    onClick={() => handleRoleChange(selectedUser.id, 'admin')}
                  >
                    Admin
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminUsersPage;
