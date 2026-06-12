import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: { mode: "dark", primary: { main: "#FF5722" } },
  typography: { fontFamily: "'Inter', sans-serif" },
});

const API = "http://localhost:5000";

// Category visual config
const CATEGORY_CONFIG = {
  "Cardio":       { color: "#22c55e", icon: "🏃", bg: "rgba(34,197,94,0.07)"   },
  "Strength":     { color: "#f59e0b", icon: "🏋️", bg: "rgba(245,158,11,0.07)" },
  "Free Weights": { color: "#3b82f6", icon: "🥊", bg: "rgba(59,130,246,0.07)"  },
  "Bodyweight":   { color: "#a78bfa", icon: "🤸", bg: "rgba(167,139,250,0.07)" },
  "Functional":   { color: "#06b6d4", icon: "⚡", bg: "rgba(6,182,212,0.07)"   },
};
function getCatConfig(cat) {
  return CATEGORY_CONFIG[cat] || { color: "#8b92b0", icon: "🔩", bg: "rgba(139,146,176,0.07)" };
}

// Status result config — after pressing "Check status"
const STATUS_RESULT = {
  "Good":        { color: "#22c55e", bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.25)",  icon: "✓", label: "Good"         },
  "Excellent":   { color: "#22c55e", bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.25)",  icon: "✓", label: "Excellent"     },
  "Fair":        { color: "#06b6d4", bg: "rgba(6,182,212,0.1)",  border: "rgba(6,182,212,0.25)",  icon: "🙂", label: "Fair"         },
  "Under Repair":{ color: "#ef4444", bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.25)",  icon: "🔧", label: "Under Repair" },
};
function getStatusResult(status) {
  return STATUS_RESULT[status] || { color: "#8b92b0", bg: "rgba(139,146,176,0.1)", border: "rgba(139,146,176,0.25)", icon: "?", label: status };
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ""; }

// ── Equipment Row inside modal ──────────────────────────────────────
function EquipmentRow({ item }) {
  const [checked, setChecked] = useState(false);
  const result = getStatusResult(item.condition_status);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      background: "#1d2130", borderRadius: 8,
      padding: "14px 16px", border: "1px solid #252836",
    }}>
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "Barlow Condensed, sans-serif", fontWeight: 800,
          fontSize: "1rem", color: "#eef0f4", letterSpacing: "0.03em",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {item.equipment_name}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 3, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.67rem", color: "#4a5068" }}>
            ID #{item.equipment_id}
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.67rem", color: "#3a4060" }}>·</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.67rem", color: "#4a5068" }}>
            {item.location}
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.67rem", color: "#3a4060" }}>·</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.67rem", color: "#4a5068" }}>
            Purchased {item.purchase_date?.slice(0, 10)}
          </span>
        </div>
      </div>

      {/* Check status / result button */}
      {!checked ? (
        <button
          onClick={() => setChecked(true)}
          style={{
            background: "rgba(245,158,11,0.12)",
            border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: 6, padding: "7px 14px", flexShrink: 0,
            fontFamily: "Inter, sans-serif", fontSize: "0.75rem",
            fontWeight: 600, color: "#f59e0b", cursor: "pointer",
            textTransform: "capitalize", transition: "background 0.15s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(245,158,11,0.2)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(245,158,11,0.12)"}
        >
          Check status
        </button>
      ) : (
        <button disabled style={{
          background: result.bg,
          border: `1px solid ${result.border}`,
          borderRadius: 6, padding: "7px 14px", flexShrink: 0,
          fontFamily: "Inter, sans-serif", fontSize: "0.75rem",
          fontWeight: 700, color: result.color, cursor: "not-allowed",
          textTransform: "capitalize", display: "flex",
          alignItems: "center", gap: 6, whiteSpace: "nowrap",
          opacity: 1,
        }}>
          <span style={{ fontSize: "0.9rem", lineHeight: 1 }}>{result.icon}</span>
          {result.label}
        </button>
      )}
    </div>
  );
}

// ── Category Card ───────────────────────────────────────────────────
function CategoryCard({ category, items, onClick }) {
  const cfg = getCatConfig(category);
  const statusCounts = items.reduce((acc, item) => {
    const s = item.condition_status;
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const hasIssues = statusCounts["Under Repair"] || statusCounts["Fair"];

  return (
    <div
      onClick={onClick}
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.color}22`,
        borderRadius: 12, padding: "24px 22px",
        cursor: "pointer", position: "relative",
        overflow: "hidden", transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 28px rgba(0,0,0,0.35)`;
        e.currentTarget.style.borderColor = cfg.color + "55";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = cfg.color + "22";
      }}
    >
      {/* Watermark text */}
      <div style={{
        position: "absolute", bottom: -10, right: -8,
        fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900,
        fontSize: "4.5rem", color: cfg.color,
        opacity: 0.06, letterSpacing: "-0.02em",
        textTransform: "uppercase", lineHeight: 1,
        userSelect: "none", pointerEvents: "none",
        whiteSpace: "nowrap",
      }}>
        {category}
      </div>

      {/* Color stripe */}
      <div style={{ height: 3, background: cfg.color, borderRadius: 2, marginBottom: 18, width: "40%", boxShadow: `0 0 8px ${cfg.color}66` }} />

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900, fontSize: "1.25rem", color: "#eef0f4", letterSpacing: "0.03em", textTransform: "uppercase" }}>
          {category}
        </div>
        <div style={{
          background: cfg.color + "22", border: `1px solid ${cfg.color}33`,
          borderRadius: 20, padding: "3px 10px",
          fontFamily: "Barlow Condensed, sans-serif", fontWeight: 800,
          fontSize: "0.9rem", color: cfg.color, letterSpacing: "0.05em",
        }}>
          {items.length}
        </div>
      </div>

      {/* Status mini summary */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {Object.entries(statusCounts).map(([status, count]) => {
          const sr = getStatusResult(status);
          return (
            <span key={status} style={{
              fontFamily: "Inter, sans-serif", fontSize: "0.65rem",
              fontWeight: 600, color: sr.color,
              background: sr.bg, borderRadius: 3, padding: "2px 7px",
            }}>
              {count} {status}
            </span>
          );
        })}
      </div>

      {/* View button */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        fontFamily: "Inter, sans-serif", fontSize: "0.72rem",
        fontWeight: 600, color: cfg.color, letterSpacing: "0.04em",
      }}>
        View equipment
        <span style={{ fontSize: "0.8rem" }}>→</span>
      </div>

      {/* Warning dot if issues */}
      {hasIssues && (
        <div style={{
          position: "absolute", top: 14, right: 14,
          width: 8, height: 8, borderRadius: "50%",
          background: "#ef4444",
          boxShadow: "0 0 6px rgba(239,68,68,0.7)",
        }} />
      )}
    </div>
  );
}

