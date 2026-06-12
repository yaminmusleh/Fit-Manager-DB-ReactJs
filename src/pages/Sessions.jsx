import { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: { mode: "dark", primary: { main: "#FF5722" } },
  typography: { fontFamily: "'Inter', sans-serif" },
});

const API = "http://localhost:5000";

const SPEC_COLORS = {
  "Weight Training":       "#f59e0b",
  "Yoga":                  "#a78bfa",
  "Cardio Fitness":        "#22c55e",
  "CrossFit":              "#ef4444",
  "Bodybuilding":          "#FF5722",
  "Pilates":               "#ec4899",
  "Strength Training":     "#f59e0b",
  "Aerobics":              "#06b6d4",
  "Sports Rehabilitation": "#10b981",
  "Nutrition & Fitness":   "#84cc16",
  "Functional Training":   "#3b82f6",
  "Personal Training":     "#e879f9",
};
function trainerColor(trainer) {
  return SPEC_COLORS[trainer?.specialization] || "#8b92b0";
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const inputStyle = {
  width: "100%", background: "#0d0f17", border: "1px solid #2a2a3a",
  borderRadius: 5, padding: "9px 11px", color: "#eef0f4",
  fontFamily: "Inter, sans-serif", fontSize: "0.85rem",
  outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
};
const labelStyle = {
  fontFamily: "Inter, sans-serif", fontSize: "0.63rem", fontWeight: 600,
  letterSpacing: "0.1em", textTransform: "capitalize", color: "#4a5068",
};

function FieldRow({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ""; }

// ── Add Session Modal ───────────────────────────────────────────────
function AddSessionModal({ open, onClose, date, trainer, members, onSaved }) {
  const [tab, setTab]         = useState("existing"); // "existing" | "new"
  const [memberId, setMemberId] = useState("");
  const [sessionTime, setSessionTime] = useState("09:00");
  const [duration, setDuration] = useState("60");
  const [saving, setSaving]   = useState(false);
  const [err, setErr]         = useState("");

  const [newForm, setNewForm] = useState({
    member_id: "", first_name: "", last_name: "",
    gender: "Male", age: "", phone_number: "", email: "", registration_date: "",
  });

  useEffect(() => {
    if (open) {
      setTab("existing"); setMemberId(""); setErr("");
      setSessionTime("09:00"); setDuration("60");
      setNewForm({ member_id: "", first_name: "", last_name: "", gender: "Male", age: "", phone_number: "", email: "", registration_date: date || "" });
    }
  }, [open, date]);

  function setN(key, val) { setNewForm(f => ({ ...f, [key]: val })); }

  async function handleSave() {
    setErr("");
    let finalMemberId = memberId;

    // If new member tab — create member first
    if (tab === "new") {
      if (!newForm.member_id || !newForm.first_name || !newForm.last_name || !newForm.age) {
        setErr("Member ID, name and age are required."); return;
      }
      setSaving(true);
      try {
        const mRes = await fetch(`${API}/api/members`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newForm, age: Number(newForm.age), member_id: Number(newForm.member_id) }),
        });
        const mData = await mRes.json();
        if (!mRes.ok) throw new Error(mData.error || "Failed to add member.");
        finalMemberId = newForm.member_id;
      } catch (e) { setErr(e.message); setSaving(false); return; }
    } else {
      if (!memberId) { setErr("Please select a member."); return; }
      setSaving(true);
    }

    // Create the session
    try {
      const sRes = await fetch(`${API}/api/sessions`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_id: Number(finalMemberId),
          trainer_id: trainer.trainer_id,
          session_date: date,
          session_time: sessionTime + ":00",
          duration_minutes: Number(duration),
        }),
      });
      const sData = await sRes.json();
      if (!sRes.ok) throw new Error(sData.error || "Failed to add session.");
      onSaved(); onClose();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  }

  const color = trainerColor(trainer);

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#13151a", border: "1px solid #252836",
        borderRadius: 12, padding: "28px",
        width: "min(540px, 93vw)", maxHeight: "90vh",
        overflowY: "auto", outline: "none",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{
              fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900,
              fontSize: "1.4rem", color: "#eef0f4", textTransform: "capitalize",
            }}>
              Book a session
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#4a5068", marginTop: 3 }}>
              <span style={{ color }}>{cap(trainer?.first_name)} {cap(trainer?.last_name)}</span>
              {" · "}{date}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#4a5068", fontSize: "1.1rem", cursor: "pointer" }}>✕</button>
        </div>

        {/* Session time + duration */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px", marginBottom: 20 }}>
          <FieldRow label="Session time">
            <input type="time" value={sessionTime} onChange={e => setSessionTime(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = color}
              onBlur={e => e.target.style.borderColor = "#2a2a3a"}
            />
          </FieldRow>
          <FieldRow label="Duration (minutes)">
            <select value={duration} onChange={e => setDuration(e.target.value)} style={inputStyle}>
              {["30","45","60","90","120"].map(d => <option key={d}>{d}</option>)}
            </select>
          </FieldRow>
        </div>

        {/* Divider + tab label */}
        <div style={{ height: 1, background: "#252836", marginBottom: 16 }} />

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {[["existing", "Existing member"], ["new", "New member"]].map(([val, lbl]) => (
            <button key={val} onClick={() => setTab(val)} style={{
              background: tab === val ? `${color}18` : "none",
              border: `1px solid ${tab === val ? color + "44" : "#252836"}`,
              borderRadius: 6, padding: "7px 16px",
              fontFamily: "Inter, sans-serif", fontSize: "0.78rem",
              fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
              color: tab === val ? color : "#4a5068",
              transition: "all 0.15s",
            }}>{lbl}</button>
          ))}
        </div>

        {/* Existing member tab */}
        {tab === "existing" && (
          <FieldRow label="Select member">
            <select value={memberId} onChange={e => setMemberId(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.borderColor = color}
              onBlur={e => e.target.style.borderColor = "#2a2a3a"}
            >
              <option value="">— Choose a member —</option>
              {members.map(m => (
                <option key={m.member_id} value={m.member_id}>
                  #{m.member_id} · {cap(m.first_name)} {cap(m.last_name)}
                </option>
              ))}
            </select>
          </FieldRow>
        )}

        {/* New member tab */}
        {tab === "new" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" }}>
            {[
              ["member_id",        "Member ID",         "number"],
              ["registration_date","Registration date", "date"],
              ["first_name",       "First name",        "text"],
              ["last_name",        "Last name",         "text"],
              ["age",              "Age",               "number"],
              ["phone_number",     "Phone",             "text"],
              ["email",            "Email",             "email"],
            ].map(([key, lbl, type]) => (
              <FieldRow key={key} label={lbl}>
                <input type={type} value={newForm[key]} onChange={e => setN(key, e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = color}
                  onBlur={e => e.target.style.borderColor = "#2a2a3a"}
                />
              </FieldRow>
            ))}
            <FieldRow label="Gender">
              <select value={newForm.gender} onChange={e => setN("gender", e.target.value)} style={inputStyle}>
                <option>Male</option><option>Female</option>
              </select>
            </FieldRow>
          </div>
        )}

        {err && (
          <div style={{
            marginTop: 14, padding: "9px 12px",
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 5, color: "#ef4444",
            fontFamily: "Inter, sans-serif", fontSize: "0.78rem",
          }}>{err}</div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            background: "none", border: "1px solid #252836", borderRadius: 5,
            padding: "9px 18px", color: "#4a5068",
            fontFamily: "Inter, sans-serif", fontSize: "0.82rem", cursor: "pointer",
            textTransform: "capitalize",
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{
            background: saving ? "#7a2d16" : color,
            border: "none", borderRadius: 5, padding: "9px 22px",
            color: "#0d0f17", fontFamily: "Inter, sans-serif",
            fontWeight: 700, fontSize: "0.85rem",
            cursor: saving ? "not-allowed" : "pointer",
            textTransform: "capitalize", transition: "background 0.15s",
          }}>
            {saving ? "Booking…" : "Book session"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Calendar ────────────────────────────────────────────────────────
function Calendar({ year, month, sessions, trainer, onDayClick }) {
  const color = trainerColor(trainer);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const sessionsByDate = useMemo(() => {
    const map = {};
    sessions.forEach(s => {
      const d = s.session_date?.slice(0, 10);
      if (!map[d]) map[d] = [];
      map[d].push(s);
    });
    return map;
  }, [sessions]);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
        {DAYS.map(d => (
          <div key={d} style={{
            textAlign: "center", fontFamily: "Inter, sans-serif",
            fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "capitalize", color: "#3a4060", padding: "6px 0",
          }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const daySessions = sessionsByDate[dateStr] || [];
          const hasSessions = daySessions.length > 0;
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

          return (
            <div
              key={day}
              onClick={() => onDayClick(dateStr, daySessions)}
              style={{
                minHeight: 70, borderRadius: 8, padding: "8px 7px",
                background: hasSessions ? `${color}0f` : "#1d2130",
                border: `1px solid ${isToday ? color + "66" : hasSessions ? color + "22" : "#252836"}`,
                cursor: "pointer", transition: "all 0.15s",
                position: "relative", boxSizing: "border-box",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = hasSessions ? `${color}22` : "rgba(34,197,94,0.08)";
                e.currentTarget.style.borderColor = hasSessions ? color + "55" : "rgba(34,197,94,0.35)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = hasSessions ? `${color}0f` : "#1d2130";
                e.currentTarget.style.borderColor = isToday ? color + "66" : hasSessions ? color + "22" : "#252836";
              }}
            >
              {/* Day number */}
              <div style={{
                fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: isToday ? 700 : 500,
                color: isToday ? color : hasSessions ? "#c8ccd8" : "#4a5068",
                marginBottom: 4,
              }}>{day}</div>

              {/* Session chips */}
              {daySessions.slice(0, 2).map((s, idx) => (
                <div key={idx} style={{
                  background: color + "22", borderRadius: 3,
                  padding: "2px 5px", marginBottom: 2,
                  fontFamily: "Inter, sans-serif", fontSize: "0.6rem",
                  fontWeight: 600, color,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {s.session_time?.slice(0, 5)} · {s.member_name?.split(" ")[0] || `#${s.member_id}`}
                </div>
              ))}
              {daySessions.length > 2 && (
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", color: "#4a5068" }}>
                  +{daySessions.length - 2} more
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────
export default function Sessions() {
  const [trainers, setTrainers]     = useState([]);
  const [sessions, setSessions]     = useState([]);
  const [members, setMembers]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen]   = useState(false);
  const [clickedDate, setClickedDate] = useState(null);
  const [clickedDaySessions, setClickedDaySessions] = useState([]);

  async function load() {
    try {
      const [tRes, sRes, mRes] = await Promise.all([
        fetch(`${API}/api/trainers`),
        fetch(`${API}/api/sessions/detailed`),
        fetch(`${API}/api/members`),
      ]);
      const [tData, sData, mData] = await Promise.all([tRes.json(), sRes.json(), mRes.json()]);
      setTrainers(tData);
      setSessions(sData);
      setMembers(mData);
      if (!selectedTrainer && tData.length > 0) setSelectedTrainer(tData[0]);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const trainerSessions = sessions.filter(s => s.trainer_id === selectedTrainer?.trainer_id);
  const color = trainerColor(selectedTrainer);

  function prevMonth() { setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)); }
  function nextMonth() { setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)); }

  function handleDayClick(dateStr, daySessions) {
    setClickedDate(dateStr);
    setClickedDaySessions(daySessions);
    setModalOpen(true);
  }

  return (
    <ThemeProvider theme={theme}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');
        .tr-pill {
          border-radius: 20px; padding: 6px 14px; cursor: pointer;
          font-family: Inter, sans-serif; font-size: 0.75rem; font-weight: 600;
          letter-spacing: 0.04em; text-transform: capitalize;
          border: 1px solid #252836; background: none; color: #4a5068;
          transition: all 0.15s; white-space: nowrap;
        }
        .tr-pill:hover { color: #8b92b0; border-color: #3a4060; }
      `}</style>

      <Box sx={{ minHeight: "100vh", background: "#13151a", px: { xs: 2, sm: 4, md: 6 }, py: { xs: 4, md: 5 } }}>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "capitalize", color: "#3a4060", mb: 1 }}>
            FitManager DB
          </Typography>
          <Typography sx={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", textTransform: "capitalize", color: "#eef0f4", lineHeight: 1 }}>
            Sessions
          </Typography>
        </Box>

        {loading && <Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#4a5068" }}>Loading…</Typography>}
        {error && <Box sx={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 2, p: 2 }}><Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#ef4444" }}>{error}</Typography></Box>}

        {!loading && !error && (
          <>
            {/* Trainer selector */}
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "capitalize", color: "#3a4060", mb: 1.5 }}>
                Select trainer
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {trainers.map(t => {
                  const c = trainerColor(t);
                  const isSelected = selectedTrainer?.trainer_id === t.trainer_id;
                  return (
                    <button
                      key={t.trainer_id}
                      className="tr-pill"
                      onClick={() => setSelectedTrainer(t)}
                      style={{
                        background: isSelected ? `${c}18` : "none",
                        borderColor: isSelected ? c + "55" : "#252836",
                        color: isSelected ? c : "#4a5068",
                      }}
                    >
                      {cap(t.first_name)} {cap(t.last_name)}
                    </button>
                  );
                })}
              </Box>
            </Box>

            {selectedTrainer && (
              <Box sx={{ background: "#1d2130", borderRadius: 12, border: "1px solid #252836", overflow: "hidden" }}>

                {/* Calendar header */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "18px 24px", borderBottom: "1px solid #252836",
                }}>
                  <div>
                    <div style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#eef0f4", letterSpacing: "0.03em" }}>
                      {MONTHS[month]} {year}
                    </div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "#4a5068", marginTop: 2 }}>
                      <span style={{ color }}>{cap(selectedTrainer.first_name)} {cap(selectedTrainer.last_name)}</span>
                      {" · "}{selectedTrainer.specialization}
                      {" · "}{trainerSessions.length} session{trainerSessions.length !== 1 ? "s" : ""} this view
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["←", "→"].map((arrow, idx) => (
                      <button key={arrow} onClick={idx === 0 ? prevMonth : nextMonth} style={{
                        background: "#171a26", border: "1px solid #252836", borderRadius: 6,
                        width: 34, height: 34, cursor: "pointer", color: "#4a5068",
                        fontFamily: "Inter, sans-serif", fontSize: "1rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "color 0.15s, border-color 0.15s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#eef0f4"; e.currentTarget.style.borderColor = "#3a4060"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#4a5068"; e.currentTarget.style.borderColor = "#252836"; }}
                      >{arrow}</button>
                    ))}
                  </div>
                </div>

                {/* Calendar body */}
                <div style={{ padding: "20px 24px 24px" }}>
                  <Calendar
                    year={year}
                    month={month}
                    sessions={trainerSessions}
                    trainer={selectedTrainer}
                    onDayClick={handleDayClick}
                  />
                </div>

                {/* Legend */}
                <div style={{ padding: "0 24px 18px", display: "flex", gap: 20, flexWrap: "wrap" }}>
                  {[
                    { color, label: "Has sessions" },
                    { color: "rgba(34,197,94,0.5)", label: "Available (hover)" },
                  ].map(({ color: c, label }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", color: "#3a4060" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </Box>
            )}
          </>
        )}
      </Box>

      <AddSessionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        date={clickedDate}
        trainer={selectedTrainer}
        members={members}
        onSaved={() => { load(); setModalOpen(false); }}
      />
    </ThemeProvider>
  );
}