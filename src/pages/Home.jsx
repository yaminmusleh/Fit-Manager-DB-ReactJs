import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const MODULES = [
  {
    label: "Members",
    path: "/members",
    api: "/api/members",
    icon: "👤",
    description: "Registered gym members",
    accent: "#FF5722",
  },
  {
    label: "Memberships",
    path: "/memberships",
    api: "/api/memberships",
    icon: "🪪",
    description: "Active, expired & suspended plans",
    accent: "#f59e0b",
  },
  {
    label: "Trainers",
    path: "/trainers",
    api: "/api/trainers",
    icon: "🏋️",
    description: "Coaching staff on roster",
    accent: "#3b82f6",
  },
  {
    label: "Sessions",
    path: "/sessions",
    api: "/api/sessions",
    icon: "📅",
    description: "Scheduled training sessions",
    accent: "#8b5cf6",
  },
  {
    label: "Equipment",
    path: "/equipment",
    api: "/api/equipment",
    icon: "🔩",
    description: "Gym equipment inventory",
    accent: "#10b981",
  },
  {
    label: "Maintenance",
    path: "/maintenance",
    api: "/api/maintenance",
    icon: "🛠️",
    description: "Repair & upkeep records",
    accent: "#ef4444",
  },
  {
    label: "Lockers",
    path: "/lockers",
    api: "/api/lockers",
    icon: "🔒",
    description: "Locker room assignments",
    accent: "#06b6d4",
  },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function today() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

export default function Home() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const results = {};
      await Promise.allSettled(
        MODULES.map(async (m) => {
          try {
            const res = await fetch(`${API}${m.api}`);
            const data = await res.json();
            results[m.api] = Array.isArray(data) ? data.length : "—";
          } catch {
            results[m.api] = "—";
          }
        })
      );
      setCounts(results);
      setLoading(false);
    }
    fetchAll();
  }, []);

  return (
    <ThemeProvider theme={gymTheme}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');

        .fm-module-card {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 8px;
          padding: 24px;
          cursor: pointer;
          transition: border-color 0.18s, transform 0.15s, box-shadow 0.18s;
          position: relative;
          overflow: hidden;
        }
        .fm-module-card:hover {
          transform: translateY(-2px);
        }
        .fm-module-card .fm-card-arrow {
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.15s, transform 0.15s;
          color: #555;
          font-size: 0.8rem;
          font-family: Inter, sans-serif;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .fm-module-card:hover .fm-card-arrow {
          opacity: 1;
          transform: translateX(0);
        }
        .fm-count {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 2.8rem;
          line-height: 1;
          letter-spacing: -0.01em;
        }
        .fm-card-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #F0EDE8;
        }
        .fm-card-desc {
          font-family: Inter, sans-serif;
          font-size: 0.75rem;
          color: #555;
          margin-top: 2px;
          font-weight: 400;
        }
        .fm-hero-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(2.2rem, 5vw, 3.5rem);
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: #F0EDE8;
          line-height: 1.05;
        }
        .fm-pulse {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 0 rgba(34,197,94,0.4);
          animation: pulse 2s infinite;
          vertical-align: middle;
          margin-right: 6px;
          position: relative;
          top: -1px;
        }
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          70%  { box-shadow: 0 0 0 7px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        .fm-section-label {
          font-family: Inter, sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #444;
        }
      `}</style>

      <Box sx={{ minHeight: "100vh", background: "#0D0D0D", px: { xs: 2, sm: 4, md: 6 }, py: { xs: 4, md: 6 } }}>

        {/* Hero */}
        <Box sx={{ mb: 6, pb: 5, borderBottom: "1px solid #1a1a1a" }}>
          <Box sx={{ mb: 1 }}>
            <span className="fm-section-label">
              <span className="fm-pulse" />
              FitManager DB · Admin Dashboard
            </span>
          </Box>

          <h1 className="fm-hero-title">
            {greeting()},<br />
            <span style={{ color: "#FF5722" }}>Admin.</span>
          </h1>

          <Box sx={{
            mt: 2, display: "flex", alignItems: "center", gap: 2,
            flexWrap: "wrap",
          }}>
            <Typography sx={{
              fontFamily: "Inter", fontSize: "0.82rem",
              color: "#555", fontWeight: 500,
            }}>
              {today()}
            </Typography>
            <Box sx={{ width: 1, height: 14, background: "#1e1e1e", flexShrink: 0 }} />
            <Typography sx={{
              fontFamily: "Inter", fontSize: "0.82rem",
              color: "#555", fontWeight: 500,
            }}>
              {loading ? "Loading data…" : `${MODULES.reduce((sum, m) => sum + (typeof counts[m.api] === "number" ? counts[m.api] : 0), 0)} total records across ${MODULES.length} tables`}
            </Typography>
          </Box>
        </Box>

        {/* Section label */}
        <Box sx={{ mb: 3 }}>
          <span className="fm-section-label">Database Overview</span>
        </Box>

        {/* Module cards grid */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
        }}>
          {MODULES.map((mod) => (
            <div
              key={mod.path}
              className="fm-module-card"
              onClick={() => navigate(mod.path)}
              style={{ "--accent": mod.accent }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = mod.accent + "55";
                e.currentTarget.style.boxShadow = `0 8px 32px ${mod.accent}18`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#1e1e1e";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Top row: icon + arrow */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>{mod.icon}</span>
                <span className="fm-card-arrow">Manage →</span>
              </Box>

              {/* Count */}
              <div
                className="fm-count"
                style={{ color: loading ? "#333" : mod.accent }}
              >
                {loading ? "·" : counts[mod.api] ?? "—"}
              </div>

              {/* Label + desc */}
              <Box sx={{ mt: 1 }}>
                <div className="fm-card-label">{mod.label}</div>
                <div className="fm-card-desc">{mod.description}</div>
              </Box>
            </div>
          ))}
        </Box>

        {/* Footer note */}
        <Box sx={{ mt: 8, pt: 4, borderTop: "1px solid #1a1a1a" }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "0.72rem", color: "#333", letterSpacing: "0.05em" }}>
            FITMANAGER DB · LOCAL GYM MANAGEMENT SYSTEM · PORT 5000
          </Typography>
        </Box>

      </Box>
    </ThemeProvider>
  );
}
