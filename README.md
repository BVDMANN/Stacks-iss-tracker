[README.md](https://github.com/user-attachments/files/28226326/README.md)
# 🛰️ STACKS-ISS-TRACKER — Global Space Command & Orbital Intelligence

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Tech](https://img.shields.io/badge/tech-Vanilla%20JS-yellow)

**STACKS-ISS-TRACKER** est un centre de commande spatial haute précision conçu pour le suivi en temps réel de la Station Spatiale Internationale (ISS) et la surveillance d'autres corps orbitaux majeurs. 

Loin d'être un simple tracker, IL transforme des flux de données brutes en une expérience immersive et institutionnelle, mêlant ingénierie logicielle, cartographie dynamique et éducation scientifique.

---

##  Fonctionnalités Clés

### 📡 Télémétrie en Temps Réel
- **Suivi Live** : Position (lat/lon), altitude et vitesse de l'ISS mises à jour toutes les 5 secondes via l'API Open-Notify.
- **Précision Géospatiale** : Calcul de la distance exacte entre l'utilisateur et la station via l'implémentation de la **formule de Haversine**.
- **Trajectoire Dynamique** : Affichage du sillage orbital de la station sur la carte.

###  Intelligence de Passage
- **Prédiction de Survol** : Calcul automatique du prochain passage visible de l'ISS au-dessus de la position exacte de l'utilisateur.
- **Détails d'Observation** : Heure précise, durée du passage et altitude estimée.

###  Registre Orbital & Fiches Techniques
- **Surveillance Multi-Satellites** : Suivi de corps célestes majeurs (Hubble, James Webb, Tiangong, Starlink).
- **Dossiers Techniques** : Fiches détaillées incluant l'opérateur, la masse, la date de lancement et la mission scientifique.
- **Simulation Orbitale** : Déplacement dynamique des satellites LEO sur la carte.

###  Hub Éducatif & Missions
- **L'Académie Spatiale** : Modules d'apprentissage sur la microgravité et l'architecture modulaire de l'ISS.
- **Dossiers de Missions** : Analyses détaillées des expéditions actuelles, objectifs de recherche et composition des équipages.

###  UX & Design Professionnel
- **Esthétique Cyber-Pro** : Interface "Platinum Silver & Electric Blue" avec effets de Glassmorphism.
- **Internationalisation (i18n)** : Switch complet et fluide entre le Français et l'Anglais.
- **Approche Mobile-First** : Ergonomie optimisée pour tous les écrans.

---

##  Stack Technique

- **Frontend** : HTML5 / CSS3 (CSS Grid, Flexbox, Animations Keyframes).
- **Logique** : JavaScript Vanilla (ES6+) — *Aucun framework lourd pour garantir une performance maximale et un chargement instantané.*
- **Cartographie** : [Leaflet.js](https://leafletjs.com/) avec tuiles sombres CartoDB et imagerie satellite ArcGIS.
- **Données** : API Open-Notify (avec système de fallback robuste pour éviter les interruptions de service).

---

##  Installation & Déploiement

### Localement
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/BVDMANN/Stacks-iss-tracker.git
   ```
2. Ouvrez le fichier `index.html` dans votre navigateur préféré.

### Déploiement GitHub Pages
1. Poussez vos modifications sur la branche `main`.
2. Allez dans **Settings** $\rightarrow$ **Pages**.
3. Sélectionnez la branche `main` et enregistrez.

---

## 📐 Architecture du Projet

```text
.
├── index.html    # Structure et DOM
├── style.css     # Design System & Animations
└── script.js    # Logique métier, API & Cartographie
```

---

##  Auteur

**Randy Boulingui**  
*Passionné de Systemes informatique .*

Ceci est le premier projet public de la série **STACKS** : construire des outils réels, optimiser la performance et automatiser.

---

© 2026 Stacks 
