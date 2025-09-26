# CI/CD (GitHub Actions)

Pipeline pour builder l'image Nginx statique, la pousser sur GHCR et déployer automatiquement le front sur la VM.

## Etapes
1. Build/push de l'image à chaque `push`/`pull_request`.
2. Déploiement continu depuis `main`.

## Secrets nécessaires
| Secret | Description |
| ------ | ----------- |
| `VM_HOST` | Adresse IP / DNS de la VM |
| `VM_USER` | Utilisateur SSH membre du groupe `docker` |
| `VM_SSH_KEY` | Clé privée SSH pour la connexion |
| `VM_DEPLOY_PATH` | (Optionnel) Chemin où stocker les fichiers, ex. `/opt/arena` |

## Exemple `.github/workflows/deploy.yml`
```yaml
name: CI-CD

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-qemu-action@v3
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build & push image
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository_owner }}/arena-front-poc:latest
            ghcr.io/${{ github.repository_owner }}/arena-front-poc:${{ github.sha }}

  deploy:
    needs: build-and-push
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Déployer sur la VM
        uses: appleboy/ssh-action@v0.1.10
        with:
          host: ${{ secrets.VM_HOST }}
          username: ${{ secrets.VM_USER }}
          key: ${{ secrets.VM_SSH_KEY }}
          script: |
            docker pull ghcr.io/${{ github.repository_owner }}/arena-front-poc:latest
            docker stop arena-front || true
            docker rm arena-front || true
            docker run -d --restart=always \
              -p 8080:80 \
              --name arena-front \
              ghcr.io/${{ github.repository_owner }}/arena-front-poc:latest
```

## Préparation VM
- Docker installé + utilisateur dans le groupe `docker`.
- Ports 8080/80 ouverts (firewall / security group).
- Optionnel : créer un dossier `/opt/arena/front` pour stocker de futurs assets.

## Tests locaux
```bash
docker build -t arena-front-poc:latest .
docker run --rm -p 8080:80 arena-front-poc:latest
```

## Personnalisations
- Servir le front derrière un reverse proxy HTTPS (Caddy/Traefik) : adapter le `docker run`.
- Remplacer `latest` par des tags versionnés.
- Ajouter un job de tests (lint HTML, audit Lighthouse, etc.).
