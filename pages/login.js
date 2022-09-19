import { useRouter } from "next/router"
import { useContext } from "react"
import LoginLayout from "../components/Layouts/LoginLayout"
import Footer from "../components/Navigation/Footers/Footer"
import Navbar from "../components/Navigation/Navbars/navbar"
import HtmlHead from "../components/ReusableComponents/page-builder/html-head"
import PageRoot from "../components/ReusableComponents/page-builder/page-root"
import { UserContext } from "../contexts/UserContext"
import PleaseWait from "../components/ReusableComponents/helpers/please-wait"
import { Stack } from "@mui/material"

export default function LoginPage() {
  // Main meta tags
  const title = "Se connecter"
  const description = "Page de connexion"

  // SEO helpers
  const follow = false

  // OpenGraph additional tags (sharing)
  const type = "website"
  const ogImg = "/medias/ogimg.png"

  // Check if user is already logged in
  const { user } = useContext(UserContext)

  const router = useRouter()
  if (user) router.push("/account")

  return (
    <PageRoot>
      <HtmlHead
        title={title}
        description={description}
        follow={follow}
        type={type}
        ogImg={ogImg}
      />

      <Navbar />

      {!user ? (
        <LoginLayout redirect="/account" />
      ) : (
        <Stack flexGrow={1} justifyContent="center">
          <PleaseWait />
        </Stack>
      )}

      <Footer />
    </PageRoot>
  )
}
