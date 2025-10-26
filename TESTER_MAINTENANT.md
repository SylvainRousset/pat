# ✅ Vérifier que l'Email est Vérifié (2 minutes)

## 1️⃣ Vérifier dans Mailjet

Retournez sur https://app.mailjet.com/account/senders

Vous devriez voir :
- `sylvaindebisca@gmail.com` ✅ **Verified** (ou **Vérifié**)
- État : **Active** (Actif)

Si c'est marqué "Unverified" ou "Unverified", il faut vérifier l'email :
1. Allez dans votre boîte email : `sylvaindebisca@gmail.com`
2. Cherchez un email de Mailjet (peut être dans spam)
3. Cliquez sur le lien de vérification dans l'email
4. Retournez dans Mailjet > Senders pour confirmer que c'est vérifié

## 2️⃣ Redémarrer le Serveur (IMPORTANT)

Les nouvelles variables d'environnement doivent être chargées.

### Dans votre terminal :
```bash
# Appuyez sur Ctrl + C pour arrêter le serveur
# Puis tapez :
npm run dev
```

**Attendez** que le serveur démarre (vous verrez "Ready" dans le terminal).

## 3️⃣ Tester une Commande

1. Ouvrez votre navigateur : http://localhost:3000
2. Allez sur la boutique et **ajoutez un produit au panier**
3. Cliquez sur le panier (icône panier en haut à droite)
4. Cliquez sur **"Passer la commande"**
5. Remplissez le formulaire :
   - Prénom : (mettez un prénom)
   - Nom : (mettez un nom)
   - Téléphone : (ex: 0612345678)
   - Email : (ex: votremail@example.com)
   - **Date de retrait** : Sélectionnez une date (pas dimanche)
   - **Heure de retrait** : Sélectionnez une heure (ex: 14h00)
6. Cliquez sur **"Confirmer la commande"**

## ✅ Résultat Attendu

- ✅ Redirection vers `/checkout/confirmation`
- ✅ Message "Commande confirmée !"
- ✅ Pas d'erreur rouge

## 🔍 Vérifier dans la Console

### Terminal du serveur (npm run dev)
Vous devriez voir :
```
✓ Configuration de Mailjet avec les clés API
✓ Début de la fonction POST pour l'envoi d'emails via Mailjet
✓ Tentative d'envoi des emails de commande via Mailjet...
✓ Emails de commande envoyés avec succès via Mailjet!
```

Si vous voyez ça = ✅ SUCCÈS !

### Console navigateur (F12)
- Pas d'erreur rouge
- Status 200 OK

## 📧 Vérifier les Emails

1. Allez dans https://app.mailjet.com
2. Cliquez sur **Statistics** ou **Activity**
3. Vous devriez voir :
   - Email envoyé vers l'admin
   - Email envoyé vers le client
   - Status : **Delivered** ou **"Accompli"**

## ❌ Si ça ne fonctionne PAS

Envoyez-moi :
1. Le message d'erreur EXACT du terminal
2. Le message d'erreur EXACT de la console navigateur (F12)
3. Un screenshot de la page Mailjet > Senders (pour voir l'état de l'email)

---

**Dites-moi ce qui se passe après avoir testé !** 🚀

