import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { clearStoredAdminToken, fetchAdminContent, getStoredAdminToken, loginAdmin, logoutAdmin, saveContent } from '../services/api';

const optionalNumber = z
  .preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    const num = Number(val);
    return Number.isNaN(num) ? undefined : num;
  }, z.number())
  .optional();

const optionalUrl = z
  .preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    return val;
  }, z.string().url())
  .optional();

const optionalEmail = z
  .preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    return val;
  }, z.string().email())
  .optional();

const formSchema = z.object({
  bio: z.object({
    shortText: z.string().min(1, 'El texto corto es requerido'),
    longText: z.string().min(1, 'El texto extendido es requerido'),
    heroImagePath: z.string().optional().nullable()
  }),
  visuals: z
    .array(
      z.object({
        title: z.string().min(1, 'Titulo requerido'),
        description: z.string().optional(),
        imagePath: z.string().min(1, 'Ruta requerida'),
        order: optionalNumber
      })
    )
    .optional()
    .default([]),
  sets: z
    .array(
      z.object({
        title: z.string().min(1, 'Titulo requerido'),
        description: z.string().optional(),
        embedUrl: z.string().url('URL invalida'),
        platform: z.enum(['youtube', 'vimeo']).default('youtube'),
        order: optionalNumber
      })
    )
    .optional()
    .default([]),
  collaborations: z
    .array(
      z.object({
        name: z.string().min(1, 'Nombre requerido'),
        role: z.string().optional(),
        year: optionalNumber,
        link: optionalUrl,
        order: optionalNumber
      })
    )
    .optional()
    .default([]),
  influences: z
    .array(
      z.object({
        name: z.string().min(1, 'Nombre requerido'),
        genre: z.string().optional(),
        note: z.string().optional(),
        order: optionalNumber
      })
    )
    .optional()
    .default([]),
  contact: z.object({
    whatsappNumber: z.string().min(5, 'WhatsApp requerido'),
    whatsappMessage: z.string().optional(),
    instagram: optionalUrl,
    spotify: optionalUrl,
    youtube: optionalUrl,
    soundcloud: optionalUrl,
    email: optionalEmail,
    location: z.string().optional()
  })
});

type AdminFormValues = z.infer<typeof formSchema>;

const emptyValues: AdminFormValues = {
  bio: { shortText: '', longText: '', heroImagePath: '' },
  visuals: [],
  sets: [],
  collaborations: [],
  influences: [],
  contact: { whatsappNumber: '' }
};

