import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const gymTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#FF5722" },
    background: { default: "#0D0D0D" },
  },
  typography: { fontFamily: "'Inter', sans-serif" },
});

const API = "http://localhost:5000";

const STATUS_COLORS = {
  Active:    { bg: "rgba(34,197,94,0.1)",  text: "#22c55e", dot: "#22c55e" },
  Expired:   { bg: "rgba(239,68,68,0.1)",  text: "#ef4444", dot: "#ef4444" },
  Suspended: { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", dot: "#f59e0b" },
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || { bg: "#2b2828", text: "#555", dot: "#555" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.text,
      fontSize: "0.7rem", fontWeight: 700,
      letterSpacing: "0.08em", textTransform: "uppercase",
      padding: "3px 9px", borderRadius: 3,
      fontFamily: "Inter, sans-serif",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {status ?? "Unknown"}
    </span>
  );
}

function MemberCard({ member, membership }) {
  const [open, setOpen] = useState(false);

  const fullName = `${member.first_name} ${member.last_name}`;
  const initials = `${member.first_name[0]}${member.last_name[0]}`.toUpperCase();

  return (
    <div
      style={{
        background: "#111",
        border: `1px solid ${open ? "#2a2a2a" : "#1a1a1a"}`,
        borderRadius: 8,
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      {/* Main row — always visible */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 18px",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={e => e.currentTarget.style.background = "#161616"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        {/* Avatar */}
        <div style={{
          width: 44, height: 44, borderRadius: 6,
          background: "#1a1a1a", border: "1px solid #222",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, overflow: "hidden",
        }}>
          <img
            src="/broken"
            alt={fullName}
            onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <span style={{
            display: "none", width: "100%", height: "100%",
            alignItems: "center", justifyContent: "center",
            fontFamily: "Barlow Condensed, sans-serif",
            fontWeight: 800, fontSize: "1rem",
            color: "#FF5722", letterSpacing: "0.05em",
          }}>
            {initials}
          </span>
        </div>

        {/* Name + ID */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "Barlow Condensed, sans-serif",
            fontWeight: 800, fontSize: "1rem",
            letterSpacing: "0.04em", textTransform: "capitalize",
            color: "#F0EDE8", whiteSpace: "nowrap",
            overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {fullName}
          </div>
          <div style={{
            fontFamily: "Inter, sans-serif", fontSize: "0.7rem",
            color: "#444", marginTop: 1, fontWeight: 500,
          }}>
            ID #{member.member_id} · {member.gender}
          </div>
        </div>

        {/* Status badge — hidden on very small screens via opacity trick */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
          {membership && <StatusBadge status={membership.status} />}

          {/* Chevron */}
          <span style={{
            color: "#444", fontSize: "0.75rem",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            display: "inline-block", lineHeight: 1,
          }}>
            ▼
          </span>
        </div>
      </div>

      {/* Expanded panel */}
      <div style={{
        maxHeight: open ? 300 : 0,
        overflow: "hidden",
        transition: "max-height 0.25s ease",
      }}>
        <div style={{
          borderTop: "1px solid #1a1a1a",
          padding: "16px 18px 18px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "14px 24px",
        }}>
          {[
            { label: "Email",           value: member.email || "—" },
            { label: "Phone",           value: member.phone_number || "—" },
            { label: "Age",             value: member.age ? `${member.age} yrs` : "—" },
            { label: "Registered",      value: member.registration_date?.slice(0, 10) || "—" },
            { label: "Membership Type", value: membership?.membership_type || "—" },
            { label: "Plan Start",      value: membership?.start_date?.slice(0, 10) || "—" },
            { label: "Plan End",        value: membership?.end_date?.slice(0, 10) || "—" },
            { label: "Status",          value: membership ? <StatusBadge status={membership.status} /> : "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{
                fontFamily: "Inter, sans-serif", fontSize: "0.65rem",
                color: "#444", fontWeight: 600,
                letterSpacing: "0.1em", textTransform: "capitalize",
                marginBottom: 3,
              }}>
                {label}
              </div>
              <div style={{
                fontFamily: "Inter, sans-serif", fontSize: "0.82rem",
                color: "#ccc", fontWeight: 400,
                wordBreak: "break-all",
              }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Members() {
  const [members, setMembers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [mRes, msRes] = await Promise.all([
          fetch(`${API}/api/members`),
          fetch(`${API}/api/memberships`),
        ]);
        const [mData, msData] = await Promise.all([mRes.json(), msRes.json()]);
        setMembers(mData);
        setMemberships(msData);
      } catch (e) {
        setError("Could not reach the server. Make sure it's running on port 5000.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getMembership = (member_id) =>
    memberships.find((ms) => ms.member_id === member_id);

  //searches about name, member id and email:
  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      !q ||
      m.first_name.toLowerCase().includes(q) ||
      m.last_name.toLowerCase().includes(q) ||
      String(m.member_id).includes(q) ||
      m.email?.toLowerCase().includes(q)
    );
  });

  return (
    <ThemeProvider theme={gymTheme}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');

        .fm-search {
          width: 100%;
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 6px;
          padding: 10px 14px;
          color: #F0EDE8;
          font-family: Inter, sans-serif;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.15s;
          box-sizing: border-box;
        }
        .fm-search::placeholder { color: #333; }
        .fm-search:focus { border-color: #FF5722; }
      `}</style>

      <Box sx={{ minHeight: "100vh", background: "#272525", px: { xs: 2, sm: 4, md: 6 }, py: { xs: 4, md: 5 } }}>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{
            fontFamily: "Inter", fontSize: "0.7rem", fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "capitalize", color: "#444", mb: 1,
          }}>
            FitManager DB
          </Typography>
          <Typography sx={{
            fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900,
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "0.03em",
            textTransform: "capitalize", color: "#F0EDE8", lineHeight: 1,
          }}>
            Members
            <span style={{ color: "#FF5722", marginLeft: 12, fontSize: "0.55em", verticalAlign: "middle" }}>
              {loading ? "…" : filtered.length}
            </span>
          </Typography>
        </Box>

        {/* Search */}
        <Box sx={{ mb: 3, maxWidth: 420 }}>
          <input
            className="fm-search"
            placeholder="Search by name, ID or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Box>

        {/* States */}
        {loading && (
          <Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#444" }}>
            Loading members…
          </Typography>
        )}

        {error && (
          <Box sx={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 2, p: 2 }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#ef4444" }}>
              {error}
            </Typography>
          </Box>
        )}

        {!loading && !error && filtered.length === 0 && (
          <Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#444" }}>
            No members match "{search}".
          </Typography>
        )}

        {/* Cards */}
        {!loading && !error && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {filtered.map((member) => (
              <MemberCard
                key={member.member_id}
                member={member}
                membership={getMembership(member.member_id)}
              />
            ))}
          </Box>
        )}

      </Box>
    </ThemeProvider>
  );
}