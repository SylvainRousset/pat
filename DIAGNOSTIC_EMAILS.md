# 🔍 Diagnostic - Pourquoi les emails ne partent pas

## ❓ Vous n'avez pas reçu de mail ?

### Questions à vous poser :
1. **Le serveur a-t-il été redémarré ?**
   - Après modification de `.env.local` OU du code
   - Les variables ne sont lues qu'au démarrage

2. **Y a-t-il des erreurs dans la console du serveur ?**
   - Ouvrez le terminal où tourne `npm run dev`
   - Cherchez des messages d'erreur

3. **L'email est-il vérifié dans Mailjet ?**
   - Allez sur https://app.mailjet.com/account/senders
   - Vérifiez que `sylvaindebisca@hotmail.fr` est **Verified** et **Active**

## 🔍 Étapes de Diagnostic

### 1. Redémarrer le serveur

**IMPORTANT** : Après modification du code ou `.env.local`, le serveur DOIT être redémarré !

```bash
# Dans le terminal où tourne npm run dev
Ctrl + C  (arrêter)
npm run dev  (redémarrer)
```

### 2. Vérifier les logs du serveur

Après avoir fait une commande test, regardez dans le terminal du serveur.

**Vous devriez voir** :
```
✓ Configuration de Mailjet avec les clés API
✓ Début de la fonction POST pour l'envoi d'emails via Mailjet
✓ Tentative d'envoi des emails de commande via Mailjet...
✓ Emails de commande envoyés avec succès via Mailjet!
```

**Si vous voyez une erreur** :
```
❌ Configuration Mailjet manquante
❌ Authentication failed
❌ Sender not verified
```

→ Copiez-moi le message d'erreur exact

### 3. Vérifier dans Mailjet

1. Allez sur https://app.mailjet.com
2. Cliquez sur **Statistics** ou **Activity**
3. Cherchez vos emails envoyés

**Si rien dans Mailjet** :
- L'API n'a pas été appelée
- Problème de connexion
- Le code ne s'exécute pas

**Si dans Mailjet mais "Bounced"** :
- Email non vérifié
- Problème de délivrabilité

**Si dans Mailjet et "Delivered"** :
- Email parti de Mailjet
- Peut être dans vos spams
- Vérifiez toutes vos boîtes (inbox + spam)

### 4. Vérifier la boîte spam

- Hotmail a parfois des filtres agressifs
- Vérifiez vos **spams** et **indésirables**
- Cherchez "coquelicot" ou "réservation"

### 5. Tester l'API directement

Je peux créer un script de test pour vérifier Mailjet directement.

## 🚨 Solutions rapides

### Solution 1 : Redémarrer le serveur

```bash
Ctrl + C
npm run dev
```

### Solution 2 : Vérifier .env.local

```bash
# Vérifiez que ces lignes existent et sont correctes
cat .env.local
```

Devrait contenir :
```env
MAILJET_API_KEY=ce34e0bba2ac679110a741f583d8e304
MAILJET_SECRET_KEY=0d71ff7d6235a3e44139a9d64a04181c
```

### Solution 3 : Vérifier Mailjet

https://app.mailjet.com/account/senders
- `sylvaindebisca@hotmail.fr` doit être **Verified** et **Active**

## 📞 Informations à me donner

Pour que je vous aide mieux, dites-moi :

1. **Message d'erreur exact** dans le terminal du serveur
2. **Status dans Mailjet** (Delivered, Bounced, ou rien?)
3. **Le serveur a-t-il été redémarré** après les dernières modifications ?

## 🎯 Test rapide

Essayez de refaire une commande ET regardez en temps réel dans :
- Terminal serveur → Logs
- Mailjet Dashboard → Activity
- Boîte email (inbox + spam)

Ensuite dites-moi ce que vous voyez !

