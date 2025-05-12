
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000/api';

// Créer une instance Axios avec l'URL de base
const API = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true
});

// Intercepteur pour gérer le token d'authentification
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 404 errors gracefully for favorites and cart
    if (error.response && error.response.status === 404) {
      const url = error.config.url;
      if (url.includes('/favorites')) {
        return Promise.resolve({ data: { items: [] } });
      }
      if (url.includes('/panier')) {
        return Promise.resolve({ data: { items: [], total: 0 } });
      }
      if (url.includes('/products/most-favorited') || url.includes('/products/new-arrivals')) {
        return Promise.resolve({ data: [] });
      }
    }
    return Promise.reject(error);
  }
);

// Types pour l'API
export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  telephone?: string;
  pays?: string;
  genre?: string;
  isVerified?: boolean;
  createdAt?: string;
}

export interface UpdateProfileData {
  nom?: string;
  prenom?: string;
  email?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  telephone?: string;
  pays?: string;
  genre?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  promotion?: number;
  image: string;
  images?: string[];
  category: string;
  stock?: number;
  isSold?: boolean;
  dateAjout?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  totalAmount?: number;
  status: string;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt?: string;
  trackingNumber?: string;
}

export interface ShippingAddress {
  nom: string;
  prenom: string;
  adresse: string;
  complementAdresse?: string;
  ville: string;
  codePostal: string;
  pays: string;
  telephone: string;
}

export interface ServiceConversation {
  id: string;
  client: User;
  messages: Message[];
  lastActivity: string;
}

// API d'authentification
export const authAPI = {
  login: (email: string, password: string) => API.post('/auth/login', { email, password }),
  register: (email: string, password: string, nom: string, prenom: string) =>
    API.post('/auth/register', { email, password, nom, prenom }),
  verifyEmail: (token: string) => API.get(`/auth/verify-email/${token}`),
  forgotPassword: (email: string) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    API.post('/auth/reset-password', { token, password }),
  getProfile: () => API.get('/users/me'),
  updateProfile: (data: UpdateProfileData) => API.put('/users/me', data),
  updatePassword: (currentPassword: string, newPassword: string) =>
    API.put('/users/password', { currentPassword, newPassword }),
  verifyToken: () => API.get('/auth/verify-token'),
  checkEmail: (email: string) => API.post('/auth/check-email', { email }),
  verifyPassword: (password: string) => API.post('/auth/verify-password', { password }),
};

// API des produits
export const productsAPI = {
  getAll: () => API.get('/products'),
  getById: (id: string) => API.get(`/products/${id}`),
  getByCategory: (category: string) => API.get(`/products/category/${category}`),
  search: (query: string) => API.get(`/products/search/${query}`),
  create: (productData: FormData) => API.post('/products', productData),
  update: (id: string, productData: FormData) => API.put(`/products/${id}`, productData),
  delete: (id: string) => API.delete(`/products/${id}`),
  updateStock: (id: string, stock: number) => API.put(`/products/${id}/stock`, { stock }),
  getMostFavorited: () => API.get('/products/most-favorited'),
  getNewArrivals: () => API.get('/products/new-arrivals'),
};

// API du panier
export const panierAPI = {
  get: () => API.get('/panier'),
  addItem: (productId: string, quantity: number) =>
    API.post('/panier/items', { productId, quantity }),
  updateItem: (productId: string, quantity: number) =>
    API.put('/panier/items', { productId, quantity }),
  removeItem: (productId: string) => API.delete(`/panier/items/${productId}`),
  clear: () => API.delete('/panier'),
};

// API des favoris
export const favoritesAPI = {
  get: () => API.get('/favorites'),
  add: (productId: string) => API.post('/favorites', { productId }),
  remove: (productId: string) => API.delete(`/favorites/${productId}`),
  addItem: (productId: string) => API.post('/favorites', { productId }),
  removeItem: (productId: string) => API.delete(`/favorites/${productId}`),
};

// API des commandes
export const ordersAPI = {
  create: (orderData: any) => API.post('/orders', orderData),
  getAll: () => API.get('/orders'),
  getById: (id: string) => API.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) =>
    API.put(`/orders/${id}/status`, { status }),
  getAllAdmin: () => API.get('/orders/admin'),
  updateTracking: (id: string, trackingNumber: string) =>
    API.put(`/orders/${id}/tracking`, { trackingNumber }),
  getUserOrders: () => API.get('/orders/user'),
};

// API des contacts
export const contactsAPI = {
  sendMessage: (name: string, email: string, subject: string, message: string) =>
    API.post('/contacts', { name, email, subject, message }),
  getAll: () => API.get('/contacts'),
  markAsRead: (id: string) => API.put(`/contacts/${id}/read`),
  delete: (id: string) => API.delete(`/contacts/${id}`),
};

// API d'administration des messages client
export const clientChatAPI = {
  getServiceChat: () => API.get('/client-chat/service'),
  getServiceConversations: () => API.get('/client-chat/service/all'),
  sendServiceMessage: (content: string) => 
    API.post('/client-chat/service', { message: content }),
  sendServiceReply: (clientId: string, content: string) =>
    API.post(`/client-chat/service/${clientId}/reply`, { message: content }),
  editMessage: (messageId: string, content: string, conversationId: string) => 
    API.put(`/client-chat/messages/${messageId}/edit`, { content, conversationId }),
  deleteMessage: (messageId: string, conversationId: string) => 
    API.delete(`/client-chat/messages/${messageId}?conversationId=${conversationId}`),
  setOnline: () => API.post('/client-chat/online'),
  setOffline: () => API.post('/client-chat/offline'),
};

// API de chat admin
export const adminChatAPI = {
  getConversations: () => API.get('/admin-chat/conversations'),
  getConversation: (adminId: string) => API.get(`/admin-chat/conversation/${adminId}`),
  sendMessage: (adminId: string, content: string) => 
    API.post(`/admin-chat/message/${adminId}`, { content }),
  editMessage: (messageId: string, content: string) => 
    API.put(`/admin-chat/message/${messageId}`, { content }),
  deleteMessage: (messageId: string) => 
    API.delete(`/admin-chat/message/${messageId}`),
};

// API de notification
export const notificationAPI = {
  getAll: () => API.get('/notifications'),
  markOrdersAsRead: () => API.put('/notifications/orders/read'),
  markContactsAsRead: () => API.put('/notifications/contacts/read'),
  markAdminChatAsRead: (adminId: string) => API.put(`/notifications/admin-chat/${adminId}/read`),
  markClientChatAsRead: (clientId: string) => API.put(`/notifications/client-chat/${clientId}/read`),
};

// Type de message pour les chats
export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read?: boolean;
  isEdited?: boolean;
  isSystemMessage?: boolean;
  isAutoReply?: boolean;
}

export default API;