const normalizeEmpty = (value?: string | null) => {
  if (value === undefined || value === null) return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

const resolvePreviewUrl = (path?: string | null) => {
  if (!path) return null;
  if (/^blob:/i.test(path) || /^https?:\/\//i.test(path)) return path;
  const base =
    (import.meta.env.VITE_ASSET_BASE as string | undefined) ||
    ((import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/api$/, '') ?? '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
};

function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [heroUploadPreview, setHeroUploadPreview] = useState<string | null>(null);
  const inputClass = 'form-input';
  const selectClass = 'form-select';
  const textAreaClass = 'form-textarea';

  const form = useForm<AdminFormValues>({
    defaultValues: emptyValues
  });

  const visualsFA = useFieldArray({ control: form.control, name: 'visuals' });
  const setsFA = useFieldArray({ control: form.control, name: 'sets' });
  const collaborationsFA = useFieldArray({ control: form.control, name: 'collaborations' });
  const influencesFA = useFieldArray({ control: form.control, name: 'influences' });

  const contentQuery = useQuery({
    queryKey: ['admin-content', token],
    queryFn: () => fetchAdminContent(token ?? ''),
    enabled: !!token
  });

  const heroPreview = resolvePreviewUrl(heroUploadPreview ?? form.watch('bio.heroImagePath'));
  const logoutMutation = useMutation({
    mutationFn: () => logoutAdmin(token ?? undefined),
    onSettled: () => {
      setToken(null);
      setSaveError(null);
      setSaveSuccess(null);
      clearStoredAdminToken();
      form.reset(emptyValues);
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  useEffect(() => {
    const storedToken = getStoredAdminToken();
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (contentQuery.data) {
      const data = contentQuery.data;
      form.reset({
        bio: {
          shortText: data.bio?.shortText ?? '',
          longText: data.bio?.longText ?? '',
          heroImagePath: data.bio?.heroImagePath ?? ''
        },
        visuals: data.visuals ?? [],
        sets: data.sets ?? [],
        collaborations: data.collaborations ?? [],
        influences: data.influences ?? [],
        contact: {
          whatsappNumber: data.contact?.whatsappNumber ?? '',
          whatsappMessage: data.contact?.whatsappMessage ?? '',
          instagram: data.contact?.instagram ?? '',
          spotify: data.contact?.spotify ?? '',
          youtube: data.contact?.youtube ?? '',
          soundcloud: data.contact?.soundcloud ?? '',
          email: data.contact?.email ?? '',
          location: data.contact?.location ?? ''
        }
      });
    }
  }, [contentQuery.data, form]);

  const loginMutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => {
      setToken(data.token);
      setLoginError(null);
    },
    onError: () => setLoginError('Login fallido, revisa credenciales.')
  });

  const saveMutation = useMutation({
    mutationFn: (payload: AdminFormValues) => saveContent(token ?? '', payload),
    onSuccess: () => {
      setSaveError(null);
      setSaveSuccess('Cambios guardados');
      contentQuery.refetch();
    },
    onError: () => setSaveError('No se pudo guardar. Revisa los datos o tu sesion.')
  });

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    const email = (formEl.elements.namedItem('email') as HTMLInputElement).value;
    const password = (formEl.elements.namedItem('password') as HTMLInputElement).value;
    loginMutation.mutate({ email, password });
  };

  const onSubmit = (values: AdminFormValues) => {
    const cleaned: AdminFormValues = {
      bio: {
        shortText: values.bio.shortText,
        longText: values.bio.longText,
        heroImagePath: normalizeEmpty(values.bio.heroImagePath) ?? ''
      },
      visuals: (values.visuals ?? []).map((v, idx) => ({
        ...v,
        order: v.order ?? idx + 1
      })),
      sets: (values.sets ?? []).map((s, idx) => ({
        ...s,
        order: s.order ?? idx + 1
      })),
      collaborations: (values.collaborations ?? []).map((c, idx) => ({
        ...c,
        link: normalizeEmpty(c.link),
        year: c.year ?? undefined,
        order: c.order ?? idx + 1
      })),
      influences: (values.influences ?? []).map((i, idx) => ({
        ...i,
        order: i.order ?? idx + 1
      })),
      contact: {
        whatsappNumber: values.contact.whatsappNumber,
        whatsappMessage: normalizeEmpty(values.contact.whatsappMessage),
        instagram: normalizeEmpty(values.contact.instagram),
        spotify: normalizeEmpty(values.contact.spotify),
        youtube: normalizeEmpty(values.contact.youtube),
        soundcloud: normalizeEmpty(values.contact.soundcloud),
        email: normalizeEmpty(values.contact.email),
        location: normalizeEmpty(values.contact.location)
      }
    };

    const parsed = formSchema.safeParse(cleaned);
    if (!parsed.success) {
      setSaveError('Corrige los campos destacados.');
      return;
    }
    setSaveSuccess(null);
    saveMutation.mutate(parsed.data);
  };

  const renderFieldError = (message?: string) =>
    message ? <span className="form-hint form-hint--error">{message}</span> : null;

  const handleHeroFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const pathGuess = `Recursos/Fotos/${file.name}`;
    form.setValue('bio.heroImagePath', pathGuess);
    setHeroUploadPreview(URL.createObjectURL(file));
  };

  const handleVisualFile = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const pathGuess = `Recursos/Fotos/${file.name}`;
    form.setValue(`visuals.${index}.imagePath`, pathGuess);
  };

  return (
    <main className="admin-shell page">
      <div className="neon-grid" />
      <div className="container admin-container">
        <header className="admin-header">
          <div>
            <p className="eyebrow">Panel admin</p>
            <h1 className="admin-title">Nomoredrama Control</h1>
            <p className="meta">Edita bio, sets, visuales, colaboraciones e influencias.</p>
          </div>
          <div className="admin-status">
            <span className={`pill ${token ? 'pill--success' : 'pill--warning'}`}>
              {token ? 'Sesion activa' : 'No autenticado'}
            </span>
            {token && (
              <button type="button" className="btn btn--ghost btn--small" onClick={handleLogout} disabled={logoutMutation.isPending}>
                {logoutMutation.isPending ? 'Cerrando...' : 'Cerrar sesion'}
              </button>
            )}
          </div>
        </header>

        {!token && (
          <section className="admin-card admin-card--narrow">
            <div className="admin-card__head">
              <div>
                <p className="eyebrow">Acceso</p>
                <h2>Inicia sesion</h2>
                <p className="meta">Protegido con JWT. Usa el correo y password configurados.</p>
              </div>
            </div>
            <form onSubmit={handleLogin} className="form-grid" noValidate>
              <label className="form-field">
                <span>Email</span>
                <input className={inputClass} name="email" placeholder="admin@example.com" required />
              </label>
              <label className="form-field">
                <span>Password</span>
                <input className={inputClass} name="password" type="password" placeholder="********" required />
              </label>
              <div className="admin-actions">
                <button className="btn" type="submit" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? 'Ingresando...' : 'Ingresar'}
                </button>
              </div>
              {loginError && <p className="form-hint form-hint--error">{loginError}</p>}
            </form>
          </section>
        )}

        {token && (
          <form className="admin-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <section className="admin-card">
              <div className="admin-card__head">
                <div>
                  <p className="eyebrow">Bio</p>
                  <h2>Identidad</h2>
                </div>
                <span className="pill">Hero + textos</span>
              </div>
              <div className="form-grid form-grid--equal">
                <label className="form-field">
                  <span>Texto corto</span>
                  <input className={`${inputClass} input--tall`} {...form.register('bio.shortText')} />
                  {renderFieldError(form.formState.errors.bio?.shortText?.message)}
                </label>
                <label className="form-field">
                  <span>Texto extendido</span>
                  <textarea className={textAreaClass} rows={4} {...form.register('bio.longText')} />
                  {renderFieldError(form.formState.errors.bio?.longText?.message)}
                </label>
                <label className="form-field">
                  <span>Hero image path</span>
                  <input
                    className={`${inputClass} input--tall`}
                    placeholder="Recursos/Fotos/hero.jpg"
                    {...form.register('bio.heroImagePath')}
                  />
                  <span className="form-hint form-hint--tall">
                    Usar imagenes JPG/PNG ~1600px de ancho x 900px de alto (~16:9), optimizadas.
                  </span>
                </label>
                <label className="form-field">
                  <span>Subir hero (elige archivo local)</span>
                  <input className={inputClass} type="file" accept="image/*" onChange={handleHeroFile} />
                  <span className="form-hint">Solo referencia el nombre; coloca el archivo en Recursos/Fotos/ antes de publicar.</span>
                </label>
                {heroPreview && (
                  <div className="preview-line">
                    <span className="pill">Preview</span>
                    <img src={heroPreview} alt="Hero preview" className="preview-thumb" />
                  </div>
                )}
              </div>
            </section>

            <section className="admin-card">
              <div className="admin-card__head">
                <div>
                  <p className="eyebrow">Visuales</p>
                  <h2>Galeria</h2>
                </div>
                <div className="admin-inline-actions">
                  <button
                    type="button"
                    className="btn btn--ghost btn--small"
                    onClick={() =>
                      visualsFA.append({
                        title: '',
                        description: '',
                        imagePath: '',
                        order: (visualsFA.fields.length || 0) + 1
                      })
                    }
                  >
                    Anadir visual
                  </button>
                </div>
              </div>
              <div className="admin-list">
                {visualsFA.fields.map((field, index) => (
                  <div key={field.id} className="admin-item">
                    <input type="hidden" {...form.register(`visuals.${index}.id` as const)} />
                    <div className="admin-item__title">
                      <span className="pill">#{index + 1}</span>
                      <strong>Visual</strong>
                    </div>
                    <div className="form-grid">
                      <label className="form-field">
                        <span>Titulo</span>
                        <input className={inputClass} {...form.register(`visuals.${index}.title` as const)} />
                        {renderFieldError(form.formState.errors.visuals?.[index]?.title?.message)}
                      </label>
                      <label className="form-field">
                        <span>Descripcion</span>
                        <input className={inputClass} {...form.register(`visuals.${index}.description` as const)} />
                      </label>
                      <label className="form-field">
                        <span>Imagen (ruta)</span>
                        <input
                          className={inputClass}
                          {...form.register(`visuals.${index}.imagePath` as const)}
                          placeholder="Recursos/Fotos/..."
                        />
                        {renderFieldError(form.formState.errors.visuals?.[index]?.imagePath?.message)}
                        <input
                          className={inputClass}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleVisualFile(index, e)}
                        />
                        <span className="form-hint">
                          Usar imagenes ~1600px de ancho x 900px de alto (~16:9), optimizadas &lt;400KB.
                        </span>
                      </label>
                      <label className="form-field form-field--short">
                        <span>Orden</span>
                        <input
                          className={inputClass}
                          type="number"
                          {...form.register(`visuals.${index}.order` as const, { valueAsNumber: true })}
                        />
                      </label>
                    </div>
                    <div className="admin-inline-actions">
                      <button type="button" className="btn btn--ghost btn--small" onClick={() => visualsFA.remove(index)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="admin-card">
              <div className="admin-card__head">
                <div>
                  <p className="eyebrow">Sets en vivo</p>
                  <h2>Embeds</h2>
                </div>
                <div className="admin-inline-actions">
                  <button
                    type="button"
                    className="btn btn--ghost btn--small"
                    onClick={() =>
                      setsFA.append({
                        title: '',
                        description: '',
                        embedUrl: '',
                        platform: 'youtube',
                        order: (setsFA.fields.length || 0) + 1
                      })
                    }
                  >
                    Anadir set
                  </button>
                  <button className="btn btn--small" type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? 'Guardando...' : 'Guardar aqui'}
                  </button>
                </div>
              </div>
              <div className="admin-list">
                {setsFA.fields.map((field, index) => (
                  <div key={field.id} className="admin-item">
                    <input type="hidden" {...form.register(`sets.${index}.id` as const)} />
                    <div className="admin-item__title">
                      <span className="pill">#{index + 1}</span>
                      <strong>Set</strong>
                    </div>
                    <div className="form-grid">
                      <label className="form-field">
                        <span>Titulo</span>
                        <input className={inputClass} {...form.register(`sets.${index}.title` as const)} />
                        {renderFieldError(form.formState.errors.sets?.[index]?.title?.message)}
                      </label>
                      <label className="form-field">
                        <span>Descripcion</span>
                        <input className={inputClass} {...form.register(`sets.${index}.description` as const)} />
                      </label>
                      <label className="form-field">
                        <span>URL de embed</span>
                        <input
                          className={inputClass}
                          {...form.register(`sets.${index}.embedUrl` as const)}
                          placeholder="https://www.youtube.com/embed/..."
                        />
                        {renderFieldError(form.formState.errors.sets?.[index]?.embedUrl?.message)}
                      </label>
                      <label className="form-field form-field--short">
                        <span>Plataforma</span>
                        <select className={selectClass} {...form.register(`sets.${index}.platform` as const)}>
                          <option value="youtube">YouTube</option>
                          <option value="vimeo">Vimeo</option>
                        </select>
                      </label>
                      <label className="form-field form-field--short">
                        <span>Orden</span>
                        <input
                          className={inputClass}
                          type="number"
                          {...form.register(`sets.${index}.order` as const, { valueAsNumber: true })}
                        />
                      </label>
                    </div>
                    <div className="admin-inline-actions">
                      <button type="button" className="btn btn--ghost btn--small" onClick={() => setsFA.remove(index)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="admin-card">
              <div className="admin-card__head">
                <div>
                  <p className="eyebrow">Colaboraciones</p>
                  <h2>Highlights</h2>
                </div>
                <div className="admin-inline-actions">
                  <button
                    type="button"
                    className="btn btn--ghost btn--small"
                    onClick={() =>
                      collaborationsFA.append({
                        name: '',
                        role: '',
                        year: new Date().getFullYear(),
                        link: '',
                        order: (collaborationsFA.fields.length || 0) + 1
                      })
                    }
                  >
                    Anadir colaboracion
                  </button>
                </div>
              </div>
              <div className="admin-list">
                {collaborationsFA.fields.map((field, index) => (
                  <div key={field.id} className="admin-item">
                    <input type="hidden" {...form.register(`collaborations.${index}.id` as const)} />
                    <div className="admin-item__title">
                      <span className="pill">#{index + 1}</span>
                      <strong>Colab</strong>
                    </div>
                    <div className="form-grid">
                      <label className="form-field">
                        <span>Nombre</span>
                        <input className={inputClass} {...form.register(`collaborations.${index}.name` as const)} />
                        {renderFieldError(form.formState.errors.collaborations?.[index]?.name?.message)}
                      </label>
                      <label className="form-field">
                        <span>Rol</span>
                        <input className={inputClass} {...form.register(`collaborations.${index}.role` as const)} />
                      </label>
                      <label className="form-field form-field--short">
                        <span>Ano</span>
                        <input
                          className={inputClass}
                          type="number"
                          {...form.register(`collaborations.${index}.year` as const, { valueAsNumber: true })}
                        />
                      </label>
                      <label className="form-field">
                        <span>Link (opcional)</span>
                        <input
                          className={inputClass}
                          {...form.register(`collaborations.${index}.link` as const)}
                          placeholder="https://..."
                        />
                      </label>
                      <label className="form-field form-field--short">
                        <span>Orden</span>
                        <input
                          className={inputClass}
                          type="number"
                          {...form.register(`collaborations.${index}.order` as const, { valueAsNumber: true })}
                        />
                      </label>
                    </div>
                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        className="btn btn--ghost btn--small"
                        onClick={() => collaborationsFA.remove(index)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="admin-card">
              <div className="admin-card__head">
                <div>
                  <p className="eyebrow">Influencias</p>
                  <h2>ADN sonoro</h2>
                </div>
                <div className="admin-inline-actions">
                  <button
                    type="button"
                    className="btn btn--ghost btn--small"
                    onClick={() =>
                      influencesFA.append({
                        name: '',
                        genre: '',
                        note: '',
                        order: (influencesFA.fields.length || 0) + 1
                      })
                    }
                  >
                    Anadir influencia
                  </button>
                </div>
              </div>
              <div className="admin-list">
                {influencesFA.fields.map((field, index) => (
                  <div key={field.id} className="admin-item">
                    <input type="hidden" {...form.register(`influences.${index}.id` as const)} />
                    <div className="admin-item__title">
                      <span className="pill">#{index + 1}</span>
                      <strong>Influ</strong>
                    </div>
                    <div className="form-grid">
                      <label className="form-field">
                        <span>Nombre</span>
                        <input className={inputClass} {...form.register(`influences.${index}.name` as const)} />
                        {renderFieldError(form.formState.errors.influences?.[index]?.name?.message)}
                      </label>
                      <label className="form-field">
                        <span>Genero/Escena</span>
                        <input className={inputClass} {...form.register(`influences.${index}.genre` as const)} />
                      </label>
                      <label className="form-field">
                        <span>Nota</span>
                        <input className={inputClass} {...form.register(`influences.${index}.note` as const)} />
                      </label>
                      <label className="form-field form-field--short">
                        <span>Orden</span>
                        <input
                          className={inputClass}
                          type="number"
                          {...form.register(`influences.${index}.order` as const, { valueAsNumber: true })}
                        />
                      </label>
                    </div>
                    <div className="admin-inline-actions">
                      <button type="button" className="btn btn--ghost btn--small" onClick={() => influencesFA.remove(index)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="admin-card">
              <div className="admin-card__head">
                <div>
                  <p className="eyebrow">Contacto</p>
                  <h2>CTA + Redes</h2>
                </div>
                <span className="pill">WhatsApp + redes</span>
              </div>
              <div className="form-grid">
                <label className="form-field">
                  <span>WhatsApp (numero)</span>
                  <input className={inputClass} {...form.register('contact.whatsappNumber')} placeholder="+549..." />
                  {renderFieldError(form.formState.errors.contact?.whatsappNumber?.message)}
                </label>
                <label className="form-field">
                  <span>Mensaje prefijado</span>
                  <input className={inputClass} {...form.register('contact.whatsappMessage')} placeholder="Hola, quiero coordinar..." />
                </label>
                <label className="form-field">
                  <span>Instagram</span>
                  <input className={inputClass} {...form.register('contact.instagram')} placeholder="https://instagram.com/..." />
                </label>
                <label className="form-field">
                  <span>Spotify</span>
                  <input className={inputClass} {...form.register('contact.spotify')} placeholder="https://open.spotify.com/..." />
                </label>
                <label className="form-field">
                  <span>YouTube</span>
                  <input className={inputClass} {...form.register('contact.youtube')} placeholder="https://youtube.com/..." />
                </label>
                <label className="form-field">
                  <span>SoundCloud</span>
                  <input className={inputClass} {...form.register('contact.soundcloud')} placeholder="https://soundcloud.com/..." />
                </label>
                <label className="form-field">
                  <span>Email</span>
                  <input className={inputClass} {...form.register('contact.email')} placeholder="booking@..." />
                </label>
                <label className="form-field">
                  <span>Ubicacion</span>
                  <input className={inputClass} {...form.register('contact.location')} placeholder="Ciudad, Pais" />
                </label>
              </div>
            </section>

            <div className="admin-actions-bar">
              <div className="admin-messages">
                {saveError && <p className="form-hint form-hint--error">{saveError}</p>}
                {saveSuccess && (
                  <p className="form-hint form-hint--success" aria-live="polite">
                    {saveSuccess}
                  </p>
                )}
              </div>
              <div className="admin-actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => contentQuery.refetch()}
                  disabled={contentQuery.isRefetching}
                >
                  Recargar datos
                </button>
                <input
                  className="btn btn--primary"
                  type="submit"
                  disabled={saveMutation.isPending}
                  value={saveMutation.isPending ? 'Guardando...' : 'Guardar todo'}
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default AdminPage;
