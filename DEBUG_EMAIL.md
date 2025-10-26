# Guide de Debug pour les Emails

## Problème : "Erreur d'envoi d'email: Erreur générale lors de l'envoi des emails"

## ✅ Solution appliquée

Le fichier `.env.local` était dupliqué et corrompu. Il a été nettoyé et recréé proprement.

## 🔧 Actions à faire maintenant

### 1. **Redémarrer le serveur de développement**

Si votre serveur est en cours d'exécution :
- Appuyez sur `Ctrl + C` dans le terminal pour arrêter le serveur
- Relancez avec `npm run dev`

### 2. **Vérifier l'email d'expédition dans SendGrid**

L'email `sylvaindebisca@gmail.com` doit être vérifié dans SendGrid :

1. Connectez-vous à https://app.sendgrid.com/
2. Allez dans **Settings > Sender Authentication**
3. Vérifiez que `sylvaindebisca@gmail.com` est bien vérifié

Si ce n'est pas le cas :
1. Cliquez sur **Single Sender Verification**
2. Ajoutez `sylvaindebisca@gmail.com`
3. Vérifiez l'email que SendGrid vous envoie
4. Cliquez sur le lien de vérification

### 3. **Vérifier les logs dans la console**

Après redémarrer le serveur et tester une commande, regardez :
- Les logs du serveur Next.js dans le terminal
- La console du navigateur (F12 > Console)

Recherchez ces messages :
- "Configuration de SendGrid avec la clé API" ✅
- "Détails de l'erreur SendGrid" ❌ (si erreur)

### 4. **Erreurs SendGrid communes**

#### Erreur 403 : Permission Denied
→ La clé API n'a pas les bonnes permissions
→ Solution : Créer une nouvelle clé avec "Full Access"

#### Erreur 422 : Unverified Sender
→ L'email expéditeur n'est pas vérifié
→ Solution : Vérifier l'email dans SendGrid

#### Erreur 429 : Too Many Requests
→ Vous avez atteint la limite (100 emails/jour en gratuit)
→ Solution : Attendez 24h ou upgradez votre plan

## 📋 Vérifications finales

### Fichier .env.local
```env
# Le fichier doit contenir UNIQUEMENT ces lignes (sans duplication)

SENDGRID_API_KEY=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
ADMIN_EMAIL=sylvaindebisca@gmail.com
FROM_EMAIL=sylvaindebisca@gmail.com
```

### Dans SendGrid
- ✅ Email `sylvaindebisca@gmail.com` vérifié
- ✅ API Key créée avec "Full Access"
- ✅ Statut : Active (pas désactivée)

### En test
1. Ajouter des produits au panier
2. Aller sur `/checkout`
3. Remplir le formulaire
4. Cliquer sur "Confirmer la commande"
5. Vérifier que les emails partent

## 🐛 Si le problème persiste

### Ajouter plus de logs

Modifier `src/app/api/send-email/route.ts` pour ajouter plus de logs :

```typescript
console.log('Variables d\'environnement:', {
  hasKey: !!process.env.SENDGRID_API_KEY,
  keyLength: process.env.SENDGRID_API_KEY?.length,
  keyPrefix: process.env.SENDGRID_API_KEY?.substring(0, 5)
});
```

### Tester l'API directement

Créer un fichier `test-email.js` :

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('SG.czJm_H9JSryb9ZveEOe5IA...');

const msg = {
  to: 'sylvaindebisca@gmail.com',
  from: 'sylvaindebisca@gmail.com',
  subject: 'Test',
  text: 'Test email',
};

sgMail.send(msg)
  .then(() => console.log('Email sent'))
  .catch((error) => console.error(error));
```

Puis exécutez : `node test-email.js`

## 📧 Vérifier les emails reçus

1. Vérifiez la boîte de réception de `sylvaindebisca@gmail.com`
2. Vérifiez les spam/indésirables
3. Connectez-vous à SendGrid > Activity pour voir si l'email est parti

## 🔗 Liens utiles

- SendGrid Dashboard : https://app.sendgrid.com/
- Documentation SendGrid : https://docs.sendgrid.com/
- Dashboard Activity : https://app.sendgrid.com/email_activity


