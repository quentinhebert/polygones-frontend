import { Box, Grid, Stack } from "@mui/material"
import { convertDateToLongString } from "../../../services/date-time"
import BodyText from "../../Text/body-text"
import SmallTitle from "../../Titles/small-title"
import EuroIcon from "@mui/icons-material/Euro"
import HourglassTopIcon from "@mui/icons-material/HourglassTop"
import WorkHistoryIcon from "@mui/icons-material/WorkHistory"

const PAYMENT_OPTIONS = [
  { id: "card", label: "Carte bancaire" },
  { id: "transfer", label: "Virement bancaire" },
  { id: "check", label: "Chèque de banque" },
  { id: "cash", label: "Espèces" },
]
const HEAD = [
  { label: "Type" },
  { label: "Intitulé" },
  { label: "Description", width: { xs: "200px", md: "20%" } },
  { label: "Qté." },
  { label: "TVA" },
  { label: "Prix unit. HT" },
  { label: "Total" },
]
const HeadCell = ({ width, ...props }) => (
  <Box
    component="th"
    textAlign="left"
    sx={{
      border: (theme) => `2px solid ${theme.palette.secondary.main}`,
      padding: 2,
      minWidth: width || "10%",
      background: (theme) => theme.palette.background.main,
    }}
  >
    <BodyText
      preventTransition
      color={(theme) => theme.palette.text.secondary}
      {...props}
    />
  </Box>
)
const Cell = (props) => (
  <Box
    component="td"
    textAlign="left"
    sx={{
      border: (theme) => `2px solid ${theme.palette.secondary.main}`,
      padding: 2,
    }}
  >
    <BodyText preventTransition color="#fff" {...props} />
  </Box>
)
const Line = (props) => (
  <Box
    component="tr"
    sx={{
      border: (theme) => `2px solid ${theme.palette.secondary.main}`,
      padding: 2,
    }}
    {...props}
  />
)
const DateInfo = ({ label, ...props }) => (
  <BodyText preventTransition fontSize="1rem">
    <Title>{label}</Title>
    <Box component="span" textTransform="capitalize" {...props} />
  </BodyText>
)
const Title = (props) => (
  <Stack>
    <BodyText
      fontSize="1rem"
      preventTransition
      color={(theme) => theme.palette.text.secondary}
      {...props}
    />
  </Stack>
)
const Info = ({ title, ...props }) => (
  <BodyText preventTransition fontSize="1rem">
    <Title>{title}</Title>
    <Box component="span" {...props} />
  </BodyText>
)
const Card = ({ title, icon, ...props }) => (
  <Grid item xs={12} sm={6} md={4} lg={3} display="flex">
    <Stack
      width="100%"
      sx={{
        background: (theme) => theme.palette.background.main,
        padding: 4,
        gap: 4,
        borderRadius: "30px",
      }}
    >
      <SmallTitle alignItems="center" gap={1} display="flex" color="#fff">
        {icon}
        {title}
      </SmallTitle>
      <Stack {...props} gap={2} />
    </Stack>
  </Grid>
)

