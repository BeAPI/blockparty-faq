# Processus de release

Le développement se fait sur `develop`. Une release est un merge vers `main`.

GitHub Actions enchaîne alors :

- le build des assets JS/CSS (`yarn run build`)
- l’install des dépendances PHP de prod (`composer install --no-dev`)
- la création d’un tag git à partir d’un arbre « dist » (copie de `.distignore` vers `.gitignore`)
- l’appel du webhook Satis (`BUDDY_SATIS_WEBHOOK`) pour publier le package sur composer.beapi.fr

> [WARNING] **Avant de commencer la release**, prévenir les autres développeurs pour éviter les merges imprévus sur `develop`.

## 1. Développer

1. Créer une nouvelle branche pour votre nouvelle feature depuis `develop`.

```bash
git switch develop
git pull
git switch -c feature/xxx
git push -u origin feature/xxx
```

1. Ouvrir une pull request vers `develop`.
2. Les checks qualité PHP et JS tournent sur la PR (`composer cs`, `yarn run lint:js src`).
3. Merger la PR dans develop.



## 2. Préparer la nouvelle release

Créer une nouvelle branche depuis `main`. Remplacer `X.X.X` par le nouveau numéro (ex. `1.3.2`).

```bash
git switch main
git pull
git switch -c ver/X.X.X
git merge develop
```

Modifier les versions dans tous les fichiers suivants : 

- fichier.php racine (en-tête du plugin **et** constante `PLUGIN_VERSION`)
- `block.json`
- `package.json`
- `.plugin-data`

Mettre à jour le changelog dans `CHANGELOG.md`.

```bash
git add .
git commit -m "chore: release X.X.X"
git push -u origin ver/X.X.X
```



## 3. Déployer la nouvelle release

1. Ouvrir une pull request `ver/X.X.X` → `main`.
2. Le workflow de version vérifie que le tag git `X.X.X` n’existe pas encore.
3. Merger la PR. Le push sur `main` lance le workflow de release et crée le tag `X.X.X`.
4. Merger `ver/X.X.X` dans `develop` pour garder les deux branches alignées.

```bash
git switch develop
git pull
git merge ver/X.X.X
git push
```

