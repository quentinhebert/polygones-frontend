import { Avatar, Box, Grid, Stack, Tooltip } from "@mui/material"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../../contexts/UserContext"
import { QUOTATION_STATUS } from "../../../enums/quotationStatus"
import apiCall from "../../../services/apiCalls/apiCall"
import { formatDayDate } from "../../../services/date-time"
import PillButton from "../../Buttons/pill-button"
import PleaseWait from "../../Helpers/please-wait"
import BodyText from "../../Text/body-text"
import SmallTitle from "../../Titles/small-title"
import AddIcon from "@mui/icons-material/Add"
import { useRouter } from "next/router"
import DeleteIcon from "@mui/icons-material/Delete"
import withConfirmAction from "../../hocs/withConfirmAction"
import { AppContext } from "../../../contexts/AppContext"
import ViewListIcon from "@mui/icons-material/ViewList"
import ViewModuleIcon from "@mui/icons-material/ViewModule"
import CustomCard from "../../Cards/custom-card"
import { buildPublicURL } from "../../../services/utils"
import DropdownOptions from "../../Dropdown/dropdown-options"
import Pill from "../../Text/pill"

const MODES = { LIST: "list", GRID: "grid" }

const Status = ({ status }) => {
  let severity = "disabled"
  if (status === QUOTATION_STATUS.REFUSED.id) severity = "error"
  if (status === QUOTATION_STATUS.ACCEPTED.id) severity = "success"
  if (status === QUOTATION_STATUS.SENT.id) severity = "warning"

  return (
    <Stack display="inline-flex" component="span" marginRight="0.75rem">
      <Pill
        margin="0rem"
        padding="0 0.75rem"
        preventTransition
        bgColor={(theme) => theme.alert.title[severity].background}
        border="1px solid"
        borderColor={(theme) => theme.alert.title[severity].color}
      >
        <BodyText
          fontSize="0.8rem"
          color={(theme) => theme.alert.title[severity].color}
          preventTransition
        >
          {QUOTATION_STATUS[status].label}
        </BodyText>
      </Pill>
    </Stack>
  )
}

const QuotationCard = withConfirmAction(function ({
  mode,
  quotation,
  timezone,
  setActionToFire,
  setOpenConfirmModal,
  setConfirmTitle,
  setConfirmContent,
  setNextButtonText,
  refreshData,
  onClick,
}) {
  const { setSnackMessage, setSnackSeverity } = useContext(AppContext)
  const handleSuccess = () => {
    setSnackMessage("Devis supprimé")
    setSnackSeverity("success")
    refreshData()
  }
  const handleError = () => {
    setSnackMessage("Un problème est survenu")
    setSnackSeverity("error")
  }
  const deleteQuotation = async () => {
    const res = await apiCall.quotations.delete({ id: quotation.id })
    if (res && res.ok) return handleSuccess()
    return handleError()
  }
  const handleDelete = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setActionToFire(() => () => deleteQuotation())
    setOpenConfirmModal(true)
    setNextButtonText("Supprimer")
    setConfirmTitle("Supprimer le devis")
    setConfirmContent({
      text: `Voulez vous vraiment supprimer le devis ${quotation.label} ?`,
    })
  }

  const options = [
    {
      label: "Supprimer le devis",
      handleClick: handleDelete,
      icon: <DeleteIcon />,
    },
  ]

  return (
    <CustomCard
      background={(theme) => theme.palette.background.main}
      sx={{
        cursor: "pointer",
        position: "relative",
        padding: { xs: "1rem", sm: "1rem 2rem" },
        flexDirection: { xs: "row" },
        "&:hover": {
          background: (theme) => theme.palette.background.main,
        },
      }}
    >
      <Stack
        onClick={!!onClick ? onClick : null}
        width="100%"
        height="100%"
        sx={{
          gap: {
            xs: 4,
            sm: mode === MODES.LIST ? 2 : 4,
          },
          alignItems: {
            xs: "start",
            sm: mode === MODES.LIST ? "center" : "start",
          },
          flexDirection: {
            xs: "column",
            sm: mode === MODES.LIST ? "row" : "column",
          },
        }}
      >
        <SmallTitle
          textTransform="initial"
          textAlign="left"
          letterSpacing={0}
          lineHeight={2}
          padding={mode === MODES.GRID ? { xs: 0, sm: "0 0.5rem 0 0" } : 0}
        >
          <Status status={quotation.status} />
          {quotation.label || "Sans nom"}
        </SmallTitle>

        <Stack flexGrow={1} />
        <Stack>
          <BodyText
            preventTransition
            fontSize={{
              xs: "1rem",
              sm: mode === MODES.GRID ? "1rem" : "0.8rem",
            }}
          >
            <Box component="span">Total HT</Box>{" "}
            <Box
              component="span"
              sx={{ color: (theme) => theme.palette.text.secondary }}
            >
              {quotation.total_price / 100} €
            </Box>
          </BodyText>
        </Stack>

        <Stack
          className="row"
          gap={2}
          alignItems="center"
          sx={{
            width: { xs: "100%", sm: mode === MODES.LIST ? "auto" : "100%" },
          }}
        >
          {!!quotation.client && (
            <Stack
              className="row"
              alignItems="center"
              gap={1}
              sx={{
                flexGrow: {
                  xs: 1,
                  sm: mode === MODES.LIST ? 0 : 1,
                },
              }}
            >
              {!!quotation.client?.avatar_path ? (
                <Avatar
                  sx={{ width: 24, height: 24 }}
                  alt={quotation.client.firstname}
                  src={buildPublicURL(quotation.client.avatar_path)}
                />
              ) : quotation.client?.firstname?.length ? (
                <Avatar sx={{ width: 24, height: 24 }}>
                  {quotation.client?.firstname[0]}
                </Avatar>
              ) : null}
              <BodyText fontSize="0.8rem" preventTransition>
                {quotation.client?.firstname} {quotation.client?.lastname || ""}
              </BodyText>
            </Stack>
          )}

          <BodyText preventTransition fontSize="0.8rem">
            {formatDayDate({
              timestamp: quotation.last_update,
              timezone: timezone,
            })}
          </BodyText>
        </Stack>
      </Stack>

      <Stack
        sx={{
          alignItems: "end",
          position: {
            xs: "relative",
            sm: mode === MODES.LIST ? "relative" : "absolute",
          },
          top: {
            xs: 0,
            sm: mode === MODES.LIST ? 0 : 10,
          },
          right: {
            xs: 0,
            sm: mode === MODES.LIST ? 0 : 10,
          },
        }}
      >
        <DropdownOptions options={options} />
      </Stack>
    </CustomCard>
  )
})

