import { useState, useEffect } from 'react';
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

export function AdminPage() {
  const user = useAuthStore(s => s.user);
  const [letters, setLetters] = useState<LetterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<LetterRow>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/admin/letters')
      .then(res => setLetters(res.data.data ?? res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
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

  const inputCls = `w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.2)]
                    rounded-lg px-3 py-1.5 text-[#f0e6cc] font-raleway text-xs
                    outline-none focus:border-gold-dim transition-colors`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
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
    </div>
  );
}
