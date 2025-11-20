import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchAdminContent, loginAdmin, saveContent } from '../services/api';

function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [shortText, setShortText] = useState('');
  const [longText, setLongText] = useState('');
  const [heroImagePath, setHeroImagePath] = useState('');

  const contentQuery = useQuery({
    queryKey: ['admin-content', token],
    queryFn: () => fetchAdminContent(token ?? ''),
    enabled: !!token
  });

  const loginMutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => setToken(data.token)
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      saveContent(token ?? '', {
        bio: { shortText, longText, heroImagePath }
      }),
    onSuccess: () => contentQuery.refetch()
  });

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    loginMutation.mutate({ email, password });
  };

  return (
    <main style={{ padding: '2rem', display: 'grid', gap: '1.5rem', maxWidth: 800 }}>
      <section>
        <h1>Admin</h1>
        {!token && (
          <form onSubmit={handleLogin} style={{ display: 'grid', gap: '0.75rem', maxWidth: 360 }}>
            <input name="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        )}
      </section>

      {token && (
        <section style={{ display: 'grid', gap: '0.75rem' }}>
          <h2>Bio</h2>
          <input
            placeholder="Texto corto"
            value={shortText}
            onChange={(e) => setShortText(e.target.value)}
          />
          <textarea
            placeholder="Texto extendido"
            value={longText}
            onChange={(e) => setLongText(e.target.value)}
            rows={4}
          />
          <input
            placeholder="Ruta hero (ej: Recursos/Fotos/hero.jpg)"
            value={heroImagePath}
            onChange={(e) => setHeroImagePath(e.target.value)}
          />
          <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
          {contentQuery.isLoading && <p>Cargando contenido...</p>}
          {contentQuery.data?.bio && (
            <p style={{ opacity: 0.8 }}>Bio actual: {contentQuery.data.bio.shortText}</p>
          )}
        </section>
      )}
    </main>
  );
}

export default AdminPage;
