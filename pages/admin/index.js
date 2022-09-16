import React, { useContext } from "react"
import Head from "next/head"
import Navbar from "../../components/Navigation/Navbars/navbar"
import Footer from "../../components/Navigation/Footers/Footer"
import { USERTYPES } from "../../enums/userTypes"
import { UserContext } from "../../contexts/UserContext"
import AdminIndex from "../../components/Layouts/admin/AdminIndex"
import LoginLayout from "../../components/Layouts/LoginLayout"
import { Stack } from "@mui/material"

export default function AdminLoginPage(props) {
  const {} = props

  // Check if user has grant to access that page
  const { user } = useContext(UserContext)

  return (
    <Stack>
      <Head>
        <title>Quentin Hébert | Admin</title>
        <meta name="description" content="Admin page" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Navbar />

      {!user || user.type !== USERTYPES.ADMIN ? (
        <LoginLayout />
      ) : (
        <AdminIndex />
      )}

      <Footer />
    </Stack>
  )
}
