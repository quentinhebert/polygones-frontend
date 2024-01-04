import {
  Box,
  Stack,
  Table,
  TableCell,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material"
import CircleIcon from "@mui/icons-material/Circle"
import { useContext, useEffect, useState } from "react"
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined"
import { useRouter } from "next/router"
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import ListIcon from "@mui/icons-material/List"
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import RefreshIcon from "@mui/icons-material/Refresh"

import { AppContext } from "../../contexts/AppContext"
import { UserContext } from "../../contexts/UserContext"
import useAddProspect from "../../hooks/useAddProspect"
import useViewProspect from "../../hooks/useViewProspect"
import apiCall from "../../services/apiCalls/apiCall"
import { formatDayDate } from "../../services/date-time"
import Pill from "../Text/pill"
import BodyText from "../Text/body-text"
import PleaseWait from "../Helpers/please-wait"
import CustomFilledSelect from "../Inputs/custom-filled-select"
import CustomSelectOption from "../Inputs/custom-select-option"
import DropdownOptions from "../Dropdown/dropdown-options"
import CustomIconButton from "../Buttons/custom-icon-button"
import {
  PROSPECT_STATES,
  PROSPECT_STATES_ENUM,
} from "../../enums/prospectStates"

export default function QuotationRequests_Main({}) {
  const MODES = { FORM: "FORM", LIST: "LIST" }
  const [list, setList] = useState([])
  const [prospects, setProspects] = useState([])
  const [statusFilter, setStatusFilter] = useState("AWAITING")
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState(MODES.FORM)
  const [selectedProspectId, setSelectedProspectId] = useState(null)
  const newNotifList = list.filter((item) => item.opened === false)

  const { handleOpenAddProspectModal, AddProspectDialog } = useAddProspect({
    refreshData: fetchProspects,
  })
  const { handleOpenViewProspectModal, ViewProspectDialog } = useViewProspect({
    id: selectedProspectId,
    refreshData: fetchProspects,
  })

  const filteredProspects =
    statusFilter === "ALL"
      ? prospects
      : prospects.filter((elt) => elt.status === statusFilter)

  // Fetch data
  useEffect(() => {
    if (mode === MODES.FORM) fetchData()
    else if (mode === MODES.LIST) fetchProspects()
  }, [mode])

  // RENDER
  return (
    <Stack
      gap={4}
      sx={{
        background: (theme) => theme.palette.background.main,
        borderRadius: "30px",
      }}
      padding="2rem"
    >
      <ToggleButtonGroup
        color="tersary"
        value={mode}
        exclusive
        onChange={handleChangeMode}
        sx={{ margin: "auto" }}
      >
        <ToggleButton
          value={MODES.FORM}
          sx={{ textTransform: "capitalize", gap: 1 }}
        >
          <MarkEmailUnreadOutlinedIcon />
          Demandes de contact{" "}
          {newNotifList.length ? `(${newNotifList.length})` : null}
        </ToggleButton>
        <ToggleButton
          value={MODES.LIST}
          sx={{ textTransform: "capitalize", gap: 1 }}
        >
          <ListIcon />
          Prospects {prospects.length ? `(${prospects.length})` : null}
        </ToggleButton>
      </ToggleButtonGroup>

      <Stack width="100%" alignItems="center" flexDirection="row" gap={1}>
        <CustomIconButton
          onClick={handleOpenAddProspectModal}
          icon={<AddRoundedIcon sx={{ fontSize: "1.5rem" }} />}
          tooltip="Ajouter un prospect"
        />
        <CustomIconButton
          onClick={mode === MODES.FORM ? fetchData : fetchProspects}
          icon={<RefreshIcon sx={{ fontSize: "1.5rem" }} />}
          loading={loading}
          tooltip="Raffraîchir"
        />

        <Stack flexGrow={1} />

        {/* SELECT STATUS FILTER */}
        {mode === MODES.LIST ? (
          <Box>
            <CustomFilledSelect
              padding="0rem"
              required
              id="status"
              value={statusFilter}
              onChange={handleChangeStatusFilter}
            >
              {PROSPECT_STATES_ENUM.map((option, key) => (
                <CustomSelectOption value={option} key={key} padding="0rem">
                  <Box
                    sx={{
                      width: "100%",
                      background: (theme) =>
                        theme.alert.title[PROSPECT_STATES[option].severity]
                          .background,
                      color: (theme) =>
                        theme.alert.title[PROSPECT_STATES[option].severity]
                          .color,
                      padding: ".5rem 1rem",
                      "&:hover": {
                        opacity: 0.9,
                      },
                    }}
                  >
                    {PROSPECT_STATES[option].label}{" "}
                    {option === "ALL" ? `(${prospects.length})` : null}
                  </Box>
                </CustomSelectOption>
              ))}
            </CustomFilledSelect>
          </Box>
        ) : null}
      </Stack>

      <Stack gap={2} overflow="hidden">
        {loading && <PleaseWait />}

        {mode === MODES.FORM && (
          <RequestsPanel
            list={list}
            handleClick={(id) => {
              setSelectedProspectId(id)
              handleOpenViewProspectModal()
            }}
            refreshData={fetchData}
          />
        )}

        {mode === MODES.LIST && (
          <ProspectsPanel
            list={filteredProspects}
            handleClick={(id) => {
              setSelectedProspectId(id)
              handleOpenViewProspectModal()
            }}
          />
        )}

        {AddProspectDialog({})}
        {ViewProspectDialog({})}
      </Stack>
    </Stack>
  )

  function handleChangeStatusFilter(e) {
    return setStatusFilter(e.target.value)
  }
  function handleChangeMode(e, newMode) {
    if (newMode === MODES.LIST) return setMode(MODES.LIST)
    else if (newMode === MODES.FORM) return setMode(MODES.FORM)
  }
  async function fetchData() {
    setLoading(true)
    const res = await apiCall.quotations.requests.getAll()
    if (res && res.ok) {
      const jsonRes = await res.json()
      setList(jsonRes)
    }
    return setLoading(false)
  }
  async function fetchProspects() {
    setLoading(true)
    const res = await apiCall.dashboard.prospects.getAll()
    if (res && res.ok) {
      const jsonRes = await res.json()
      setProspects(jsonRes)
    }
    return setLoading(false)
  }
}

function RequestsPanel({ list, handleClick, refreshData }) {
  if (!list?.length) return <></>

  const { user } = useContext(UserContext)

  return list.map((item) => {
    // Format date
    const formattedDate = formatDayDate({
      timestamp: item.created_at,
      timezone: user.timezone,
    })

    return (
      <QuotationRequestsCard
        key={item.id}
        id={item.id}
        opened={item.opened}
        firstname={item.firstname}
        email={item.email}
        description={item.description}
        services={item.services}
        date={formattedDate}
        onClick={handleClick}
        refreshData={refreshData}
      />
    )
  })
}
function QuotationRequestsCard({
  id,
  opened,
  firstname,
  email,
  description,
  date,
  services,
  refreshData,
  onClick,
}) {
  const router = useRouter()
  const { setSnackMessage, setSnackSeverity } = useContext(AppContext)
  const options = [
    {
      label: opened ? "Marquer comme non lue" : "Marquer comme lue",
      handleClick: opened ? markAsUnread : markAsRead,
      icon: <MarkEmailUnreadIcon />,
    },
    {
      label: "Ouvrir dans un nouvel onglet",
      handleClick: () =>
        window.open(`/dashboard/quotation-requests/${id}`, "_blank").focus(),
      icon: <OpenInNewIcon />,
    },
  ]

  return (
    <Stack
      sx={{
        flexDirection: "column",
        padding: "1rem 2rem",
        gap: 2,
        borderRadius: "30px",
        background: opened ? "rgb(0,0,0,0.3)" : "rgb(198, 144, 14, 0.2)",
        "&:hover": {
          background: opened ? "rgb(0,0,0,0.5)" : "rgb(198, 144, 14, 0.5)",
        },
      }}
      justifyContent="space-between"
    >
      <Stack className="row" alignItems="center">
        {!opened && (
          <CircleIcon color="secondary" sx={{ marginRight: "1rem" }} />
        )}
        <BodyText textAlign="right" preventTransition>
          {date || ""}
        </BodyText>

        <Stack flexGrow={1} />

        <DropdownOptions options={options} />
      </Stack>

      <Stack
        // onClick={(e) => router.push(`/dashboard/quotation-requests/${id}`)}
        onClick={onClick}
        flexGrow={1}
        sx={{
          cursor: "pointer",
          display: "box",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
      >
        <BodyText fontWeight="bold" preventTransition>
          {firstname || ""}{" "}
          <Box
            component="span"
            fontSize="1rem"
            sx={{
              color: (theme) => "rgb(256, 256, 256, 0.7)",
            }}
          >
            {email || ""}
          </Box>
        </BodyText>

        <BodyText
          color={opened ? "gray" : "rgb(256, 256, 256, 0.7)"}
          fontSize="1rem"
          preventTransition
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {description || ""}
        </BodyText>
      </Stack>

      <Stack className="row" gap={1}>
        {services.map((service, key) => (
          <Pill
            key={key}
            margin="0rem"
            padding="0 0.75rem"
            preventTransition
            bgColor={(theme) => theme.alert.title["disabled"].background}
            border="1px solid"
            borderColor={(theme) => theme.alert.title["disabled"].color}
          >
            <BodyText
              fontSize="0.8rem"
              color={(theme) => theme.alert.title["disabled"].color}
              preventTransition
            >
              {service}
            </BodyText>
          </Pill>
        ))}
      </Stack>
    </Stack>
  )

  async function markAsRead() {
    const res = await apiCall.quotations.requests.setOpened({
      id,
      opened: true,
    })
    if (!res || !res.ok) {
      setSnackMessage("Une erreur s'est produite")
      setSnackSeverity("error")
    }
    return refreshData()
  }
  async function markAsUnread() {
    const res = await apiCall.quotations.requests.setOpened({
      id,
      opened: false,
    })
    if (!res || !res.ok) {
      setSnackMessage("Une erreur s'est produite")
      setSnackSeverity("error")
    }
    return refreshData()
  }
}

function ProspectsPanel({ list, handleClick }) {
  if (!list?.length) return <></>

  const { user } = useContext(UserContext)

  return (
    <Box overflow="auto">
      <Table
        padding=".25rem .5rem"
        width="100%"
        minWidth="800px"
        sx={{ "& td": { border: 0 } }}
      >
        <TableRow>
          <TableCell>
            <BodyText color="gray" preventTransition>
              Service(s)
            </BodyText>
          </TableCell>
          <TableCell>
            <BodyText color="gray" preventTransition>
              Contact
            </BodyText>
          </TableCell>
          <TableCell>
            <BodyText color="gray" preventTransition>
              Entreprise
            </BodyText>
          </TableCell>
          <TableCell>
            <BodyText color="gray" preventTransition>
              Description
            </BodyText>
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            <BodyText color="gray" preventTransition>
              Status
            </BodyText>
          </TableCell>
        </TableRow>

        {list.map((item, key) => {
          // Format date
          const formattedDate = formatDayDate({
            timestamp: item.created_at,
            timezone: user.timezone,
          })

          return (
            <ProspectRow
              key={key}
              index={key}
              id={item.id}
              status={item.status}
              firstname={item.firstname}
              lastname={item.lastname}
              email={item.email}
              company={item.company}
              description={item.description}
              contacted={item.contacted}
              services={item.services}
              date={formattedDate}
              onClick={() => handleClick(item.id)}
            />
          )
        })}
      </Table>
    </Box>
  )
}
function ProspectRow({
  index,
  status,
  firstname,
  lastname,
  company,
  description,
  services,
  onClick,
}) {
  return (
    <>
      <TableRow
        onClick={onClick}
        padding=".5rem"
        className="pointer"
        width="100%"
        minWidth="800px"
        sx={{
          background: index % 2 !== 0 ? "transparent" : "rgb(0,0,0,0.3)",
          "&:hover": {
            background: "rgb(256,256,256, 0.1)",
          },
        }}
      >
        <TableCell>
          <BodyText
            color="gray"
            preventTransition
            whiteSpace="nowrap"
            gap={0.5}
            display="flex"
          >
            {services.sort().map((service, key) => (
              <Pill
                key={key}
                lineHeight="0.8rem"
                margin="0rem"
                padding="0 0.5rem"
                preventTransition
                bgColor={(theme) => theme.alert.title["disabled"].background}
                border="1px solid"
                borderColor={(theme) => theme.alert.title["disabled"].color}
              >
                <BodyText
                  fontSize="0.8rem"
                  color={(theme) => theme.alert.title["disabled"].color}
                  preventTransition
                >
                  {service}
                </BodyText>
              </Pill>
            ))}
          </BodyText>
        </TableCell>

        <TableCell>
          <BodyText fontWeight="bold" preventTransition>
            {firstname || ""} {lastname || ""}
          </BodyText>
        </TableCell>

        <TableCell>
          <BodyText fontWeight="bold" preventTransition>
            {company || ""}
          </BodyText>
        </TableCell>

        <TableCell>
          <BodyText
            color="gray"
            fontSize="1rem"
            preventTransition
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {description || ""}
          </BodyText>
        </TableCell>

        <TableCell sx={{ textAlign: "center" }}>
          <BodyText
            preventTransition
            sx={{
              width: "auto",
              padding: ".2rem .5rem",
              borderRadius: "15px",
              whiteSpace: "nowrap",
              background: (theme) =>
                theme.alert.title[PROSPECT_STATES[status].severity].background,
              border: "1px solid",
              borderColor: (theme) =>
                theme.alert.title[PROSPECT_STATES[status].severity].color,
              color: (theme) =>
                theme.alert.title[PROSPECT_STATES[status].severity].color,
            }}
          >
            {PROSPECT_STATES[status].label}
          </BodyText>
        </TableCell>
      </TableRow>
    </>
  )
}
