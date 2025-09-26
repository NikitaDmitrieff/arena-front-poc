'use client';

import { useMemo, useState } from 'react';

const FALLBACK_BASE = 'http://localhost:8000';

function resolveApiBase() {
  if (process.env.NEXT_PUBLIC_API_BASE) {
    return process.env.NEXT_PUBLIC_API_BASE;
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:8000`;
  }

  return FALLBACK_BASE;
}

export default function Page() {
  const [status, setStatus] = useState('En attente d’un ordre.');
  const [loading, setLoading] = useState(false);

  const apiBase = useMemo(() => resolveApiBase(), []);

  const triggerHello = async () => {
    setLoading(true);
    setStatus('Connexion au backend…');

    try {
      const response = await fetch(`${apiBase}/hello`);

      if (!response.ok) {
        throw new Error(`Code ${response.status}`);
      }

      const text = await response.text();
      setStatus(`Réponse capturée : ${text}`);
    } catch (error) {
      setStatus(`Échec de l’opération : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div>
        <h1>ARENA OPS</h1>
        <p>
          Console d’interaction directe avec le noyau FastAPI. Déclenche la
          sonde pour vérifier la disponibilité stratégique.
        </p>

        <div className="code-strip">
          <div className="status-line">
            <span className="status-dot" aria-hidden />
            <span>Canal API&nbsp;: {apiBase}</span>
          </div>
          <div className="response" role="status">{status}</div>
          <button onClick={triggerHello} disabled={loading}>
            {loading ? 'Analyse en cours…' : 'Déployer la sonde'}
          </button>
        </div>

        <footer>FASTAPI // NEXT.JS // ARENA</footer>
      </div>
    </main>
  );
}
