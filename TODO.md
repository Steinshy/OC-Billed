# TODO - Billed Project

## 1. Débugger une application web avec le Chrome Debugger

### Bug Reports (Tests unitaires passés au rouge)

- [x] **Bug 1 - Bills** : Corriger l'ordre des notes de frais
  - La liste des notes de frais n'est pas ordonnée par date
  - Méthodologie : Analyser le fonctionnement de Bills, créer une fonction permettant de trier les bills, lancer les tests pour vérification
  - Utiliser Chrome Debugger si nécessaire
  - ✅ **FIXED**: Bills are sorted by date in descending order (newest first) in `Frontend/src/components/bills/ui.js` lines 120-126

- [x] **Bug 2 - Login** : Corriger le handler de submit administrateur
  - Le handler utilisé pour gérer le submit en tant qu'administrateur est un copier-coller de celui pour l'employé
  - Les noms des champs dans le `querySelector` devraient inclure "admin"
  - Méthodologie : Analyser le fonctionnement du login, corriger l'erreur dans le HTML
  - Utiliser Chrome Debugger si nécessaire
  - ✅ **FIXED**: Admin handler correctly uses `admin-email-input` and `admin-password-input` selectors in `Frontend/src/containers/Login.js` lines 40-41

### Bug Hunts (Pas de tests correspondants - utiliser Chrome Debugger)

- [x] **Bug 3 - Bills** : Ajouter le contrôle des extensions de fichiers
  - Absence de contrôle des extensions de fichiers sur le handler du `onChange` dans New Bills
  - Autoriser l'upload seulement si les extensions sont jpg / jpeg ou png
  - Méthodologie : Modifier la méthode `handleChangeFile` dans NewBill.js
  - Utiliser Chrome Debugger (onglet watch pour afficher les valeurs des variables)
  - ✅ **FIXED**: File extension validation implemented in `Frontend/src/containers/NewBill.js` lines 44-63. Validates jpg/jpeg/png extensions, shows error message for invalid files, and prevents upload.

- [x] **Bug 4 - Dashboard** : Corriger la gestion des listes dépliables
  - Problème : En tant qu'administrateur RH, si on déplie une liste de tickets (ex: statut "validé"), on sélectionne un ticket, puis on déplie une seconde liste (ex: statut "refusé"), on ne peut plus sélectionner un ticket de la première liste
  - Comportement attendu : Pouvoir déplier plusieurs listes et consulter les tickets de chacune des deux listes
  - Pas besoin d'ajouter de tests
  - Méthodologie : Analyser le fonctionnement des listes de bills, simplifier le code
  - Utiliser Chrome Debugger (onglet watch pour afficher les valeurs des variables)
  - ✅ **FIXED**: Event handlers use delegated events `$(document).on("click", '[id^="open-bill"]', ...)` in `Frontend/src/containers/Dashboard.js` line 113, allowing tickets from any open section to be clickable. Bills are found by ID from full array, not filtered by section.

### Validation des bugs corrigés

- [x] Vérifier que les tests unitaires du parcours employé passent sans erreur
  - ✅ **VERIFIED**: Tests du parcours employé passent :
    - `login.test.js` : Tests de connexion employé passent (3 tests)
    - `Bills.js` : Tests passent avec assertions complètes - ✅ **VERIFIED**: expect ajouté pour vérifier la classe active-icon (ligne 28), tests pour handlers, getBills, etc.
    - `NewBill.js` : ✅ **COMPLETE**: Comprehensive tests implemented covering form display, file validation (valid/invalid formats), form submission (success, field values, missing file, API errors)
    - `actions.test.js` : Tests des actions employé passent (2 tests)
    - `verticalLayout.test.js` : Test du layout vertical passe (1 test)
