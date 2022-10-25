import { Box, Stack } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import apiCall from "../../../../services/apiCalls/apiCall"
import PillButton from "../../../ReusableComponents/buttons/pill-button"
import PleaseWait from "../../../ReusableComponents/helpers/please-wait"
import BodyText from "../../../ReusableComponents/text/body-text"
import AccountPagesLayout from "../../AccountPagesLayout"
import Custom404Layout from "../../error/Custom404Layout"
import PaymentIcon from "@mui/icons-material/Payment"
import { useRouter } from "next/router"
import { UserContext } from "../../../../contexts/UserContext"
import {
  convertToShortString,
  getLocaleDateTime,
} from "../../../../services/date-time"

export default function OrdersLayout({ orderId }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useContext(UserContext)

  const fetchOrders = async () => {
    if (!user?.id) return
    const res = await apiCall.orders.getAllByClient({ id: user.id })
    if (res && res.ok) {
      const jsonRes = await res.json()
      setOrders(jsonRes)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const router = useRouter()

  return (
    <AccountPagesLayout title="Mes commandes">
      {loading && <PleaseWait />}
      <Stack gap={4}>
        {orders.length < 1 && !loading && (
          <BodyText>Pas de commande pour le moment</BodyText>
        )}
        {orders.map((order, key) => (
          <Stack className="row full-height flex-center" key={key} gap={4}>
            <Stack
              sx={{
                flexGrow: 1,
                border: (theme) => `1px solid ${theme.palette.secondary.main}`,
                borderRadius: "30px",
                padding: 2,
              }}
            >
              <BodyText>N° de commande: {order.id}</BodyText>
              <BodyText>Statut: {order.state}</BodyText>
              <BodyText>
                Date:{" "}
                {convertToShortString(
                  getLocaleDateTime(order.created_at, user.timezone)
                )}
              </BodyText>
              <BodyText>{order.total_price / 100}€</BodyText>
            </Stack>
            <Stack className="full-height">
              <PillButton
                onClick={() =>
                  router.push(`/account/orders/${order.id}/information`)
                }
              >
                + d'infos
              </PillButton>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </AccountPagesLayout>
  )
}
