# 🎯 ÉTAPES FINALES - Configuration Mailjet

## 1️⃣ Créer un compte Mailjet

👉 https://app.mailjet.com/signup

- Plan gratuit : 6000 emails/mois
- Support en français
- Confirmez votre email après inscription

## 2️⃣ Obtenir vos clés API

1. Connectez-vous : https://app.mailjet.com
2. Allez dans : **Account Settings > API Keys** (ou https://app.mailjet.com/account/apikeys)
3. Copiez les deux clés :
   - **API Key** (commence par des chiffres)
   - **Secret Key** (clé longue aléatoire)

## 3️⃣ Configurer .env.local

Ouvrez le fichier `.env.local` et remplacez :

```env
MAILJET_API_KEY=VOTRE_API_KEY_ICI
MAILJET_SECRET_KEY=VOTRE_SECRET_KEY_ICI
```

Par vos vraies clés obtenues à l'étape 2.

## 4️⃣ Vérifier l'adresse email

1. Dans Mailjet : **Senders** (https://app.mailjet.com/account/senders)
2. Cliquez sur **Add a sender**
3. Email : `sylvaindebisca@gmail.com`
4. Name : `Pâtisserie Coquelicot`
5. Validez l'email de confirmation que Mailjet vous envoie

## 5️⃣ Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl + C)
npm run dev
```

## 6️⃣ Tester !

1. Allez sur votre site
2. Ajoutez des produits au panier
3. Aller sur `/checkout`
4. Remplissez le formulaire
5. Cliquez sur "Confirmer la commande"

✅ **Résultat attendu** :
- Redirection vers `/checkout/confirmation`
- Email reçu dans sylvaindebisca@gmail.com
- Email de confirmation au client

## 📋 Checklist

- [ ] Compte Mailjet créé
- [ ] Clés API copiées dans `.env.local`
- [ ] Email `sylvaindebisca@gmail.com` vérifié dans Mailjet
- [ ] Serveur redémarré
- [ ] Test de commande effectué

## 📞 Besoin d'aide ?

Consultez :
- `GUIDE_MIGRATION_MAILJET.md` → Guide complet
- Console du serveur → Logs détaillés
- Dashboard Mailjet → Statistiques emails

---

**Temps estimé** : 5-10 minutes total 🚀


