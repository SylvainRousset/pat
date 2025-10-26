# Checklist SendGrid - Ce qu'il vous FAUT faire

## ✅ Déjà fait (vous n'avez rien à toucher)

- [x] Code d'envoi d'emails installé
- [x] Bibliothèque `@sendgrid/mail` installée
- [x] Fichier `.env.local` configuré avec la clé API
- [x] Adresses email configurées (sylvaindebisca@gmail.com)

## ⚠️ À FAIRE MAINTENANT dans SendGrid

### Étape 1 : Vérifier que l'email d'expédition est vérifié

**C'est LA chose la plus importante !**

1. Allez sur https://app.sendgrid.com
2. Connectez-vous à votre compte
3. Menu : **Settings > Sender Authentication**
4. Cherchez "Single Sender Verification"
5. Vérifiez si `sylvaindebisca@gmail.com` est dans la liste

#### Si il N'EST PAS dans la liste :
1. Cliquez sur **Verify a Single Sender**
2. Remplissez :
   - Email : `sylvaindebisca@gmail.com`
   - Nom : `Pâtisserie Coquelicot`
   - Adresse : `3 rue des prés du roi 64800 NAY`
3. Cliquez sur **Create**
4. Allez sur votre boîte email `sylvaindebisca@gmail.com`
5. Cherchez un email de SendGrid
6. **Cliquez sur le lien de vérification**

### Étape 2 : Vérifier que la clé API est active

1. Dans SendGrid : **Settings > API Keys**
2. Recherchez la clé commençant par `SG.czJm_H9JS...`
3. Vérifiez qu'elle est **Active** (pas "Deleted")

#### Si la clé n'existe pas :
1. Cliquez sur **Create API Key**
2. Nom : `Pâtisserie Coquelicot`
3. Permissions : **Full Access**
4. Copiez la clé générée
5. Remplacez dans `.env.local` :
   ```
   SENDGRID_API_KEY=NOUVELLE_CLE_ICI
   ```

### Étape 3 : Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl + C)
npm run dev
```

### Étape 4 : Tester

1. Allez sur votre site
2. Ajoutez un produit au panier
3. Aller sur `/checkout`
4. Remplissez le formulaire
5. Cliquez sur "Confirmer la commande"

**Résultat attendu** :
- ✅ Pas d'erreur
- ✅ Redirection vers `/checkout/confirmation`
- ✅ Email reçu dans la boîte de sylvaindebisca@gmail.com

## 🔍 Vérifier dans SendGrid

Après un test, allez dans **SendGrid > Activity** :
- Vous devriez voir les emails envoyés
- Status : "Delivered" = ✅ Succès
- Status : "Bounced" = ❌ Problème

## ❌ Erreurs communes

### "Unverified Sender"
→ L'email n'est pas vérifié dans SendGrid
→ **Solution** : Suivez l'Étape 1

### "API Key invalid"
→ La clé n'existe pas ou a été supprimée
→ **Solution** : Suivez l'Étape 2

### "Email not sent" sans message
→ Le serveur n'a pas été redémarré après la modification de `.env.local`
→ **Solution** : Redémarrez le serveur (Étape 3)

## 📊 Résumé

Pour que ça fonctionne, il vous faut :
1. ✅ Un compte SendGrid
2. ✅ Email `sylvaindebisca@gmail.com` vérifié dans SendGrid
3. ✅ API Key active dans SendGrid
4. ✅ Serveur redémarré

**Tout le code est déjà en place, il vous suffit juste de vérifier ces 3 choses dans SendGrid !**


