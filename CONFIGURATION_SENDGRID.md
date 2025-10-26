# Configuration SendGrid - Guide Complet

## ✅ Ce qui est DÉJÀ configuré

### 1. Code dans votre application
- Fichier `src/app/api/send-email/route.ts` ✅
- Utilise la bibliothèque `@sendgrid/mail` ✅
- Email d'expédition : `sylvaindebisca@gmail.com` ✅
- Email admin : `sylvaindebisca@gmail.com` ✅

### 2. Variables d'environnement
```env
SENDGRID_API_KEY=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
ADMIN_EMAIL=sylvaindebisca@gmail.com
FROM_EMAIL=sylvaindebisca@gmail.com
```

## ⚠️ Ce qu'il vous FAUT faire dans SendGrid

### Étape 1 : Créer un compte SendGrid (si pas déjà fait)

1. Allez sur https://sendgrid.com
2. Cliquez sur **Start for Free**
3. Créez un compte (100 emails/jour gratuits)

### Étape 2 : Vérifier l'adresse email d'expédition

**C'EST LA PLUS IMPORTANTE ÉTAPE !**

SendGrid doit vérifier que vous êtes propriétaire de l'email `sylvaindebisca@gmail.com`

#### Méthode 1 : Single Sender Verification (Recommandé)

1. Connectez-vous à https://app.sendgrid.com
2. Allez dans **Settings > Sender Authentication**
3. Cliquez sur **Verify a Single Sender**
4. Remplissez le formulaire :
   - **From Email Address** : `sylvaindebisca@gmail.com`
   - **From Name** : `Pâtisserie Coquelicot`
   - **Reply-To** : `sylvaindebisca@gmail.com`
   - **Company Address** : `3 rue des prés du roi 64800 NAY`
   - **Website URL** : Votre URL de site web
5. Cliquez sur **Create**
6. Un email sera envoyé à `sylvaindebisca@gmail.com`
7. **Important** : Ouvrez cet email et cliquez sur le lien de vérification

#### Méthode 2 : Domain Authentication (Pour production)

Pour un domaine comme `coquelicot.com` (plus professionnel mais optionnel)

### Étape 3 : Vérifier que l'API Key est valide

1. Allez dans **Settings > API Keys**
2. Vérifiez que cette clé existe : 
   ```
   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
   ```

Si elle n'existe pas ou a été supprimée :

1. Cliquez sur **Create API Key**
2. Nom : `Pâtisserie Coquelicot`
3. Permissions : Sélectionnez **Full Access**
4. Cliquez sur **Create & View**
5. **Copiez la clé** et remplacez `SENDGRID_API_KEY` dans `.env.local`

### Étape 4 : Tester l'envoi d'email

#### Option A : Via le Dashboard SendGrid
1. Allez dans **Email API > Mail Send**
2. Envoyez un email test

#### Option B : Via votre application
1. Redémarrez votre serveur (`npm run dev`)
2. Allez sur votre site
3. Faites une commande test
4. Vérifiez votre boîte email

## 📊 Vérifier que tout fonctionne

### Dans SendGrid Dashboard

1. Allez dans **Activity**
2. Vous devriez voir les emails envoyés
3. Status : "Delivered" = ✅ Succès

### Dans votre application

1. Vérifiez la console du serveur
2. Vous devriez voir :
   ```
   Configuration de SendGrid avec la clé API
   Début de la fonction POST pour l'envoi d'emails
   Tentative d'envoi des emails de commande...
   Emails de commande envoyés avec succès!
   ```

## 🔧 En cas de problème

### Problème : "Unverified Sender"

**Solution** :
1. Allez dans SendGrid > Sender Authentication
2. Vérifiez que `sylvaindebisca@gmail.com` est vérifié
3. Si non vérifié, suivez l'Étape 2 ci-dessus

### Problème : "API Key invalid"

**Solution** :
1. Allez dans SendGrid > Settings > API Keys
2. Créez une nouvelle clé
3. Remplacez `SENDGRID_API_KEY` dans `.env.local`
4. Redémarrez le serveur

### Problème : "Email goes to spam"

**Solution** :
1. Ajoutez votre domaine (Domain Authentication)
2. Configurez SPF, DKIM, DMARC
3. Utilisez un domaine professionnel (ex: info@coquelicot.com)

## 📋 Checklist finale

Avant de tester les commandes, vérifiez :

- [ ] Compte SendGrid créé
- [ ] Email `sylvaindebisca@gmail.com` vérifié dans SendGrid
- [ ] API Key créée et copiée dans `.env.local`
- [ ] Serveur redémarré (`npm run dev`)
- [ ] Pas d'erreur dans la console du serveur

## 🎯 Test final

1. Ajoutez un produit au panier
2. Allez sur `/checkout`
3. Remplissez le formulaire
4. Sélectionnez une date/heure de retrait
5. Cliquez sur "Confirmer la commande"
6. **Résultat attendu** :
   - Redirection vers `/checkout/confirmation`
   - Email reçu dans la boîte de sylvaindebisca@gmail.com
   - Email de confirmation au client

## 💰 Coûts SendGrid

- **Plan gratuit** : 100 emails/jour
- **Essentials** (15€/mois) : 50 000 emails/jour
- Pour votre pâtisserie, le plan gratuit suffit largement !

## 📞 Support

Si vous avez des problèmes :
1. Consultez https://docs.sendgrid.com/
2. Dashboard SendGrid > Activity pour voir les logs
3. Console serveur pour les erreurs détaillées


