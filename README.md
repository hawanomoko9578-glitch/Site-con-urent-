# Thème Shopify « Aqua Clone »

Thème Shopify complet qui reprend la mise en page, les couleurs et la structure de la page d'accueil et de la page produit du modèle. Tous les textes et toutes les images sont des **exemples** que vous remplacez dans l'éditeur de thème Shopify, sans toucher au code.

## Installation

**Option 1 : fichier zip**
1. Compressez le contenu de ce dossier (les dossiers `assets`, `config`, `layout`, `locales`, `sections`, `snippets` et `templates` doivent être à la racine du zip).
2. Dans Shopify, allez dans **Boutique en ligne → Thèmes → Ajouter un thème → Importer un fichier zip**.
3. Cliquez sur **Personnaliser** pour modifier les textes et les images.

**Option 2 : GitHub (recommandé)**
Dans **Boutique en ligne → Thèmes → Ajouter un thème → Se connecter à GitHub**, choisissez ce dépôt et cette branche. Chaque modification poussée sur GitHub se synchronise avec la boutique.

## Page d'accueil (`templates/index.json`)

| Section | Correspond à |
|---|---|
| Bandeau promo | « FALL SALE » avec le compte à rebours (en boucle ou jusqu'à une date précise) |
| En-tête | Menu, logo, recherche, compte et panier (transparent au-dessus de la bannière) |
| Bannière principale | Grande image, titre avec un mot en italique, note, bouton et coches |
| Bandeau défilant | Bande bleue qui défile avec les arguments |
| Image avec texte | « Pourquoi nous choisir ? » |
| Image avec texte (crème + vague) | « Le problème des gamelles » |
| Avant / Après | Comparaison ronde avec un curseur à glisser |
| Avantages autour image | 6 avantages répartis autour d'une image centrale |
| Texte (histoire) | L'histoire du fondateur |
| FAQ | Accordéon |
| Carrousel produits | Choisissez une collection |
| Pied de page | Nom de la marque qui défile, newsletter, Instagram et liens |

## Page produit (`templates/product.json`)

| Section | Correspond à |
|---|---|
| Produit principal | Galerie et vignettes, badge, note, étiquettes, cartes de variantes, bouton d'ajout au panier, infos d'expédition, icônes de confiance, cadeaux offerts, onglets déroulants et barre d'achat collante en bas |
| Bandeau défilant (bleu clair) | Arguments avec icônes |
| Chiffres clés | 97 %, 99 %, etc. sur fond bleu |
| Bienfaits (accordéon) | Image avec le badge rond qui tourne et les bienfaits dépliables |
| Avis clients | Photos qui défilent et cartes d'avis dans un carrousel |
| Nos standards | Image et 4 icônes |
| Vidéos clients | Vidéos avec une étiquette (vidéos uploadées dans Shopify) |
| Tableau comparatif | « Nous vs. les autres » : tapez `oui`, `non` ou `?` pour afficher une icône |
| Parcours (timeline) | Semaine 1 → Semaine 4+ |

## Réglages utiles

- **Couleurs** : Personnaliser → Paramètres du thème → Couleurs.
- **Onglet latéral « -15 € OFF »** : Paramètres du thème → Onglet latéral promo.
- **Sous-titres des variantes** (« Fontaine 4L », etc.) : bloc *Choix des variantes*, séparés par des virgules.
- **Icône d'une variante** : l'image associée à la variante dans l'admin produit.
- Toutes les sections peuvent être ajoutées, supprimées ou déplacées, sur n'importe quelle page.
