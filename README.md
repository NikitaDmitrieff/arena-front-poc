# Arena Front POC

Frontend Next.js minimaliste inspiré d'une console d'opérations. Il interroge l'API FastAPI (`/hello`) et affiche la réponse.

## Prérequis
- Docker et Docker Compose installés localement. Installe Docker Desktop (macOS/Windows) ou Docker Engine (Linux) via <https://docs.docker.com/get-docker/>.
- (Optionnel) Node.js 20+ si tu veux lancer le front sans Docker.

## Configuration
L'URL du backend est déduite automatiquement (`http(s)://<hôte>:8000`). Pour un autre endpoint, définis la variable d'environnement `NEXT_PUBLIC_API_BASE`.

## Démarrage local avec Docker
```bash
cd arena-front-poc
docker build -t arena-front-poc:latest .
docker run --rm -p 8080:3000 \
  -e NEXT_PUBLIC_API_BASE="http://localhost:8000" \
  --name arena-front arena-front-poc:latest
```

Ouvre <http://localhost:8080> et déclenche la sonde.

## CI/CD et déploiement
Workflow GitHub Actions `.github/workflows/deploy.yml` : build & push de l'image sur GHCR, redéploiement automatique du conteneur Next.js sur ta VM.