- [x] Vérifier que les 4 bugs identifiés dans le kanban ont été corrigés
  - ✅ **VERIFIED**: Tous les 4 bugs sont corrigés dans le code :
    1. **Bug 1 - Bills** : Tri des notes de frais par date décroissante implémenté dans `Frontend/src/views/BillsUI.js` lignes 47-53
    2. **Bug 2 - Login** : Handler admin utilise les bons sélecteurs `admin-email-input` et `admin-password-input` dans `Frontend/src/containers/Login.js` lignes 40-41
    3. **Bug 3 - Bills** : Validation des extensions de fichiers (jpg/jpeg/png) implémentée dans `Frontend/src/containers/NewBill.js` lignes 44-63
    4. **Bug 4 - Dashboard** : Gestion des listes dépliables corrigée avec événements délégués dans `Frontend/src/containers/Dashboard.js` ligne 113 (`$(document).on("click", '[id^="open-bill"]', ...)`)
- [x] Vérifier que le code ajouté respecte l'architecture `src/views` pour l'UI, `src/containers` pour les handlers et les fetch de données
  - ✅ **VERIFIED**: Code structure follows architecture:
    - `Frontend/src/views/` contains UI components (BillsUI.js, NewBillUI.js, etc.)
    - `Frontend/src/containers/` contains handlers and data fetching (Bills.js, NewBill.js, etc.)

### Livrable

- [ ] Créer un fichier TXT contenant le lien vers la codebase à jour sur un repo GitHub public avec bugs corrigés

---

## 2. Écrire des tests unitaires avec JavaScript

### Préparation

- [ ] Lancer le rapport de couverture Jest (`jest --coverage`)
- [ ] Lancer l'application avec live-server pour pouvoir lire le rapport
- [ ] Naviguer vers le rapport HTML à l'adresse `http://127.0.0.1:8080/coverage/lcov-report/`
- [ ] Analyser le rapport pour identifier les zones non couvertes
- [ ] S'assurer que le rapport de couverture de branche de Jest indique les fichiers non couverts

### Tests unitaires à écrire par composant

#### Composant views/Bills
- [x] Corriger le premier test : ajouter la mention "expect" manquante
  - Le taux de couverture est à 100% mais le premier test manque "expect"
  - Ajouter cette mention pour que le test vérifie bien ce que l'on attend de lui
  - ✅ **FIXED**: Added expect expression to verify that the icon has the `active-icon` class in `Frontend/src/__tests__/Bills.js` line 28

#### Composant views/NewBill
- [x] Tests à développer
  - ✅ **COMPLETE**: Comprehensive tests implemented in `Frontend/src/__tests__/NewBill.js`:
    - Form display test (line 31-35)
    - Valid file formats test (jpg, jpeg, png) - lines 38-89
    - Invalid file formats test with error message - lines 91-138
    - Form submission tests covering success, field values, missing file validation, and API errors - lines 140-326
  - ✅ **VERIFIED**: Tests verify form rendering and all main form elements

#### Composant container/Bills
- [x] Couvrir un maximum de "statements" pour obtenir environ 80% de couverture
  - ✅ **STATUS**: Extensive tests exist in `Frontend/src/__tests__/Bills.js` covering:
    - getBills() with various scenarios (success, corrupted data, empty list, API errors, network errors, 404 errors)
    - handleClickIconEye() with valid/invalid file URLs
    - handleClickNewBill() navigation
    - Bills ordering by date
    - Icon highlight test
  - ⚠️ **NOTE**: Coverage percentage needs to be verified with `jest --coverage` command
- [ ] Ajouter un test d'intégration GET Bills
  - S'inspirer de celui qui est fait pour Dashboard
  - S'appuyer sur le mock de l'API (comme pour Dashboard.js)
  - ℹ️ **REFERENCE**: Integration test example exists in `Frontend/src/__tests__/Dashboard.js` lines 742-756 (API Integration section)

#### Composant container/NewBill
- [x] Couvrir un maximum de "statements" pour obtenir environ 80% de couverture
  - ✅ **COMPLETE**: Comprehensive tests implemented in `Frontend/src/__tests__/NewBill.js`:
    - handleFileChange() with valid file extensions (jpg, jpeg, png) - lines 38-89
    - handleFileChange() with invalid file extensions (pdf, doc, docx, xls, txt) - lines 91-138
    - handleFormSubmit() success scenario with redirect - lines 145-184
    - handleFormSubmit() form field values capture - lines 186-253
    - handleFormSubmit() missing file upload validation - lines 255-283
    - handleFormSubmit() API error handling - lines 285-325
  - ⚠️ **NOTE**: Coverage percentage needs to be verified with `jest --coverage` command
  - Objectif : taux de couverture aux alentours de 80% dans la colonne "statements"
