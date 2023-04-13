import React, { useContext } from "react"
import { USERTYPES } from "../../../enums/userTypes"
import { UserContext } from "../../../contexts/UserContext"
import Login_Main from "../../../components/Main/Login_Main"
import PagesLayout from "../../../components/Layouts/PagesLayout"
import AdminLayout from "../../../components/Layouts/AdminLayout"
import Redirect from "../../../components/Helpers/redirect"
import ServicesPanel_Main from "../../../components/Main/Admin/ServicesPanel_Main"

const head = {
  // Main meta tags
  title: "Admin | Back-Office | Services",
  description: "Back-Office : gérez vos services",
  // SEO helpers
  follow: false,
  // OpenGraph additional tags (sharing)
  type: "website",
  ogImg: "/medias/ogimg.jpg",
}

export default function Services() {
  // Check if user has grant to access that page
  const { user } = useContext(UserContext)
  if (!!user && user.type !== USERTYPES.ADMIN)
    return <Redirect target="/account" />

  return (
    <PagesLayout head={head}>
      {!user && <Login_Main />}

      {!!user && user.type === USERTYPES.ADMIN && (
        <AdminLayout title="Mes services">
          <ServicesPanel_Main />
        </AdminLayout>
      )}
    </PagesLayout>
  )
}
