'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import DatePicker, { registerLocale } from 'react-datepicker';
import { fr } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";

// Enregistrer la locale française
registerLocale('fr', fr);

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    
    // Effacer l'erreur de date si elle existe
    if (formErrors.dateRetrait) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.dateRetrait;
        return newErrors;
      });
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
    
    // Effacer l'erreur d'heure si elle existe
    if (formErrors.heureRetrait) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.heureRetrait;
        return newErrors;
      });
    }
  };

  // Fonction pour filtrer les dates (exclure les dimanches)
  const filterDate = (date: Date) => {
    // 0 = dimanche, donc on exclut les dimanches
    return date.getDay() !== 0;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.nom.trim()) {
      errors.nom = "Le nom est requis";
    }
    
    if (!formData.prenom.trim()) {
      errors.prenom = "Le prénom est requis";
    }
    
    if (!formData.telephone.trim()) {
      errors.telephone = "Le numéro de téléphone est requis";
    } else if (!/^[0-9]{10}$/.test(formData.telephone.replace(/\s/g, ''))) {
      errors.telephone = "Le format du numéro de téléphone est invalide";
    }
    
    if (!formData.email.trim()) {
      errors.email = "L&apos;email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "L&apos;email est invalide";
    }
    
    if (!selectedDate) {
      errors.dateRetrait = "La date de retrait est requise";
    }
    
    if (!selectedTime) {
      errors.heureRetrait = "L'heure de retrait est requise";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Formater la date pour l'affichage
      const formattedDate = selectedDate ? 
        new Intl.DateTimeFormat('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric'
        }).format(selectedDate) : '';
      
      // Préparer les données de la commande
      const orderData = {
        type: 'order',
        clientInfo: formData,
        orderDetails: {
          dateRetrait: formattedDate,
          heureRetrait: selectedTime
        },
        cartItems: cart,
        totalPrice: totalPrice
      };
      
      console.log("Envoi des données de commande:", orderData);
      
      // Appel à l'API d'envoi d'email
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      const result = await response.json();
      console.log("Réponse de l'API d'email:", result);
      
      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de l&apos;envoi de l&apos;email");
      }
      
      // Rediriger vers la page de confirmation
      clearCart();
      router.push('/checkout/confirmation');
      
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      if (error instanceof Error) {
        setEmailError(error.message);
      } else {
        setEmailError("Une erreur s&apos;est produite lors de l&apos;envoi de l&apos;email");
      }
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Votre panier est vide</h1>
              <p className="text-gray-600 mb-6">Vous n&apos;avez aucun article dans votre panier.</p>
              <button
                onClick={() => router.push('/')}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Retour à l&apos;accueil
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Finaliser votre commande</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Récapitulatif de la commande */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-amber-600 text-white">
                  <h2 className="text-lg font-medium">Récapitulatif de votre commande</h2>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                      {cart.map((item) => (
                        <li key={item.id} className="py-5 flex">
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              style={{ objectFit: 'cover' }}
                              sizes="80px"
                            />
                          </div>
                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.name}</h3>
                                <p className="ml-4">{item.price}</p>
                              </div>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <p className="text-gray-500">Qté {item.quantity}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Total</p>
                      <p>{totalPrice}</p>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      À régler lors du retrait en boutique.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Formulaire de commande */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-amber-600 text-white">
                  <h2 className="text-lg font-medium">Informations de contact</h2>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom
                        </label>
                        <input
                          type="text"
                          name="prenom"
                          id="prenom"
                          value={formData.prenom}
                          onChange={handleChange}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-3 ${
                            formErrors.prenom ? 'border-red-300' : ''
                          }`}
                        />
                        {formErrors.prenom && (
                          <p className="mt-2 text-sm text-red-600">{formErrors.prenom}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          name="nom"
                          id="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-3 ${
                            formErrors.nom ? 'border-red-300' : ''
                          }`}
                        />
                        {formErrors.nom && (
                          <p className="mt-2 text-sm text-red-600">{formErrors.nom}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          name="telephone"
                          id="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                          placeholder="06 12 34 56 78"
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-3 ${
                            formErrors.telephone ? 'border-red-300' : ''
                          }`}
                        />
                        {formErrors.telephone && (
                          <p className="mt-2 text-sm text-red-600">{formErrors.telephone}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-3 ${
                            formErrors.email ? 'border-red-300' : ''
                          }`}
                        />
                        {formErrors.email && (
                          <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <label htmlFor="dateRetrait" className="block text-sm font-medium text-gray-700 mb-2">
                        Date de retrait en boutique
                      </label>
                      <div className={`${formErrors.dateRetrait ? 'border-red-300 rounded-md' : ''}`}>
                        <DatePicker
                          selected={selectedDate}
                          onChange={handleDateChange}
                          filterDate={filterDate}
                          locale="fr"
                          dateFormat="dd/MM/yyyy"
                          minDate={new Date(new Date().setDate(new Date().getDate() + 2))}
                          placeholderText="Cliquez pour sélectionner une date"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-3"
                          calendarClassName="bg-white shadow-lg rounded-md border border-gray-200"
                          popperClassName="z-50"
                          popperPlacement="bottom-start"
                          showPopperArrow={false}
                          inline={false}
                        />
                      </div>
                      {formErrors.dateRetrait && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.dateRetrait}</p>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor="heureRetrait" className="block text-sm font-medium text-gray-700 mb-2">
                        Heure de retrait (entre 9h et 20h)
                      </label>
                      <select
                        id="heureRetrait"
                        name="heureRetrait"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-3 ${
                          formErrors.heureRetrait ? 'border-red-300' : ''
                        }`}
                      >
                        <option value="">Sélectionnez une heure</option>
                        <option value="09:00">09:00</option>
                        <option value="09:30">09:30</option>
                        <option value="10:00">10:00</option>
                        <option value="10:30">10:30</option>
                        <option value="11:00">11:00</option>
                        <option value="11:30">11:30</option>
                        <option value="12:00">12:00</option>
                        <option value="12:30">12:30</option>
                        <option value="13:00">13:00</option>
                        <option value="13:30">13:30</option>
                        <option value="14:00">14:00</option>
                        <option value="14:30">14:30</option>
                        <option value="15:00">15:00</option>
                        <option value="15:30">15:30</option>
                        <option value="16:00">16:00</option>
                        <option value="16:30">16:30</option>
                        <option value="17:00">17:00</option>
                        <option value="17:30">17:30</option>
                        <option value="18:00">18:00</option>
                        <option value="18:30">18:30</option>
                        <option value="19:00">19:00</option>
                        <option value="19:30">19:30</option>
                        <option value="20:00">20:00</option>
                      </select>
                      {formErrors.heureRetrait && (
                        <p className="mt-2 text-sm text-red-600">{formErrors.heureRetrait}</p>
                      )}
                    </div>
                    
                    <div className="pt-6">
                      {emailError && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-red-600">
                            <strong>Erreur d&apos;envoi d&apos;email:</strong> {emailError}
                          </p>
                          <p className="text-sm text-red-500 mt-1">
                            Veuillez réessayer ou contacter le support si le problème persiste.
                          </p>
                        </div>
                      )}
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? 'Traitement en cours...' : 'Confirmer la commande'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage; 