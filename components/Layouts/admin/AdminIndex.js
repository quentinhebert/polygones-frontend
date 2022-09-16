import { Box, Grid, Stack, Typography } from "@mui/material"
import CustomCard from "../../ReusableComponents/cards/custom-card"
import CustomCardTitle from "../../ReusableComponents/cards/custom-card-title"
import EndCardButton from "../../ReusableComponents/cards/end-card-button"
import styles from "../../../styles/TextShine.module.css"
import BodyText from "../../ReusableComponents/text/body-text"
import PageTitle from "../../ReusableComponents/titles/page-title"
import OneActionCardsGrid from "../../ReusableComponents/cards/one-action-cards-grid"

const CARDS = [
  {
    title: "Informations",
    description:
      "Modifiez les informations de votre site (descriptions, footer, barre de navigation...).",
    button: { text: "Gérer", href: "/admin/manage-website-informations" },
  },
  {
    title: "Contenu",
    description: "Ajoutez, modifiez et supprimez du contenu de votre site.",
    button: { text: "Gérer", href: "/admin/manage-content" },
  },
  {
    title: "Utilisateurs",
    description:
      "Ajoutez, modifiez et supprimez ou ou des utilisateurs de votre site.",
    button: { text: "Gérer", href: "/admin/manage-users" },
  },
  {
    title: "Fichiers",
    description:
      "Ajoutez, modifiez et supprimez ou ou des utilisateurs de votre site.",
    button: { text: "Gérer", href: "/admin/manage-files" },
  },
]

export default function AdminIndex() {
  return (
    <Stack
      flexGrow={1}
      direction="column"
      gap={4}
      padding={4}
      paddingTop={"7rem"}
      paddingBottom={"7rem"}
    >
      <Box
        position="fixed"
        width="100%"
        height="100%"
        zIndex={0}
        sx={{
          backgroundImage: "url(/medias/lines.jpg)",
          backgroundSize: "cover",
        }}
      />
      <PageTitle zIndex={1} text="Dashboard" />

      <Stack zIndex={0}>
        <OneActionCardsGrid cards={CARDS} />
      </Stack>
    </Stack>
  )
}
