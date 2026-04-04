import { useState, useEffect } from 'react';
import { useTranslation }  from 'react-i18next';
import { useAuthStore }    from '../store/authStore';
import { api }             from '../lib/api';
import { Button }          from '../components/ui/Button';
import { Navigate }        from 'react-router-dom';

interface LetterRow {
  code: string;
  index: number;
  nameRu: string;
  nameUz: string;
  nameEn: string;
  associationRu: string;
  associationUz: string;
  associationEn: string;
}

interface DonateLink {
  name: string;
  url: string;
}

interface DonateForm {
  enabled: boolean;
  title: string;
  description: string;
  cardNumber: string;
  cardHolder: string;
  links: DonateLink[];
}

export function AdminPage() {
  const { t } = useTranslation('common');
  const user = useAuthStore(s => s.user);
  const [letters, setLetters] = useState<LetterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<LetterRow>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Sections state
  const [sectionsData, setSectionsData] = useState<Record<string, boolean>>({});
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [sectionsSaving, setSectionsSaving] = useState(false);
  const [sectionsMsg, setSectionsMsg] = useState('');

  const SECTION_LABELS: Record<string, { uz: string; ru: string; en: string }> = {
    games:        { uz: "O'yin rejimlari", ru: "\u0418\u0433\u0440\u043e\u0432\u044b\u0435 \u0440\u0435\u0436\u0438\u043c\u044b", en: "Game Modes" },
    textbook:     { uz: "Muallim Soniy darsligi", ru: "\u0423\u0447\u0435\u0431\u043d\u0438\u043a \u041c\u0443\u0430\u043b\u043b\u0438\u043c \u0421\u043e\u043d\u0438", en: "Textbook" },
    quran:        { uz: "Qur'on rejimi", ru: "\u0420\u0435\u0436\u0438\u043c \u041a\u043e\u0440\u0430\u043d", en: "Quran Mode" },
    challenges:   { uz: "Do'stni chaqirish", ru: "\u0412\u044b\u0437\u043e\u0432 \u0434\u0440\u0443\u0433\u0430", en: "Challenges" },
    leaderboard:  { uz: "Reyting", ru: "\u0420\u0435\u0439\u0442\u0438\u043d\u0433", en: "Leaderboard" },
    achievements: { uz: "Yutuqlar", ru: "\u0414\u043e\u0441\u0442\u0438\u0436\u0435\u043d\u0438\u044f", en: "Achievements" },
    daily_lesson: { uz: "Kunlik dars", ru: "\u0423\u0440\u043e\u043a \u0434\u043d\u044f", en: "Daily Lesson" },
    donate:       { uz: "Donat", ru: "\u0414\u043e\u043d\u0430\u0442\u044b", en: "Donations" },
    weakness:     { uz: "Zaif harflar", ru: "\u0421\u043b\u0430\u0431\u044b\u0435 \u0431\u0443\u043a\u0432\u044b", en: "Weak Letters" },
    roadmap:      { uz: "Yo'l xaritasi", ru: "\u0420\u043e\u0430\u0434\u043c\u0435\u043f", en: "Roadmap" },
  };

  const lang = user?.language ?? 'uz';

  // Donate state
  const [activeTab, setActiveTab] = useState<'letters' | 'donate' | 'sections'>('letters');
  const [donateForm, setDonateForm] = useState<DonateForm>({
    enabled: false,
    title: '',
    description: '',
    cardNumber: '',
    cardHolder: '',
    links: [],
  });
  const [donateLoading, setDonateLoading] = useState(true);
  const [donateSaving, setDonateSaving] = useState(false);
  const [donateMsg, setDonateMsg] = useState('');

  useEffect(() => {
    api.get('/admin/letters')
      .then(res => setLetters(res.data.data ?? res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
    api.get('/settings/sections')
      .then(res => {
        setSectionsData(res.data.data ?? res.data);
      })
      .catch(() => {})
      .finally(() => setSectionsLoading(false));
    api.get('/donate')
      .then(res => {
        const d = res.data.data ?? res.data;
        setDonateForm({
          enabled: d.enabled ?? false,
          title: d.title ?? '',
          description: d.description ?? '',
          cardNumber: d.cardNumber ?? '',
          cardHolder: d.cardHolder ?? '',
          links: d.links ?? [],
        });
      })
      .catch(() => {})
      .finally(() => setDonateLoading(false));
  }, []);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const startEdit = (letter: LetterRow) => {
    setEditing(letter.code);
    setForm({
      nameRu: letter.nameRu,
      nameUz: letter.nameUz,
      nameEn: letter.nameEn,
      associationRu: letter.associationRu,
      associationUz: letter.associationUz,
      associationEn: letter.associationEn,
    });
    setMsg('');
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({});
    setMsg('');
  };

  const saveEdit = async (code: string) => {
    setSaving(true);
    setMsg('');
    try {
      await api.patch(`/admin/letters/${encodeURIComponent(code)}`, form);
      setLetters(prev => prev.map(l => l.code === code ? { ...l, ...form } as LetterRow : l));
      setEditing(null);
      setMsg('Saved');
      setTimeout(() => setMsg(''), 2000);
    } catch (e: any) {
      setMsg(e?.response?.data?.error ?? 'Error saving');
    } finally {
      setSaving(false);
    }
  };

  const saveDonate = async () => {
    setDonateSaving(true);
    setDonateMsg('');
    try {
      await api.patch('/admin/donate', {
        enabled: donateForm.enabled,
        title: donateForm.title,
        description: donateForm.description,
        cardNumber: donateForm.cardNumber,
        cardHolder: donateForm.cardHolder,
        links: donateForm.links,
      });
      setDonateMsg(t('donate.saved'));
      setTimeout(() => setDonateMsg(''), 2000);
    } catch (e: any) {
      setDonateMsg(e?.response?.data?.error ?? 'Error saving');
    } finally {
      setDonateSaving(false);
    }
  };

  const saveSections = async () => {
    setSectionsSaving(true);
    setSectionsMsg('');
    try {
      const res = await api.patch('/admin/sections', { sections: sectionsData });
      setSectionsData(res.data.data);
      setSectionsMsg(t('sections_saved'));
      setTimeout(() => setSectionsMsg(''), 2000);
    } catch (e: any) {
      setSectionsMsg(e?.response?.data?.error ?? 'Error saving');
    } finally {
      setSectionsSaving(false);
    }
  };

  const addDonateLink = () => {
    setDonateForm(prev => ({
      ...prev,
      links: [...prev.links, { name: '', url: '' }],
    }));
  };

  const removeDonateLink = (index: number) => {
    setDonateForm(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const updateDonateLink = (index: number, field: 'name' | 'url', value: string) => {
    setDonateForm(prev => ({
      ...prev,
      links: prev.links.map((link, i) => i === index ? { ...link, [field]: value } : link),
    }));
  };

  const inputCls = `w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.2)]
                    rounded-lg px-3 py-1.5 text-[#f0e6cc] font-raleway text-xs
                    outline-none focus:border-gold-dim transition-colors`;

  const tabCls = (active: boolean) =>
    `font-cinzel text-[0.65rem] tracking-[3px] uppercase px-4 py-2 rounded-xl border transition-all cursor-pointer ${
      active
        ? 'border-[rgba(201,168,76,0.4)] text-gold-light bg-[rgba(201,168,76,0.08)]'
        : 'border-[rgba(255,255,255,0.08)] text-[#9a8a6a] hover:text-gold-light'
    }`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Tab switcher */}
      <div className="flex gap-3 justify-center mb-6">
        <button className={tabCls(activeTab === 'letters')} onClick={() => setActiveTab('letters')}>
          Letters
        </button>
        <button className={tabCls(activeTab === 'donate')} onClick={() => setActiveTab('donate')}>
          {t('donate.admin_title')}
        </button>
        <button className={tabCls(activeTab === 'sections')} onClick={() => setActiveTab('sections')}>
          {t('admin_sections')}
        </button>
      </div>

      {activeTab === 'letters' && (
        <>
          <h1 className="font-cinzel text-[0.7rem] tracking-[4px] text-[#9a8a6a] uppercase text-center mb-6">
            Admin — Letters Management
          </h1>

          {msg && (
            <p className="font-cinzel text-xs text-[#4caf78] tracking-widest text-center mb-4">{msg}</p>
          )}

          {loading ? (
            <p className="font-cinzel text-xs text-[#9a8a6a] text-center tracking-widest py-10">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(201,168,76,0.15)]">
                    <th className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase py-3 px-2 text-left">#</th>
                    <th className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase py-3 px-2 text-center">Letter</th>
                    <th className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase py-3 px-2 text-left">Name RU</th>
                    <th className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase py-3 px-2 text-left">Name UZ</th>
                    <th className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase py-3 px-2 text-left">Name EN</th>
                    <th className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase py-3 px-2 text-left">Assoc RU</th>
                    <th className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase py-3 px-2 text-left">Assoc UZ</th>
                    <th className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase py-3 px-2 text-left">Assoc EN</th>
                    <th className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase py-3 px-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {letters.map(letter => (
                    <tr key={letter.code}
                        className="border-b border-[rgba(201,168,76,0.08)] hover:bg-[rgba(201,168,76,0.03)] transition-colors">
                      {editing === letter.code ? (
                        <>
                          <td className="py-2 px-2 font-cinzel text-xs text-[#9a8a6a]">{letter.index}</td>
                          <td className="py-2 px-2 text-center">
                            <span className="font-scheherazade text-2xl text-gold-light">{letter.code}</span>
                          </td>
                          <td className="py-2 px-2">
                            <input className={inputCls} value={form.nameRu ?? ''} onChange={e => setForm({...form, nameRu: e.target.value})} />
                          </td>
                          <td className="py-2 px-2">
                            <input className={inputCls} value={form.nameUz ?? ''} onChange={e => setForm({...form, nameUz: e.target.value})} />
                          </td>
                          <td className="py-2 px-2">
                            <input className={inputCls} value={form.nameEn ?? ''} onChange={e => setForm({...form, nameEn: e.target.value})} />
                          </td>
                          <td className="py-2 px-2">
                            <input className={inputCls} value={form.associationRu ?? ''} onChange={e => setForm({...form, associationRu: e.target.value})} />
                          </td>
                          <td className="py-2 px-2">
                            <input className={inputCls} value={form.associationUz ?? ''} onChange={e => setForm({...form, associationUz: e.target.value})} />
                          </td>
                          <td className="py-2 px-2">
                            <input className={inputCls} value={form.associationEn ?? ''} onChange={e => setForm({...form, associationEn: e.target.value})} />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <div className="flex gap-1 justify-center">
                              <Button size="sm" onClick={() => saveEdit(letter.code)} disabled={saving}>
                                {saving ? '...' : 'Save'}
                              </Button>
                              <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-2 px-2 font-cinzel text-xs text-[#9a8a6a]">{letter.index}</td>
                          <td className="py-2 px-2 text-center">
                            <span className="font-scheherazade text-2xl text-gold-light">{letter.code}</span>
                          </td>
                          <td className="py-2 px-2 font-raleway text-xs text-[#f0e6cc]">{letter.nameRu}</td>
                          <td className="py-2 px-2 font-raleway text-xs text-[#f0e6cc]">{letter.nameUz}</td>
                          <td className="py-2 px-2 font-raleway text-xs text-[#f0e6cc]">{letter.nameEn}</td>
                          <td className="py-2 px-2 font-raleway text-xs text-[#9a8a6a]">{letter.associationRu}</td>
                          <td className="py-2 px-2 font-raleway text-xs text-[#9a8a6a]">{letter.associationUz}</td>
                          <td className="py-2 px-2 font-raleway text-xs text-[#9a8a6a]">{letter.associationEn}</td>
                          <td className="py-2 px-2 text-center">
                            <Button size="sm" variant="outline" onClick={() => startEdit(letter)}>Edit</Button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === 'sections' && (
        <div className="max-w-xl mx-auto">
          <h1 className="font-cinzel text-[0.7rem] tracking-[4px] text-[#9a8a6a] uppercase text-center mb-6">
            {t('admin_sections')}
          </h1>

          {sectionsMsg && (
            <p className={`font-cinzel text-xs tracking-widest text-center mb-4 ${
              sectionsMsg === t('sections_saved') ? 'text-[#4caf78]' : 'text-[#c95050]'
            }`}>{sectionsMsg}</p>
          )}

          {sectionsLoading ? (
            <p className="font-cinzel text-xs text-[#9a8a6a] text-center tracking-widest py-10">Loading...</p>
          ) : (
            <div className="space-y-4">
              {Object.keys(SECTION_LABELS).map((key) => {
                const label = SECTION_LABELS[key];
                const displayLabel = lang === 'ru' ? label.ru : lang === 'en' ? label.en : label.uz;
                const isOn = sectionsData[key] !== false;
                return (
                  <label key={key} className="flex items-center justify-between gap-3 cursor-pointer group
                                              bg-[rgba(255,255,255,0.02)] border border-[rgba(201,168,76,0.1)]
                                              rounded-xl px-4 py-3 hover:border-[rgba(201,168,76,0.25)] transition-all">
                    <div>
                      <span className="font-cinzel text-xs tracking-widest text-[#f0e6cc] uppercase">
                        {displayLabel}
                      </span>
                      <span className="font-cinzel text-[0.5rem] tracking-widest text-[#9a8a6a] ml-2">
                        ({key})
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isOn}
                        onChange={(e) => setSectionsData(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[rgba(255,255,255,0.08)] border border-[rgba(201,168,76,0.2)]
                                      rounded-full peer-checked:bg-[rgba(201,168,76,0.3)]
                                      peer-checked:border-[rgba(201,168,76,0.5)] transition-all" />
                      <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-[#9a8a6a] rounded-full
                                      peer-checked:translate-x-5 peer-checked:bg-gold-light transition-all" />
                    </div>
                  </label>
                );
              })}

              <div className="pt-2">
                <Button onClick={saveSections} disabled={sectionsSaving}>
                  {sectionsSaving ? '...' : t('save')}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'donate' && (
        <div className="max-w-xl mx-auto">
          <h1 className="font-cinzel text-[0.7rem] tracking-[4px] text-[#9a8a6a] uppercase text-center mb-6">
            {t('donate.admin_title')}
          </h1>

          {donateMsg && (
            <p className={`font-cinzel text-xs tracking-widest text-center mb-4 ${
              donateMsg === t('donate.saved') ? 'text-[#4caf78]' : 'text-[#c95050]'
            }`}>{donateMsg}</p>
          )}

          {donateLoading ? (
            <p className="font-cinzel text-xs text-[#9a8a6a] text-center tracking-widest py-10">Loading...</p>
          ) : (
            <div className="space-y-5">
              {/* Enabled toggle */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={donateForm.enabled}
                    onChange={e => setDonateForm(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[rgba(255,255,255,0.08)] border border-[rgba(201,168,76,0.2)]
                                  rounded-full peer-checked:bg-[rgba(201,168,76,0.3)]
                                  peer-checked:border-[rgba(201,168,76,0.5)] transition-all" />
                  <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-[#9a8a6a] rounded-full
                                  peer-checked:translate-x-5 peer-checked:bg-gold-light transition-all" />
                </div>
                <span className="font-cinzel text-xs tracking-widest text-[#f0e6cc] uppercase">
                  {t('donate.enabled')}
                </span>
              </label>

              {/* Title */}
              <div>
                <label className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase block mb-1">
                  {t('donate.title_label')}
                </label>
                <input
                  className={inputCls}
                  value={donateForm.title}
                  onChange={e => setDonateForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase block mb-1">
                  {t('donate.description_label')}
                </label>
                <textarea
                  className={`${inputCls} min-h-[80px] resize-y`}
                  value={donateForm.description}
                  onChange={e => setDonateForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase block mb-1">
                  {t('donate.card_number')}
                </label>
                <input
                  className={inputCls}
                  value={donateForm.cardNumber}
                  onChange={e => setDonateForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                  placeholder="8600 1234 5678 9012"
                />
              </div>

              {/* Card Holder */}
              <div>
                <label className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase block mb-1">
                  {t('donate.card_holder')}
                </label>
                <input
                  className={inputCls}
                  value={donateForm.cardHolder}
                  onChange={e => setDonateForm(prev => ({ ...prev, cardHolder: e.target.value }))}
                />
              </div>

              {/* Links */}
              <div>
                <label className="font-cinzel text-[0.55rem] tracking-widest text-[#9a8a6a] uppercase block mb-2">
                  {t('donate.links')}
                </label>
                <div className="space-y-2">
                  {donateForm.links.map((link, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        className={`${inputCls} flex-1`}
                        value={link.name}
                        onChange={e => updateDonateLink(i, 'name', e.target.value)}
                        placeholder={t('donate.link_name')}
                      />
                      <input
                        className={`${inputCls} flex-1`}
                        value={link.url}
                        onChange={e => updateDonateLink(i, 'url', e.target.value)}
                        placeholder={t('donate.link_url')}
                      />
                      <button
                        onClick={() => removeDonateLink(i)}
                        className="text-[#c95050] hover:text-[#ff6666] transition-colors text-lg px-2 shrink-0"
                        title="Remove"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addDonateLink}
                  className="mt-2 font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a]
                             hover:text-gold-light uppercase transition-colors"
                >
                  + {t('donate.add_link')}
                </button>
              </div>

              {/* Save */}
              <div className="pt-2">
                <Button onClick={saveDonate} disabled={donateSaving}>
                  {donateSaving ? '...' : t('donate.save')}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
