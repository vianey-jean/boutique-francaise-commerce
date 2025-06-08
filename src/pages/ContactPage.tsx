
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { useMutation } from '@tanstack/react-query';
import { API } from '@/services/api';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Sparkles } from 'lucide-react';

const formSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(8, 'Numéro de téléphone invalide'),
  adresse: z.string().min(5, 'Adresse requise'),
  objet: z.string().min(3, 'Objet requis'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

type FormValues = z.infer<typeof formSchema>;

const ContactPage = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      objet: '',
      message: '',
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return API.post('/contacts', data);
    },
    onSuccess: () => {
      toast.success("Votre message a été envoyé avec succès");
      form.reset();
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de l'envoi de votre message");
    }
  });

  const onSubmit = (data: FormValues) => {
    contactMutation.mutate(data);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 rounded-none lg:rounded-3xl lg:mx-8 lg:mt-8 p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <MessageSquare className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Contactez-nous</h1>
                <p className="text-pink-100 text-lg">Nous sommes là pour vous aider</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-12 px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Enhanced Form Card */}
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent flex items-center">
                  <Sparkles className="h-6 w-6 mr-3 text-red-600" />
                  Formulaire de contact
                </CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="nom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Dupont" {...field} className="border-2 border-gray-200 focus:border-red-500 transition-colors h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="prenom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Prénom</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean" {...field} className="border-2 border-gray-200 focus:border-red-500 transition-colors h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                            <FormControl>
                              <Input placeholder="email@example.com" {...field} className="border-2 border-gray-200 focus:border-red-500 transition-colors h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="telephone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Téléphone</FormLabel>
                            <FormControl>
                              <Input placeholder="06 12 34 56 78" {...field} className="border-2 border-gray-200 focus:border-red-500 transition-colors h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="adresse"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Adresse</FormLabel>
                          <FormControl>
                            <Input placeholder="123 rue des Exemples, 75000 Paris" {...field} className="border-2 border-gray-200 focus:border-red-500 transition-colors h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="objet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Objet</FormLabel>
                          <FormControl>
                            <Input placeholder="Objet de votre message" {...field} className="border-2 border-gray-200 focus:border-red-500 transition-colors h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Votre message..." {...field} rows={5} className="border-2 border-gray-200 focus:border-red-500 transition-colors" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium h-12 rounded-xl transition-all duration-300 hover:shadow-lg"
                      disabled={contactMutation.isPending}
                    >
                      {contactMutation.isPending ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                          Envoi en cours...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="h-5 w-5 mr-2" />
                          Envoyer
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Enhanced Contact Info Section */}
            <div className="space-y-8">
              <div className="grid gap-6">
                <Card className="group border-0 shadow-xl bg-gradient-to-br from-white to-red-50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-gradient-to-br from-red-500 to-pink-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                        <MapPin className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-red-800">Adresse</h3>
                        <p className="text-gray-600">Notre siège social</p>
                      </div>
                    </div>
                    <div className="ml-16">
                      <p className="text-gray-700 font-medium">123 Rue du Commerce</p>
                      <p className="text-gray-700 font-medium">75015 Paris, France</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="group border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                        <Phone className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-800">Téléphone</h3>
                        <p className="text-gray-600">Appelez-nous directement</p>
                      </div>
                    </div>
                    <div className="ml-16">
                      <p className="text-gray-700 font-medium">+33 (0)1 23 45 67 89</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="group border-0 shadow-xl bg-gradient-to-br from-white to-green-50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                        <Mail className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-800">Email</h3>
                        <p className="text-gray-600">Écrivez-nous</p>
                      </div>
                    </div>
                    <div className="ml-16">
                      <p className="text-gray-700 font-medium">contact@Riziky-Boutic.fr</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="group border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                        <Clock className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-purple-800">Heures d'ouverture</h3>
                        <p className="text-gray-600">Quand nous contacter</p>
                      </div>
                    </div>
                    <div className="ml-16 space-y-1">
                      <p className="text-gray-700 font-medium">Lundi - Vendredi: 9h00 - 18h00</p>
                      <p className="text-gray-700 font-medium">Samedi: 10h00 - 16h00</p>
                      <p className="text-gray-700 font-medium">Dimanche: Fermé</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
