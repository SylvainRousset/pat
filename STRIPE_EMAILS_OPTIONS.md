# Options pour les Emails avec Stripe

## Vue d'ensemble

Actuellement, votre site utilise **SendGrid** pour l'envoi d'emails et le paiement se fait **en boutique** ("À régler lors du retrait").

Si vous souhaitez ajouter Stripe pour les paiements en ligne, voici les options pour gérer les emails :

## Option 1 : Stripe Receipts (Automatique) ⭐ RECOMMANDÉ

### Avantages
- **Automatique** : Stripe envoie des reçus par email après chaque paiement
- **Gratuit** : Inclus dans tous les plans Stripe
- **Personnalisable** : Template personnalisé avec votre logo et couleurs
- **Conforme** : Reçus fiscaux aux normes françaises
- **Sécurisé** : Données de paiement jamais stockées sur votre serveur

### Limites
- Envoie **UNIQUEMENT** le reçu de paiement au client
- Ne gère PAS les emails à l'administrateur
- Ne gère PAS les détails de retrait (date/heure)
- Template assez basique

### Ce que vous recevez
**Email au client** :
- Reçu de paiement automatique
- Liste des articles achetés
- Montant total
- Date de paiement

**Email à l'admin** : ❌ Aucun (il faut combiner avec SendGrid)

### Configuration (si vous ajoutez Stripe)
```bash
npm install stripe @stripe/stripe-js
```

```env
# .env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Option 2 : Stripe + SendGrid (Hybrid) ⭐⭐ PARFAIT

### Solution complète
**Stripe** = Paiement en ligne + Reçu automatique au client
**SendGrid** = Emails personnalisés à l'admin + Détails de retrait

### Flux de commande
```
1. Client remplit le formulaire
   ↓
2. Clic sur "Payer avec Stripe"
   ↓
3. Stripe process le paiement
   ↓
4. Deux emails partent automatiquement :
   - Stripe : Reçu de paiement au client
   - SendGrid : Détails complets de la commande à l'admin
   ↓
5. Webhook Stripe déclenche votre API SendGrid
   ↓
6. Email personnalisé avec date/heure de retrait
```

### Avantages
- ✅ Paiement en ligne sécurisé (Stripe)
- ✅ Reçus automatiques (Stripe)
- ✅ Email détaillé à l'admin (SendGrid)
- ✅ Gestion des dates de retrait
- ✅ Personnalisation totale

### Implementation
```typescript
// 1. Client paie avec Stripe
// 2. Webhook Stripe appelle votre API
// 3. Votre API envoie email SendGrid à l'admin

// src/app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const event = await stripe.webhooks.constructEvent(...);
  
  if (event.type === 'checkout.session.completed') {
    // Récupérer les détails de la commande
    const orderDetails = event.data.object;
    
    // Envoyer email à l'admin via SendGrid
    await sgMail.send({
      to: 'sylvaindebisca@gmail.com',
      from: 'sylvaindebisca@gmail.com',
      subject: 'Nouvelle commande payée',
      html: generateAdminEmail(orderDetails)
    });
  }
}
```

## Option 3 : SendGrid Seul (Actuel) ⭐ SIMPLE

### Votre situation actuelle
- Aucun paiement en ligne
- Client paie en boutique lors du retrait
- SendGrid envoie emails à l'admin et au client

### Avantages
- ✅ Simple et direct
- ✅ Pas de frais de transaction Stripe
- ✅ Paiement sécurisé en boutique
- ✅ Gestion complète des emails

### Inconvénients
- ❌ Pas de prépaiement
- ❌ Risque de commande non récupérée

## Comparaison rapide

| Fonctionnalité | SendGrid seul (actuel) | Stripe seul | Stripe + SendGrid |
|---|---|---|---|
| **Email reçu client** | ✅ Personnalisé | ✅ Automatique | ✅ Automatique (Stripe) |
| **Email admin** | ✅ Complet | ❌ Non | ✅ Complet (SendGrid) |
| **Détails retrait** | ✅ Oui | ❌ Non | ✅ Oui |
| **Paiement online** | ❌ Non | ✅ Oui | ✅ Oui |
| **Coûts** | Gratuit (100/jour) | 1.4% + 0.25€/txn | 1.4% + 0.25€/txn |
| **Complexité** | Simple | Moyenne | Complexe |

## Recommandation

### Si vous voulez garder la simplicité
→ **Gardez SendGrid seul** (système actuel)
- Fonctionne parfaitement
- Pas de frais de transaction
- Installation rapide (juste l'API Key SendGrid)

### Si vous voulez les paiements en ligne
→ **Stripe + SendGrid**
- Le meilleur des deux mondes
- Paiement + Emails complets
- Plus complexe mais très professionnel

## Code d'exemple : Intégration Stripe + SendGrid

### 1. Installation
```bash
npm install stripe @stripe/stripe-js
```

### 2. Configuration environnement
```env
# .env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
SENDGRID_API_KEY=SG...
```

### 3. Créer une session de paiement
```typescript
// src/app/api/create-checkout-session/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { cart, clientInfo, dateRetrait } = await req.json();
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: cart.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(parseFloat(item.price) * 100),
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${req.url}/checkout/confirmation`,
    cancel_url: `${req.url}/checkout`,
    customer_email: clientInfo.email,
    metadata: {
      clientName: `${clientInfo.prenom} ${clientInfo.nom}`,
      telephone: clientInfo.telephone,
      dateRetrait,
      heureRetrait: clientInfo.heureRetrait,
    }
  });
  
  return NextResponse.json({ sessionId: session.id });
}
```

### 4. Webhook pour recevoir les événements Stripe
```typescript
// src/app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';
import sgMail from '@sendgrid/mail';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }
  
  // Quand un paiement est confirmé
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Envoyer email à l'admin avec les détails de retrait
    await sgMail.send({
      to: 'sylvaindebisca@gmail.com',
      from: 'sylvaindebisca@gmail.com',
      subject: `Nouvelle commande payée #${session.id}`,
      html: `
        <h1>Nouvelle commande payée !</h1>
        <p>Client: ${session.metadata.clientName}</p>
        <p>Email: ${session.customer_email}</p>
        <p>Téléphone: ${session.metadata.telephone}</p>
        <p>Date retrait: ${session.metadata.dateRetrait}</p>
        <p>Heure retrait: ${session.metadata.heureRetrait}</p>
        <p>Total: ${(session.amount_total! / 100).toFixed(2)} €</p>
      `
    });
  }
  
  return NextResponse.json({ received: true });
}
```

## Conclusion

**Pour votre cas d'usage** (pâtisserie avec retrait en boutique) :

1. **Si paiement en boutique** → Gardez SendGrid seul ✅
2. **Si paiement en ligne** → Stripe + SendGrid ✅
3. **Stripe seul** → Pas assez pour les détails de retrait ❌

Votre système actuel avec SendGrid seul est déjà excellent pour une commande sans paiement en ligne !


