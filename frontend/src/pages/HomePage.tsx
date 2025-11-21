import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPublicContent } from '../services/api';
import { PublicContent, SetItem, VisualItem, Collaboration } from '../types/content';

const DEFAULT_WHATSAPP_MESSAGE = 'Hola, quiero coordinar una fecha con Nomoredrama.';
const ASSET_BASE =
  (import.meta.env.VITE_ASSET_BASE as string | undefined) ||
  ((import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/api$/, '') ?? '');

const sortByOrder = <T extends { order?: number }>(items: T[] = []) =>
  [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

const buildWhatsAppLink = (content?: PublicContent['contact']) => {
  const number = content?.whatsappNumber?.trim();
  if (!number) return null;
  const message = content?.whatsappMessage?.trim() || DEFAULT_WHATSAPP_MESSAGE;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

const getEmbedSrc = (url?: string, platform?: string) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    if (host.includes('youtube.com')) {
      const videoId =
        parsed.searchParams.get('v') ??
        parsed.pathname.split('/').filter(Boolean).pop();
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (host.includes('youtu.be')) {
      const videoId = parsed.pathname.split('/').filter(Boolean).pop();
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (host.includes('vimeo.com')) {
      const videoId = parsed.pathname.split('/').filter(Boolean).pop();
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    return url;
  } catch {
    return null;
  }
};

const resolveAssetUrl = (assetPath?: string | null) => {
  if (!assetPath) return null;
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  const normalized = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${ASSET_BASE}${normalized}`;
};

function HomePage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['public-content'],
    queryFn: fetchPublicContent
  });

  const visuals = useMemo(() => sortByOrder(data?.visuals ?? []), [data?.visuals]);
  const sets = useMemo(() => sortByOrder(data?.sets ?? []), [data?.sets]);
  const collaborations = useMemo(
    () => sortByOrder(data?.collaborations ?? []),
    [data?.collaborations]
  );
  const influences = useMemo(() => sortByOrder(data?.influences ?? []), [data?.influences]);
  const heroImage = resolveAssetUrl(data?.bio?.heroImagePath) || '/hero.jpg';
  const whatsappLink = buildWhatsAppLink(data?.contact);

  if (isLoading) {
    return (
      <div className="page">
        <div className="neon-grid" aria-hidden />
        <div className="container">
          <div className="state-card" role="status">
            <p className="meta">Preparando la experiencia Y2K...</p>
            <div className="grid" style={{ marginTop: '1rem' }}>
              <div className="skeleton" />
              <div className="skeleton" />
              <div className="skeleton" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="neon-grid" aria-hidden />
        <div className="container">
          <div className="state-card" role="alert">
            <p>Error al cargar contenido.</p>
            <p className="meta">Verifica la API o recarga la página.</p>
            <div style={{ marginTop: '1rem' }}>
              <button className="btn btn--ghost" type="button" onClick={() => refetch()}>
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="neon-grid" aria-hidden />
      <div className="container">
        <header className="topbar">
          <div className="brand">
            <img src="/logo.png" alt="Logo Nomoredrama" className="brand__logo" />
            <div>
              <div className="brand__title">Nomoredrama</div>
              <div className="meta">Audio/visual · Y2K cyberpunk</div>
            </div>
          </div>
          <nav className="topbar__nav" aria-label="Secciones principales">
            <a href="#visuales">Visuales</a>
            <a href="#sets">Sets en vivo</a>
            <a href="#colaboraciones">Colaboraciones</a>
            <a href="#influencias">Influencias</a>
            <a href="#contacto">Contacto</a>
          </nav>
          {whatsappLink && (
            <a
              className="btn btn--small"
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              aria-label="Abrir WhatsApp para booking"
            >
              Booking x WhatsApp
            </a>
          )}
        </header>

        <main>
          <section
            className="hero"
            id="bio"
            style={{
              backgroundImage: `linear-gradient(150deg, rgba(140, 248, 210, 0.12), rgba(84, 225, 255, 0.08), rgba(3, 2, 16, 0.9)), url(${heroImage})`
            }}
          >
            <div className="hero__content">
              <span className="eyebrow">Bio</span>
              <div className="hero__copy">Nomoredrama</div>
              <p className="lead">
                {data?.bio?.longText ||
                  data?.bio?.shortText ||
                  'Identidad digital y sets que mezclan glitch, hard drums y cyberpunk latino.'}
              </p>
              <div className="hero__actions">
                {whatsappLink && (
                  <a className="btn" href={whatsappLink} target="_blank" rel="noreferrer">
                    Bookear por WhatsApp
                  </a>
                )}
                <a className="btn btn--ghost" href="#sets">
                  Ver sets en vivo
                </a>
              </div>
              <div className="hero__stats">
                <span className="badge">Visuales · {visuals.length}</span>
                <span className="badge">Sets · {sets.length}</span>
                <span className="badge">Colaboraciones · {collaborations.length}</span>
              </div>
            </div>
          </section>

          <section className="panel" id="visuales">
            <div className="panel__header">
              <div>
                <div className="eyebrow">Visuales</div>
                <h2 className="panel__title">Galería audiovisual</h2>
                <p className="meta">
                  Selección de visuales locales (optimiza ~1600px / &lt;400KB). Configurable desde el
                  admin.
                </p>
              </div>
            </div>
            <div className="grid visuals-grid">
              {visuals.length ? (
                visuals.map((visual: VisualItem) => (
                  <article className="visual-card" key={visual.id ?? visual.title}>
                    {visual.imagePath && (
                      <img src={visual.imagePath} alt={visual.title ?? 'Visual de Nomoredrama'} />
                    )}
                    <div className="visual-card__overlay" />
                    <div className="visual-card__content">
                      <span className="pill">Visual</span>
                      <h3>{visual.title ?? 'Visual pendiente'}</h3>
                      <p className="meta">
                        {visual.description || 'Describe el momento, venue o concepto del visual.'}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <p className="meta">Añade visuales desde el admin para poblar la galería.</p>
              )}
            </div>
          </section>

          <section className="panel" id="sets">
            <div className="panel__header">
              <div>
                <div className="eyebrow">Sets en vivo</div>
                <h2 className="panel__title">Live streams / recordings</h2>
                <p className="meta">Embeds oficiales desde YouTube/Vimeo.</p>
              </div>
            </div>
            <div className="grid" style={{ gap: '1.25rem' }}>
              {sets.length ? (
                sets.map((setItem: SetItem) => (
                  <article key={setItem.id ?? setItem.title}>
                    <div className="embed" aria-label={setItem.title ?? 'Set en vivo'}>
                      {getEmbedSrc(setItem.embedUrl, setItem.platform) ? (
                        <iframe
                          src={getEmbedSrc(setItem.embedUrl, setItem.platform) ?? ''}
                          title={setItem.title ?? 'Embed de set'}
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : setItem.embedUrl ? (
                        <div className="state-card">
                          <p>El URL no es embebible. Intenta con un enlace de embed (YouTube/Vimeo).</p>
                          <div style={{ marginTop: '0.75rem' }}>
                            <a className="btn btn--ghost btn--small" href={setItem.embedUrl} target="_blank" rel="noreferrer">
                              Abrir enlace
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="state-card">
                          <p>Agrega el URL de embed para mostrar el set.</p>
                        </div>
                      )}
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                      <div className="row__title">{setItem.title ?? 'Set sin título'}</div>
                      <p className="meta">{setItem.description ?? 'Describe el mood del set.'}</p>
                    </div>
                  </article>
                ))
              ) : (
                <p className="meta">
                  No hay sets cargados aún. Usa el admin para pegar los embeds y ordenarlos.
                </p>
              )}
            </div>
          </section>

          <section className="panel" id="colaboraciones">
            <div className="panel__header">
              <div>
                <div className="eyebrow">Colaboraciones</div>
                <h2 className="panel__title">Proyectos y featuring</h2>
              </div>
            </div>
            <div className="list-rows">
              {collaborations.length ? (
                collaborations.map((item: Collaboration) => (
                  <div className="row" key={item.id ?? `${item.name}-${item.year}`}>
                    <div>
                      <div className="row__title">{item.name ?? 'Colaboración'}</div>
                      <div className="meta">
                        {item.role ?? 'Rol'} {item.year ? `· ${item.year}` : ''}
                      </div>
                    </div>
                    {item.link && (
                      <a
                        className="btn btn--ghost btn--small"
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ver
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="meta">Carga colaboraciones para dar contexto a bookers y prensa.</p>
              )}
            </div>
          </section>

          <section className="panel" id="influencias">
            <div className="panel__header">
              <div>
                <div className="eyebrow">Influencias</div>
                <h2 className="panel__title">Ecosistema de sonido</h2>
              </div>
            </div>
            <div className="hero__stats" style={{ flexWrap: 'wrap' }}>
              {influences.length ? (
                influences.map((influence) => (
                  <span className="pill" key={influence.id ?? influence.name}>
                    {influence.name ?? 'Influencias'} {influence.genre ? `· ${influence.genre}` : ''}{' '}
                    {influence.note ? `— ${influence.note}` : ''}
                  </span>
                ))
              ) : (
                <p className="meta">Completa las influencias para reforzar el storytelling.</p>
              )}
            </div>
          </section>

          <section className="panel" id="contacto">
            <div className="panel__header">
              <div>
                <div className="eyebrow">Contacto</div>
                <h2 className="panel__title">Booking inmediato</h2>
                <p className="meta">CTA principal a WhatsApp con mensaje prellenado + redes.</p>
              </div>
            </div>
            <div className="contact-grid">
              <div>
                <p className="lead">
                  {data?.contact?.whatsappMessage ||
                    'Listo para bookings, livestreams o visual sets. Agenda por WhatsApp y coordinamos en corto.'}
                </p>
                <div className="hero__actions">
                  {whatsappLink && (
                    <a className="btn" href={whatsappLink} target="_blank" rel="noreferrer">
                      Abrir WhatsApp
                    </a>
                  )}
                  {data?.contact?.email && (
                    <a className="btn btn--ghost" href={`mailto:${data.contact.email}`}>
                      Email
                    </a>
                  )}
                </div>
                {data?.contact?.location && (
                  <p className="meta" style={{ marginTop: '0.6rem' }}>
                    Base: {data.contact.location}
                  </p>
                )}
              </div>
              <div className="list-rows">
                {data?.contact?.instagram && (
                  <div className="row">
                    <div>
                      <div className="row__title">Instagram</div>
                      <div className="meta">@{data.contact.instagram.replace('@', '')}</div>
                    </div>
                    <a
                      className="btn btn--ghost btn--small"
                      href={`https://instagram.com/${data.contact.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir
                    </a>
                  </div>
                )}
                {data?.contact?.spotify && (
                  <div className="row">
                    <div>
                      <div className="row__title">Spotify</div>
                      <div className="meta">Playlists y releases</div>
                    </div>
                    <a
                      className="btn btn--ghost btn--small"
                      href={data.contact.spotify}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Escuchar
                    </a>
                  </div>
                )}
                {data?.contact?.youtube && (
                  <div className="row">
                    <div>
                      <div className="row__title">YouTube</div>
                      <div className="meta">Clips, VJ sets, lives</div>
                    </div>
                    <a
                      className="btn btn--ghost btn--small"
                      href={data.contact.youtube}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver canal
                    </a>
                  </div>
                )}
                {data?.contact?.soundcloud && (
                  <div className="row">
                    <div>
                      <div className="row__title">SoundCloud</div>
                      <div className="meta">Mixes y demos</div>
                    </div>
                    <a
                      className="btn btn--ghost btn--small"
                      href={data.contact.soundcloud}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Escuchar
                    </a>
                  </div>
                )}
                {!data?.contact?.instagram &&
                  !data?.contact?.spotify &&
                  !data?.contact?.youtube &&
                  !data?.contact?.soundcloud && (
                    <p className="meta">Agrega redes para dar más puntos de contacto.</p>
                  )}
              </div>
            </div>
          </section>
        </main>
      </div>

      {whatsappLink && (
        <a className="btn floating-cta" href={whatsappLink} target="_blank" rel="noreferrer">
          Booking por WhatsApp
        </a>
      )}
    </div>
  );
}

export default HomePage;
