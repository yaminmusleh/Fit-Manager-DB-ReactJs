import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PeopleIcon from "@mui/icons-material/People";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import SportsIcon from "@mui/icons-material/Sports";
import FitnessCenter from "@mui/icons-material/FitnessCenter";
import BuildIcon from "@mui/icons-material/Build";
import LockIcon from "@mui/icons-material/Lock";
import EventNoteIcon from "@mui/icons-material/EventNote";

const gymTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#FF5722" },
    background: { default: "#0D0D0D", paper: "#141414" },
  },
  typography: { fontFamily: "'Inter', sans-serif" },
});

// each nav item maps to a DB table + a server.js route
const NAV_ITEMS = [
  { label: "Members",     path: "/members",     icon: <PeopleIcon fontSize="small" />, api: "/api/members"},
  { label: "Memberships", path: "/memberships", icon: <CardMembershipIcon fontSize="small" />,api: "/api/memberships"},
  { label: "Trainers",    path: "/trainers",    icon: <SportsIcon fontSize="small" />,api: "/api/trainers"},
  { label: "Sessions",    path: "/sessions",    icon: <EventNoteIcon fontSize="small" />,api: "/api/sessions"},
  { label: "Equipment",   path: "/equipment",   icon: <FitnessCenter fontSize="small" />, api: "/api/equipment"},
  { label: "Maintenance", path: "/maintenance", icon: <BuildIcon fontSize="small" />, api: "/api/maintenance"},
  { label: "Lockers",     path: "/lockers",     icon: <LockIcon fontSize="small" />, api: "/api/lockers"},
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <ThemeProvider theme={gymTheme}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');

        .fm-logo {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 1.45rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #F0EDE8;
          line-height: 1;
          cursor: pointer;
          user-select: none;
        }
        .fm-logo span { color: #FF5722; }

        .fm-nav-btn {
          font-family: 'Inter', sans-serif !important;
          font-size: 0.78rem !important;
          font-weight: 500 !important;
          letter-spacing: 0.07em !important;
          text-transform: uppercase !important;
          color: #888 !important;
          padding: 5px 11px !important;
          min-width: unset !important;
          border-radius: 3px !important;
          gap: 5px;
          transition: color 0.15s !important;
          position: relative;
        }
        .fm-nav-btn::after {
          content: '';
          position: absolute;
          bottom: 0px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 20px;
          height: 2px;
          background: #FF5722;
          border-radius: 1px;
          transition: transform 0.15s ease;
        }
        .fm-nav-btn:hover {
          color: #F0EDE8 !important;
          background: rgba(255,255,255,0.04) !important;
        }
        .fm-nav-btn:hover::after { transform: translateX(-50%) scaleX(1); }
        .fm-nav-btn.active {
          color: #FF5722 !important;
          background: rgba(255,87,34,0.08) !important;
        }
        .fm-nav-btn.active::after { transform: translateX(-50%) scaleX(1); }

        .fm-drawer-btn {
          font-family: 'Inter', sans-serif !important;
          font-size: 0.85rem !important;
          font-weight: 500 !important;
          letter-spacing: 0.05em !important;
          text-transform: uppercase !important;
          color: #aaa !important;
          border-radius: 4px !important;
        }
        .fm-drawer-btn:hover { color: #F0EDE8 !important; background: rgba(255,255,255,0.05) !important; }
        .fm-drawer-btn.active { color: #FF5722 !important; background: rgba(255,87,34,0.1) !important; }
      `}</style>

      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"  
          elevation={0}
          sx={{ background: "#0D0D0D", borderBottom: "1px solid #1E1E1E" }}
        >
          <Toolbar sx={{ minHeight: "58px !important", px: { xs: 2, sm: 3 }, gap: 1 }}>

            {/* Logo */}
            <Box
              onClick={() => navigate("/")}
              sx={{ display: "flex", alignItems: "center", gap: 1, mr: 3, flexShrink: 0 }}
            >
              <FitnessCenterIcon sx={{ color: "#FF5722", fontSize: "1.2rem", transform: "rotate(-30deg)" }} />
              <span className="fm-logo">Fit<span>Manager</span></span>
            </Box>

            {/* Desktop nav */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", lg: "flex" }, alignItems: "center", gap: 0.25 }}>
              {NAV_ITEMS.map(({ label, path, icon }) => (
                <Button
                  key={path}
                  disableRipple
                  className={`fm-nav-btn${isActive(path) ? " active" : ""}`}
                  onClick={() => navigate(path)}
                  startIcon={icon}
                >
                  {label}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: { xs: 1, lg: 0 } }} />

            {/* DB status dot */}
            <Box sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center", gap: 0.75,
              fontSize: "0.7rem", fontFamily: "Inter, sans-serif",
              fontWeight: 600, letterSpacing: "0.06em",
              textTransform: "uppercase", color: "#555",
              flexShrink: 0,
            }}>
              <Box sx={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 6px #22c55e",
              }} />
              DB Connected
            </Box>

            {/* Mobile hamburger */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: "flex", lg: "none" }, color: "#888", ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              background: "#111",
              borderLeft: "1px solid #1E1E1E",
              width: 240,
            },
          }}
        >
          <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="fm-logo" style={{ fontSize: "1.2rem" }}>
              Fit<span style={{ color: "#FF5722" }}>Manager</span>
            </span>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#555" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: "#1E1E1E" }} />

          <List sx={{ pt: 1 }}>
            {NAV_ITEMS.map(({ label, path, icon }) => (
              <ListItem key={path} disablePadding sx={{ px: 1, mb: 0.5 }}>
                <ListItemButton
                  className={`fm-drawer-btn${isActive(path) ? " active" : ""}`}
                  onClick={() => { navigate(path); setDrawerOpen(false); }}
                  sx={{ borderRadius: "4px", gap: 1.5, py: 1 }}
                >
                  <Box sx={{ color: isActive(path) ? "#FF5722" : "#555", display: "flex" }}>{icon}</Box>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: "0.82rem",
                      fontWeight: 500,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}