- [ ] Ajouter un test d'intégration POST new bill
  - S'appuyer sur le mock de l'API (comme pour Dashboard.js)
  - ℹ️ **REFERENCE**: Integration test example exists in `Frontend/src/__tests__/Dashboard.js` lines 742-756

#### Composant views/VerticalLayout
- [x] Tests déjà développés (coché sur le kanban)

### Astuces pour les handlers d'événements
- [x] Couvrir les handlers d'événements dans `Bills.js`
  - ✅ **DONE**: Tests exist in `Frontend/src/__tests__/Bills.js`:
    - handleClickNewBill() - line 296-303
    - handleClickIconEye() - lines 214-294 (multiple scenarios with valid/invalid URLs)
- [x] Couvrir les hanƒdlers d'événements dans `NewBill.js`
  - ✅ **COMPLETE**: All event handlers covered in `Frontend/src/__tests__/NewBill.js`:
    - handleFileChange() with valid file extensions (jpg, jpeg, png) - lines 38-89
    - handleFileChange() with invalid file extensions - lines 91-138
    - handleFormSubmit() with success scenario - lines 145-184
    - handleFormSubmit() with field values verification - lines 186-253
    - handleFormSubmit() with missing file validation - lines 255-283
    - handleFormSubmit() with API error handling - lines 285-325
  - ✅ **VERIFIED**: Tests import NewBill class, instantiate with proper parameters, and call methods directly

### Structure des tests

- [x] S'assurer que tous les tests sont dans le dossier `__tests__`
  - ✅ **VERIFIED**: All test files are in `Frontend/src/__tests__/` directory
- [x] Respecter la structure des tests unitaires en place : **Given / When / Then** avec le résultat attendu
  - ✅ **VERIFIED**: NewBill tests follow Given/When/Then structure:
    - "Given I am connected as an employee" (line 11)
    - "When I am on NewBill Page" / "When I select..." / "When I submit..." (lines 30, 38, 91, 140)
    - "Then..." assertions in each test
  - ✅ **VERIFIED**: Tests are structured with component name, testable condition, and expected behavior description

### Validation des tests unitaires

- [ ] Tout le code est testé (en dehors des appels au back-end)
- [ ] Le taux global de couverture est de 80% minimum
- [ ] Les tests n'ont pas de dépendance avec d'autres unités
- [ ] Tous les tests passent sans erreurs
- [ ] S'assurer d'utiliser des matchers pertinents, afin de bien tester l'application et pas simplement obtenir une bonne couverture

### Livrables (partie des livrables finaux)

- [ ] Prendre un screenshot au format PNG du rapport de tests Jest sur l'ensemble des fichiers d'UI (`src/views`) et des fichiers d'UX (`src/containers`)
- [ ] Prendre un screenshot au format PNG du rapport de couverture Jest
- [ ] Mettre à jour le fichier TXT avec le lien vers la codebase à jour sur un repo GitHub public (si pas déjà fait)

---

## 3. Écrire des tests d'intégration avec JavaScript

### Tests d'intégration à écrire

- [ ] Écrire un test d'intégration GET Bills pour container/Bills
  - S'inspirer de celui qui est fait (signalé en commentaires) pour Dashboard
- [ ] Écrire un test d'intégration POST new bill pour container/NewBill
  - S'inspirer de l'exemple de test d'intégration GET bills de `Dashboard.js`

### Mocks à créer

- [ ] Créer un mock de l'appel API POST
- [x] Créer un mock des erreurs 404
  - ✅ **DONE**: Mock exists in `Frontend/src/__tests__/Dashboard.js` lines 771-783
- [x] Créer un mock des erreurs 500
  - ✅ **DONE**: Mock exists in `Frontend/src/__tests__/Dashboard.js` lines 785-798
- [ ] S'assurer que les mocks sont dans le dossier `__mocks__`
- [ ] S'assurer que les mocks sont importés dans les fichiers de test du composant testé

### Validation des tests d'intégration

