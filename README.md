# SHOPS Boutiques — Site vitrine

Site vitrine premium, statique (HTML/CSS/JS pur, **aucune dépendance à installer**).

## Ouvrir le site

Double-cliquez sur `index.html`, ou pour un rendu 100 % fidèle (la carte Google et les polices se chargent mieux via un serveur local) :

```bash
# Python (déjà installé sur beaucoup de machines)
python -m http.server 8000
# puis ouvrez http://localhost:8000
```

## Structure

```
site-vitrine/
├── index.html        → contenu et structure de toutes les sections
├── css/style.css     → design, palette, animations, responsive, dark mode
├── js/main.js        → interactions (loader, curseur, slider, lightbox, formulaire…)
└── assets/           → déposez ici vos vraies images (voir ci-dessous)
```

## À personnaliser (important)

1. **Images.** Vos vraies photos sont déjà intégrées (dans `assets/`). Répartition actuelle :

   | Fichier | Contenu | Emplacement sur le site |
   |---|---|---|
   | `logo.png` | logo rond | navbar, footer, favicon |
   | `hero.jpg` | look devant le fleuriste | fond du hero + galerie |
   | `boutique-1.jpg` | intérieur (boho) | « À propos » (grande image) |
   | `devanture.jpg` | devanture (2 vitrines) | « À propos » (vignette) + galerie |
   | `boutique-2.jpg` | intérieur (arche pierre) | galerie |
   | `look-2.jpg` | jupe satin + baskets | carte « Prêt-à-porter » |
   | `sac-2.jpg` | sac cuir (gros plan) | carte « Maroquinerie & sacs » |
   | `bijoux.jpg` | bracelets cristal | carte « Accessoires » + galerie |
   | `look-4.jpg` | look assis + mocassins | carte « Conseil en style » |
   | `sac.jpg` | pull beige + sac | galerie |
   | `look-3.jpg` | pull fleurs + sac damier | galerie |
   | `devanture-2.jpg` | 2ᵉ devanture | *(en réserve, non utilisée)* |

   Pour changer une photo : remplacez le fichier dans `assets/` en gardant le même nom (ou
   modifiez l'`url("../assets/…")` correspondante dans `css/style.css`). Format **WebP** ~1600 px
   conseillé pour la performance.

   > 🗺️ **Carte Google** : l'iframe se charge une fois le site en ligne. Si elle reste bloquée,
   > un repli cliquable « Ouvrir dans Google Maps » s'affiche automatiquement à la place.

2. **Email.** Remplacez `contact@shops-boutiques.fr` (dans `index.html`) par votre vraie adresse.

3. **Horaires.** Ceux affichés (Mar–Sam 10h–19h) sont indicatifs — corrigez-les dans `index.html`
   (sections « Informations pratiques » et footer).

4. **Réseaux sociaux.** Les liens Facebook / TikTok / Snapchat / LinkedIn / YouTube pointent vers `#`.
   Remplacez par vos vraies URL. Instagram est déjà branché sur `shops.boutiques`.

5. **Formulaire de contact.** Il valide les champs côté navigateur mais **n'envoie rien** pour l'instant
   (pas de serveur). Deux options simples et gratuites :
   - [Formspree](https://formspree.io) : remplacez `<form id="contactForm" novalidate>` par
     `<form id="contactForm" action="https://formspree.io/f/VOTRE_ID" method="POST" novalidate>`.
   - [Web3Forms](https://web3forms.com) : idem avec leur clé.

6. **Mentions légales / confidentialité.** À rédiger (obligatoire en France). Créez `mentions-legales.html`
   et faites pointer les liens du footer dessus.

## Mettre le site en ligne (gratuit)

- **Netlify** : glissez-déposez le dossier `site-vitrine` sur [app.netlify.com/drop](https://app.netlify.com/drop).
- **GitHub Pages** : poussez le dossier sur un dépôt, activez Pages dans les réglages.
- **Vercel / Cloudflare Pages** : import du dossier, aucune config.

## Bonnes pratiques déjà en place

Responsive mobile/tablette/desktop · SEO (meta, Open Graph, données structurées ClothingStore) ·
accessibilité (labels, aria, focus, `prefers-reduced-motion`) · dark mode persistant ·
lazy-loading de la carte · animations optimisées `requestAnimationFrame` (60 FPS).
