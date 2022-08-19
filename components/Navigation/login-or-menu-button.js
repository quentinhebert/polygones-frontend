import * as React from "react";
import Button from "@mui/material/Button";
import { UserContext } from "../../contexts/UserContext";
import { Avatar, Typography, useMediaQuery } from "@mui/material";
import dynamic from "next/dynamic";
import theme from "../../config/theme";
const UserMenuDrawer = dynamic(() => import("../Drawer/user-menu"));
const LoginModal = dynamic(() => import("../Modals/login-modal"));

function LoginOrMenuButton(props) {
  /********** PROPS **********/
  const {} = props;

  /********** USER CONTEXT **********/
  const { user, setUser, setAccessToken } = React.useContext(UserContext);

  /********** USE-STATES **********/
  const [openLogin, setOpenLogin] = React.useState(false);
  const [openDrawer, setOpenDrawer] = React.useState(false);

  /********** FUNCTIONS **********/
  const handleOpenLogin = () => {
    setOpenLogin(true);
  };
  const handleCloseLogin = () => {
    setOpenLogin(false);
  };
  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenDrawer(open);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  /********** RENDER **********/
  // User logged
  if (user)
    return (
      <>
        <Button onClick={toggleDrawer(true)}>
          <Avatar alt="Avatar" src={user.avatar_path} />
          {!isMobile ? (
            <Typography margin={2} textTransform="capitalize">
              {user.firstname}
            </Typography>
          ) : null}
        </Button>
        <UserMenuDrawer
          toggleDrawer={toggleDrawer}
          isOpen={openDrawer}
          user={user}
          setUser={setUser}
          setAccessToken={setAccessToken}
        />
      </>
    );

  // Default (no user)
  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpenLogin}
        sx={{
          letterSpacing: "1px",
          padding: ".5rem 1rem",
          "&:hover": { color: "#fff" },
        }}
      >
        Log in
      </Button>

      <LoginModal
        openLogin={openLogin}
        handleOpenLogin={handleOpenLogin}
        handleCloseLogin={handleCloseLogin}
      />
    </>
  );
}

/********** EXPORT **********/
export default LoginOrMenuButton;
