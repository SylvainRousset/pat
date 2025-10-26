# Guide de Migration vers Mailjet ✅

## ✅ Migration terminée !

### 1. Installation
- ✅ Bibliothèque `node-mailjet` installée
- ✅ Code API mis à jour pour utiliser Mailjet
- ✅ Fichier SendGrid conservé en backup : `route.sendgrid.backup.ts`

### 2. Code
- ✅ Nouvelle API route créée : `src/app/api/send-email/route.ts` (Mailjet)
- ✅ Fonctionnalités conservées : emails admin + client
- ✅ Templates HTML identiques

### 3. Variables d'environnement
- ✅ Fichier `.env.local` mis à jour
- ⚠️ **À FAIRE** : Obtenir vos clés Mailjet (voir ci-dessous)

## 🔑 Obtenir vos clés Mailjet

### Étape 1 : Créer un compte Mailjet

1. Allez sur https://app.mailjet.com/signup
2. Créez un compte gratuit (6000 emails/mois)
3. Confirmez votre email

### Étape 2 : Obtenir vos clés API

1. Connectez-vous à https://app.mailjet.com
2. Allez dans **Account Settings > API Keys Management** (ou directement https://app.mailjet.com/account/apikeys)
3. Vous verrez deux clés :
   - **API Key** : Une clé qui commence par des chiffres
   - **Secret Key** : Une clé aléatoire

### Étape 3 : Configurer le fichier .env.local

Ouvrez le fichier `.env.local` à la racine du projet et remplacez :

```env
MAILJET_API_KEY=VOTRE_API_KEY_ICI
MAILJET_SECRET_KEY=VOTRE_SECRET_KEY_ICI
```

Par vos vraies clés :
```env
MAILJET_API_KEY=1234567890abcdef1234567890abcdef
MAILJET_SECRET_KEY=abcdef1234567890abcdef1234567890
```

### Étape 4 : Vérifier l'adresse email d'expédition

1. Dans Mailjet : **Senders** (ou https://app.mailjet.com/account/senders)
2. Cliquez sur **Add a sender**
3. Remplissez :
   - **Email** : `sylvaindebisca@gmail.com`
   - **Name** : `Pâtisserie Coquelicot`
   - **Company** : Votre nom de boutique
   - **Website** : Votre site (optionnel)
4. Cliquez sur **Add**
5. Mailjet vous enverra un email de vérification
6. **Important** : Ouvrez cet email et cliquez sur le lien de vérification

## 🔄 Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl + C)
npm run dev
```

## ✅ Tester

### Test manuel

1. Allez sur votre site
2. Ajoutez des produits au panier
3. Allez sur `/checkout`
4. Remplissez le formulaire
5. Cliquez sur "Confirmer la commande"

**Résultat attendu** :
- ✅ Redirection vers `/checkout/confirmation`
- ✅ Pas d'erreur dans la console
- ✅ Email reçu dans sylvaindebisca@gmail.com
- ✅ Email de confirmation au client

### Dans Mailjet Dashboard

1. Allez sur https://app.mailjet.com
2. Section **Statistics**
3. Vous devriez voir les emails envoyés
4. Status : "Delivered" = ✅ Succès

## 📊 Vérifications dans la console

### Serveur (terminal)
```
Configuration de Mailjet avec les clés API
Début de la fonction POST pour l'envoi d'emails via Mailjet
Tentative d'envoi des emails de commande via Mailjet...
Emails de commande envoyés avec succès via Mailjet!
```

### Navigateur (F12 > Console)
- Pas d'erreur
- Status 200 OK

## 🎯 Avantages de la migration

- ✅ **6000 emails/mois** au lieu de 3000 (gratuit)
- ✅ **Support en français** si problème
- ✅ **RGPD friendly** (basé en France)
- ✅ **Interface plus intuitive**
- ✅ **Email builder intégré** (pour futures améliorations)

## ⚠️ Si problème

### Erreur "Configuration Mailjet manquante"

**Cause** : Les clés API ne sont pas dans `.env.local`
**Solution** :
1. Vérifiez que `.env.local` contient `MAILJET_API_KEY` et `MAILJET_SECRET_KEY`
2. Redémarrez le serveur
3. Les variables ne sont lues qu'au démarrage du serveur

### Erreur "Authentication failed"

**Cause** : Les clés API sont incorrectes
**Solution** :
1. Vérifiez que vous avez copié les bonnes clés dans `.env.local`
2. Pas d'espace avant/après les clés
3. Pas de guillemets autour des clés

### Erreur "Sender not verified"

**Cause** : L'email `sylvaindebisca@gmail.com` n'est pas vérifié
**Solution** :
1. Allez dans Mailjet > Senders
2. Vérifiez `sylvaindebisca@gmail.com`
3. Si non vérifié, ajoutez-le et confirmez via l'email

## 📁 Fichiers modifiés

- ✅ `src/app/api/send-email/route.ts` → Utilise maintenant Mailjet
- ✅ `src/app/api/send-email/route.sendgrid.backup.ts` → Ancienne version SendGrid (sauvegarde)
- ✅ `.env.local` → Variables Mailjet ajoutées

## 🔙 Rollback (si besoin)

Si vous voulez revenir à SendGrid :

```bash
# Restaurez l'ancien fichier
Copy-Item "src/app/api/send-email/route.sendgrid.backup.ts" "src/app/api/send-email/route.ts" -Force

# Remettez SendGrid dans .env.local
SENDGRID_API_KEY=VOTRE_CLE_SENDGRID
```

## ✅ Prochaine étape

1. **Obtenez vos clés Mailjet** (5 minutes)
2. **Ajoutez-les dans `.env.local`** (1 minute)
3. **Redémarrez le serveur** (1 minute)
4. **Testez une commande** (2 minutes)

**Total** : ~10 minutes pour tout configurer ! 🚀


