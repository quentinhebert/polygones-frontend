import { useState, useContext } from "react"
import { Stack } from "@mui/material"
import apiCall from "../../services/apiCalls/apiCall"
import { USERTYPES } from "../../enums/userTypes"
import { ModalTitle } from "../Modals/Modal-Components/modal-title"
import { checkPhone, checkEmail, checkPassword } from "../../services/utils"
import AlertInfo from "../Other/alert-info"
import CustomSelect from "../Other/custom-select"
import { UserContext } from "../../contexts/UserContext"
import CustomOutlinedInput from "../ReusableComponents/forms/custom-outlined-input"
import CustomCheckbox from "../ReusableComponents/forms/custom-checkbox"
import CustomForm from "../ReusableComponents/forms/custom-form"
import DualInputLine from "../ReusableComponents/forms/responsive-dual-input-container"
import CustomSubmitButton from "../ReusableComponents/forms/custom-submit-button"

export default function SignUpForm(props) {
  /********** PROPS **********/
  const { handleClose, setSeverity, setOpenSnackBar, setMessageSnack } = props

  // Check if user exists and if the user is admin
  const { user } = useContext(UserContext)
  const isAdmin = user && user.type === USERTYPES.ADMIN

  /********** MODEL **********/
  const initialUserData = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    type: isAdmin ? "" : USERTYPES.CLIENT,
  }
  // Set initial errors on false
  const initialSignUpErrors = () => {
    let localErrors = {}
    Object.keys(initialUserData).map((key) => {
      localErrors[key] = false
    })
    console.log(localErrors)
    return localErrors
  }
  // Clear all data & errors
  const clearData = () => {
    setUserData(initialUserData)
    setSignupErrors(initialSignUpErrors)
  }

  /********** USE-STATES **********/
  const [accept, setAccept] = useState({ policy: false })
  const [loadingButton, setLoadingButton] = useState(false)
  const [signupCompleted, setSignupCompleted] = useState(false)
  const [userData, setUserData] = useState(initialUserData)
  const [signupErrors, setSignupErrors] = useState(initialSignUpErrors)
  const [showAlert, setShowAlert] = useState({
    show: false,
    severity: null,
    text: null,
    title: null,
  })

  /********** VARAIABLES FOR LIVE CHECK **********/
  const liveCheck = {
    password:
      signupErrors.password ||
      (userData.password.trim() !== "" && !checkPassword(userData.password)),
    email:
      signupErrors.email ||
      (userData.email.trim() !== "" && !checkEmail(userData.email)),
    phone:
      signupErrors.phone ||
      (userData.phone.trim() !== "" && !checkPhone(userData.phone)),
  }

  /********** FUNCTIONS **********/
  const handleChange = (attribute) => (event) => {
    // Update user data
    setUserData({
      ...userData,
      [attribute]: event.target.value,
    })
    // On change we reset the localError of the input value, we let the live check take over
    setSignupErrors({
      ...signupErrors,
      [attribute]: false,
    })
  }

  const handleCheck = (attribute) => (e) => {
    setAccept({ ...accept, [attribute]: e.target.checked })
  }

  const handleSignUpComplete = () => {
    setSignupCompleted(true)
    setSeverity("success")
    setMessageSnack("Inscription réussie !")
    setOpenSnackBar(true)
    setShowAlert({
      show: true,
      severity: "success",
      text: "Un lien de confirmation a été envoyé à l'adresse e-mail que vous avez renseignée. Cliquez sur le lien ou bien sur le bouton dans l'e-mail, pour vérifier qu'il s'agit bien de votre e-mail.",
      title: "Votre inscription est presque terminée",
    })
  }

  const handleSignUpIncomplete = () => {
    setSeverity("error")
    setMessageSnack(
      "L'inscription a échouée, veuillez vérifier tous les champs"
    )
    setOpenSnackBar(true)
  }

  const handleDuplicateSignup = () => {
    setShowAlert({
      show: true,
      title: "E-mail ou téléphone déjà existant",
      severity: "warning",
      text: "Votre e-mail ou votre numéro de téléphone existe déjà pour un autre utilisateur.",
    })
  }

  /* Check all data at once onSubmit button click */
  const checkAllData = () => {
    const errors = initialSignUpErrors

    // Let's check that all input values are not null and not empty string
    Object.keys(userData).map((key) => {
      if (!userData[key] || userData[key].trim() === "") errors[key] = true
      else errors[key] = false
    })

    // Count number of errors
    let count = 0
    for (const err of Object.entries(errors)) {
      if (err[1]) count += 1
    }

    return { errors, count }
  }

  const signUp = async (e) => {
    e.stopPropagation()
    e.preventDefault()

    setLoadingButton(true)

    const { errors, count } = checkAllData()
    setSignupErrors(errors)

    if (count > 0) {
      setLoadingButton(false)
      return // we dont send the createUser request if payload is invalid
    }

    const res = await apiCall.users.create({ userData })
    if (res && res.ok) {
      handleSignUpComplete()
    } else {
      const jsonRes = await res.json()
      if (jsonRes.code === 1010) {
        handleDuplicateSignup()
      }
      handleSignUpIncomplete()
    }

    setLoadingButton(false)
  }

  const handleCloseAndClear = () => {
    clearData()
    handleClose()
  }

  /********** RENDER **********/
  return (
    <Stack gap={4}>
      {isAdmin ? (
        <ModalTitle>Ajouter un utilisateur</ModalTitle>
      ) : (
        <ModalTitle>S'inscrire</ModalTitle>
      )}

      <CustomForm>
        <DualInputLine>
          <CustomOutlinedInput
            required
            type="input"
            id="firstname"
            label="Prénom"
            value={userData.firstname}
            onChange={handleChange("firstname")}
            error={signupErrors.firstname}
            helperText={signupErrors.firstname && "Problem with this field"}
          />
          <CustomOutlinedInput
            required
            type="input"
            id="lastname"
            label="Nom"
            value={userData.lastname}
            onChange={handleChange("lastname")}
            error={signupErrors.lastname}
            helperText={signupErrors.lastname && "Please check this field"}
          />
        </DualInputLine>

        <DualInputLine>
          <CustomOutlinedInput
            required
            type="email"
            id="email"
            label="E-mail"
            value={userData.email}
            onChange={handleChange("email")}
            error={liveCheck.email || signupErrors.email}
            helperText={liveCheck.email && "This email is ot valid"}
          />
          <CustomOutlinedInput
            required
            type="phone"
            id="phone"
            label="Téléphone"
            value={userData.phone}
            onChange={handleChange("phone")}
            error={liveCheck.phone || signupErrors.phone}
            helperText={liveCheck.phone && "This phone is not valid"}
          />
        </DualInputLine>

        <DualInputLine>
          <CustomOutlinedInput
            required
            type="input"
            label="Mot de passe"
            value={userData.password}
            onChange={handleChange("password")}
            error={liveCheck.password}
            helperText={
              liveCheck.password &&
              "Minimum 8 caracters, 1 lowercase, 1 uppercase, 1 number et 1 special caracter"
            }
          />

          {isAdmin ? (
            <CustomSelect
              required
              size="small"
              placeholder="Role"
              options={[
                { id: "admin", label: "Admin" },
                { id: "client", label: "Client" },
                { id: "professional", label: "Employé" },
              ]}
              value={userData.type}
              setValue={(eventValue) =>
                setUserData({ ...userData, type: eventValue })
              }
            />
          ) : null}
        </DualInputLine>

        <CustomCheckbox
          required
          label="J'accepte la politique du site"
          onChange={handleCheck("policy")}
          labelcolor={(theme) => theme.palette.text.white}
          fontSize="1rem"
        />
        {showAlert.show ? <AlertInfo content={showAlert} /> : null}
      </CustomForm>

      <Stack flexDirection="row" gap={2} justifyContent="end">
        <CustomSubmitButton onClick={handleCloseAndClear}>
          Annuler
        </CustomSubmitButton>
        <CustomSubmitButton
          secondary="true"
          onClick={signUp}
          disabled={!accept.policy || loadingButton}
        >
          Enregistrer
        </CustomSubmitButton>
      </Stack>
    </Stack>
  )
}
