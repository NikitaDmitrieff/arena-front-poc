import './globals.css';

export const metadata = {
  title: 'Arena Command Console',
  description: 'Interface minimaliste pour interroger le backend FastAPI.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
