# Guide de Gestion des Commandes et Emails

## Vue d'ensemble du système

Votre application dispose déjà d'un système complet de gestion des commandes avec envoi d'emails. Voici comment tout fonctionne :

## Architecture actuelle

### 1. **Gestion du panier** (déjà configuré)
- Fichier : `src/context/CartContext.tsx`
- Stockage : localStorage du navigateur
- Fonctions disponibles :
  - `addToCart()` : Ajouter un produit
  - `addMultipleToCart()` : Ajouter plusieurs produits du même type
  - `removeFromCart()` : Retirer un produit
  - `updateQuantity()` : Modifier la quantité
  - `clearCart()` : Vider le panier
  - `totalItems` : Nombre total d'articles
  - `totalPrice` : Prix total

### 2. **Page de checkout** (déjà configurée)
- Fichier : `src/app/checkout/page.tsx`
- Fonctionnalités :
  - Formulaire de validation avec prénom, nom, téléphone, email
  - Sélection de la date de retrait (calendrier, exclut les dimanches)
  - Sélection de l'heure de retrait (9h-20h toutes les 30min)
  - Validation des champs côté client
  - Récapitulatif des articles commandés
  - Envoi des données à l'API `/api/send-email`

### 3. **API d'envoi d'emails** (déjà configurée)
- Fichier : `src/app/api/send-email/route.ts`
- Utilise SendGrid pour l'envoi d'emails
- Gère deux types de messages :
  - **Commande** : Envoie un email à l'admin ET au client avec les détails de la commande
  - **Contact** : Envoie un email à l'admin avec le message de contact

### 4. **Page de confirmation** (déjà configurée)
- Fichier : `src/app/checkout/confirmation/page.tsx`
- S'affiche après une commande réussie
- Affiche les informations de retrait

## Configuration requise

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec :

```env
SENDGRID_API_KEY=votre_cle_api_sendgrid_ici
```

### 2. Configuration SendGrid

#### Étape 1 : Créer un compte SendGrid
1. Allez sur https://sendgrid.com
2. Créez un compte gratuit (100 emails/jour)

#### Étape 2 : Vérifier l'adresse email d'expédition
1. Aller dans **Settings > Sender Authentication**
2. Vérifier l'adresse `sylvaindebisca@gmail.com` (déjà configurée dans le code)

#### Étape 3 : Créer une API Key
1. Aller dans **Settings > API Keys**
2. Cliquer sur **Create API Key**
3. Donner un nom (ex: "Coquelicot Emails")
4. Sélectionner **Full Access**
5. Copier la clé générée dans votre fichier `.env.local`

## Flux de commande

```
1. Client ajoute des produits au panier
   ↓
2. Client clique sur "Passer la commande"
   ↓
3. Redirection vers /checkout
   ↓
4. Remplissage du formulaire (validation en temps réel)
   ↓
5. Sélection date/heure de retrait
   ↓
6. Clic sur "Confirmer la commande"
   ↓
7. Données envoyées à /api/send-email
   ↓
8. SendGrid envoie 2 emails :
   - Email à l'admin (sylvaindebisca@gmail.com)
   - Email au client (confirmation)
   ↓
9. Panier vidé automatiquement
   ↓
10. Redirection vers /checkout/confirmation
```

## Détails des emails envoyés

### Email à l'administrateur
**Destinataire** : `sylvaindebisca@gmail.com`  
**Contenu** :
- Numéro de commande (CMD-XXXXXX)
- Informations client (nom, prénom, email, téléphone)
- Date et heure de retrait
- Détail des articles commandés (nom, quantité, prix)
- Prix total

### Email au client
**Destinataire** : Email du client  
**Contenu** :
- Confirmation de commande
- Numéro de commande
- Récapitulatif des articles
- Date, heure et adresse de retrait
- Instructions pour le retrait

## Validation côté client

Le formulaire de checkout valide automatiquement :

✅ **Nom** : Champ requis
✅ **Prénom** : Champ requis
✅ **Téléphone** : Format (10 chiffres)
✅ **Email** : Format valide
✅ **Date de retrait** : Obligatoire (minimum 2 jours à l'avance, pas de dimanche)
✅ **Heure de retrait** : Obligatoire (9h-20h)

## Personnalisation

### Modifier l'adresse email d'expédition

Dans `src/app/api/send-email/route.ts` :

```typescript
const VERIFIED_SENDER = 'votre_email@example.com';
const ADMIN_EMAIL = 'votre_email@example.com';
```

### Modifier le texte des emails

Editez les templates HTML dans `src/app/api/send-email/route.ts` :
- Lignes 245-304 : Email admin
- Lignes 340-433 : Email client

### Modifier l'adresse de retrait

Dans les emails, changer :
```
3 rue des prés du roi 64800 NAY
```

## Test de l'API

Pour tester si tout fonctionne :

```bash
# En développement
npm run dev

# Puis allez sur http://localhost:3000/checkout
```

## Dépannage

### Les emails ne partent pas
1. Vérifiez que `SENDGRID_API_KEY` est configuré dans `.env.local`
2. Vérifiez que l'email d'expédition est vérifié dans SendGrid
3. Consultez les logs de la console (erreurs SendGrid sont affichées)

### Erreur "Configuration SendGrid manquante"
- Créez le fichier `.env.local` avec votre clé API
- Redémarrez le serveur de développement

### L'adresse email n'est pas vérifiée
1. Connectez-vous à SendGrid
2. Settings > Sender Authentication > Single Sender Verification
3. Ajoutez et vérifiez votre adresse email

## Sécurité

- L'API key SendGrid est stockée dans `.env.local` (jamais commité dans Git)
- Le fichier `.env.local` est ignoré par Git (voir `.gitignore`)
- Les emails sont chiffrés en transit via SendGrid

## Limites du plan gratuit SendGrid

- 100 emails/jour
- Suffisant pour des tests et une petite boutique
- Pour plus de volume, passer à un plan payant

## Fonctionnalités avancées (à ajouter si nécessaire)

1. **Sauvegarde des commandes en base de données** : Actuellement, seuls les emails sont envoyés
2. **Notifications SMS** : Via Twilio ou équivalent
3. **Suivi de commande** : Statut (en attente, en préparation, prête)
4. **Gestion des stocks** : Diminuer les quantités en stock

## Support

Pour toute question ou problème, consultez :
- Logs de la console navigateur (F12 > Console)
- Logs du serveur Next.js
- Dashboard SendGrid (activité des emails envoyés)


