import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import LogoSwitchDropdown from "../../Dropdown/logo-switch-dropdown";

export default function NavbarFilm() {
  return (
    <AppBar
      position="sticky"
      component="nav"
      sx={{ backgroundColor: "#87181f", backgroundImage: "none" }}
    >
      <Box sx={{ flexGrow: 2 }}>
        <Toolbar>
          <LogoSwitchDropdown src="/logos/film-logo.png" />
          <Box component="div" sx={{ flexGrow: 1 }} />
          <Button
            sx={{
              backgroundColor: "#fff",
              color: "#87181f",
              letterSpacing: "1px",
              padding: ".5rem 1rem",
              "&:hover": { color: "#fff" },
            }}
          >
            Obtenir un devis
          </Button>
        </Toolbar>
      </Box>
    </AppBar>
  );
}
