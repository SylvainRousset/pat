import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Configuration de l'API key SendGrid (à configurer dans les variables d'environnement)
// Vous devrez créer un compte SendGrid et obtenir une clé API
if (process.env.SENDGRID_API_KEY) {
  console.log('Configuration de SendGrid avec la clé API');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.log('ATTENTION: Clé API SendGrid non trouvée dans les variables d\'environnement');
}

// Adresse email vérifiée pour l'envoi
const VERIFIED_SENDER = 'sylvaindebisca@gmail.com'; // Assurez-vous que cette adresse est vérifiée dans SendGrid
const ADMIN_EMAIL = 'coquelicot.traiteursucre@gmail.com'; // Adresse de réception des messages

export async function POST(request: Request) {
  try {
    console.log('Début de la fonction POST pour l\'envoi d\'emails');
    console.log('Adresse d\'expédition vérifiée:', VERIFIED_SENDER);
    console.log('Adresse de réception admin:', ADMIN_EMAIL);
    
    // Vérifier que l'API key est configurée
    if (!process.env.SENDGRID_API_KEY) {
      console.error('Configuration SendGrid manquante');
      return NextResponse.json(
        { error: 'Configuration SendGrid manquante' },
        { status: 500 }
      );
    }

    // Récupérer les données de la requête
    const data = await request.json();
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
      
      // Email à l'administrateur pour le message de contact
      const contactEmail = {
        to: ADMIN_EMAIL,
        from: {
          email: VERIFIED_SENDER,
          name: 'Patisserie Coquelicot' // Éviter les caractères spéciaux pour Gmail
        },
        subject: `Message de contact #${messageId} - ${clientInfo.name}`, // Éviter les crochets qui peuvent déclencher les filtres
        html: `
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
        `,
        text: `Nouveau message de contact #${messageId}
        
Informations du contact:
Nom: ${clientInfo.name}
Email: ${clientInfo.email}
Téléphone: ${clientInfo.phone || 'Non renseigné'}

Message:
${message}

Ce message a été envoyé depuis le formulaire de contact du site web Pâtisserie Coquelicot.`,
        headers: {
          "X-Priority": "1",
          "Importance": "high",
          "List-Unsubscribe": `<mailto:${VERIFIED_SENDER}?subject=unsubscribe>` // Améliore la délivrabilité
        },
        categories: ['contact'],
        mailSettings: {
          sandboxMode: {
            enable: false // Assurez-vous que le mode sandbox est désactivé
          }
        },
        trackingSettings: {
          clickTracking: {
            enable: true
          },
          openTracking: {
            enable: true
          }
        }
      };

      console.log('Email de contact préparé:');
      console.log('- Destinataire:', contactEmail.to);
      console.log('- Expéditeur:', contactEmail.from.email);
      console.log('- Sujet:', contactEmail.subject);

      try {
        console.log('Tentative d\'envoi du message de contact...');
        const response = await sgMail.send(contactEmail);
        console.log('Réponse de SendGrid (contact):', JSON.stringify(response));
        console.log('Message ID SendGrid:', response[0].headers['x-message-id']);
        
        return NextResponse.json({ 
          success: true,
          message: "Message de contact envoyé avec succès",
          messageId: messageId,
          response: response[0].statusCode,
          sendgridMessageId: response[0].headers['x-message-id']
        });
      } catch (emailError: any) {
        console.error('Erreur spécifique SendGrid (contact):', emailError);
        if (emailError.response) {
          console.error('Détails de l\'erreur SendGrid:', JSON.stringify(emailError.response.body));
        }
        
        return NextResponse.json(
          { 
            error: 'Erreur lors de l\'envoi du message de contact',
            details: emailError.message,
            response: emailError.response ? emailError.response.body : null
          },
          { status: 500 }
        );
      }
    } else {
      // Gestion des commandes (code existant)
      const { clientInfo, orderDetails, cartItems, totalPrice } = data;
      
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
      
      // Email à l'administrateur
      const adminEmail = {
        to: ADMIN_EMAIL,
        from: {
          email: VERIFIED_SENDER,
          name: 'Patisserie Coquelicot'
        },
        subject: `Nouvelle commande #${orderId} de ${clientInfo.prenom} ${clientInfo.nom}`,
        html: `
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
                  ${cartItems.map((item: any) => `
                    <tr>
                      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
                      <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
                      <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">${item.price}</td>
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
        `,
        text: `Nouvelle commande #${orderId}
        
Informations client:
Nom: ${clientInfo.prenom} ${clientInfo.nom}
Email: ${clientInfo.email}
Téléphone: ${clientInfo.telephone}
Date de retrait: ${orderDetails.dateRetrait}

Articles commandés:
${cartItems.map((item: any) => `- ${item.name} - Quantité: ${item.quantity} - Prix: ${item.price}`).join('\n')}

Prix total: ${totalPrice}`,
        headers: {
          "X-Priority": "1",
          "Importance": "high",
          "List-Unsubscribe": `<mailto:${VERIFIED_SENDER}?subject=unsubscribe>`
        },
        categories: ['commande', 'admin'],
        mailSettings: {
          sandboxMode: {
            enable: false
          }
        },
        trackingSettings: {
          clickTracking: {
            enable: true
          },
          openTracking: {
            enable: true
          }
        }
      };

      // Email au client
      const clientEmail = {
        to: clientInfo.email,
        from: {
          email: VERIFIED_SENDER,
          name: 'Patisserie Coquelicot'
        },
        subject: `Confirmation de votre commande #${orderId} - Coquelicot`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f8f5f0; padding: 20px; text-align: center;">
              <h1 style="color: #d97706;">Merci pour votre commande!</h1>
              <p style="font-size: 16px;">Référence: #${orderId}</p>
            </div>
            
            <div style="padding: 20px; border: 1px solid #e5e7eb; background-color: #ffffff;">
              <p>Cher(e) ${clientInfo.prenom},</p>
              <p>Nous avons bien reçu votre commande et nous sommes ravis de vous confirmer qu'elle est en cours de préparation.</p>
              
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
                  ${cartItems.map((item: any) => `
                    <tr>
                      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
                      <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
                      <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb;">${item.price}</td>
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
                <p style="margin: 10px 0 0 0;"><strong>Adresse:</strong> 3 rue des prés du roi 64800 NAY</p>
              </div>
              
              <p>Veuillez vous présenter à notre boutique avec une pièce d'identité pour récupérer votre commande.</p>
              <p>Nous vous remercions de votre confiance et avons hâte de vous accueillir !</p>
              <p>L'équipe Coquelicot</p>
            </div>
          </div>
        `,
        text: `Merci pour votre commande #${orderId} !

Cher(e) ${clientInfo.prenom},

Nous avons bien reçu votre commande et nous sommes ravis de vous confirmer qu'elle est en cours de préparation.

Détails de votre commande:
${cartItems.map((item: any) => `- ${item.name} - Quantité: ${item.quantity} - Prix: ${item.price}`).join('\n')}

Prix total: ${totalPrice}
Date de retrait: ${orderDetails.dateRetrait}

Veuillez vous présenter à notre boutique avec une pièce d'identité pour récupérer votre commande.
Adresse: 3 rue des prés du roi 64800 NAY

Nous vous remercions de votre confiance et avons hâte de vous accueillir !

L'équipe Coquelicot`,
        headers: {
          "X-Priority": "1",
          "Importance": "high",
          "List-Unsubscribe": `<mailto:${VERIFIED_SENDER}?subject=unsubscribe>`
        },
        categories: ['commande', 'client'],
        mailSettings: {
          sandboxMode: {
            enable: false
          }
        },
        trackingSettings: {
          clickTracking: {
            enable: true
          },
          openTracking: {
            enable: true
          }
        }
      };

      console.log('Préparation des emails:');
      console.log('Email admin:', adminEmail.to);
      console.log('Email client:', clientEmail.to);
      console.log('Email expéditeur:', VERIFIED_SENDER);

      // Envoi des emails
      try {
        console.log('Tentative d\'envoi des emails de commande...');
        
        // Envoi de l'email à l'administrateur
        console.log('Envoi de l\'email à l\'administrateur...');
        const adminResponse = await sgMail.send(adminEmail);
        console.log('Réponse de SendGrid (admin):', JSON.stringify(adminResponse));
        console.log('Message ID SendGrid (admin):', adminResponse[0].headers['x-message-id']);
        
        // Envoi de l'email au client
        console.log('Envoi de l\'email au client...');
        const clientResponse = await sgMail.send(clientEmail);
        console.log('Réponse de SendGrid (client):', JSON.stringify(clientResponse));
        console.log('Message ID SendGrid (client):', clientResponse[0].headers['x-message-id']);
        
        console.log('Emails de commande envoyés avec succès!');
        return NextResponse.json({ 
          success: true,
          message: "Emails de commande envoyés avec succès",
          orderId: orderId,
          adminResponse: adminResponse[0].statusCode,
          clientResponse: clientResponse[0].statusCode,
          adminMessageId: adminResponse[0].headers['x-message-id'],
          clientMessageId: clientResponse[0].headers['x-message-id']
        });
      } catch (emailError: any) {
        console.error('Erreur spécifique SendGrid (commande):', emailError);
        if (emailError.response) {
          console.error('Détails de l\'erreur SendGrid:', JSON.stringify(emailError.response.body));
        }
        
        return NextResponse.json(
          { 
            error: 'Erreur lors de l\'envoi des emails de commande',
            details: emailError.message,
            response: emailError.response ? emailError.response.body : null
          },
          { status: 500 }
        );
      }
    }
  } catch (error: any) {
    console.error('Erreur générale lors de l\'envoi des emails:', error);
    return NextResponse.json(
      { 
        error: 'Erreur générale lors de l\'envoi des emails',
        message: error.message
      },
      { status: 500 }
    );
  }
} 