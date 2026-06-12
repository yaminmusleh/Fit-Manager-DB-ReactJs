import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: { mode: "dark", primary: { main: "#FF5722" } },
  typography: { fontFamily: "'Inter', sans-serif" },
});

const API = "http://localhost:5000";

// Specialization accent colors — each discipline gets its own tint
const SPEC_COLORS = {
  "Weight Training":       { color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  "Yoga":                  { color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  "Cardio Fitness":        { color: "#22c55e", bg: "rgba(34,197,94,0.1)"   },
  "CrossFit":              { color: "#ef4444", bg: "rgba(239,68,68,0.1)"   },
  "Bodybuilding":          { color: "#FF5722", bg: "rgba(255,87,34,0.1)"   },
  "Pilates":               { color: "#ec4899", bg: "rgba(236,72,153,0.1)"  },
  "Strength Training":     { color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  "Aerobics":              { color: "#06b6d4", bg: "rgba(6,182,212,0.1)"   },
  "Sports Rehabilitation": { color: "#10b981", bg: "rgba(16,185,129,0.1)"  },
  "Nutrition & Fitness":   { color: "#84cc16", bg: "rgba(132,204,22,0.1)"  },
  "Functional Training":   { color: "#3b82f6", bg: "rgba(59,130,246,0.1)"  },
  "Personal Training":     { color: "#e879f9", bg: "rgba(232,121,249,0.1)" },
};

function getSpec(spec) {
  return SPEC_COLORS[spec] || { color: "#8b92b0", bg: "rgba(139,146,176,0.1)" };
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ── Trainer Card ────────────────────────────────────────────────────
function TrainerCard({ trainer, sessions }) {
  const [showMembers, setShowMembers] = useState(false);

  const spec = getSpec(trainer.specialization);
  const initials = `${trainer.first_name[0]}${trainer.last_name[0]}`.toUpperCase();
  const fullName = `${capitalize(trainer.first_name)} ${capitalize(trainer.last_name)}`;

  // Unique members coached by this trainer
  const coachedSessions = sessions.filter(s => s.trainer_id === trainer.trainer_id);
  const uniqueMembers = Object.values(
    coachedSessions.reduce((acc, s) => {
      if (!acc[s.member_id]) acc[s.member_id] = { member_id: s.member_id, member_name: s.member_name, count: 0 };
      acc[s.member_id].count++;
      return acc;
    }, {})
  );

  return (
    <div style={{
      background: "#1d2130",
      borderRadius: 10,
      overflow: "hidden",
      border: "1px solid #252836",
      transition: "transform 0.15s, box-shadow 0.15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.35)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Specialization color stripe */}
      <div style={{ height: 4, background: spec.color, boxShadow: `0 0 12px ${spec.color}66` }} />

      <div style={{ padding: "20px 20px 0" }}>

        {/* Top row: avatar + name + spec badge */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
          {/* Avatar */}
          <div style={{
            width: 48, height: 48, borderRadius: 10, flexShrink: 0,
            background: spec.bg, border: `1px solid ${spec.color}33`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Barlow Condensed, sans-serif",
            fontWeight: 900, fontSize: "1.1rem", color: spec.color,
            letterSpacing: "0.05em",
          }}>
            {initials}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "Barlow Condensed, sans-serif", fontWeight: 800,
              fontSize: "1.1rem", color: "#eef0f4", letterSpacing: "0.03em",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {fullName}
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", color: "#4a5068", marginTop: 2 }}>
              Trainer ID #{trainer.trainer_id}
            </div>
          </div>
        </div>

        {/* Specialization badge */}
        <div style={{ marginBottom: 16 }}>
          <span style={{
            display: "inline-flex", alignItems: "center",
            background: spec.bg, border: `1px solid ${spec.color}33`,
            borderRadius: 20, padding: "4px 12px",
            fontFamily: "Inter, sans-serif", fontSize: "0.72rem",
            fontWeight: 600, color: spec.color,
            letterSpacing: "0.05em",
          }}>
            {trainer.specialization ?? "—"}
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#252836", marginBottom: 16 }} />

        {/* Info row: hire date + phone + member count */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: "6px 8px", marginBottom: 16,
        }}>
          {[
            { label: "Hired",    value: trainer.hire_date?.slice(0, 10) || "—" },
            { label: "Phone",    value: trainer.phone_number || "—" },
            { label: "Coaching", value: `${uniqueMembers.length} member${uniqueMembers.length !== 1 ? "s" : ""}` },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: "#171a26", borderRadius: 6, padding: "8px 10px",
            }}>
              <div style={{
                fontFamily: "Inter, sans-serif", fontSize: "0.58rem",
                fontWeight: 600, letterSpacing: "0.1em",
                textTransform: "capitalize", color: "#3a4060", marginBottom: 3,
              }}>{label}</div>
              <div style={{
                fontFamily: "Inter, sans-serif", fontSize: "0.75rem",
                color: label === "Coaching" ? spec.color : "#6b7399",
                fontWeight: label === "Coaching" ? 700 : 500,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Show members button */}
        {uniqueMembers.length > 0 && (
          <button
            onClick={() => setShowMembers(v => !v)}
            style={{
              width: "100%", background: showMembers ? "rgba(255,87,34,0.08)" : "none",
              border: `1px solid ${showMembers ? "#FF572233" : "#252836"}`,
              borderRadius: 6, padding: "9px 14px", marginBottom: 0,
              color: showMembers ? "#FF5722" : "#4a5068",
              fontFamily: "Inter, sans-serif", fontSize: "0.78rem",
              fontWeight: 600, cursor: "pointer",
              textTransform: "capitalize",
              transition: "all 0.15s",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}
            onMouseEnter={e => { if (!showMembers) { e.currentTarget.style.borderColor = "#FF572233"; e.currentTarget.style.color = "#FF5722"; } }}
            onMouseLeave={e => { if (!showMembers) { e.currentTarget.style.borderColor = "#252836"; e.currentTarget.style.color = "#4a5068"; } }}
          >
            <span>Show coached members</span>
            <span style={{
              display: "inline-block",
              transform: showMembers ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s", lineHeight: 1, fontSize: "0.65rem",
            }}>▼</span>
          </button>
        )}

        {uniqueMembers.length === 0 && (
          <div style={{
            padding: "9px 0", fontFamily: "Inter, sans-serif",
            fontSize: "0.75rem", color: "#3a4060",
            textAlign: "center",
          }}>
            No sessions recorded yet
          </div>
        )}
      </div>

      {/* Coached members panel — slides down */}
      <div style={{
        maxHeight: showMembers ? `${uniqueMembers.length * 52 + 24}px` : "0px",
        overflow: "hidden",
        transition: "max-height 0.3s ease",
      }}>
        <div style={{ padding: "10px 20px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
          {uniqueMembers.map((m, i) => {
            const parts = (m.member_name || "").split(" ");
            const mInitials = parts.map(p => p[0]).join("").toUpperCase().slice(0, 2);
            return (
              <div key={m.member_id} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#171a26", borderRadius: 7,
                padding: "9px 12px",
                border: "1px solid #1e2235",
              }}>
                {/* Mini avatar */}
                <div style={{
                  width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                  background: spec.bg, border: `1px solid ${spec.color}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontWeight: 800, fontSize: "0.7rem", color: spec.color,
                }}>
                  {mInitials || "?"}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "Inter, sans-serif", fontSize: "0.8rem",
                    fontWeight: 600, color: "#c8ccd8",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {m.member_name || `Member #${m.member_id}`}
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.65rem", color: "#3a4060" }}>
                    ID #{m.member_id}
                  </div>
                </div>

                <div style={{
                  fontFamily: "Inter, sans-serif", fontSize: "0.68rem",
                  color: "#4a5068", fontWeight: 500, flexShrink: 0,
                }}>
                  {m.count} session{m.count !== 1 ? "s" : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────
export default function Trainers() {
  const [trainers, setTrainers]   = useState([]);
  const [sessions, setSessions]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState("");
  const [filterSpec, setFilterSpec] = useState("All");

  useEffect(() => {
    async function load() {
      try {
        const [tRes, sRes] = await Promise.all([
          fetch(`${API}/api/trainers`),
          fetch(`${API}/api/sessions/detailed`),
        ]);
        const [tData, sData] = await Promise.all([tRes.json(), sRes.json()]);
        setTrainers(tData);
        setSessions(sData);
      } catch {
        setError("Could not reach the server. Make sure it's running on port 5000.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // All unique specializations for filter
  const allSpecs = ["All", ...Array.from(new Set(trainers.map(t => t.specialization).filter(Boolean)))];

  const filtered = trainers.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || t.first_name.toLowerCase().includes(q)
      || t.last_name.toLowerCase().includes(q)
      || t.specialization?.toLowerCase().includes(q)
      || String(t.trainer_id).includes(q);
    const matchSpec = filterSpec === "All" || t.specialization === filterSpec;
    return matchSearch && matchSpec;
  });

  const totalCoached = new Set(sessions.map(s => s.member_id)).size;

  return (
    <ThemeProvider theme={theme}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');
        .tr-search {
          width: 100%; background: #1d2130; border: 1px solid #252836;
          border-radius: 6px; padding: 10px 14px; color: #eef0f4;
          font-family: Inter, sans-serif; font-size: 0.85rem;
          outline: none; transition: border-color 0.15s; box-sizing: border-box;
        }
        .tr-search::placeholder { color: #3a4060; }
        .tr-search:focus { border-color: #FF5722; }
        .tr-filter-btn {
          background: none; border: 1px solid #252836; border-radius: 20px;
          padding: 5px 13px; font-family: Inter, sans-serif; font-size: 0.7rem;
          font-weight: 600; letter-spacing: 0.05em; cursor: pointer;
          transition: all 0.15s; color: #4a5068; white-space: nowrap;
          text-transform: capitalize;
        }
        .tr-filter-btn:hover { border-color: #3a4060; color: #8b92b0; }
        .tr-filter-btn.active { background: #FF5722; border-color: #FF5722; color: #0D0D0D; }
      `}</style>

      <Box sx={{ minHeight: "100vh", background: "#13151a", px: { xs: 2, sm: 4, md: 6 }, py: { xs: 4, md: 5 } }}>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{
            fontFamily: "Inter", fontSize: "0.68rem", fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "capitalize", color: "#3a4060", mb: 1,
          }}>
            FitManager DB
          </Typography>

          <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, flexWrap: "wrap" }}>
            <Typography sx={{
              fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900,
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "0.03em",
              textTransform: "capitalize", color: "#eef0f4", lineHeight: 1,
            }}>
              Trainers
            </Typography>
            {!loading && (
              <Typography sx={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#FF5722", lineHeight: 1 }}>
                {filtered.length}
              </Typography>
            )}
          </Box>

          {/* Quick stats */}
          {!loading && !error && (
            <Box sx={{ display: "flex", gap: 3, mt: 2, flexWrap: "wrap" }}>
              {[
                { label: "Total trainers", value: trainers.length },
                { label: "Members coached", value: totalCoached },
                { label: "Specializations", value: allSpecs.length - 1 },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#4a5068", fontWeight: 500 }}>
                    <span style={{ color: "#8b92b0", fontWeight: 700 }}>{value}</span> {label}
                  </span>
                </div>
              ))}
            </Box>
          )}
        </Box>

        {/* Controls */}
        <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap", alignItems: "center" }}>
          <Box sx={{ maxWidth: 300, flex: 1 }}>
            <input
              className="tr-search"
              placeholder="Search by name or specialization…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {allSpecs.map(spec => (
              <button
                key={spec}
                className={`tr-filter-btn${filterSpec === spec ? " active" : ""}`}
                onClick={() => setFilterSpec(spec)}
              >
                {spec}
              </button>
            ))}
          </Box>
        </Box>

        {/* States */}
        {loading && <Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#4a5068" }}>Loading trainers…</Typography>}
        {error && (
          <Box sx={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 2, p: 2 }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#ef4444" }}>{error}</Typography>
          </Box>
        )}
        {!loading && !error && filtered.length === 0 && (
          <Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#4a5068" }}>
            No trainers match your search.
          </Typography>
        )}

        {/* Grid */}
        {!loading && !error && (
          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: 2,
          }}>
            {filtered.map(trainer => (
              <TrainerCard
                key={trainer.trainer_id}
                trainer={trainer}
                sessions={sessions}
              />
            ))}
          </Box>
        )}

      </Box>
    </ThemeProvider>
  );
}