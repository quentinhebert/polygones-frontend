import { Box, Grid, Stack, Typography } from "@mui/material"
import CustomCard from "../../Cards/custom-card"
import BodyText from "../../Text/body-text"
import { Fragment, useContext, useEffect, useState } from "react"
import { UserContext } from "../../../contexts/UserContext"
import apiCall from "../../../services/apiCalls/apiCall"
import { formatPrice } from "../../../services/utils"
import { convertDateToShortString } from "../../../services/date-time"
import { defaultConfig } from "../../../config/defaultConfig"
import CustomAccordion from "../../Containers/custom-accordion"
import JsPDF from "jspdf"
import CustomTabs, { CustomTab } from "../../Navigation/Tabs/cutom-tabs"

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
]

export default function StatsModule({}) {
  return (
    <Stack gap={1}>
      <WelcomeCard />
      <KpiModule />
      <TurnoverModule />
    </Stack>
  )
}

function KpiModule({}) {
  const initialKpi = {
    this_week: {
      prospects: 0,
      orders: 0,
    },
    this_month: {
      prospects: 0,
      orders: 0,
    },
    this_year: {
      prospects: 0,
      orders: 0,
    },
  }
  const [kpi, setKpi] = useState(initialKpi)
  useEffect(() => {
    fetchKpi()
  }, [])

  return (
    <CustomCard
      backgroundColor={(theme) => theme.palette.background.main}
      padding="1rem"
      marginBottom="0"
      borderRadius="15px"
    >
      <Stack
        flexDirection="row"
        gap={2}
        sx={{
          scrollSnapType: "x mandatory",
          overflowX: "auto",
          scrollBehavior: "smooth",
        }}
      >
        <RenderKpi title="Cette semaine" data={kpi.this_week} />
        <RenderKpi title="Ce mois-ci" data={kpi.this_month} />
        <RenderKpi title="Cette année" data={kpi.this_year} />
      </Stack>
    </CustomCard>
  )

  async function fetchKpi() {
    const res = await apiCall.dashboard.kpi.get()
    if (res && res.ok) {
      const jsonRes = await res.json()
      setKpi(jsonRes)
    }
  }
}
function TurnoverModule({}) {
  const businessActivityStart = 2022
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  // Populate YEARS array
  const YEARS = []
  for (let i = currentYear; i >= businessActivityStart; i -= 1) {
    YEARS.push(i)
  }
  const initialTurnover = { total: 0, real: 0, total_fees: 0 }
  const initialPayments = []
  const [turnover, setTurnover] = useState(initialTurnover)
  const [payments, setPayments] = useState(initialPayments)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [activeYear, setActiveYear] = useState(0)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  useEffect(() => {
    setTurnover(initialTurnover)
    setPayments(initialPayments)
    fetchData()
  }, [selectedMonth, selectedYear])

  // const generatePDF = () => {
  //   const report = new JsPDF("portrait", "pt", "a1")
  //   report.html(document.querySelector("#report")).then(() => {
  //     report.save("report.pdf")
  //   })
  // }

  return (
    <CustomCard
      borderRadius="15px"
      backgroundColor={(theme) => theme.palette.background.main}
      background="transparent"
      padding="1rem"
      gap={0.5}
      marginBottom={0}
    >
      <Stack
        sx={{
          background: "rgb(0,0,0,0.5)",
          borderRadius: "7.5px",
          padding: ".5rem 1rem",
        }}
        width="100%"
      >
        <Box width="100%" display="flex" justifyContent="center">
          <CustomTabs value={activeYear} onChange={handleChangeYear}>
            {YEARS.map((year, key) => {
              return <CustomTab label={year} key={key} />
            })}
          </CustomTabs>
        </Box>

        <Box width="100%" display="flex" justifyContent="center">
          <CustomTabs value={selectedMonth} onChange={handleChangeMonth}>
            {MONTHS.map((month, key) => (
              <CustomTab
                label={month}
                key={key}
                disabled={
                  selectedYear === currentYear && key > new Date().getMonth()
                }
              />
            ))}
          </CustomTabs>
        </Box>
      </Stack>

      {MONTHS.map((month, index) => (
        <CustomTabPanel value={selectedMonth} index={index}>
          <Box>
            <CustomAccordion
              defaultExpanded
              title="Chiffres d'affaire"
              noBorder
              background="rgb(0,0,0,0.3)"
              borderRadius="7.5px 7.5px 0 0"
            >
              <Stack gap={0.2} color="#fff">
                <Grid
                  container
                  sx={{
                    background: "rgb(0,0,0,0.2)",
                    borderRadius: "7.5px 7.5px 0 0",
                    padding: 2,
                  }}
                >
                  <Grid item xs={8} sx={{ textAlign: "left" }}>
                    <Typography color="grey">Montant total perçu</Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "right" }}>
                    <Typography color="secondary" fontStyle="italic">
                      + {formatPrice(Number(turnover.total))} €
                    </Typography>
                  </Grid>
                  <Grid item xs={8} sx={{ textAlign: "left" }}>
                    <Typography color="grey">
                      Frais de service Stripe
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "right" }}>
                    <Typography color="error.main" fontStyle="italic">
                      - {formatPrice(Number(turnover.total_fees))} €
                    </Typography>
                  </Grid>
                </Grid>

                <Grid
                  container
                  sx={{
                    background: "rgb(0,0,0,0.5)",
                    borderRadius: "0 0 7.5px 7.5px",
                    padding: 2,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Grid
                    item
                    xs={6}
                    md={8}
                    sx={{
                      textAlign: "left",
                    }}
                  >
                    <Typography>Chiffre d'affaire réel</Typography>
                  </Grid>
                  <Grid item xs={6} md={4} sx={{ textAlign: "right" }}>
                    <Typography
                      color="green"
                      fontSize="1.5rem"
                      whiteSpace="nowrap"
                    >
                      + {formatPrice(Number(turnover.real))} €
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            </CustomAccordion>

            <CustomAccordion
              defaultExpanded
              title="Livre de recettes"
              noBorder
              background="rgb(0,0,0,0.3)"
              borderRadius="0 0 7.5px 7.5px"
            >
              <Box overflow="auto">
                <Grid
                  id="report"
                  container
                  minWidth="1000px"
                  width="100%"
                  sx={{
                    borderRadius: "7.5px 7.5px 0 0",
                    background: "rgb(0,0,0,0.5)",
                    padding: ".5rem 1rem",
                  }}
                >
                  <GridHeadItem size={1} label="Montant" />
                  <GridHeadItem size={1} label="Frais" />
                  <GridHeadItem size={3} label="Commande" />
                  <GridHeadItem size={2} label="Client" />
                  <GridHeadItem
                    size={2}
                    label="Mode de paiement"
                    align="right"
                  />
                  <GridHeadItem size={1.5} label="Facture" align="right" />
                  <GridHeadItem size={1.5} label="Encaissement" align="right" />
                </Grid>

                {payments.map((payment, key) => (
                  <Grid
                    key={key}
                    id={`report-line-${key}`}
                    container
                    minWidth="1000px"
                    width="100%"
                    sx={{
                      borderRadius:
                        key === payments.length ? "0 0 7.5px 7.5px" : "0",
                      background:
                        key % 2 === 0 ? "rgb(0,0,0,0.15)" : "rgb(0,0,0,0.3.5)",
                      padding: "0 1rem",
                    }}
                  >
                    <GridItem size={1}>{formatPrice(payment.amount)}€</GridItem>
                    <GridItem size={1}>{formatPrice(payment.fees)}€</GridItem>
                    <GridItem
                      size={3}
                      href={`/dashboard/orders/${payment.order.id}/edit`}
                    >
                      {payment.order.label}
                    </GridItem>
                    <GridItem size={2}>
                      {payment.order.client_firstname +
                        " " +
                        payment.order.client_lastname}
                    </GridItem>
                    <GridItem size={2} align="right">
                      {payment.type}
                    </GridItem>
                    <GridItem
                      size={1.5}
                      href={`${defaultConfig.ftpPublicBasePath}${payment.path}`}
                      align="right"
                    >
                      {payment.invoice_number}
                    </GridItem>
                    <GridItem size={1.5} align="right">
                      {convertDateToShortString(payment.last_update)}
                    </GridItem>
                  </Grid>
                ))}
              </Box>
            </CustomAccordion>
          </Box>
        </CustomTabPanel>
      ))}
    </CustomCard>
  )

  function handleChangeYear(e, newValue) {
    setSelectedYear(YEARS[newValue])
    return setActiveYear(newValue)
  }
  function handleChangeMonth(e, newValue) {
    return setSelectedMonth(newValue)
  }
  function CustomTabPanel({ children, value, index, ...other }) {
    return (
      <Box
        width="100%"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box
            sx={{
              width: "100%",
              gap: 0.5,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {children}
          </Box>
        )}
      </Box>
    )
  }
  function getTypeInfo(type, metadata) {
    switch (type) {
      case "CHECK":
        return <>Chèque</>
      case "CARD":
        return <>CB</>
      case "CASH":
        return <>Espèces</>
      case "TRANSFER":
        return <>Virement bancaire</>
      case "STRIPE":
        switch (metadata.type) {
          case "card":
            return <>Stripe / CB</>
          case "sepa_debit":
            return <>Stripe / Prélèvement SEPA</>
          case "paypal":
            return <>Stripe / PayPal</>
          default:
            return <></>
        }
      default:
        return <></>
    }
  }
  function getFees(fees) {
    let localFees = 0
    fees.map((fee) => {
      localFees += fee.amount
    })
    return formatPrice(localFees)
  }
  async function fetchData() {
    const res = await apiCall.dashboard.payments.getPerMonth({
      month: selectedMonth,
      year: selectedYear,
    })
    if (res && res.ok) {
      const jsonRes = await res.json()
      setPayments(jsonRes.payments)
      setTurnover(jsonRes.turnover)
    }
  }
}
function Label(props) {
  return (
    <Grid item xs={8}>
      <Stack>
        <BodyText color="grey" {...props} />
      </Stack>
    </Grid>
  )
}
function Value(props) {
  return (
    <Grid item xs={4}>
      <Stack>
        <BodyText textAlign="right" {...props} />
      </Stack>
    </Grid>
  )
}
function RenderKpi({ data, title }) {
  return (
    <Card title={title}>
      <Grid container spacing={0}>
        <Label>Prospects</Label>
        <Value>{data.prospects}</Value>
        <Label>Commandes en cours</Label>
        <Value>{data.orders}</Value>
        <Label>Projets livrés</Label>
        <Value>0</Value>
        {/* <Label>C.A.</Label>
    <Value>{data.turnover / 100}€</Value> */}
      </Grid>
    </Card>
  )
}
function Card({ title, ...props }) {
  return (
    <Stack
      padding={2}
      width="100%"
      minWidth="250px"
      sx={{
        background: "rgb(0,0,0,0.3)",
        borderRadius: "7.5px",
        gap: 2,
        scrollSnapAlign: "center",
      }}
    >
      <BodyText textAlign="center">{title}</BodyText>
      <Stack {...props} />
    </Stack>
  )
}
function WelcomeCard({}) {
  const { user } = useContext(UserContext)
  return (
    <CustomCard
      borderRadius="15px"
      backgroundColor={(theme) => theme.palette.background.main}
      background={"transparent"}
      padding="1rem"
      marginBottom="0"
      className="flex-center"
      gap={2}
    >
      <BodyText
        className="inline-flex gap-10"
        alignItems="center"
        fontSize="1.5rem"
        textAlign="center"
      >
        Content de vous revoir {user.firstname} ! 🎉
      </BodyText>
    </CustomCard>
  )
}
function GridHeadItem({ size, align, label }) {
  return (
    <Grid item xs={size} sx={{ textAlign: align || "left" }} padding={1}>
      <Typography color="text.grey">{label}</Typography>
    </Grid>
  )
}
function GridItem({ size, align, href, ...props }) {
  return (
    <Grid
      item
      xs={size}
      sx={{
        textAlign: align || "left",
      }}
    >
      <Box
        component={href ? "a" : "div"}
        href={href || "#"}
        className={href ? "cool-button" : ""}
        target={href ? "_blank" : null}
        padding={1}
      >
        <Typography color={href ? "secondary" : "text.white"} {...props} />
      </Box>
    </Grid>
  )
}
