import React, { useContext } from "react"
import Footer from "../../../../components/Navigation/Footers/Footer"
import { USERTYPES } from "../../../../enums/userTypes"
import { UserContext } from "../../../../contexts/UserContext"
import HtmlHead from "../../../../components/ReusableComponents/page-builder/html-head"
import PageRoot from "../../../../components/ReusableComponents/page-builder/page-root"
import LoginLayout from "../../../../components/Layouts/LoginLayout"
import AdminWebsitesPanel from "../../../../components/Layouts/admin/AdminWebsitesPanel"
import { useRouter } from "next/router"

export default function ManageWebsitesPage() {
  // Main meta tags
  const title = "Admin | Back-Office | Web | Gérer les sites web"
  const description = "Back-Office : gérez les sites web de votre portfolio web"

  // SEO helpers
  const follow = false

  // OpenGraph additional tags (sharing)
  const type = "website"
  const ogImg = "/medias/ogimg.png"

  // Check if user has grant to access that page
  const { user } = useContext(UserContext)

  // If user is logged in but not as an admin, the user is redirected to his/her account page
  const router = useRouter()
  if (!!user && user.type !== USERTYPES.ADMIN) router.push("/account")

  return (
    <PageRoot>
      <HtmlHead
        title={title}
        description={description}
        follow={follow}
        type={type}
        ogImg={ogImg}
      />

      {!!user && user.type === USERTYPES.ADMIN ? (
        <AdminWebsitesPanel />
      ) : (
        <LoginLayout />
      )}

      <Footer />
    </PageRoot>
  )
}
