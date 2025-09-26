# Arena Front POC

Frontend statique (Nginx) qui appelle l'API `/hello` et affiche la réponse.

## Prérequis
- Docker et Docker Compose installés localement. Installe Docker Desktop (macOS/Windows) ou Docker Engine (Linux) via <https://docs.docker.com/get-docker/>.
- Vérifie l'installation avec `docker --version` avant de lancer les commandes.

## Démarrage local avec Docker
```bash
cd arena-front-poc
docker build -t arena-front-poc:latest .
docker run --rm -p 8080:80 --name arena-front arena-front-poc:latest
```
Ouvre <http://localhost:8080> puis clique sur le bouton.

## CI/CD et déploiement
Workflow GitHub Actions disponible dans `.github/workflows/deploy.yml` : build & push de l'image sur GHCR, redéploiement automatique du conteneur Nginx sur ta VM.
