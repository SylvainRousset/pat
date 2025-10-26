import { NextResponse } from 'next/server';
import mailjet from 'node-mailjet';

// Types pour les données
interface ClientInfo {
  name?: string;
  email: string;
  phone?: string;
  prenom?: string;
  nom?: string;
  telephone?: string;
}

interface OrderDetails {
  dateRetrait: string;
  heureRetrait?: string;
}

interface CartItem {
  name: string;
  quantity: number;
  price: string;
  image?: string;
  flavorManagementType?: 'standard' | 'pack';
  selectedFlavors?: string[];
  flavor?: string;
  portions?: string;
}

interface ContactData {
  type: 'contact';
  clientInfo: ClientInfo;
  message: string;
}

interface OrderData {
  type: 'order';
  clientInfo: ClientInfo;
  orderDetails: OrderDetails;
  cartItems: CartItem[];
  totalPrice: string;
}

type RequestData = ContactData | OrderData;

// Configuration de Mailjet
const VERIFIED_SENDER = 'sylvaindebisca@hotmail.fr';
const ADMIN_EMAIL = 'sylvaindebisca@hotmail.fr';

// Fonction pour formater les articles avec saveurs groupées (version texte)
function formatCartItem(item: CartItem): string {
  let itemName = item.name.replace(/\s*\([^)]*\)$/, '').trim();
  
  if (item.flavorManagementType === 'pack' && item.selectedFlavors && item.selectedFlavors.length > 0) {
    itemName = itemName.replace(/ - Pack de \d+ parts?$/i, '').trim();
    
    const flavorCounts = item.selectedFlavors.reduce((acc, flavor) => {
      acc[flavor] = (acc[flavor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const flavorsText = Object.entries(flavorCounts)
      .map(([flavor, count]) => count > 1 ? `${flavor} ×${count}` : flavor)
      .join(', ');
    
    return `${itemName} : ${flavorsText}`;
  } else if (item.flavor) {
    return `${itemName} - ${item.flavor}`;
  }
  
  return itemName;
}

// Fonction pour formater les articles avec badges HTML (version email)
function formatCartItemHTML(item: CartItem): string {
  // Nettoyer le nom : enlever TOUTES les informations déjà dans le nom
  let itemName = item.name;
  
  // Enlever les parenthèses et tout leur contenu (ex: (saveur1, saveur2, ...))
  itemName = itemName.replace(/ \(.+\)/g, '').trim();
  
  // Enlever "Pack de X parts" si présent
  itemName = itemName.replace(/ - Pack de \d+ parts?$/i, '').trim();
  
  if (item.flavorManagementType === 'pack' && item.selectedFlavors && item.selectedFlavors.length > 0) {
    const flavorCounts = item.selectedFlavors.reduce((acc, flavor) => {
      acc[flavor] = (acc[flavor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Créer des badges HTML pour chaque saveur
    const badgesHTML = Object.entries(flavorCounts)
      .map(([flavor, count]) => {
        const countDisplay = count > 1 ? ` <strong>×${count}</strong>` : '';
        return `
              <span style="display: inline-block; background-color: #fef3c7; color: #92400e; padding: 4px 10px; margin: 2px; border-radius: 12px; font-size: 12px; border: 1px solid #f59e0b;">
                ${flavor}${countDisplay}
              </span>`;
      })
      .join('\n            ');
    
    return `${itemName}<div style="margin-top: 8px;">${badgesHTML}</div>`;
  } else if (item.flavor) {
    return `${itemName}<div style="margin-top: 8px;"><span style="display: inline-block; background-color: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 12px; font-size: 12px; border: 1px solid #f59e0b;">${item.flavor}</span></div>`;
  }
  
  return itemName;
}

// Initialiser Mailjet si les clés sont disponibles
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mailjetClient: any = null;

if (process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY) {
  console.log('Configuration de Mailjet avec les clés API');
  mailjetClient = mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
  );
} else {
  console.log('ATTENTION: Clés API Mailjet non trouvées dans les variables d\'environnement');
}

export async function POST(request: Request) {
  try {
    console.log('Début de la fonction POST pour l\'envoi d\'emails via Mailjet');
    console.log('Adresse d\'expédition:', VERIFIED_SENDER);
    console.log('Adresse de réception admin:', ADMIN_EMAIL);
    
    // Vérifier que les clés API sont configurées
    if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
      console.error('Configuration Mailjet manquante');
      return NextResponse.json(
        { error: 'Configuration Mailjet manquante. Veuillez configurer MAILJET_API_KEY et MAILJET_SECRET_KEY' },
        { status: 500 }
      );
    }

    // Récupérer les données de la requête
    const data = await request.json() as RequestData;
    console.log('Type de requête reçue:', data.type);
    
    // Traitement différent selon le type de message
    if (data.type === 'contact') {
      // Gestion des messages de contact
      const { clientInfo, message } = data;
      
      console.log('Message de contact reçu:', { 
        client: clientInfo, 
        message: message
      });

      if (!clientInfo || !message) {
        console.error('Données de contact manquantes dans la requête');
        return NextResponse.json(
          { error: 'Données de contact manquantes' },
          { status: 400 }
        );
      }

      // Générer un ID unique pour le message
      const messageId = `MSG-${Date.now().toString().slice(-6)}`;
      
      try {
        console.log('Tentative d\'envoi du message de contact via Mailjet...');
        
        const result = await mailjetClient.post('send', { version: 'v3.1' }).request({
          Messages: [
            {
              From: {
                Email: VERIFIED_SENDER,
                Name: 'Pâtisserie Coquelicot'
              },
              To: [
                {
                  Email: ADMIN_EMAIL,
                  Name: 'Admin Coquelicot'
                }
              ],
              Subject: `Message de contact #${messageId} - ${clientInfo.name}`,
              TextPart: `Nouveau message de contact #${messageId}
        
Informations du contact:
Nom: ${clientInfo.name}
Email: ${clientInfo.email}
Téléphone: ${clientInfo.phone || 'Non renseigné'}

Message:
${message}

Ce message a été envoyé depuis le formulaire de contact du site web Pâtisserie Coquelicot.`,
              HTMLPart: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #f8f5f0; padding: 20px; text-align: center;">
                <h1 style="color: #d97706;">Nouveau message de contact</h1>
                <p style="font-size: 16px;">Référence: #${messageId}</p>
              </div>
              
              <div style="padding: 20px; border: 1px solid #e5e7eb; background-color: #ffffff;">
                <h2 style="color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Informations du contact</h2>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 8px; font-weight: bold; width: 120px;">Nom:</td>
                    <td style="padding: 8px;">${clientInfo.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold;">Email:</td>
                    <td style="padding: 8px;"><a href="mailto:${clientInfo.email}" style="color: #d97706;">${clientInfo.email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold;">Téléphone:</td>
                    <td style="padding: 8px;">${clientInfo.phone || 'Non renseigné'}</td>
                  </tr>
                </table>
                
                <h2 style="color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Message</h2>
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                  <p style="white-space: pre-line;">${message}</p>
                </div>
                
                <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
                  Ce message a été envoyé depuis le formulaire de contact du site web Pâtisserie Coquelicot.
                </p>
              </div>
            </div>
          `
            }
          ]
        });
        
        console.log('Message de contact envoyé avec succès via Mailjet');
        console.log('Réponse Mailjet:', JSON.stringify(result.body));
        
        return NextResponse.json({ 
          success: true,
          message: "Message de contact envoyé avec succès",
          messageId: messageId,
          provider: 'Mailjet'
        });
      } catch (error: unknown) {
        const err = error as Error;
        console.error('Erreur lors de l\'envoi du message de contact:', err);
        console.error('Détails:', err.message);
        
        return NextResponse.json(
          { 
            error: 'Erreur lors de l\'envoi du message de contact',
            details: err.message
          },
          { status: 500 }
        );
      }
    } else {
      // Gestion des commandes
      const orderData = data as OrderData;
      const { clientInfo, orderDetails, cartItems, totalPrice } = orderData;
      
      console.log('Données de commande reçues:', { 
        client: clientInfo, 
        commande: orderDetails,
        articles: cartItems ? cartItems.length : 0,
        total: totalPrice 
      });

      if (!clientInfo || !orderDetails || !cartItems) {
        console.error('Données de commande manquantes dans la requête');
        return NextResponse.json(
          { error: 'Données de commande manquantes' },
          { status: 400 }
        );
      }

      // Générer un ID unique pour la commande
      const orderId = `CMD-${Date.now().toString().slice(-6)}`;
      
      console.log('Préparation des emails de commande via Mailjet...');
      console.log('Email admin:', ADMIN_EMAIL);
      console.log('Email client:', clientInfo.email);
      
      try {
        console.log('Tentative d\'envoi des emails de commande via Mailjet...');
        
        // Envoi simultané des emails à l'admin ET au client dans un seul appel
        console.log('Envoi simultané des emails à l\'admin et au client...');
        const result = await mailjetClient.post('send', { version: 'v3.1' }).request({
          Messages: [
            // Email admin
            {
              From: {
                Email: VERIFIED_SENDER,
                Name: 'Pâtisserie Coquelicot'
              },
              To: [
                {
                  Email: ADMIN_EMAIL,
                  Name: 'Admin Coquelicot'
                }
              ],
              Subject: `[Coquelicot] Réservation #${orderId} - ${clientInfo.prenom} ${clientInfo.nom}`,
              TextPart: `Nouvelle commande #${orderId}
        
Informations client:
Nom: ${clientInfo.prenom} ${clientInfo.nom}
Email: ${clientInfo.email}
Téléphone: ${clientInfo.telephone}
Date de retrait: ${orderDetails.dateRetrait}
Heure de retrait: ${orderDetails.heureRetrait || 'Non spécifiée'}

Articles commandés:
${cartItems.map((item) => `- ${formatCartItem(item)} - Quantité: ${item.quantity} - Prix: ${item.price}`).join('\n')}

Prix total: ${totalPrice}`,
              HTMLPart: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #f8f5f0; padding: 20px; text-align: center;">
                <h1 style="color: #d97706;">Nouvelle commande!</h1>
                <p style="font-size: 16px;">Référence: #${orderId}</p>
              </div>
              
              <div style="padding: 20px; border: 1px solid #e5e7eb; background-color: #ffffff;">
                <h2 style="color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Informations client</h2>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 8px; font-weight: bold; width: 120px;">Nom:</td>
                    <td style="padding: 8px;">${clientInfo.prenom} ${clientInfo.nom}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold;">Email:</td>
                    <td style="padding: 8px;"><a href="mailto:${clientInfo.email}" style="color: #d97706;">${clientInfo.email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold;">Téléphone:</td>
                    <td style="padding: 8px;">${clientInfo.telephone}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold;">Date de retrait:</td>
                    <td style="padding: 8px;">${orderDetails.dateRetrait}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; font-weight: bold;">Heure de retrait:</td>
                    <td style="padding: 8px;">${orderDetails.heureRetrait || 'Non spécifiée'}</td>
                  </tr>
                </table>
                
                <h2 style="color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Articles commandés</h2>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <thead>
                    <tr style="background-color: #f9fafb;">
                      <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb;">Produit</th>
                      <th style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb;">Quantité</th>
                      <th style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">Prix</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${cartItems.map((item) => `
                      <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top;">${formatCartItemHTML(item)}</td>
                        <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb; vertical-align: top;">${item.quantity}</td>
                        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb; vertical-align: top;">${item.price}</td>
                      </tr>
                    `).join('')}
                    <tr style="font-weight: bold;">
                      <td style="padding: 10px;" colspan="2">Total</td>
                      <td style="padding: 10px; text-align: right;">${totalPrice}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          `
            },
            // Email client
            {
              From: {
                Email: VERIFIED_SENDER,
                Name: 'Pâtisserie Coquelicot'
              },
              To: [
                {
                  Email: ADMIN_EMAIL,
                  Name: `${clientInfo.prenom} ${clientInfo.nom}`
                }
              ],
              Subject: `[Coquelicot] Confirmation de votre réservation #${orderId}`,
              TextPart: `Merci pour votre commande #${orderId} !

Cher(e) ${clientInfo.prenom},

Nous avons bien reçu votre commande et nous sommes ravis de vous confirmer qu'elle est en cours de préparation.

Détails de votre commande:
${cartItems.map((item) => `- ${item.name} - Quantité: ${item.quantity} - Prix: ${item.price}`).join('\n')}

Prix total: ${totalPrice}
Date de retrait: ${orderDetails.dateRetrait}
Heure de retrait: ${orderDetails.heureRetrait || 'Non spécifiée'}

Veuillez vous présenter à notre boutique avec une pièce d'identité pour récupérer votre commande.
Adresse: 3 rue des prés du roi 64800 NAY

Nous vous remercions de votre confiance et avons hâte de vous accueillir !

L'équipe Coquelicot`,
              HTMLPart: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #f8f5f0; padding: 20px; text-align: center;">
                <h1 style="color: #d97706;">Merci pour votre commande!</h1>
                <p style="font-size: 16px;">Référence: #${orderId}</p>
              </div>
              
              <div style="padding: 20px; border: 1px solid #e5e7eb; background-color: #ffffff;">
                <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin-bottom: 20px;">
                  <p style="margin: 0; font-size: 14px; color: #92400e;">
                    <strong>ℹ️ Email authentique</strong><br/>
                    Cet email vous a été envoyé suite à votre réservation sur le site Pâtisserie Coquelicot. 
                    Si vous n'avez pas effectué de réservation, vous pouvez ignorer ce message.
                  </p>
                </div>
                
                <p>Cher(e) ${clientInfo.prenom},</p>
                <p>Nous avons bien reçu votre réservation et nous sommes ravis de vous confirmer qu'elle est en cours de préparation.</p>
                
                <h2 style="color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Détails de votre commande</h2>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <thead>
                    <tr style="background-color: #f9fafb;">
                      <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb;">Produit</th>
                      <th style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb;">Quantité</th>
                      <th style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">Prix</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${cartItems.map((item) => `
                      <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top;">${formatCartItemHTML(item)}</td>
                        <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb; vertical-align: top;">${item.quantity}</td>
                        <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb; vertical-align: top;">${item.price}</td>
                      </tr>
                    `).join('')}
                    <tr style="font-weight: bold;">
                      <td style="padding: 10px;" colspan="2">Total</td>
                      <td style="padding: 10px; text-align: right;">${totalPrice}</td>
                    </tr>
                  </tbody>
                </table>
                
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                  <p style="margin: 0;"><strong>Date de retrait:</strong> ${orderDetails.dateRetrait}</p>
                  <p style="margin: 10px 0 0 0;"><strong>Heure de retrait:</strong> ${orderDetails.heureRetrait || 'Non spécifiée'}</p>
                  <p style="margin: 10px 0 0 0;"><strong>Adresse:</strong> 3 rue des prés du roi 64800 NAY</p>
                </div>
                
                <p>Veuillez vous présenter à notre boutique avec une pièce d'identité pour récupérer votre commande.</p>
                <p>Nous vous remercions de votre confiance et avons hâte de vous accueillir !</p>
                <p>L'équipe Coquelicot</p>
              </div>
            </div>
          `
            }
          ]
        });
        
        console.log('Emails de commande envoyés avec succès via Mailjet!');
        console.log('Réponse Mailjet:', JSON.stringify(result.body));
        
        return NextResponse.json({ 
          success: true,
          message: "Emails de commande envoyés avec succès",
          orderId: orderId,
          provider: 'Mailjet'
        });
      } catch (error: unknown) {
        const err = error as Error;
        console.error('Erreur générale lors de l\'envoi des emails via Mailjet:', err);
        console.error('Détails:', err.message);
        
        return NextResponse.json(
          { 
            error: 'Erreur générale lors de l\'envoi des emails',
            message: err.message
          },
          { status: 500 }
        );
      }
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Erreur générale lors de l\'envoi des emails:', err);
    return NextResponse.json(
      { 
        error: 'Erreur générale lors de l\'envoi des emails',
        message: err.message
      },
      { status: 500 }
    );
  }
}

