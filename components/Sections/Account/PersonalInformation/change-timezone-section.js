import { Box, Stack, Typography } from "@mui/material"
import { useContext, useState } from "react"
import { ModalTitle } from "../../../Modals/Modal-Components/modal-title"
import { UserContext } from "../../../../contexts/UserContext"
import apiCall from "../../../../services/apiCalls/apiCall"
import { AppContext } from "../../../../contexts/AppContext"
import CustomForm from "../../../Forms/custom-form"
import CustomOutlinedAutocomplete from "../../../Inputs/custom-outlined-autocomplete"
import RectangleButton from "../../../Buttons/rectangle-button"
import PillButton from "../../../Buttons/pill-button"

export default function ChangeTimezoneSection(props) {
  const {} = props

  // USER CONTEXT
  const { user } = useContext(UserContext)
  // APP CONTEXT
  const { setSnackSeverity, setSnackMessage } = useContext(AppContext)

  // Populate list of all official timezones
  const timezones = []
  Intl.supportedValuesOf("timeZone").map((tz) => {
    const cityArray = tz.split("/")
    cityArray.shift()
    const city = cityArray.join("/")
    timezones.push({
      label: tz,
      continent: tz.split("/")[0],
      city: city,
    })
  })

  // USE-STATES
  const defaultTZ = Intl.DateTimeFormat().resolvedOptions().timeZone.toString()
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState(
    timezones.find((v) => v.label === user.timezone)
  )
  const [inputValue, setInputValue] = useState("")
  const [key, setKey] = useState(0)

  // HANDLERS
  const handleReset = () => setKey(key + 1)
  const handleSuccess = () => {
    setSnackMessage("Votre timezone a été modifiée")
    setSnackSeverity("success")
  }
  const handleError = () => {
    setSnackMessage(
      "Une erreur est survenue lors de la modification de votre timezone..."
    )
    setSnackSeverity("error")
  }
  const handleSave = async () => {
    setIsLoading(true)
    const res = await apiCall.users.updateTimeZone(user.id, value)
    if (res && res.ok) handleSuccess()
    else handleError()
    setIsLoading(false)
  }

  return (
    <CustomForm key={key}>
      <Stack
        gap={4}
        padding={4}
        width="100%"
        alignItems="center"
        borderRadius="10px"
        sx={{ backgroundColor: (theme) => theme.palette.background.main }}
      >
        <ModalTitle>Modifier ma timezone</ModalTitle>

        <Stack width="100%" gap={2}>
          <CustomOutlinedAutocomplete
            options={timezones}
            groupBy={(option) => option.continent}
            getOptionLabel={(option) => option.label}
            label="Sélectionner une timezone"
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option.city}
              </Box>
            )}
            onChange={(event, newValue) => {
              setValue(newValue)
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue)
            }}
            defaultValue={timezones.find((v) => v.label === user.timezone)}
          />
        </Stack>

        <Stack justifyContent="center" width="100%" gap={1}>
          <PillButton onClick={handleSave} preventTransitionOut>
            Enregistrer
          </PillButton>
          <Stack
            onClick={handleReset}
            color="#fff"
            className="flex-center pointer"
            sx={{ "&:hover": { textDecoration: "underline" } }}
          >
            <Typography>Annuler</Typography>
          </Stack>
        </Stack>
      </Stack>
    </CustomForm>
  )
}
