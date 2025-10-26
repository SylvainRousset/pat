# 📧 Pourquoi les emails vont dans Spam + Solutions

## 🔴 Pourquoi ça arrive

### Causes principales
1. **Email d'expédition non professionnel** : `hotmail.fr` ou `gmail.com` → Spam
2. **Pas de SPF/DKIM** : Le domaine n'est pas authentifié
3. **Reputation du domaine** : Nouveau domaine = méfiance
4. **Contenu** : Mots-clés déclencheurs ("commande", "prix", etc.)
5. **Compte Mailjet gratuit** : Moins de "réputation" qu'un plan payant

## ✅ Solutions (du plus simple au plus avancé)

### 🔵 Solution 1 : Ajouter dans les contacts

Demandez à vos clients d'ajouter `sylvaindebisca@hotmail.fr` dans leurs contacts. Ça aide beaucoup !

### 🔵 Solution 2 : Utiliser un domaine personnalisé ⭐ RECOMMANDÉ

**Avantages** :
- 📈 Meilleure délivrabilité (+50%)
- 💼 Plus professionnel
- 🔒 Vérification SPF/DKIM plus facile

**Ce qu'il faut** :
1. Acheter un domaine (ex: `coquelicot.fr`) ~ 10€/an
2. Configurer DNS dans Mailjet
3. Vérifier le domaine
4. Utiliser `contact@coquelicot.fr` ou `info@coquelicot.fr`

### 🔵 Solution 3 : Configurer SPF (gratuit)

Même avec hotmail.fr, vous pouvez améliorer en configurant SPF.

Dans votre domaine (si vous en avez un) :
```
DNS : TXT record
Name: @
Value: v=spf1 include:spf.mailjet.com ~all
```

### 🔵 Solution 4 : Upgrade Mailjet (payant)

Plan Essentials (15€/mois) :
- Meilleure délivrabilité
- Statut serveur amélioré
- Support prioritaire

## 🎯 Solutions IMMÉDIATES (gratuit)

### 1. Ajouter un préfixe au sujet

Actuellement : `Nouvelle commande #...`
Mieux : `[Coquelicot] Nouvelle commande #...`

### 2. Réduire les mots déclencheurs

Éviter :
- ❌ "Commande"
- ❌ "Prix"
- ❌ "Gagner"
- ❌ "Gratuit"

Utiliser plutôt :
- ✅ "Réservation"
- ✅ "Votre création"
- ✅ "Retrait"

### 3. Ajouter un texte clair en haut

```
Cet email vous a été envoyé depuis votre réservation.
Si vous n'avez pas effectué de réservation, ignorez cet email.
```

### 4. Utiliser un nom dans l'Email From

Actuellement : `sylvaindebisca@hotmail.fr`
Mieux : `Pâtisserie Coquelicot <sylvaindebisca@hotmail.fr>`

## 🔧 Modifications de code possibles

### Option A : Améliorer le From name
Je peux modifier le code pour afficher "Pâtisserie Coquelicot" comme nom.

### Option B : Changer le sujet
Je peux modifier le sujet pour éviter les mots déclencheurs.

### Option C : Ajouter un texte d'avertissement
Je peux ajouter du texte en haut de l'email pour rassurer.

## 💡 Ma recommandation

### Court terme (gratuit - maintenant)
1. Ajouter dans From : `Pâtisserie Coquelicot <sylvaindebisca@hotmail.fr>`
2. Demander aux clients d'ajouter à leurs contacts
3. Dire aux clients de vérifier leurs spams

### Long terme (meilleure solution)
1. Acheter un domaine : `coquelicot.fr`
2. Configurer DNS dans Mailjet
3. Utiliser `contact@coquelicot.fr`
4. Délivrabilité +50%

## 🚀 Voulez-vous que je modifie le code maintenant ?

Je peux améliorer :
- ✅ Le From name ("Pâtisserie Coquelicot" au lieu de juste l'email)
- ✅ Le sujet des emails
- ✅ Ajouter un texte d'information

**Dites-moi si vous voulez que je fasse ces modifications !**

