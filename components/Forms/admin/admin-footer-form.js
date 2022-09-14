import { useState, useContext, useEffect } from "react"
import { Stack } from "@mui/material"
import apiCall from "../../../services/apiCalls/apiCall"
import AlertInfo from "../../Other/alert-info"
import { UserContext } from "../../../contexts/UserContext"
import CustomForm from "../../ReusableComponents/forms/custom-form"
import CustomFilledTextArea from "../../ReusableComponents/forms/custom-filled-text-area"
import { ModalTitle } from "../../Modals/Modal-Components/modal-title"
import { useAnimation, motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import CustomSubmitButton from "../../ReusableComponents/forms/custom-submit-button"

export default function AdminFooterForm(props) {
  /********** PROPS **********/
  const {
    handleClickPasswordForgotten,
    passwordForgottenDefaultEmail,
    setPasswordForgottenDefaultEmail,
    handleClose,
  } = props

  /********** USER **********/
  const { setUser } = useContext(UserContext)

  /********** USE-STATES **********/
  const [credits, setCredits] = useState("")
  const [showAlert, setShowAlert] = useState({
    show: false,
    severity: null,
    text: null,
    title: null,
  })

  /********** ANIMATION **********/
  const [ref, inView] = useInView()
  const variants = (key) => ({
    visible: {
      opacity: 1,
      y: 5,
      transition: { duration: 0.75, delay: key / 10 },
    },
    hidden: { opacity: 0, y: 0 },
  })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [controls, inView])

  /********** FUNCTIONS **********/
  const fetchFooter = async () => {
    const res = await apiCall.unauthenticated.getFooter()
    if (res && res.ok) {
      const jsonRes = await res.json()
      setCredits(jsonRes.credits)
    }
  }

  useEffect(() => {
    fetchFooter()
  }, [])

  const handleSaveFooter = () => {
    //
  }

  const handleCancel = async () => {
    if (handleClose) handleClose()
    // reset form
    await fetchFooter()
  }

  /********** RENDER **********/
  return (
    <Stack width="100%" gap={4} ref={ref}>
      <motion.div
        initial="hidden"
        variants={variants(0.5)}
        animate={controls}
        style={{ width: "100%" }}
      >
        <ModalTitle>Modifier le footer</ModalTitle>
      </motion.div>

      <CustomForm gap={4}>
        <motion.div
          initial="hidden"
          variants={variants(2)}
          animate={controls}
          style={{ width: "100%" }}
        >
          <Stack gap={2} width="100%">
            <CustomFilledTextArea
              label="Modifier les crédits"
              type="credits"
              id="credits"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
            />

            {showAlert.show ? <AlertInfo content={showAlert} /> : null}
          </Stack>
        </motion.div>

        <motion.div
          initial="hidden"
          variants={variants(4)}
          animate={controls}
          style={{ width: "100%" }}
        >
          <Stack flexDirection="row" gap={2} justifyContent="end">
            <CustomSubmitButton onClick={handleCancel}>
              Annuler
            </CustomSubmitButton>
            <CustomSubmitButton
              secondary="true"
              onClick={handleSaveFooter}
              disabled={!credits || credits.trim() === ""}
            >
              Enregistrer
            </CustomSubmitButton>
          </Stack>
        </motion.div>
      </CustomForm>
    </Stack>
  )
}
