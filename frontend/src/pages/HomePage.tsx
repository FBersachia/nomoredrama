import { useQuery } from '@tanstack/react-query';
import { fetchPublicContent } from '../services/api';

function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['public-content'],
    queryFn: fetchPublicContent
  });

  if (isLoading) return <main style={{ padding: '2rem' }}>Cargando...</main>;
  if (error) return <main style={{ padding: '2rem' }}>Error al cargar contenido</main>;

  const bio = data?.bio;

  return (
    <main style={{ padding: '2rem', display: 'grid', gap: '1.5rem' }}>
      <section>
        <h1 style={{ letterSpacing: '0.1em' }}>Nomoredrama</h1>
        <p style={{ maxWidth: 720, opacity: 0.85 }}>{bio?.shortText ?? 'Bio breve pendiente.'}</p>
      </section>
      <section>
        <h2>Sets en Vivo</h2>
        <p style={{ opacity: 0.8 }}>Próximamente embebidos de YouTube/Vimeo configurables desde admin.</p>
      </section>
      <section>
        <h2>Contacto</h2>
        <a
          href={`https://wa.me/${data?.contact?.whatsappNumber ?? ''}?text=${encodeURIComponent(
            data?.contact?.whatsappMessage ?? 'Hola, quiero coordinar una fecha con Nomoredrama.'
          )}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            border: '1px solid #3bd57f',
            borderRadius: 8
          }}
        >
          Escribir por WhatsApp
        </a>
      </section>
    </main>
  );
}

export default HomePage;
