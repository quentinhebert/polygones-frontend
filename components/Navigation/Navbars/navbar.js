import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import LogoSwitchDropdown from "../../Dropdown/logo-switch-dropdown";

export default function Navbar() {
  return (
    <AppBar
      position="sticky"
      component="nav"
      sx={{ backgroundColor: "#000", backgroundImage: "none" }}
    >
      <Box sx={{ flexGrow: 2 }}>
        <Toolbar>
          <LogoSwitchDropdown src="/logos/logo.png" />
          <Box component="div" sx={{ flexGrow: 1 }} />
          <Button
            sx={{
              backgroundColor: "#fff",
              color: "#000",
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