- [ ] Tous les tests passent sans erreur
- [ ] Les erreurs 404 et 500 sont gérées correctement
  - Astuce : Lire la documentation [MDN sur la classe Error](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error)

### Livrables (partie des livrables finaux)

- [ ] Prendre un screenshot au format PNG du rapport de tests Jest sur l'ensemble des fichiers d'UI (`src/views`) et des fichiers d'UX (`src/containers`) (si pas déjà fait)
- [ ] Prendre un screenshot au format PNG du rapport de couverture Jest (si pas déjà fait)

---

## 4. Rédiger un plan de test End-to-End (E2E) manuel

### Préparation

- [ ] S'inspirer du plan E2E rédigé pour le parcours administrateur RH (source principale)
- [ ] Identifier tous les scénarios de navigation du parcours employé
- [ ] Le plan doit comprendre l'ensemble des scénarios possibles
- [ ] Le plan doit respecter le format habituel

### Scénarios à décrire (au moins 10 sur 15)

- [ ] Scénario 1 : Navigation de base
- [ ] Scénario 2 : Affichage des notes de frais
- [ ] Scénario 3 : Création d'une nouvelle note de frais
- [ ] Scénario 4 : Validation du formulaire de création
- [ ] Scénario 5 : Gestion des erreurs de formulaire
- [ ] Scénario 6 : Upload de justificatif (jpg, jpeg, png)
- [ ] Scénario 7 : Upload de justificatif (extension non autorisée)
- [ ] Scénario 8 : Visualisation d'une note de frais
- [ ] Scénario 9 : Téléchargement d'un justificatif
- [ ] Scénario 10 : Test de l'appel API GET bills
- [ ] Scénario 11 : Test de l'appel API POST new bill
- [ ] Scénario 12 : Gestion des erreurs API (404, 500)
- [ ] Scénario 13 : Déconnexion
- [ ] Scénario 14 : Navigation avec le bouton retour
- [ ] Scénario 15 : Autre scénario pertinent

### Structure du plan E2E

- [ ] Reprendre la même forme que le document E2E du parcours administrateur
- [ ] Utiliser le format : Scénario n°i
- [ ] Inclure les instructions "Given", "When" et "Then" pour chaque scénario

### Validation du plan E2E

- [ ] Au moins 10 scénarios sur 15 sont décrits
- [ ] Le plan permet de tester manuellement le fonctionnement de l'appel API GET bills
- [ ] Le plan permet de tester manuellement le fonctionnement de l'appel API POST new bill
- [ ] Le format correspond au document E2E du parcours administrateur

### Livrable (partie 4/4 du livrable final)

- [ ] Créer un document au format PDF du plan de tests End-To-End pour le parcours employé

---

---

## 5. Livrables finaux (selon Livrable.md)

Tous les livrables doivent être fournis selon les spécifications suivantes :

- [ ] **Fichier TXT** : Créer un fichier au format TXT contenant le lien vers le code à jour sur un repo GitHub public
- [ ] **Screenshot PNG - Rapport de tests** : Prendre un screenshot au format PNG du rapport de tests Jest sur l'ensemble des fichiers d'UI (`src/views`) et des fichiers d'UX (`src/containers`)
- [ ] **Screenshot PNG - Rapport de couverture** : Prendre un screenshot au format PNG du rapport de couverture Jest
- [ ] **Document PDF - Plan E2E** : Créer un document au format PDF du plan de tests End-To-End pour le parcours employé

---

## Notes importantes

- Le site web est connecté à une API qui s'exécute en local
- Utiliser Chrome Debugger pour les bugs sans tests correspondants
- Utiliser `screen.debug()` de `testing-library` pour afficher le DOM dans la console
- Utiliser `console.log` pour afficher les valeurs de variables dans les tests
- S'assurer que le code respecte l'architecture : `src/views` pour l'UI, `src/containers` pour les handlers et les fetch de données

- API s'exécute en local
- Utiliser Chrome Debugger (onglet watch) pour bugs sans tests
- Utiliser `screen.debug()` et `console.log` pour debugging
- Architecture : `src/views` (UI), `src/containers` (handlers/fetch)
