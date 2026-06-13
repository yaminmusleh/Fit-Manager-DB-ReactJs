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
  "In Progress": { color: "#22c55e", bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.25)",  label: "Under Repairing" },
  "Completed":   { color: "#3b82f6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.25)", label: "Completed"       },
  "Pending":     { color: "#ef4444", bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.25)",  label: "Needs Repair"    },
};
function getStatus(s) {
  return STATUS_CONFIG[s] || { color: "#8b92b0", bg: "rgba(139,146,176,0.1)", border: "rgba(139,146,176,0.25)", label: s };
}

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

// ── Maintenance Card ────────────────────────────────────────────────
function MaintenanceCard({ record, equipmentName, onStatusChange }) {
  const [loading, setLoading] = useState(false);
  const cfg = getStatus(record.status);
  const isPending = record.status === "Pending";

  async function handleRepairClick() {
    setLoading(true);
    try {
      // Update maintenance status to In Progress
      await fetch(`${API}/api/maintenance/${record.maintenance_id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "In Progress" }),
      });
      // Update equipment condition_status to Under Repair
      await fetch(`${API}/api/equipment/${record.equipment_id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ condition_status: "Under Repair" }),
      });
      onStatusChange(record.maintenance_id, "In Progress");
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  return (
    <div style={{
      background: "#1d2130",
      border: `1px solid ${isPending ? "rgba(239,68,68,0.2)" : "#252836"}`,
      borderRadius: 10, overflow: "hidden",
      transition: "box-shadow 0.15s",
      boxShadow: isPending ? "0 0 0 1px rgba(239,68,68,0.1)" : "none",
    }}>
      {/* Top stripe */}
      <div style={{ height: 3, background: cfg.color, boxShadow: `0 0 8px ${cfg.color}55` }} />

      <div style={{ padding: "16px 18px 18px" }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900,
              fontSize: "1.1rem", color: "#eef0f4", letterSpacing: "0.03em",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {equipmentName || `Equipment #${record.equipment_id}`}
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.67rem", color: "#4a5068", marginTop: 2 }}>
              Maintenance ID #{record.maintenance_id} · {record.maintenance_date?.slice(0, 10)}
            </div>
          </div>

          {/* Status / action button */}
          {isPending ? (
            <button
              onClick={handleRepairClick}
              disabled={loading}
              style={{
                background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 6, padding: "7px 14px", flexShrink: 0,
                fontFamily: "Inter, sans-serif", fontSize: "0.75rem",
                fontWeight: 700, color: "#ef4444",
                cursor: loading ? "not-allowed" : "pointer",
                textTransform: "capitalize", transition: "background 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "rgba(239,68,68,0.22)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.12)"; }}
            >
              {loading ? "Updating…" : "⚠ Needs repair"}
            </button>
          ) : (
            <div style={{
              background: cfg.bg, border: `1px solid ${cfg.border}`,
              borderRadius: 6, padding: "7px 14px", flexShrink: 0,
              fontFamily: "Inter, sans-serif", fontSize: "0.75rem",
              fontWeight: 700, color: cfg.color,
              textTransform: "capitalize", whiteSpace: "nowrap",
            }}>
              {record.status === "In Progress" ? "🔧 " : "✓ "}{cfg.label}
            </div>
          )}
        </div>

        {/* Issue description */}
        <div style={{
          background: "#171a26", borderRadius: 7,
          padding: "10px 12px", marginBottom: 12,
          border: "1px solid #1e2235",
        }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "capitalize", color: "#3a4060", marginBottom: 4 }}>
            Issue
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#8b92b0", lineHeight: 1.5 }}>
            {record.issue_description || "—"}
          </div>
        </div>

        {/* Notes */}
        {record.notes && (
          <div style={{
            background: "#171a26", borderRadius: 7,
            padding: "10px 12px", marginBottom: 12,
            border: "1px solid #1e2235",
          }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "capitalize", color: "#3a4060", marginBottom: 4 }}>
              Notes
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "#8b92b0", lineHeight: 1.5 }}>
              {record.notes}
            </div>
          </div>
        )}

        {/* Technician */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 6, flexShrink: 0,
            background: "rgba(255,87,34,0.1)", border: "1px solid rgba(255,87,34,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Barlow Condensed, sans-serif", fontWeight: 800,
            fontSize: "0.75rem", color: "#FF5722",
          }}>
            {record.technician_name?.split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2) || "?"}
          </div>
          <div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", fontWeight: 600, color: "#c8ccd8" }}>
              {record.technician_name || "Unassigned"}
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#3a4060" }}>
              Responsible technician
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Add Maintenance Modal ───────────────────────────────────────────
function AddMaintenanceModal({ open, onClose, equipment, onAdded }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    equipment_id: "", maintenance_date: today,
    issue_description: "", technician_name: "", notes: "", status: "Pending",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  useEffect(() => {
    if (open) {
      setForm({ equipment_id: "", maintenance_date: today, issue_description: "", technician_name: "", notes: "", status: "Pending" });
      setErr("");
    }
  }, [open]);

  async function handleSave() {
    setErr("");
    if (!form.equipment_id || !form.issue_description || !form.technician_name) {
      setErr("Equipment, issue description and technician are required."); return;
    }
    setSaving(true);
    try {
      // Add maintenance record
      const res = await fetch(`${API}/api/maintenance`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, equipment_id: Number(form.equipment_id) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add record.");

      // Also update equipment condition_status
      await fetch(`${API}/api/equipment/${form.equipment_id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ condition_status: "Under Repair" }),
      });

      onAdded(); onClose();
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
        width: "min(540px, 93vw)", maxHeight: "90vh",
        overflowY: "auto", outline: "none",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <div>
            <div style={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: "#eef0f4", textTransform: "capitalize" }}>
              Report maintenance
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: "#4a5068", marginTop: 3 }}>
              Equipment will be marked as Under Repair in the database
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#4a5068", fontSize: "1.1rem", cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Equipment selector */}
          <FieldRow label="Equipment">
            <select value={form.equipment_id} onChange={e => set("equipment_id", e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#FF5722"}
              onBlur={e => e.target.style.borderColor = "#2a2a3a"}
            >
              <option value="">— Select equipment —</option>
              {equipment.map(eq => (
                <option key={eq.equipment_id} value={eq.equipment_id}>
                  #{eq.equipment_id} · {eq.equipment_name} ({eq.category})
                </option>
              ))}
            </select>
          </FieldRow>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
            <FieldRow label="Maintenance date">
              <input type="date" value={form.maintenance_date} onChange={e => set("maintenance_date", e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#FF5722"}
                onBlur={e => e.target.style.borderColor = "#2a2a3a"}
              />
            </FieldRow>
            <FieldRow label="Technician name">
              <input type="text" value={form.technician_name} onChange={e => set("technician_name", e.target.value)}
                placeholder="e.g. Tariq Hassan"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#FF5722"}
                onBlur={e => e.target.style.borderColor = "#2a2a3a"}
              />
            </FieldRow>
          </div>

          <FieldRow label="Issue description">
            <textarea value={form.issue_description} onChange={e => set("issue_description", e.target.value)}
              placeholder="Describe the problem…"
              rows={3}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "Inter, sans-serif" }}
              onFocus={e => e.target.style.borderColor = "#FF5722"}
              onBlur={e => e.target.style.borderColor = "#2a2a3a"}
            />
          </FieldRow>

          <FieldRow label="Notes (optional)">
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)}
              placeholder="Any additional notes…"
              rows={2}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "Inter, sans-serif" }}
              onFocus={e => e.target.style.borderColor = "#FF5722"}
              onBlur={e => e.target.style.borderColor = "#2a2a3a"}
            />
          </FieldRow>

          <FieldRow label="Initial status">
            <select value={form.status} onChange={e => set("status", e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#FF5722"}
              onBlur={e => e.target.style.borderColor = "#2a2a3a"}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
            </select>
          </FieldRow>
        </div>

        {err && (
          <div style={{ marginTop: 14, padding: "9px 12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 5, color: "#ef4444", fontFamily: "Inter, sans-serif", fontSize: "0.78rem" }}>
            {err}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: "1px solid #252836", borderRadius: 5, padding: "9px 18px", color: "#4a5068", fontFamily: "Inter, sans-serif", fontSize: "0.82rem", cursor: "pointer", textTransform: "capitalize" }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} style={{
            background: saving ? "#7a2d16" : "#FF5722", border: "none", borderRadius: 5,
            padding: "9px 22px", color: "#0d0f17", fontFamily: "Inter, sans-serif",
            fontWeight: 700, fontSize: "0.85rem", cursor: saving ? "not-allowed" : "pointer",
            textTransform: "capitalize", transition: "background 0.15s",
          }}>
            {saving ? "Reporting…" : "Report issue"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Main Page ───────────────────────────────────────────────────────
export default function Maintenance() {
  const [records, setRecords]     = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [addOpen, setAddOpen]     = useState(false);
  const [filter, setFilter]       = useState("All");

  async function load() {
    try {
      const [mRes, eRes] = await Promise.all([
        fetch(`${API}/api/maintenance`),
        fetch(`${API}/api/equipment`),
      ]);
      const [mData, eData] = await Promise.all([mRes.json(), eRes.json()]);
      setRecords(mData);
      setEquipment(eData);
    } catch {
      setError("Could not reach the server. Make sure it's running on port 5000.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function getEquipmentName(id) {
    return equipment.find(e => e.equipment_id === id)?.equipment_name || null;
  }

  function handleStatusChange(maintenanceId, newStatus) {
    setRecords(prev => prev.map(r => r.maintenance_id === maintenanceId ? { ...r, status: newStatus } : r));
  }

  const FILTERS = ["All", "Pending", "In Progress", "Completed"];
  const filtered = filter === "All" ? records : records.filter(r => r.status === filter);

  const counts = {
    Pending:     records.filter(r => r.status === "Pending").length,
    "In Progress": records.filter(r => r.status === "In Progress").length,
    Completed:   records.filter(r => r.status === "Completed").length,
  };

  return (
    <ThemeProvider theme={theme}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');
        .mnt-filter-btn {
          background: none; border: 1px solid #252836; border-radius: 20px;
          padding: 5px 14px; font-family: Inter, sans-serif; font-size: 0.72rem;
          font-weight: 600; letter-spacing: 0.05em; cursor: pointer;
          transition: all 0.15s; color: #4a5068; white-space: nowrap;
          text-transform: capitalize;
        }
        .mnt-filter-btn:hover { border-color: #3a4060; color: #8b92b0; }
        .mnt-filter-btn.active { background: #FF5722; border-color: #FF5722; color: #0D0D0D; }
      `}</style>

      <Box sx={{ minHeight: "100vh", background: "#13151a", px: { xs: 2, sm: 4, md: 6 }, py: { xs: 4, md: 5 } }}>

        {/* Header */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <div>
            <Typography sx={{ fontFamily: "Inter", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "capitalize", color: "#3a4060", mb: 1 }}>
              FitManager DB
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 2 }}>
              <Typography sx={{ fontFamily: "Barlow Condensed, sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", textTransform: "capitalize", color: "#eef0f4", lineHeight: 1 }}>
                Maintenance
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
                  { label: "Needs repair",  value: counts["Pending"],     color: "#ef4444" },
                  { label: "Under repairing", value: counts["In Progress"], color: "#22c55e" },
                  { label: "Completed",     value: counts["Completed"],   color: "#3b82f6" },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "#4a5068" }}>
                      <span style={{ color, fontWeight: 700 }}>{value}</span> {label}
                    </span>
                  </div>
                ))}
              </Box>
            )}
          </div>

          {/* Report button */}
          <button
            onClick={() => setAddOpen(true)}
            style={{
              background: "#FF5722", border: "none", borderRadius: 6,
              padding: "10px 20px", color: "#0D0D0D",
              fontFamily: "Inter, sans-serif", fontWeight: 700,
              fontSize: "0.88rem", cursor: "pointer", flexShrink: 0,
              textTransform: "capitalize", transition: "background 0.15s, transform 0.12s",
            }}
            onMouseEnter={e => { e.target.style.background = "#FF7043"; e.target.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.target.style.background = "#FF5722"; e.target.style.transform = "none"; }}
          >
            + Report issue
          </button>
        </Box>

        {/* Filter buttons */}
        <Box sx={{ display: "flex", gap: 1, mb: 4, flexWrap: "wrap" }}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`mnt-filter-btn${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f} <span style={{ opacity: 0.6 }}>· {f === "All" ? records.length : counts[f] ?? 0}</span>
            </button>
          ))}
        </Box>

        {loading && <Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#4a5068" }}>Loading maintenance records…</Typography>}
        {error && (
          <Box sx={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 2, p: 2 }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#ef4444" }}>{error}</Typography>
          </Box>
        )}
        {!loading && !error && filtered.length === 0 && (
          <Typography sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#4a5068" }}>
            No maintenance records match this filter.
          </Typography>
        )}

        {/* Cards grid */}
        {!loading && !error && (
          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: 2,
          }}>
            {filtered.map(record => (
              <MaintenanceCard
                key={record.maintenance_id}
                record={record}
                equipmentName={getEquipmentName(record.equipment_id)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </Box>
        )}
      </Box>

      <AddMaintenanceModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        equipment={equipment}
        onAdded={load}
      />
    </ThemeProvider>
  );
}