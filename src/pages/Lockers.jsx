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

const STATUS_CONFIG = {
  Available:        { color: "#22c55e", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.2)",  label: "Available"         },
  Occupied:         { color: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)", label: "Occupied"          },
  UnderMaintenance: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", label: "Under Maintenance" },
};
function getCfg(status) {
  return STATUS_CONFIG[status] || { color: "#8b92b0", bg: "rgba(139,146,176,0.08)", border: "rgba(139,146,176,0.2)", label: status };
}

const SIZE_HEIGHTS = { Small: 120, Medium: 150, Large: 180 };

const inputStyle = {
  width: "100%", background: "#0d0f17", border: "1px solid #2a2a3a",
  borderRadius: 5, padding: "9px 11px", color: "#eef0f4",
  fontFamily: "Inter, sans-serif", fontSize: "0.85rem",
  outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
};

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ""; }

// ── Assign Modal ────────────────────────────────────────────────────
function AssignModal({ open, onClose, locker, members, usages, onAssigned }) {
  const [memberId, setMemberId] = useState("");
  const [saving, setSaving]     = useState(false);
  const [err, setErr]           = useState("");

  // Members who already have a locker
  const occupiedMemberIds = new Set(usages.map(u => u.member_id));
  // Filter to members without a locker
  const availableMembers = members.filter(m => !occupiedMemberIds.has(m.member_id));

  useEffect(() => { if (open) { setMemberId(""); setErr(""); } }, [open]);

  async function handleAssign() {
    setErr("");
    if (!memberId) { setErr("Please select a member."); return; }
    setSaving(true);
    const today = new Date().toISOString().slice(0, 10);
    const now   = new Date().toISOString().slice(0, 19).replace("T", " ");
    try {
      const res = await fetch(`${API}/api/lockers/assign`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locker_id: locker.locker_id, member_id: Number(memberId), usage_date: today, start_time: now }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to assign locker.");
      onAssigned(); onClose();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#13151a", border: "1px solid #252836",
        borderRadius: 12, padding: "28px",
        width: "min(460px, 93vw)", outline: "none",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#eef0f4", textTransform: "capitalize" }}>
              Assign locker
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#4a5068", marginTop: 3 }}>
              Locker {locker?.locker_number} · {locker?.size} size
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#4a5068", fontSize: "1.1rem", cursor: "pointer" }}>✕</button>
        </div>

        {/* Info note */}
        <div style={{
          background: "rgba(255,87,34,0.07)", border: "1px solid rgba(255,87,34,0.18)",
          borderRadius: 7, padding: "10px 13px", marginBottom: 18,
          fontFamily: "Inter, sans-serif", fontSize: "0.75rem",
          color: "#FF7043", lineHeight: 1.5,
        }}>
          💡 Only members without an existing locker are shown. If you need to assign to a new member, add them to the members page first.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 6 }}>
          <label style={{ fontFamily: "Inter, sans-serif", fontSize: "0.63rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "capitalize", color: "#4a5068" }}>
            Select member
          </label>
          <select value={memberId} onChange={e => setMemberId(e.target.value)}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#22c55e"}
            onBlur={e => e.target.style.borderColor = "#2a2a3a"}
          >
            <option value="">— Choose a member —</option>
            {availableMembers.map(m => (
              <option key={m.member_id} value={m.member_id}>
                #{m.member_id} · {cap(m.first_name)} {cap(m.last_name)}
              </option>
            ))}
          </select>
          {availableMembers.length === 0 && (
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#ef4444", marginTop: 4 }}>
              All members already have a locker assigned.
            </div>
          )}
        </div>

        {err && (
          <div style={{ marginTop: 10, padding: "9px 12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 5, color: "#ef4444", fontFamily: "Inter, sans-serif", fontSize: "0.78rem" }}>
            {err}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: "1px solid #252836", borderRadius: 5, padding: "9px 18px", color: "#4a5068", fontFamily: "Inter, sans-serif", fontSize: "0.82rem", cursor: "pointer", textTransform: "capitalize" }}>
            Cancel
          </button>
          <button onClick={handleAssign} disabled={saving || availableMembers.length === 0} style={{
            background: saving ? "#166534" : "#22c55e",
            border: "none", borderRadius: 5, padding: "9px 22px",
            color: "#0d0f17", fontFamily: "Inter, sans-serif",
            fontWeight: 700, fontSize: "0.85rem",
            cursor: (saving || availableMembers.length === 0) ? "not-allowed" : "pointer",
            textTransform: "capitalize", transition: "background 0.15s",
            opacity: availableMembers.length === 0 ? 0.5 : 1,
          }}>
            {saving ? "Assigning…" : "Assign locker"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Locker Card ─────────────────────────────────────────────────────
function LockerCard({ locker, usage, onAssignClick }) {
  const cfg         = getCfg(locker.status);
  const cardHeight  = SIZE_HEIGHTS[locker.size] || 140;
  const isAvailable = locker.status === "Available";
  const isOccupied  = locker.status === "Occupied";
  const isMaintenance = locker.status === "UnderMaintenance";

  // Member initials from usage
  const memberName    = usage?.member_name || null;
  const memberInitials = memberName
    ? memberName.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2)
    : null;

  return (
    <div
      onClick={isAvailable ? onAssignClick : undefined}
      style={{
        // Locker shape — tall rectangle with rounded top
        width: "100%",
        height: cardHeight,
        background: cfg.bg,
        border: `2px solid ${cfg.color}44`,
        borderRadius: "8px 8px 4px 4px",
        position: "relative",
        cursor: isAvailable ? "pointer" : "default",
        transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        boxShadow: isAvailable ? "none" : `inset 0 0 20px rgba(0,0,0,0.2)`,
      }}
      onMouseEnter={e => {
        if (isAvailable) {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = `0 8px 24px ${cfg.color}33`;
          e.currentTarget.style.borderColor = cfg.color + "99";
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = isAvailable ? "none" : `inset 0 0 20px rgba(0,0,0,0.2)`;
        e.currentTarget.style.borderColor = cfg.color + "44";
      }}
    >
      {/* Locker top bar — like a real locker header */}
      <div style={{
        height: 6, background: cfg.color,
        opacity: 0.7,
        boxShadow: `0 2px 6px ${cfg.color}55`,
      }} />

      {/* Locker number tag */}
      <div style={{
        position: "absolute", top: 10, left: "50%",
        transform: "translateX(-50%)",
        fontFamily: "Barlow Condensed, sans-serif",
        fontWeight: 900, fontSize: "1rem",
        color: cfg.color, letterSpacing: "0.06em",
        textAlign: "center", lineHeight: 1,
      }}>
        {locker.locker_number}
      </div>

      {/* Locker handle — the signature shape detail */}
      <div style={{
        position: "absolute", left: "50%", top: "38%",
        transform: "translateX(-50%)",
        width: 10, height: 22,
        border: `2px solid ${cfg.color}55`,
        borderRadius: 3,
        background: cfg.color + "11",
      }} />

      {/* Bottom content area */}
      <div style={{
        marginTop: "auto", padding: "8px 8px 10px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      }}>
        {/* Size pill */}
        <div style={{
          fontFamily: "Inter, sans-serif", fontSize: "0.55rem",
          fontWeight: 600, color: cfg.color + "99",
          letterSpacing: "0.08em", textTransform: "capitalize",
        }}>
          {locker.size}
        </div>

        {/* Status / content */}
        {isAvailable && (
          <div style={{
            background: cfg.color + "22", border: `1px solid ${cfg.color}33`,
            borderRadius: 4, padding: "3px 8px",
            fontFamily: "Inter, sans-serif", fontSize: "0.6rem",
            fontWeight: 700, color: cfg.color,
            textTransform: "capitalize", letterSpacing: "0.05em",
          }}>
            Tap to assign
          </div>
        )}

        {isOccupied && memberName && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 4,
              background: cfg.color + "22", border: `1px solid ${cfg.color}33`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Barlow Condensed, sans-serif", fontWeight: 800,
              fontSize: "0.65rem", color: cfg.color,
            }}>
              {memberInitials}
            </div>
            <div style={{
              fontFamily: "Inter, sans-serif", fontSize: "0.58rem",
              fontWeight: 600, color: cfg.color + "cc",
              textAlign: "center", lineHeight: 1.2,
              maxWidth: "90%", overflow: "hidden",
              textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {memberName.split(" ")[0]}
            </div>
          </div>
        )}

        {isMaintenance && (
          <div style={{
            fontFamily: "Inter, sans-serif", fontSize: "0.58rem",
            fontWeight: 600, color: cfg.color + "99",
            textTransform: "capitalize", letterSpacing: "0.05em",
          }}>
            🔧 Maintenance
          </div>
        )}
      </div>

      {/* Status dot top-right */}
      <div style={{
        position: "absolute", top: 10, right: 8,
        width: 7, height: 7, borderRadius: "50%",
        background: cfg.color,
        boxShadow: isAvailable ? `0 0 6px ${cfg.color}` : "none",
      }} />
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────
export default function Lockers() {
  const [lockers, setLockers]   = useState([]);
  const [usages, setUsages]     = useState([]);
  const [members, setMembers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [assignTarget, setAssignTarget] = useState(null);
  const [filter, setFilter]     = useState("All");

  async function load() {
    try {
      const [lRes, uRes, mRes] = await Promise.all([
        fetch(`${API}/api/lockers`),
        fetch(`${API}/api/lockers/usage`),
        fetch(`${API}/api/members`),
      ]);
      const [lData, uData, mData] = await Promise.all([lRes.json(), uRes.json(), mRes.json()]);
      setLockers(lData);
      setUsages(uData);
      setMembers(mData);
    } catch {
      setError("Could not reach the server. Make sure it's running on port 5000.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // Most recent usage per locker
  function getUsage(lockerId) {
    return usages.find(u => u.locker_id === lockerId) || null;
  }

  const FILTERS = ["All", "Available", "Occupied", "UnderMaintenance"];
  const filtered = filter === "All" ? lockers : lockers.filter(l => l.status === filter);

  const counts = {
    Available:        lockers.filter(l => l.status === "Available").length,
    Occupied:         lockers.filter(l => l.status === "Occupied").length,
    UnderMaintenance: lockers.filter(l => l.status === "UnderMaintenance").length,
  };

  return (
    <ThemeProvider theme={theme}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');
        .lk-filter-btn {
          background: none; border: 1px solid #252836; border-radius: 20px;
          padding: 5px 14px; font-family: Inter, sans-serif; font-size: 0.72rem;
          font-weight: 600; letter-spacing: 0.05em; cursor: pointer;
          transition: all 0.15s; color: #4a5068; white-space: nowrap;
          text-transform: capitalize;
        }
        .lk-filter-btn:hover { border-color: #3a4060; color: #8b92b0; }
        .lk-filter-btn.active { background: #FF5722; border-color: #FF5722; color: #0D0D0D; }
      `}</style>

      <Box sx={{ minHeight: "100vh", background: "#13151a", px: { xs: 2, sm: 4, md: 6 }, py: { xs: 4, md: 5 } }}>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontFamily: "Inter", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "capitalize", color: "#3a4060", mb: 1 }}>
            FitManager DB
          </Typography>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, flexWrap: "wrap" }}>
            <Typography sx={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", textTransform: "capitalize", color: "#eef0f4", lineHeight: 1 }}>
              Lockers
            </Typography>
            {!loading && (
              <Typography sx={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#FF5722", lineHeight: 1 }}>
                {lockers.length}
              </Typography>
            )}
          </Box>

          {/* Quick stats */}
          {!loading && !error && (
            <Box sx={{ display: "flex", gap: 3, mt: 2, flexWrap: "wrap" }}>
              {[
                { label: "Available",   value: counts.Available,        color: "#22c55e" },
                { label: "Occupied",    value: counts.Occupied,         color: "#3b82f6" },
                { label: "Maintenance", value: counts.UnderMaintenance, color: "#f59e0b" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block", boxShadow: `0 0 5px ${color}` }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#4a5068" }}>
                    <span style={{ color, fontWeight: 700 }}>{value}</span> {label}
                  </span>
                </div>
              ))}
            </Box>
          )}
        </Box>

        {/* Filter */}
        <Box sx={{ display: "flex", gap: 1, mb: 4, flexWrap: "wrap" }}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`lk-filter-btn${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "UnderMaintenance" ? "Under Maintenance" : f}
              <span style={{ opacity: 0.6 }}> · {f === "All" ? lockers.length : counts[f] ?? 0}</span>
            </button>
          ))}
        </Box>

        {loading && <Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#4a5068" }}>Loading lockers…</Typography>}
        {error && (
          <Box sx={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 2, p: 2 }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#ef4444" }}>{error}</Typography>
          </Box>
        )}

        {/* Locker wall — vertical columns like a real locker room */}
        {!loading && !error && (
          <>
            {/* Info note for admin */}
            <Box sx={{
              mb: 3, p: "10px 14px",
              background: "rgba(255,87,34,0.06)",
              border: "1px solid rgba(255,87,34,0.15)",
              borderRadius: 2,
              display: "inline-flex", alignItems: "center", gap: 1,
            }}>
              <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#FF7043" }}>
                💡 Green lockers are available — click to assign. To assign to a new member, add them on the Members page first.
              </Typography>
            </Box>

            <Box sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(3, 1fr)",
                sm: "repeat(4, 1fr)",
                md: "repeat(6, 1fr)",
                lg: "repeat(8, 1fr)",
                xl: "repeat(10, 1fr)",
              },
              gap: 1.5,
              alignItems: "end",
            }}>
              {filtered.map(locker => (
                <LockerCard
                  key={locker.locker_id}
                  locker={locker}
                  usage={getUsage(locker.locker_id)}
                  onAssignClick={() => setAssignTarget(locker)}
                />
              ))}
            </Box>

            {filtered.length === 0 && (
              <Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#4a5068", mt: 2 }}>
                No lockers match this filter.
              </Typography>
            )}
          </>
        )}
      </Box>

      {assignTarget && (
        <AssignModal
          open={!!assignTarget}
          onClose={() => setAssignTarget(null)}
          locker={assignTarget}
          members={members}
          usages={usages}
          onAssigned={() => { load(); setAssignTarget(null); }}
        />
      )}
    </ThemeProvider>
  );
}