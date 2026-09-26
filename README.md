# Thème Shopify « Pure Source »

Thème Shopify complet (Online Store 2.0) pour une boutique mono-produit de type « fontaine à eau pour animaux ». Il reprend la **structure** des boutiques de ce genre : bannière, réassurance, comparatif, avis, garantie, FAQ, offres par quantité…
Les textes sont des exemples génériques en français et **tout est modifiable dans l'éditeur de thème Shopify**, sans toucher au code.

> Remplacez les textes d'exemple, les avis et les chiffres par **vos propres contenus** (vrais avis clients, vraies statistiques, vos photos). N'utilisez pas les textes, photos ou marques d'un autre site.

---

## 1. Installer le thème sur Shopify

### Option A : connexion GitHub (recommandée, mises à jour automatiques)
1. Dans Shopify : **Boutique en ligne > Thèmes > Ajouter un thème > Connecter depuis GitHub**.
2. Choisissez le dépôt `Site-con-urent-` et la branche `claude/shopify-site-reproduction-zcui5r` (ou `main` après fusion).
3. Le thème apparaît dans la bibliothèque : cliquez sur **Personnaliser**, puis **Publier** quand il est prêt.

### Option B : fichier ZIP
1. Compressez **le contenu** du dossier (les dossiers `assets`, `config`, `layout`, `locales`, `sections`, `snippets`, `templates` doivent être à la racine du ZIP, pas dans un sous-dossier).
   ```bash
   zip -r pure-source.zip assets config layout locales sections snippets templates
   ```
2. Shopify : **Boutique en ligne > Thèmes > Ajouter un thème > Importer un fichier ZIP**.

### Option C : Shopify CLI
```bash
npm install -g @shopify/cli
shopify theme dev --store votre-boutique.myshopify.com   # aperçu local
shopify theme push --unpublished                          # envoi sur la boutique
```

---

## 2. Mise en route (10 minutes)

1. **Créer le produit** (Produits > Ajouter) avec ses photos et ses variantes (ex. « Capacité : 4 L / 7 L »).
2. **Page d'accueil** : Personnaliser > section **Produit en vedette** > choisir le produit.
3. **Logo et couleurs** : section **En-tête** (logo) et **Paramètres du thème** (couleurs, polices, arrondis).
4. **Menus** : Boutique en ligne > Navigation. Le thème utilise `main-menu` (en-tête) et `footer` (pied de page).
5. **Pages** : créez « Contact », « FAQ », « À propos » et attribuez les modèles `page.contact`, `page.faq`, `page.about`.
6. **Réseaux sociaux** : Paramètres du thème > Réseaux sociaux.
7. **Livraison gratuite** : Paramètres du thème > Panier > seuil de la barre de progression.

---

## 3. Ce qui est modifiable

### Paramètres globaux (Personnaliser > Paramètres du thème)
- Couleurs (fond, texte, boutons, accent, promo, étoiles…)
- Polices des titres et du texte, tailles
- Largeur de page, arrondi des boutons et des cartes, animations
- Badge promo (%, montant ou texte), étoiles sur les cartes produit
- Panier : tiroir latéral ou page, barre livraison gratuite, note de commande, texte de réassurance
- Réseaux sociaux, favicon

### Sections disponibles (ajoutables sur n'importe quelle page)
| Section | Usage |
|---|---|
| Barre d'annonces | Messages défilants en haut (livraison, garantie…) |
| Bandeau compte à rebours | Offre du jour ou date de fin précise |
| En-tête / Pied de page | Logo, menus, newsletter, paiements, pays/langue |
| Bannière principale | Grande image + note, titre, avantages, boutons |
| Texte défilant | Bandeau de réassurance animé |
| Logos / « Vu dans » | Logos presse ou partenaires |
| Image avec texte | Image ou vidéo + titre, texte, points clés, bouton |
| Atouts autour du produit | Image centrale entourée des caractéristiques |
| Cartes avec image | Étapes « comment ça marche », bénéfices |
| Chiffres clés | Statistiques (93 %, etc.) |
| Tableau comparatif | Vous vs une alternative, avec icônes ✓ / ✗ |
| Témoignages clients | Carrousel d'avis avec photos et note globale |
| Garantie | Badge « 365 jours » + texte |
| Icônes / réassurance | Grille d'icônes (livraison, retours, paiement…) |
| FAQ | Questions dépliables + données structurées SEO |
| Produit en vedette | Fiche d'achat complète sur l'accueil |
| Collection en vedette / Liste de collections | Grilles de produits |
| Vidéo | Vidéo Shopify, YouTube ou Vimeo |
| Texte enrichi, Newsletter, Formulaire de contact | Pages de contenu |
| Code personnalisé, Applications | Widgets d'apps (avis, Instagram…) |

### Blocs de la fiche produit (glisser-déposer pour réordonner)
Sur-titre · Titre · Note/avis · Prix · Texte · Description · Liste d'avantages · Sélecteur de variantes (boutons ou liste, pastilles de couleur) · **Offres par quantité** (1/2/3 unités avec remise) · Indicateur de stock · Estimation de livraison · Encadré · Quantité · Boutons d'achat (+ paiement express) · Ligne de réassurance · Moyens de paiement · Image · Onglets dépliables · Code personnalisé · Blocs d'applications.

La fiche produit inclut aussi une galerie avec miniatures, une **barre d'ajout collante** au défilement et les données structurées Google (Product).

---

## 4. Points importants

- **Offres par quantité** : la remise affichée est visuelle. Créez la réduction correspondante dans **Réductions > Réduction automatique > Achetez X, obtenez une remise** pour qu'elle s'applique au paiement.
- **Avis clients** : si vous installez une app d'avis (Judge.me, Loox, Shopify Product Reviews…), les étoiles utilisent automatiquement les métachamps `reviews.rating` et `reviews.rating_count`. Ajoutez le widget d'avis via la section **Applications** ou un bloc d'app.
- **Multi-devises** : le seuil de livraison gratuite est dans la devise principale de la boutique.
- **Langues** : français (par défaut) et anglais inclus (`locales/`). Les textes des sections se traduisent avec l'app gratuite **Translate & Adapt**.

---

## 5. Structure des fichiers

```
assets/      base.css (styles), theme.js (panier AJAX, variantes, carrousels…)
config/      settings_schema.json (réglages du thème), settings_data.json
layout/      theme.liquid, password.liquid
locales/     fr.default.json, en.json
sections/    toutes les sections + groupes en-tête / pied de page
snippets/    composants réutilisables (carte produit, prix, étoiles, icônes…)
templates/   modèles JSON (accueil, produit, collection, panier, pages, compte client…)
```

Le thème est validé avec `shopify theme check` (0 erreur).