export default function Quotations_Main({}) {
  /******* USE-STATES *******/
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState(MODES.LIST)

  const router = useRouter()
  const { user } = useContext(UserContext)

  /******* FETCH DATA *******/
  const fetchQuotations = async () => {
    setLoading(true)
    const res = await apiCall.quotations.getAll()
    if (res && res.ok) {
      const jsonRes = await res.json()
      setQuotations(jsonRes)
    }
    setLoading(false)
  }

  /******* INITIAL FETCH *******/
  useEffect(() => {
    fetchQuotations()
  }, [])

  const handleNewQuotation = () => router.push("/dashboard/quotations/create")

  const ModesToggle = ({}) => (
    <Stack
      color="#fff"
      className="row"
      flexGrow={1}
      sx={{ visibility: { xs: "hidden", sm: "visible" } }}
    >
      <Tooltip title="Grille">
        <ViewModuleIcon
          onClick={() => setMode(MODES.GRID)}
          sx={{
            cursor: "pointer",
            color:
              mode === MODES.GRID
                ? (theme) => theme.palette.text.secondary
                : "",
            "&:hover": {
              color: (theme) => theme.palette.text.secondary,
              opacity: 0.5,
            },
          }}
        />
      </Tooltip>
      <Tooltip title="Liste">
        <ViewListIcon
          onClick={() => setMode(MODES.LIST)}
          sx={{
            cursor: "pointer",
            color:
              mode === MODES.LIST
                ? (theme) => theme.palette.text.secondary
                : "",
            "&:hover": {
              color: (theme) => theme.palette.text.secondary,
              opacity: 0.5,
            },
          }}
        />
      </Tooltip>
    </Stack>
  )

  if (loading) return <PleaseWait />

  return (
    <Stack gap={2}>
      <BodyText>Vous trouverez ci-dessous tous vos devis.</BodyText>
      <Stack className="row" alignItems="center" width="100%">
        <ModesToggle />
        <PillButton startIcon={<AddIcon />} onClick={handleNewQuotation}>
          Nouveau devis
        </PillButton>
      </Stack>

      <Grid container spacing={2}>
        {quotations.map((quotation, key) => (
          <Grid
            key={key}
            item
            xs={12}
            sm={mode === MODES.LIST ? 12 : 6}
            md={mode === MODES.LIST ? 12 : 4}
          >
            <QuotationCard
              quotation={quotation}
              timezone={user.timezone}
              refreshData={fetchQuotations}
              mode={mode}
              onClick={() =>
                router.push(`/dashboard/quotations/${quotation.id}/edit`)
              }
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}