// ── Category Modal ──────────────────────────────────────────────────
function CategoryModal({ open, onClose, category, items }) {
  const cfg = getCatConfig(category);
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#13151a", border: `1px solid ${cfg.color}22`,
        borderRadius: 12, padding: "28px",
        width: "min(600px, 93vw)", maxHeight: "85vh",
        overflowY: "auto", outline: "none",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{
              fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900,
              fontSize: "1.5rem", color: "#eef0f4",
              textTransform: "uppercase", letterSpacing: "0.04em",
            }}>
              {category}
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "#4a5068", marginTop: 3 }}>
              {items.length} piece{items.length !== 1 ? "s" : ""} of equipment · press
              <span style={{ color: "#f59e0b", fontWeight: 600 }}> check status </span>
              to inspect each item
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#4a5068", fontSize: "1.1rem", cursor: "pointer", padding: 4, flexShrink: 0 }}>✕</button>
        </div>

        {/* Equipment list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map(item => (
            <EquipmentRow key={item.equipment_id} item={item} />
          ))}
        </div>

        {/* Legend */}
        <div style={{ marginTop: 20, padding: "12px 14px", background: "#1d2130", borderRadius: 8, border: "1px solid #252836" }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "capitalize", color: "#3a4060", marginBottom: 8 }}>
            Status legend
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[
              { icon: "✓",  color: "#22c55e", label: "Good / Excellent" },
              { icon: "🙂", color: "#06b6d4", label: "Fair"             },
              { icon: "🔧", color: "#ef4444", label: "Under Repair"     },
            ].map(({ icon, color, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: "0.8rem" }}>{icon}</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", color: "#4a5068" }}>
                  <span style={{ color, fontWeight: 600 }}>{label}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ── Main Page ───────────────────────────────────────────────────────
export default function Equipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/equipment`);
        const data = await res.json();
        setEquipment(data);
      } catch {
        setError("Could not reach the server. Make sure it's running on port 5000.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Group by category
  const categories = equipment.reduce((acc, item) => {
    const cat = item.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const totalIssues = equipment.filter(e => e.condition_status === "Under Repair" || e.condition_status === "Fair").length;

  return (
    <ThemeProvider theme={theme}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <Box sx={{ minHeight: "100vh", background: "#13151a", px: { xs: 2, sm: 4, md: 6 }, py: { xs: 4, md: 5 } }}>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "capitalize", color: "#3a4060", mb: 1 }}>
            FitManager DB
          </Typography>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, flexWrap: "wrap" }}>
            <Typography sx={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", textTransform: "capitalize", color: "#eef0f4", lineHeight: 1 }}>
              Equipment
            </Typography>
            {!loading && (
              <Typography sx={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#FF5722", lineHeight: 1 }}>
                {equipment.length}
              </Typography>
            )}
          </Box>

          {/* Quick stats */}
          {!loading && !error && (
            <Box sx={{ display: "flex", gap: 3, mt: 2, flexWrap: "wrap" }}>
              {[
                { label: "Categories",   value: Object.keys(categories).length, color: "#8b92b0" },
                { label: "Total items",  value: equipment.length,               color: "#8b92b0" },
                { label: "Need attention", value: totalIssues,                  color: totalIssues > 0 ? "#ef4444" : "#22c55e" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#4a5068" }}>
                    <span style={{ color, fontWeight: 700 }}>{value}</span> {label}
                  </span>
                </div>
              ))}
            </Box>
          )}
        </Box>

        {loading && <Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#4a5068" }}>Loading equipment…</Typography>}
        {error && (
          <Box sx={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 2, p: 2 }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#ef4444" }}>{error}</Typography>
          </Box>
        )}

        {/* Category grid */}
        {!loading && !error && (
          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: 2,
          }}>
            {Object.entries(categories).map(([category, items]) => (
              <CategoryCard
                key={category}
                category={category}
                items={items}
                onClick={() => setOpenCategory(category)}
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Category modal */}
      <CategoryModal
        open={!!openCategory}
        onClose={() => setOpenCategory(null)}
        category={openCategory || ""}
        items={openCategory ? (categories[openCategory] || []) : []}
      />
    </ThemeProvider>
  );
}