export default function QuotationReadOnlySection({ items, quotation }) {
  // SUB-COMPONENTS
  const TotalPrices = () => {
    let totalPrice = 0
    let totalNoVatPrice = 0
    let totalVat = 0

    items.map((item) => {
      totalPrice += item.quantity * item.no_vat_price * (1 + item.vat / 100)
      totalNoVatPrice += item.quantity * item.no_vat_price
      totalVat += item.quantity * item.vat
    })
    totalPrice = totalPrice / 100
    totalNoVatPrice = totalNoVatPrice / 100

    const Label = (props) => (
      <Grid item xs={8}>
        <BodyText
          preventTransition
          {...props}
          color={(theme) => theme.palette.text.secondary}
        />
      </Grid>
    )

    const Price = (props) => (
      <Grid item xs={4}>
        <BodyText preventTransition {...props} />
      </Grid>
    )

    return (
      <Stack
        sx={{
          alignSelf: "end",
          border: (theme) => `1px solid ${theme.palette.secondary.main}`,
          borderRadius: "20px",
          padding: 2,
        }}
      >
        <Grid container maxWidth="400px">
          <Label>Total HT</Label>
          <Price>{totalNoVatPrice} €</Price>
          <Label>TVA</Label>
          <Price>{totalVat} €</Price>
          <Label>Total TTC</Label>
          <Price>{totalPrice} €</Price>
          {Number(quotation.deposit) !== 0 && (
            <>
              <Stack
                sx={{
                  borderBottom: "1px solid rgb(256,256,256, 0.1)",
                  width: "100%",
                  margin: "1rem 0",
                }}
              />
              <Label>Acompte TTC ({quotation.deposit}%)</Label>
              <Price>
                {Number((quotation.deposit / 100) * totalNoVatPrice)} €
              </Price>
              <Label>Solde TTC ({quotation.balance}%)</Label>
              <Price>
                {Number((quotation.balance / 100) * totalNoVatPrice)} €
              </Price>
            </>
          )}
        </Grid>
      </Stack>
    )
  }

  let paymentOptionsArray = []
  Object.keys(quotation.payment_options).map((opt) => {
    if (quotation.payment_options[opt] === true) {
      paymentOptionsArray.push(
        PAYMENT_OPTIONS.filter((elt) => elt.id === opt)[0].label
      )
    }
  })
  const paymentOptionsString = paymentOptionsArray.join(", ")

  // RENDER
  return (
    <Stack gap={4} width="100%">
      <Grid
        container
        spacing={2}
        sx={{
          borderRadius: "20px",
        }}
      >
        <Card title="Prestation" icon={<WorkHistoryIcon />}>
          <DateInfo label="Date">
            {convertDateToLongString(quotation.date)}
          </DateInfo>

          <DateInfo label="Livraison (estimation)">
            {convertDateToLongString(quotation.delivery_date)}
          </DateInfo>

          {/* Optional */}
          {!!quotation.duration && quotation.duration.trim !== "" && (
            <Info title="Durée estimée de la prestation">
              {quotation.duration}
            </Info>
          )}
        </Card>

        <Card title="Règlement" icon={<EuroIcon />}>
          <Info title="Moyen(s) de paiement au choix">
            {paymentOptionsString}
          </Info>

          <Info title="Conditions">{quotation.payment_conditions}</Info>

          {Number(quotation.deposit) !== 0 && (
            <>
              <Info title="Acompte / Solde">
                {quotation.deposit}% / {quotation.balance}%
              </Info>
            </>
          )}

          <Info title="Pénalités de retard">
            {quotation.payment_delay_penalties}
          </Info>
        </Card>

        {/* Optional */}
        {!!quotation.validity_end_date && (
          <Card title="Validité" icon={<HourglassTopIcon />}>
            <DateInfo label="Devis valable jusqu'au">
              {convertDateToLongString(quotation.validity_end_date)}
            </DateInfo>
          </Card>
        )}
      </Grid>

      <Stack overflow="auto">
        <Box
          component="table"
          sx={{
            width: "99%",
            margin: "0.5%",
            borderCollapse: "collapse",
            borderStyle: "hidden",
            borderRadius: "20px",
            boxShadow: (theme) => `0 0 0 2px ${theme.palette.secondary.main}`,
            overflow: "hidden",
          }}
        >
          {HEAD.map((item, key) => (
            <HeadCell key={key} width={item.width}>
              {item.label}
            </HeadCell>
          ))}

          {items.map((item, key) => (
            <Line key={key}>
              <Cell>
                {
                  // QUOTATION_ITEM_TYPES.filter((elt) => elt.id === item.type)[0]
                  //   .label
                  item.type
                }
              </Cell>
              <Cell>{item.label}</Cell>
              <Cell>{item.description}</Cell>
              <Cell>{item.quantity}</Cell>
              <Cell>{item.vat} %</Cell>
              <Cell>{item.no_vat_price / 100} €</Cell>
              <Cell>
                {(item.no_vat_price / 100) *
                  item.quantity *
                  (1 + item.vat / 100)}{" "}
                €
              </Cell>
            </Line>
          ))}
        </Box>
      </Stack>

      <TotalPrices />
    </Stack>
  )
}
