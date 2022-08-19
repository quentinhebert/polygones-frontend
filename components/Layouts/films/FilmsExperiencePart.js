import React, { useRef } from "react"
import { Box, Button, Slide, Stack, Typography } from "@mui/material"
import SaveAltIcon from "@mui/icons-material/SaveAlt"

export default function FilmsExperiencePart(props) {
  const {} = props

  return (
    <>
      <Stack
        sx={{
          backgroundImage: "url(/medias/Untitled.png)",
          backgroundSize: "cover",
          height: "900px",
        }}
      >
        <Slide direction="left" {...{ timeout: 1000 }} in>
          <Stack width="100%" alignItems="start">
            <Stack padding="4rem" width="80%" alignItems="start">
              <Typography
                variant="h1"
                fontFamily="Ethereal"
                fontWeight="bold"
                textAlign="start"
                sx={{
                  color: "#c6900e",
                  fontSize: {
                    xs: "4.5rem",
                    sm: "8rem",
                    md: "11.5rem",
                    lg: "15rem",
                    xl: "19rem",
                  },
                  lineHeight: {
                    xs: "4rem",
                    sm: "8rem",
                    md: "10rem",
                    lg: "13rem",
                    xl: "17rem",
                  },
                  zIndex: 0,
                  padding: {
                    xs: "1.5rem 1rem 1rem 0",
                    sm: "1.5rem 1rem 1rem 0",
                    md: "1.5rem 5rem 1rem 0",
                  },
                }}
              >
                Exp .
              </Typography>
              <Typography
                fontFamily="Arial"
                letterSpacing={2}
                fontSize="1.5rem"
                marginBottom="3rem"
                sx={{
                  alignSelf: "start",
                  color: "#825E09",
                  width: "70%",
                }}
              >
                D'abord pris de passion pour la réalisation de courts-métrages,
                j'apprends rapidement à diriger une équipe de tournage amateure.
                <br />
                <br />
                Je prends goût à tous les corps du métier, mais c'est dans la
                direction photographique, le cadrage et le montage que je me
                sens le plus créatif.
                <br />
                <br />
                Je réalise rapidement mes premiers clips musicaux et
                événementiels.
              </Typography>

              <Button
                variant="contained"
                color="secondary"
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  letterSpacing: "1.2px",
                }}
                startIcon={<SaveAltIcon />}
              >
                Télécharger mon CV
              </Button>
            </Stack>
          </Stack>
        </Slide>

        <Box
          sx={{
            backgroundImage: "url(/medias/prout.png)",
            backgroundSize: "cover",
            backgroundPosition: "0% 50%",
            position: "absolute",
            right: 0,
            width: "50%",
            height: "900px",
            mixBlendMode: "multiply",
            // opacity: 0.7,
          }}
        />
      </Stack>
    </>
  )
}
