# 🚀 Déploiement sur Vercel - Configuration Sécurisée

## ✅ Important : Variables d'Environnement

**NE JAMAIS push `.env.local` sur Git !** Ce fichier est déjà ignoré par `.gitignore`.

Les clés secrètes doivent être configurées **UNIQUEMENT** dans le dashboard Vercel.

## 🔐 Variables à Configurer dans Vercel

### 1. Aller sur Vercel Dashboard

1. Connectez-vous sur https://vercel.com
2. Allez dans votre projet
3. Cliquez sur **Settings**
4. Cliquez sur **Environment Variables**

### 2. Ajouter les Variables

Cliquez sur **Add New** pour chaque variable :

#### ✅ Variables REQUISES

| Nom | Valeur | Où la trouver |
|---|---|---|
| `MAILJET_API_KEY` | `ce34e0bba2ac679110a741f583d8e304` | Dans .env.local |
| `MAILJET_SECRET_KEY` | `0d71ff7d6235a3e44139a9d64a04181c` | Dans .env.local |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `dfecje8rj` | Dans .env.local |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | `535452689188371` | Dans .env.local |
| `CLOUDINARY_API_SECRET` | `Ba9GIE9345L7IJ5NlAn0Z5bqFSQ` | Dans .env.local |

**⚠️ Important** : Pour chaque variable, sélectionnez **Production**, **Preview**, et **Development** pour qu'elle soit disponible partout.

### 3. Vérifier que .gitignore est correct

Vérifiez que votre `.gitignore` contient :

```
.env.local
.env*.local
```

## 📝 Checklist Déploiement

### Avant de push

- [x] Vérifier que `.env.local` n'est PAS dans Git (déjà ignoré)
- [x] S'assurer que toutes les clés sont dans Vercel
- [x] Pas de clés secrètes dans le code
- [x] Code prêt à déployer

### Commandes Git

```bash
# Vérifier que .env.local n'est pas suivi
git status

# Si vous voyez .env.local, NE PAS push
# Il devrait être ignoré automatiquement

# Push sur GitHub
git add .
git commit -m "Mise en place badges saveurs dans emails"
git push origin main
```

### Déploiement Vercel

Si Vercel est connecté à votre GitHub, il déploiera automatiquement.

Sinon, connectez manuellement :
1. https://vercel.com/new
2. Importez votre repo GitHub
3. Vérifiez que les variables d'environnement sont configurées
4. Cliquez sur **Deploy**

## 🔍 Vérification Post-Déploiement

### 1. Tester l'application en production

Après déploiement, testez :
1. Créez une commande de test
2. Vérifiez que les emails partent bien
3. Vérifiez que les badges s'affichent correctement

### 2. Vérifier dans Vercel

Dans le dashboard Vercel > votre projet > **Logs** :
- Regardez les logs de déploiement
- Pas d'erreur "Configuration Mailjet manquante"
- Les variables sont bien chargées

### 3. Vérifier Mailjet

Dans Mailjet > **Activity** :
- Voir que les emails sont envoyés
- Status "Delivered" = ✅ Succès

## ⚠️ Sécurité

### ✅ À FAIRE
- ✅ Configurer les variables dans Vercel Dashboard
- ✅ .env.local reste local (ne pas push)
- ✅ Clés API jamais dans le code source
- ✅ Vérifier `.gitignore`

### ❌ À NE JAMAIS FAIRE
- ❌ Push `.env.local` sur Git
- ❌ Copier-coller les clés dans un message/public
- ❌ Commit les clés dans le code
- ❌ Partager les clés publiquement

## 🎯 Variables Prévues pour Vercel

Copiez-collez ces valeurs dans Vercel (sans les guillemets) :

```
MAILJET_API_KEY=ce34e0bba2ac679110a741f583d8e304

MAILJET_SECRET_KEY=0d71ff7d6235a3e44139a9d64a04181c

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dfecje8rj

NEXT_PUBLIC_CLOUDINARY_API_KEY=535452689188371

CLOUDINARY_API_SECRET=Ba9GIE9345L7IJ5NlAn0Z5bqFSQ
```

## 🔄 Redéploiement

Si vous modifiez les variables d'environnement dans Vercel :
1. Allez dans **Settings > Environment Variables**
2. Modifiez ou ajoutez les variables
3. **Redéployez** le site (automatique ou manuel)

## 📞 En cas de problème

### Erreur "Configuration Mailjet manquante"
- Vérifiez que les variables sont bien dans Vercel
- Vérifiez que l'environnement est sélectionné (Production/Preview/Development)

### Emails ne partent pas en production
- Vérifiez Mailjet Dashboard > Activity
- Vérifiez les logs Vercel pour les erreurs

---

**Une fois les variables configurées dans Vercel, vous pouvez push sans crainte !** 🔐

