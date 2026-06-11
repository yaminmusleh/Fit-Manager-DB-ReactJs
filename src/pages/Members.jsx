import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const gymTheme = createTheme({
  palette: { mode: "dark", primary: { main: "#FF5722" }, background: { default: "#0D0D0D" } },
  typography: { fontFamily: "'Inter', sans-serif" },
});

const API = "http://localhost:5000";

const STATUS_COLORS = {
  Active:    { bg: "rgba(34,197,94,0.1)",  text: "#22c55e", dot: "#22c55e" },
  Expired:   { bg: "rgba(239,68,68,0.1)",  text: "#ef4444", dot: "#ef4444" },
  Suspended: { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", dot: "#f59e0b" },
};

const EMPTY_FORM = {
  member_id: "", first_name: "", last_name: "",
  gender: "Male", age: "", phone_number: "", email: "", registration_date: "",
};

// ── Shared field style helpers ──────────────────────────────────────
const inputStyle = {
  background: "#0D0D0D", border: "1px solid #2a2a2a",
  borderRadius: 5, padding: "9px 11px",
  color: "#F0EDE8", fontFamily: "Inter, sans-serif",
  fontSize: "0.85rem", outline: "none",
  transition: "border-color 0.15s", width: "100%", boxSizing: "border-box",
};
const labelStyle = {
  fontFamily: "Inter, sans-serif", fontSize: "0.65rem",
  fontWeight: 600, letterSpacing: "0.1em",
  textTransform: "capitalize", color: "#555",
};
const btnPrimary = (disabled) => ({
  background: disabled ? "#7a2d16" : "#FF5722",
  border: "none", borderRadius: 5,
  padding: "9px 22px", color: "#0D0D0D",
  fontFamily: "Inter, sans-serif", fontWeight: 700,
  fontSize: "0.85rem", cursor: disabled ? "not-allowed" : "pointer",
  transition: "background 0.15s", textTransform: "capitalize",
});
const btnSecondary = {
  background: "none", border: "1px solid #2a2a2a",
  borderRadius: 5, padding: "9px 18px",
  color: "#888", fontFamily: "Inter, sans-serif",
  fontSize: "0.82rem", cursor: "pointer",
  textTransform: "capitalize",
};
const btnDanger = (disabled) => ({
  background: disabled ? "#7a1c1c" : "#ef4444",
  border: "none", borderRadius: 5,
  padding: "9px 22px", color: "#fff",
  fontFamily: "Inter, sans-serif", fontWeight: 700,
  fontSize: "0.85rem", cursor: disabled ? "not-allowed" : "pointer",
  textTransform: "capitalize",
});

function FieldRow({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

// ─ Status Badge ─
function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || { bg: "#1e1e1e", text: "#555", dot: "#555" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.text, fontSize: "0.7rem", fontWeight: 700,
      letterSpacing: "0.06em", textTransform: "capitalize",
      padding: "3px 9px", borderRadius: 3, fontFamily: "Inter, sans-serif",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {status ?? "Unknown"}
    </span>
  );
}

// ─ Member Card ─
function MemberCard({ member, membership, selected, onToggleSelect, onEdit, onReactivate }) {
  const [open, setOpen] = useState(false);
  const fullName = `${member.first_name} ${member.last_name}`;
  const initials = `${member.first_name[0]}${member.last_name[0]}`.toUpperCase();
  const isExpired = membership?.status === "Expired" || membership?.status === "Suspended";

  return (
    <div style={{
      background: selected ? "rgba(239,68,68,0.05)" : "#111",
      border: `1px solid ${selected ? "rgba(239,68,68,0.3)" : open ? "#2a2a2a" : "#1a1a1a"}`,
      borderRadius: 8, overflow: "hidden",
      transition: "border-color 0.2s, background 0.2s",
    }}>
      {/* Main row */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", userSelect: "none" }}>

        {/* Checkbox */}
        <div onClick={() => onToggleSelect(member.member_id)} style={{
          width: 18, height: 18, borderRadius: 4, flexShrink: 0,
          border: `2px solid ${selected ? "#ef4444" : "#2a2a2a"}`,
          background: selected ? "rgba(239,68,68,0.15)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.15s",
        }}>
          {selected && <span style={{ color: "#ef4444", fontSize: "0.65rem", lineHeight: 1, fontWeight: 700 }}>✕</span>}
        </div>

        {/* Avatar */}
        <div onClick={() => setOpen(v => !v)} style={{
          width: 44, height: 44, borderRadius: 6,
          background: "#1a1a1a", border: "1px solid #222",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, overflow: "hidden", cursor: "pointer",
        }}>
          <img src="/broken" alt={fullName}
            onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <span style={{
            display: "none", width: "100%", height: "100%",
            alignItems: "center", justifyContent: "center",
            fontFamily: "Barlow Condensed, sans-serif",
            fontWeight: 800, fontSize: "1rem", color: "#FF5722",
          }}>{initials}</span>
        </div>

        {/* Name + ID */}
        <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => setOpen(v => !v)}>
          <div style={{
            fontFamily: "Barlow Condensed, sans-serif", fontWeight: 800,
            fontSize: "1rem", letterSpacing: "0.04em", textTransform: "capitalize",
            color: "#F0EDE8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{fullName}</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "#444", marginTop: 1, fontWeight: 500 }}>
            ID #{member.member_id} · {member.gender}
          </div>
        </div>

        {/* Right: badge + chevron */}
        <div onClick={() => setOpen(v => !v)} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          {membership && <StatusBadge status={membership.status} />}
          <span style={{
            color: "#444", fontSize: "0.75rem",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s", display: "inline-block", lineHeight: 1,
          }}>▼</span>
        </div>
      </div>

      {/* Expanded panel */}
      <div style={{ maxHeight: open ? 400 : 0, overflow: "hidden", transition: "max-height 0.25s ease" }}>
        <div style={{
          borderTop: "1px solid #1a1a1a", padding: "16px 18px 18px",
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "14px 24px",
        }}>
          {[
            { label: "Email",           value: member.email || "—" },
            { label: "Phone",           value: member.phone_number || "—" },
            { label: "Age",             value: member.age ? `${member.age} yrs` : "—" },
            { label: "Registered",      value: member.registration_date?.slice(0, 10) || "—" },
            { label: "Membership type", value: membership?.membership_type || "—" },
            { label: "Plan start",      value: membership?.start_date?.slice(0, 10) || "—" },
            { label: "Plan end",        value: membership?.end_date?.slice(0, 10) || "—" },
            { label: "Status",          value: membership ? <StatusBadge status={membership.status} /> : "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{
                fontFamily: "Inter, sans-serif", fontSize: "0.65rem", color: "#444",
                fontWeight: 600, letterSpacing: "0.1em", textTransform: "capitalize", marginBottom: 3,
              }}>{label}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "#ccc", wordBreak: "break-all" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Action buttons inside expanded */}
        <div style={{ padding: "0 18px 16px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => onEdit(member)}
            style={{
              background: "none", border: "1px solid #2a2a2a", borderRadius: 5,
              padding: "7px 14px", color: "#aaa",
              fontFamily: "Inter, sans-serif", fontSize: "0.78rem",
              fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={e => { e.target.style.borderColor = "#FF5722"; e.target.style.color = "#FF5722"; }}
            onMouseLeave={e => { e.target.style.borderColor = "#2a2a2a"; e.target.style.color = "#aaa"; }}
          >
            Edit info
          </button>

          {isExpired && membership && (
            <button
              onClick={() => onReactivate(member, membership)}
              style={{
                background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)",
                borderRadius: 5, padding: "7px 14px", color: "#22c55e",
                fontFamily: "Inter, sans-serif", fontSize: "0.78rem",
                fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.target.style.background = "rgba(34,197,94,0.15)"}
              onMouseLeave={e => e.target.style.background = "rgba(34,197,94,0.08)"}
            >
              Reactivate membership
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─ Modal wrapper ─
function GymModal({ open, onClose, title, subtitle, children }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#111", border: "1px solid #1e1e1e",
        borderRadius: 10, padding: "28px 28px 24px",
        width: "min(520px, 92vw)", maxHeight: "88vh",
        overflowY: "auto", outline: "none",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <div>
            <div style={{
              fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900,
              fontSize: "1.4rem", letterSpacing: "0.04em",
              textTransform: "capitalize", color: "#F0EDE8",
            }}>{title}</div>
            {subtitle && <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#444", marginTop: 2 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#444", fontSize: "1.1rem", cursor: "pointer", padding: 4 }}>✕</button>
        </div>
        {children}
      </div>
    </Modal>
  );
}

// ─ Add Member Modal ─
function AddMemberModal({ open, onClose, onAdded }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function handleSave() {
    setErr("");
    if (!form.member_id || !form.first_name || !form.last_name || !form.age) {
      setErr("Member ID, name and age are required."); return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/members`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age), member_id: Number(form.member_id) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add member.");
      onAdded(); setForm(EMPTY_FORM); onClose();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  }

  return (
    <GymModal open={open} onClose={onClose} title="Add member" subtitle="New record will be saved to the database">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
        {[
          ["member_id", "Member ID", "number"],
          ["registration_date", "Registration date", "date"],
          ["first_name", "First name", "text"],
          ["last_name", "Last name", "text"],
          ["age", "Age", "number"],
          ["phone_number", "Phone number", "text"],
          ["email", "Email", "email"],
        ].map(([key, label, type]) => (
          <FieldRow key={key} label={label}>
            <input type={type} value={form[key]} onChange={e => set(key, e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#FF5722"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
            />
          </FieldRow>
        ))}
        <FieldRow label="Gender">
          <select value={form.gender} onChange={e => set("gender", e.target.value)} style={inputStyle}>
            <option>Male</option><option>Female</option>
          </select>
        </FieldRow>
      </div>
      {err && <div style={{ marginTop: 14, padding: "9px 12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 5, color: "#ef4444", fontFamily: "Inter", fontSize: "0.78rem" }}>{err}</div>}
      <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
        <button onClick={onClose} style={btnSecondary}>Cancel</button>
        <button onClick={handleSave} disabled={saving} style={btnPrimary(saving)}>{saving ? "Saving…" : "Add member"}</button>
      </div>
    </GymModal>
  );
}

// ─ Edit Member Modal ─
function EditMemberModal({ open, onClose, member, onSaved }) {
  const [form, setForm] = useState({ first_name: "", last_name: "", phone_number: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (member) setForm({
      first_name: member.first_name || "",
      last_name: member.last_name || "",
      phone_number: member.phone_number || "",
      email: member.email || "",
    });
  }, [member]);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  async function handleSave() {
    setErr("");
    if (!form.first_name || !form.last_name) { setErr("First and last name are required."); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/members/${member.member_id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update.");
      onSaved({ ...member, ...form }); onClose();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  }

  return (
    <GymModal open={open} onClose={onClose} title="Edit member" subtitle={member ? `Editing ID #${member.member_id}` : ""}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
        {[["first_name","First name"],["last_name","Last name"],["phone_number","Phone number"],["email","Email"]].map(([key, label]) => (
          <FieldRow key={key} label={label}>
            <input value={form[key]} onChange={e => set(key, e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#FF5722"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
            />
          </FieldRow>
        ))}
      </div>
      {err && <div style={{ marginTop: 14, padding: "9px 12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 5, color: "#ef4444", fontFamily: "Inter", fontSize: "0.78rem" }}>{err}</div>}
      <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
        <button onClick={onClose} style={btnSecondary}>Cancel</button>
        <button onClick={handleSave} disabled={saving} style={btnPrimary(saving)}>{saving ? "Saving…" : "Save changes"}</button>
      </div>
    </GymModal>
  );
}

// ─ Reactivate Modal ─
function ReactivateModal({ open, onClose, member, membership, onSaved }) {
  const today = new Date().toISOString().slice(0, 10);
  const oneYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10);
  const [form, setForm] = useState({ start_date: today, end_date: oneYear });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => { if (open) setForm({ start_date: today, end_date: oneYear }); }, [open]);

  async function handleSave() {
    setErr("");
    if (!form.start_date || !form.end_date) { setErr("Both dates are required."); return; }
    if (form.end_date <= form.start_date) { setErr("End date must be after start date."); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/memberships/${membership.membership_id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Active", start_date: form.start_date, end_date: form.end_date }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reactivate.");
      onSaved({ ...membership, status: "Active", start_date: form.start_date, end_date: form.end_date });
      onClose();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  }

  return (
    <GymModal open={open} onClose={onClose} title="Reactivate membership" subtitle={member ? `${member.first_name} ${member.last_name} · ID #${member.member_id}` : ""}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
        <FieldRow label="New start date">
          <input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#22c55e"}
            onBlur={e => e.target.style.borderColor = "#2a2a2a"}
          />
        </FieldRow>
        <FieldRow label="New end date">
          <input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#22c55e"}
            onBlur={e => e.target.style.borderColor = "#2a2a2a"}
          />
        </FieldRow>
      </div>
      {err && <div style={{ marginTop: 14, padding: "9px 12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 5, color: "#ef4444", fontFamily: "Inter", fontSize: "0.78rem" }}>{err}</div>}
      <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
        <button onClick={onClose} style={btnSecondary}>Cancel</button>
        <button onClick={handleSave} disabled={saving} style={{
          ...btnPrimary(saving), background: saving ? "#166534" : "#22c55e",
        }}>{saving ? "Saving…" : "Reactivate"}</button>
      </div>
    </GymModal>
  );
}

// ─ Confirm Delete Modal ─
function ConfirmDeleteModal({ open, count, onConfirm, onCancel, deleting }) {
  return (
    <Modal open={open} onClose={onCancel}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#111", border: "1px solid #2a2a2a",
        borderRadius: 10, padding: "28px", width: "min(400px, 90vw)", outline: "none",
      }}>
        <div style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900, fontSize: "1.3rem", textTransform: "capitalize", color: "#ef4444", marginBottom: 10 }}>
          Delete {count} member{count > 1 ? "s" : ""}?
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "#888", lineHeight: 1.6, marginBottom: 22 }}>
          This will permanently remove {count === 1 ? "this member" : `these ${count} members`} from the database. This action cannot be undone.
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={btnSecondary}>Cancel</button>
          <button onClick={onConfirm} disabled={deleting} style={btnDanger(deleting)}>
            {deleting ? "Deleting…" : `Delete ${count}`}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─ Main Page ─
export default function Members() {
  const [members, setMembers]         = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [search, setSearch]           = useState("");
  const [selected, setSelected]       = useState(new Set());
  const [addOpen, setAddOpen]         = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting]       = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [reactivateTarget, setReactivateTarget] = useState({ member: null, membership: null });

  async function load() {
    setLoading(true); setError(null);
    try {
      const [mRes, msRes] = await Promise.all([fetch(`${API}/api/members`), fetch(`${API}/api/memberships`)]);
      const [mData, msData] = await Promise.all([mRes.json(), msRes.json()]);
      setMembers(mData); setMemberships(msData);
    } catch { setError("Could not reach the server. Make sure it's running on port 5000."); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const getMembership = (id) => memberships.find(ms => ms.member_id === id);

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    return !q || m.first_name.toLowerCase().includes(q) || m.last_name.toLowerCase().includes(q)
      || String(m.member_id).includes(q) || m.email?.toLowerCase().includes(q);
  });

  function toggleSelect(id) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await Promise.all([...selected].map(id => fetch(`${API}/api/members/${id}`, { method: "DELETE" })));
      // instant UI update — remove deleted members immediately
      setMembers(prev => prev.filter(m => !selected.has(m.member_id)));
      setSelected(new Set()); setConfirmOpen(false);
    } catch { setConfirmOpen(false); }
    finally { setDeleting(false); }
  }

  // Instant UI update for edit — no refetch needed
  function handleMemberSaved(updated) {
    setMembers(prev => prev.map(m => m.member_id === updated.member_id ? updated : m));
  }

  // Instant UI update for reactivate — no refetch needed
  function handleMembershipSaved(updated) {
    setMemberships(prev => prev.map(ms => ms.membership_id === updated.membership_id ? updated : ms));
  }

  return (
    <ThemeProvider theme={gymTheme}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');
        .fm-search {
          width: 100%; background: #111; border: 1px solid #1e1e1e;
          border-radius: 6px; padding: 10px 14px; color: #F0EDE8;
          font-family: Inter, sans-serif; font-size: 0.85rem;
          outline: none; transition: border-color 0.15s; box-sizing: border-box;
        }
        .fm-search::placeholder { color: #333; }
        .fm-search:focus { border-color: #FF5722; }
      `}</style>

      <Box sx={{ minHeight: "100vh", background: "#0D0D0D", px: { xs: 2, sm: 4, md: 6 }, py: { xs: 4, md: 5 }, pb: selected.size > 0 ? "90px" : undefined }}>

        {/* Header */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <div>
            <Typography sx={{ fontFamily: "Inter", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "capitalize", color: "#444", mb: 1 }}>
              FitManager DB
            </Typography>
            <Typography sx={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "0.03em", textTransform: "capitalize", color: "#F0EDE8", lineHeight: 1 }}>
              Members
              <span style={{ color: "#FF5722", marginLeft: 12, fontSize: "0.55em", verticalAlign: "middle" }}>
                {loading ? "…" : filtered.length}
              </span>
            </Typography>
          </div>
          <button onClick={() => setAddOpen(true)} style={{
            background: "#FF5722", border: "none", borderRadius: 6,
            padding: "10px 20px", color: "#0D0D0D",
            fontFamily: "Inter, sans-serif", fontWeight: 700,
            fontSize: "0.88rem", cursor: "pointer", flexShrink: 0,
            textTransform: "capitalize", transition: "background 0.15s, transform 0.12s",
          }}
            onMouseEnter={e => { e.target.style.background = "#FF7043"; e.target.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.target.style.background = "#FF5722"; e.target.style.transform = "none"; }}
          >
            + Add member
          </button>
        </Box>

        {/* Search */}
        <Box sx={{ mb: 3, maxWidth: 420 }}>
          <input className="fm-search" placeholder="Search by name, ID or email…" value={search} onChange={e => setSearch(e.target.value)} />
        </Box>

        {loading && <Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#444" }}>Loading members…</Typography>}
        {error && <Box sx={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 2, p: 2 }}><Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#ef4444" }}>{error}</Typography></Box>}
        {!loading && !error && filtered.length === 0 && <Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#444" }}>No members match "{search}".</Typography>}

        {/* Cards */}
        {!loading && !error && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {filtered.map(member => (
              <MemberCard
                key={member.member_id}
                member={member}
                membership={getMembership(member.member_id)}
                selected={selected.has(member.member_id)}
                onToggleSelect={toggleSelect}
                onEdit={m => setEditTarget(m)}
                onReactivate={(m, ms) => setReactivateTarget({ member: m, membership: ms })}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Floating delete bar */}
      {selected.size > 0 && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10,
          padding: "12px 18px", display: "flex", alignItems: "center", gap: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)", zIndex: 1000, whiteSpace: "nowrap",
        }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "#888", fontWeight: 500 }}>
            <span style={{ color: "#F0EDE8", fontWeight: 700 }}>{selected.size}</span> member{selected.size > 1 ? "s" : ""} selected
          </span>
          <button onClick={() => setSelected(new Set())} style={{ background: "none", border: "1px solid #2a2a2a", borderRadius: 5, padding: "6px 12px", color: "#666", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", cursor: "pointer", textTransform: "capitalize" }}>Clear</button>
          <button onClick={() => setConfirmOpen(true)} style={{ background: "#ef4444", border: "none", borderRadius: 5, padding: "7px 16px", color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", textTransform: "capitalize" }}>
            Delete {selected.size} member{selected.size > 1 ? "s" : ""}
          </button>
        </div>
      )}

      <AddMemberModal open={addOpen} onClose={() => setAddOpen(false)} onAdded={() => { load(); }} />

      <EditMemberModal
        open={!!editTarget} member={editTarget}
        onClose={() => setEditTarget(null)}
        onSaved={handleMemberSaved}
      />

      <ReactivateModal
        open={!!reactivateTarget.member}
        member={reactivateTarget.member}
        membership={reactivateTarget.membership}
        onClose={() => setReactivateTarget({ member: null, membership: null })}
        onSaved={handleMembershipSaved}
      />

      <ConfirmDeleteModal
        open={confirmOpen} count={selected.size}
        onConfirm={handleDelete} onCancel={() => setConfirmOpen(false)}
        deleting={deleting}
      />
    </ThemeProvider>
  );
}