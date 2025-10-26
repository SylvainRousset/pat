# 📧 Configuration Mailjet - Guide Simple

## ✅ DÉJÀ FAIT
- Code de l'application prêt
- Clés API configurées dans `.env.local`
- Bibliothèque Mailjet installée

## 🎯 CE QU'IL VOUS RESTE À FAIRE (5 minutes)

### Étape 1 : Créer un compte Mailjet (si pas déjà fait)

1. Allez sur https://app.mailjet.com/signup
2. Remplissez le formulaire
3. Confirmez votre email
4. **Plan gratuit** : 6000 emails/mois

### Étape 2 : Vérifier l'adresse email d'expédition ⭐ IMPORTANT

**Sans cette étape, AUCUN email ne peut partir !**

1. Connectez-vous à https://app.mailjet.com
2. Dans le menu de gauche, cliquez sur **Senders** 
   (ou allez directement : https://app.mailjet.com/account/senders)
3. Cherchez si `sylvaindebisca@gmail.com` est dans la liste

#### Si l'email N'EST PAS dans la liste :

1. Cliquez sur le bouton **Add a single sender** ou **Add sender**
2. Remplissez le formulaire :
   ```
   Email Address: sylvaindebisca@gmail.com
   Name: Pâtisserie Coquelicot
   Company Name: Pâtisserie Coquelicot (ou votre nom)
   Website URL: votre-site.fr (optionnel)
   ```
3. Cliquez sur **Save** ou **Add sender**
4. Mailjet va vous envoyer un email de vérification à `sylvaindebisca@gmail.com`
5. **Important** : 
   - Ouvrez votre boîte email `sylvaindebisca@gmail.com`
   - Cherchez l'email de Mailjet (peut être dans spam)
   - Cliquez sur le lien de vérification dans l'email
6. Retournez sur Mailjet : l'email devrait maintenant être **Verified** (vérifié)

#### Si l'email EST dans la liste mais marqué "Unverified" :

1. Cliquez sur l'email
2. Un email de vérification sera renvoyé
3. Ouvrez votre boîte email et cliquez sur le lien

### Étape 3 : Redémarrer le serveur

Les clés API sont maintenant configurées, mais le serveur Next.js doit être redémarré pour charger les nouvelles variables.

```bash
# Dans votre terminal où tourne le serveur
# Appuyez sur Ctrl + C pour arrêter le serveur

# Puis relancez :
npm run dev
```

### Étape 4 : Tester !

1. Allez sur votre site (http://localhost:3000)
2. Ajoutez des produits au panier
3. Allez sur la page `/checkout`
4. Remplissez le formulaire :
   - Prénom, Nom
   - Téléphone, Email
   - Sélectionnez une date de retrait
   - Sélectionnez une heure de retrait
5. Cliquez sur **"Confirmer la commande"**

**Résultat attendu** :
- ✅ Pas d'erreur
- ✅ Redirection vers `/checkout/confirmation`
- ✅ Email reçu dans votre boîte `sylvaindebisca@gmail.com`
- ✅ Panier vidé

## 🔍 Vérifier que tout fonctionne

### Dans votre console (terminal serveur)
Vous devriez voir ces messages :
```
✅ Configuration de Mailjet avec les clés API
✅ Début de la fonction POST pour l'envoi d'emails via Mailjet
✅ Tentative d'envoi des emails de commande via Mailjet...
✅ Emails de commande envoyés avec succès via Mailjet!
```

### Dans Mailjet Dashboard
1. Allez sur https://app.mailjet.com
2. Cliquez sur **Statistics** ou **Activity** dans le menu
3. Vous devriez voir les emails envoyés
4. Status : **"Delivered"** = ✅ Succès

## ⚠️ Erreurs communes

### Erreur : "Configuration Mailjet manquante"
**Solution** : Vérifiez que `.env.local` contient bien :
```env
MAILJET_API_KEY=ce34e0bba2ac679110a741f583d8e304
MAILJET_SECRET_KEY=0d71ff7d6235a3e44139a9d64a04181c
```

### Erreur : "Sender not verified"
**Solution** : L'email `sylvaindebisca@gmail.com` n'est pas vérifié dans Mailjet
- Allez dans Mailjet > Senders
- Ajoutez l'email si absent
- Cliquez sur le lien de vérification dans l'email reçu

### Erreur : "Authentication failed"
**Solution** : Les clés API sont incorrectes
- Vérifiez que vous avez bien copié les clés dans `.env.local`
- Pas d'espace avant/après les clés
- Pas de guillemets autour des clés

## 📞 Résumé en 3 points

1. ✅ Vérifiez l'email dans Mailjet > Senders
2. ✅ Redémarrez le serveur (`npm run dev`)
3. ✅ Testez une commande sur votre site

## 🎯 Checklist

- [ ] Compte Mailjet créé
- [ ] Clés API copiées dans `.env.local` ✅ (Déjà fait)
- [ ] Email `sylvaindebisca@gmail.com` vérifié dans Mailjet
- [ ] Serveur redémarré (`npm run dev`)
- [ ] Test de commande effectué

## 📧 Besoin d'aide ?

Si vous avez un problème :
1. Regardez les messages dans la console du serveur
2. Regardez les messages dans la console du navigateur (F12)
3. Vérifiez dans Mailjet > Activity si les emails sont partis

Dites-moi si vous avez des questions ! 🚀

