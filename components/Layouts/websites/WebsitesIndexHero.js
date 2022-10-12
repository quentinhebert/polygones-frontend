import { Box, Slide, Stack, Typography } from "@mui/material"
import BouncingArrow from "../../Navigation/BouncingArrow"
import PillButton from "../../ReusableComponents/buttons/pill-button"

export default function WebsitesIndexHero(props) {
  const { refsForScroll } = props

  const scrollTo = (ref) => {
    ref.current.scrollIntoView({
      behavior: "smooth",
    })
  }

  return (
    <Stack
      zIndex={1}
      position="relative"
      sx={{
        background: (theme) =>
          `linear-gradient(220deg, ${theme.palette.tersary.main} 10%, ${theme.palette.background.secondary} 100%)`,
        width: "100%",
        minHeight: { xs: "500px", md: "600px" },
        height: { xs: "70vh", sm: "70vh", md: "100vh" },
        alignItems: "end",
        position: "relative",
      }}
    >
      {/* Right Text */}
      <Slide direction="left" {...{ timeout: 1000 }} in>
        <Typography
          variant="h1"
          color="secondary"
          fontFamily="Zacbel X"
          sx={{
            textAlign: "right",
            fontSize: {
              xs: "13vw",
              sm: "11vw",
            },
            lineHeight: {
              xs: "13vw",
              sm: "11vw",
            },
            position: "absolute",
            zIndex: 0,
            padding: {
              xs: "7rem 1.5rem 0 1rem",
              sm: "7rem 1.5rem 0 1rem",
              md: "7rem 1.5rem 0 5rem",
            },
          }}
        >
          Developpeur
          <br />
          Freelance
        </Typography>
      </Slide>

      <Slide
        direction="right"
        {...(true ? { timeout: 1000 } : {})}
        in
        mountOnEnter
        unmountOnExit
      >
        <Box
          sx={{
            position: "absolute",
            backgroundImage: "url(/medias/developper-alpha.png)",
            backgroundSize: {
              xs: "200%",
              sm: "200%",
              md: "170%",
              lg: "150%",
              xl: "120%",
            },
            backgroundPosition: {
              xs: "30% 10rem",
              sm: "50% -10vw",
              md: "50% 20%",
              lg: "30% 30%",
              xl: "30% 10%",
            },
            backgroundRepeat: "no-repeat",
            width: "100%",
            minHeight: { xs: "500px", md: "600px" },
            height: { xs: "70vh", sm: "70vh", md: "100vh" },
            zIndex: 1,
          }}
        />
      </Slide>

      <Box
        width="100%"
        height="100%"
        sx={{
          zIndex: 11,
        }}
      >
        <Stack
          sx={{
            fontFamily: "Helmet",
            position: "absolute",
            right: { xs: "2rem", md: "2rem" },
            top: { xs: "60vw", sm: "25rem", md: "30rem" },
            gap: { xs: 1, md: 2 },
            flexDirection: "row",
          }}
        >
          <PillButton
            animDelay={0.2}
            background="transparent"
            boxShadow="!important"
            scaleUpOnHover
            color={(theme) => theme.palette.secondary.main}
            border={(theme) => `3px solid ${theme.palette.secondary.main}`}
            fontSize={{ xs: "1rem", sm: "1.2rem", md: "1.5rem" }}
            padding={{ xs: "0.2rem 1.5rem", md: "0.5rem 2rem" }}
            onClick={() => scrollTo(refsForScroll.portfolio)}
          >
            Mes projets
          </PillButton>
          <PillButton
            animDelay={0.5}
            boxShadow="!important"
            scaleUpOnHover
            fontSize={{ xs: "1rem", sm: "1.2rem", md: "1.5rem" }}
            border={(theme) => `3px solid ${theme.palette.secondary.main}`}
            padding={{ xs: "0.2rem 1.5rem", md: "0.5rem 2rem" }}
            onClick={() => scrollTo(refsForScroll.portfolio)}
          >
            Mon Cv
          </PillButton>
        </Stack>
      </Box>

      <Stack
        zIndex={10}
        justifyContent="end"
        alignItems="center"
        sx={{
          width: "100%",
          minHeight: { xs: "500px", md: "600px" },
          height: { xs: "100vh", md: "100vh" },
        }}
      >
        <BouncingArrow
          text=""
          scrollTo={scrollTo}
          refForScroll={refsForScroll.whyADev}
        />
      </Stack>
    </Stack>
  )
}
