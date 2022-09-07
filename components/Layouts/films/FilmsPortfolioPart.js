import React, { useRef } from "react"
import {
  Box,
  ImageListItem,
  Slide,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material"
import theme from "../../../config/theme"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import BigTitle from "../../ReusableComponents/titles/big-title"
import PortfolioImageList from "./PortfolioImageList"
import BodyText from "../../ReusableComponents/text/body-text"
import CenteredMaxWidthStack from "../../ReusableComponents/containers/centered-max-width-container"
import styles from "../../../styles/TextShine.module.css"

export default function FilmsPortfolioPart(props) {
  const { refForScroll } = props

  const sm = useMediaQuery((theme) => theme.breakpoints.up("sm"))
  const md = useMediaQuery((theme) => theme.breakpoints.up("md"))

  return (
    <Stack zIndex={1} position="relative">
      {/* TOP Anchor */}
      <Stack ref={refForScroll} />

      <Stack
        sx={{
          background: (theme) =>
            `linear-gradient(0deg, #000 20%, rgb(0,0,0,0.4) 100%)`,
          // paddingRight: { xs: "1rem", md: "4rem" },
          // paddingLeft: { xs: "1rem", md: "4rem" },
          paddingBottom: { xs: "2rem", md: "6rem" },
        }}
      >
        <CenteredMaxWidthStack pixels="1200px">
          <Slide direction="right" {...{ timeout: 1000 }} in>
            <Stack width="100%" alignItems="start">
              <Stack
                width="100%"
                sx={{ padding: { xs: "2rem 0 0", md: "6rem 2rem 4rem 0" } }}
              >
                <BigTitle
                  className={styles.shine}
                  title="Mes réalisations"
                  fontFamily="Ethereal"
                  textAlign="center"
                />
                {/* <BodyText color="text.white" textAlign="center">
                  Je crée des vidéos qui vous ressemblent.
                  <p />
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in
                  <br />
                  some form, by injected humour, or randomised words which don't
                  look even slightly believable. If you are going to use a
                  passage o
                </BodyText> */}
              </Stack>
            </Stack>
          </Slide>

          <PortfolioImageList />
        </CenteredMaxWidthStack>
      </Stack>
    </Stack>
  )
}
