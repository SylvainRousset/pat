# 🔄 Annuler un Commit sur Git

## ✅ Bonne Nouvelle

Si vous **n'avez PAS encore push**, c'est très simple à annuler. Rien n'est perdu !

## 🎯 Avec Git Desktop

### Méthode 1 : Annuler le dernier commit

1. Ouvrez **Git Desktop**
2. Allez dans **History** (historique)
3. Cherchez votre **dernier commit** (en haut)
4. **Clic droit** sur le commit
5. Cliquez sur **Revert commit** ou **Undo commit**

### Méthode 2 : Reset (plus direct)

1. Dans Git Desktop, allez dans **View** → **Show Command Palette**
2. Ou utilisez : **Ctrl + Shift + P**
3. Tapez : `reset`
4. Sélectionnez **Reset to commit**
5. Choisissez le commit d'avant votre dernier commit

## 💻 Avec la Ligne de Commande

### Annuler le dernier commit (garder les modifications)

```bash
git reset --soft HEAD~1
```

Cela annule le commit mais **garde tous vos changements** dans votre workspace.

### Annuler et perdre les modifications

```bash
git reset --hard HEAD~1
```

⚠️ **Attention** : Cela efface aussi toutes vos modifications !

## 🔍 Vérifier l'état

```bash
git status
```

Vérifiez que vos fichiers sont bien là.

## 📋 Ce qui se passe

### `git reset --soft HEAD~1`
- ✅ Annule le commit
- ✅ Garde vos changements
- ✅ Les fichiers sont toujours modifiés (prêt à recommitter)

### `git reset --hard HEAD~1`
- ✅ Annule le commit
- ❌ Efface vos modifications
- ⚠️ Impossible de récupérer après

## ✅ Recommandation

**Utilisez `--soft`** pour garder vos changements :

```bash
git reset --soft HEAD~1
```

Ensuite, vous pouvez :
- Recommitter avec un nouveau message
- Modifier vos fichiers
- Ou annuler complètement si besoin

## 🎯 Suite

Après avoir annulé le commit :

1. Vérifiez avec `git status`
2. Vos fichiers doivent apparaître comme "modified"
3. Modifiez ce que vous voulez
4. Recommittez quand vous êtes prêt

---

**Rien n'est perdu tant que vous n'avez pas push !** 😊

