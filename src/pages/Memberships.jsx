import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: { mode: "dark", primary: { main: "#FF5722" } },
  typography: { fontFamily: "'Inter', sans-serif" },
});

const API = "http://localhost:5000";

const STATUS = {
  Active: { color: "#22c55e", bg: "rgba(34,197,94,0.1)", label: "Active" },
  Expired: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", label: "Expired" },
  Suspended: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    label: "Suspended",
  },
};

const FILTERS = ["All", "Active", "Suspended", "Expired"];

function MembershipCard({ membership, member }) {
  // this is the layout of the membership cards, takes the membership
  //and the member data as props and displays them in a
  // card format with some styles and colors based on the status of the membership
  const s = STATUS[membership.status] || {
    color: "#555",
    bg: "#1e1e1e",
    label: membership.status,
  };
  //we create a function to capitalize the first letter of
  //the name and display the initials of the member in the avatar,
  //if the member data is not available we show a question mark and
  //use the member_id as a fallback for the name
  const capitalize = (s) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
  const name = member
    ? `${capitalize(member.first_name)} ${capitalize(member.last_name)}`
    : `Member #${membership.member_id}`;
  const initials = member
    ? `${member.first_name[0]}${member.last_name[0]}`.toUpperCase()
    : "?";

  return (
    <div
      style={{
        background: "#1d2130",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #252836",
        transition: "transform 0.15s, box-shadow 0.15s",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 28px rgba(0,0,0,0.35)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Status stripe — the signature element */}
      <div
        style={{
          height: 4,
          background: s.color,
          boxShadow: `0 0 12px ${s.color}66`,
        }}
      />

      <div
        style={{
          padding: "18px 20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          flex: 1,
        }}
      >
        {/* Top: avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 8,
              background: "#252836",
              border: "1px solid #2e3244",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontFamily: "Barlow Condensed, sans-serif",
              fontWeight: 800,
              fontSize: "0.95rem",
              color: "#FF5722",
              letterSpacing: "0.05em",
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontWeight: 800,
                fontSize: "1.05rem",
                letterSpacing: "0.04em",
                color: "#eef0f4",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.68rem",
                color: "#4a5068",
                fontWeight: 500,
                marginTop: 1,
              }}
            >
              Member ID #{membership.member_id}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#252836" }} />

        {/* Info row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          {/* Left: membership # + type */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "capitalize",
                  color: "#3a4060",
                  marginBottom: 2,
                }}
              >
                Membership #
              </div>
              <div
                style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  color: "#8b92b0",
                  letterSpacing: "0.03em",
                }}
              >
                {String(membership.membership_id).padStart(4, "0")}
              </div>
            </div>

            {/* Type badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "#252836",
                border: "1px solid #2e3244",
                borderRadius: 5,
                padding: "3px 9px",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "#8b92b0",
                letterSpacing: "0.06em",
                textTransform: "capitalize",
                width: "fit-content",
              }}
            >
              {membership.membership_type ?? "—"}
            </div>
          </div>

          {/* Right: status pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: s.bg,
              border: `1px solid ${s.color}33`,
              borderRadius: 20,
              padding: "6px 13px",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: s.color,
              letterSpacing: "0.07em",
              textTransform: "capitalize",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: s.color,
                boxShadow:
                  membership.status === "Active"
                    ? `0 0 5px ${s.color}`
                    : "none",
              }}
            />
            {s.label}
          </div>
        </div>

        {/* Dates */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px 12px",
            background: "#171a26",
            borderRadius: 6,
            padding: "10px 12px",
          }}
        >
          {[
            { label: "Start", value: membership.start_date?.slice(0, 10) },
            { label: "End", value: membership.end_date?.slice(0, 10) },
          ].map(({ label, value }) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "capitalize",
                  color: "#3a4060",
                  marginBottom: 2,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.78rem",
                  color: "#6b7399",
                  fontWeight: 500,
                }}
              >
                {value ?? "—"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Memberships() {
  //some useful states to manage the data and the filters and the search query
  const [memberships, setMemberships] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      // Load memberships and members in parallel, then set state accordingly
      try {
        const [msRes, mRes] = await Promise.all([
          // one of them will store the memberships data and the other will store the members data
          //we use Promise.all to wait for both of them to finish before setting the state
          fetch(`${API}/api/memberships`),
          fetch(`${API}/api/members`),
        ]);
        const [msData, mData] = await Promise.all([msRes.json(), mRes.json()]); // we parse the responses as json in parallel as well to take the data
        // Set the memberships and members state with the fetched data
        setMemberships(msData);
        setMembers(mData);
      } catch {
        setError(
          "Could not reach the server. Make sure it's running on port 5000.",
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getMember = (id) => members.find((m) => m.member_id === id);

  const filtered = memberships.filter((ms) => {
    const matchFilter = filter === "All" || ms.status === filter;
    const member = getMember(ms.member_id);
    const name = member
      ? `${member.first_name} ${member.last_name}`.toLowerCase()
      : "";
    const q = search.toLowerCase();
    const isNumber = /^\d+$/.test(q);

const matchSearch = !q || (
  isNumber
    ? String(ms.member_id) === q ||
      String(ms.membership_id) === q
    : name.includes(q)
);
    return matchFilter && matchSearch;
  });

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] =
      f === "All"
        ? memberships.length
        : memberships.filter((m) => m.status === f).length;
    /* Initialize the count for each filter */
    return acc;
  }, {});

  return (
    <ThemeProvider theme={theme}>
      {/* Styles for the memberships page, acts as a container for custom styles and classes like css */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');
        .ms-search {
          width: 100%; background: #1d2130; border: 1px solid #252836;
          border-radius: 6px; padding: 10px 14px; color: #eef0f4;
          font-family: Inter, sans-serif; font-size: 0.85rem;
          outline: none; transition: border-color 0.15s; box-sizing: border-box;
        }
        .ms-search::placeholder { color: #3a4060; }
        .ms-search:focus { border-color: #FF5722; }
        .ms-filter-btn {
          background: none; border: 1px solid #252836; border-radius: 20px;
          padding: 5px 14px; font-family: Inter, sans-serif; font-size: 0.72rem;
          font-weight: 600; letter-spacing: 0.07em; text-transform: capitalize;
          cursor: pointer; transition: all 0.15s; color: #4a5068;
          white-space: nowrap;
        }
        .ms-filter-btn:hover { border-color: #3a4060; color: #8b92b0; }
        .ms-filter-btn.active { background: #FF5722; border-color: #FF5722; color: #0D0D0D; }
      `}</style>

      <Box
        sx={{
          minHeight: "100vh",
          background: "#13151a",
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 4, md: 5 },
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "capitalize",
              color: "#3a4060",
              mb: 1,
            }}
          >
            FitManager DB
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Barlow Condensed, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                letterSpacing: "0.03em",
                textTransform: "capitalize",
                color: "#eef0f4",
                lineHeight: 1,
              }}
            >
              Memberships
            </Typography>
            {!loading && (
              <Typography
                sx={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.4rem",
                  color: "#FF5722",
                  lineHeight: 1,
                }}
              >
                {filtered.length}
              </Typography>
            )}
          </Box>

          {/* Quick stats to display */}
          {!loading && !error && (
            <Box sx={{ display: "flex", gap: 3, mt: 2, flexWrap: "wrap" }}>
              {[
                { label: "Active", count: counts.Active, color: "#22c55e" },
                {
                  label: "Suspended",
                  count: counts.Suspended,
                  color: "#f59e0b",
                },
                { label: "Expired", count: counts.Expired, color: "#ef4444" },
              ].map(({ label, count, color }) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: color,
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.75rem",
                      color: "#4a5068",
                      fontWeight: 500,
                    }}
                  >
                    <span style={{ color: "#8b92b0", fontWeight: 700 }}>
                      {count}
                    </span>{" "}
                    {label}
                  </span>
                </div>
              ))}
            </Box>
          )}
        </Box>

        {/* Controls to filter and search memberships */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Box sx={{ maxWidth: 320, flex: 1 }}>
            <input
              className="ms-search"
              placeholder="Search by name or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`ms-filter-btn${filter === f ? " active" : ""}`} /* Add "active" class if this filter is selected*/
                onClick={() => setFilter(f)}
              >
                {f}{" "}
                {counts[f] !== undefined && (
                  <span style={{ opacity: 0.7 }}>· {counts[f]}</span>
                )}
              </button>
            ))}
          </Box>
        </Box>

        {/* States, if the api returns data load memberships, if not show error or no results */}
        {loading && (
          <Typography
            sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#4a5068" }}
          >
            Loading memberships…
          </Typography>
        )}
        {error && (
          <Box
            sx={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: "0.82rem",
                color: "#ef4444",
              }}
            >
              {error}
            </Typography>
          </Box>
        )}
        {!loading && !error && filtered.length === 0 && (
          <Typography
            sx={{ fontFamily: "Inter", fontSize: "0.82rem", color: "#4a5068" }}
          >
            No memberships match your filters.
          </Typography>
        )}

        {/* Grid splitting them into 3 in large screens and 2 in small screens and 1 in extra small screens */}
        {!loading && !error && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {filtered.map((ms) => (
              <MembershipCard
                key={ms.membership_id}
                membership={ms}
                member={getMember(ms.member_id)}
              />
            ))}
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}
