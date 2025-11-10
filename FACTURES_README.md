# 📄 Système de Génération de Factures

## Fonctionnalité

Le système permet de générer et télécharger des factures PDF professionnelles pour chaque commande depuis la page de gestion des commandes admin.

## Accès

Deux méthodes pour télécharger une facture :

### 1. Depuis la carte de commande
- Bouton **"Facture"** directement sur chaque carte de commande
- Icône de téléchargement avec le texte "Facture" (visible sur desktop)
- Téléchargement immédiat sans ouvrir la modal

### 2. Depuis les détails de la commande
- Ouvrir les détails d'une commande en cliquant dessus
- Bouton **"Facture PDF"** en bas de la modal
- Bouton avec icône de téléchargement et texte explicite

## Contenu de la facture

La facture générée contient :

### En-tête
- Logo et nom de la pâtisserie
- Informations de contact
- Titre "FACTURE"
- Numéro de commande
- Date de la commande

### Informations client
- Nom et prénom
- Email
- Téléphone
- Date et heure de retrait

### Tableau des articles
Pour chaque produit :
- Nom du produit
- Détails (saveurs, portions)
- Quantité
- Prix unitaire
- Total par ligne

### Total
- Total TTC bien visible

### Pied de page
- Message de remerciement
- Informations légales (TVA, conditions de paiement)

## Style

La facture utilise la palette de couleurs du site :
- **Couleur principale** : #a75120 (marron caramel)
- **Couleur texte** : #421500 (marron foncé)
- **Fond clair** : #f8f5f0 (beige)

## Nom du fichier

Le fichier PDF est automatiquement nommé :
```
Facture_[NuméroCommande]_[NomClient].pdf
```

Exemple : `Facture_CMD-20241110-1234_Dupont.pdf`

## Technologies utilisées

- **jsPDF** : Génération de PDF côté client
- **jspdf-autotable** : Création de tableaux professionnels
- **TypeScript** : Typage strict pour la sécurité

## Avantages

✅ Génération instantanée (côté client)
✅ Aucune configuration serveur nécessaire
✅ Design professionnel et cohérent
✅ Responsive (boutons adaptés mobile/desktop)
✅ Informations complètes et structurées
✅ Conforme aux standards de facturation

## Personnalisation future

Pour modifier les informations de la pâtisserie, éditer le fichier :
`src/lib/generateInvoice.ts`

Sections modifiables :
- Nom de la pâtisserie
- Adresse
- Téléphone
- Email
- Informations légales (SIRET, TVA, etc.)

