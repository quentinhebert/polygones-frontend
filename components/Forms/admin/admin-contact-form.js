import { useState, useEffect } from "react"
import { Box, Stack, Typography } from "@mui/material"
import apiCall from "../../../services/apiCalls/apiCall"
import AlertInfo from "../../Other/alert-info"
import CustomForm from "../../ReusableComponents/forms/custom-form"
import { ModalTitle } from "../../Modals/Modal-Components/modal-title"
import { useAnimation, motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import CustomSubmitButton from "../../ReusableComponents/forms/custom-submit-button"
import CustomFilledInput from "../../ReusableComponents/forms/custom-filled-input"
import SwipeableViews from "react-swipeable-views"
import styles from "../../../styles/TextShine.module.css"
import SwipeIcon from "@mui/icons-material/Swipe"
import Stepper from "../../Navigation/stepper"
import SmallTitle from "../../ReusableComponents/titles/small-title"
import InTextLink from "../../ReusableComponents/text/in-text-link"
import SwitchButton from "../../ReusableComponents/buttons/switch-button"
import CustomTooltip from "../../ReusableComponents/helpers/tooltip"
import PleaseWait from "../../ReusableComponents/helpers/please-wait"

const Caroussel = ({
  addressItems,
  traditionalContactItems,
  socialMediaItems,
  contactItems,
  setContactItems,
}) => {
  const [index, setIndex] = useState(0)
  const handleChangeIndex = (index) => {
    setIndex(index)
  }
  const cards = [
    {
      title: "Contacts traditionnels",
      id: "contact",
      items: traditionalContactItems,
      description: [
        <Typography>
          L'adresse e-mail que vous renseignez sera celle qui sera affichée sur
          la page de <InTextLink text="contact" href="/contact" />
        </Typography>,
      ],
    },
    {
      title: "Réseaux sociaux",
      id: "social_medias",
      items: socialMediaItems,
      description: null,
    },
    {
      title: "Adresse postale",
      id: "address",
      items: addressItems,
      description: null,
    },
  ]

  /********** ANIMATION **********/
  const [ref, inView] = useInView()
  const controls = useAnimation()
  const variants = (key) => {
    return {
      visible: {
        opacity: 1,
        y: 1,
        transition: { duration: 1, delay: key / 10 },
      },
      hidden: { opacity: 0, y: -25 },
    }
  }
  useEffect(() => {
    if (inView) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [controls, inView])
  const motionDivStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignSelf: "start",
  }

  const handleChange = (attribute, value, card, key) => {
    // Get copies
    const localGroup = contactItems[card.id] // Array
    const localItem = localGroup[key] // object

    // Update copy
    localItem[attribute] = value

    // Update local group
    localGroup[key] = localItem

    // Update state
    setContactItems({
      ...contactItems,
      [card.id]: localGroup,
    })
  }

  return (
    <Stack ref={ref}>
      <SwipeableViews
        index={index}
        disableLazyLoading
        enableMouseEvents
        onChangeIndex={handleChangeIndex}
        axis="x"
        springConfig={{
          duration: "1s",
          easeFunction: "cubic-bezier(0.1, 0.8, 0.3, 1)",
          delay: "0s",
        }}
      >
        {cards.map((card, key) => (
          <motion.div
            initial="hidden"
            variants={variants(0)}
            animate={controls}
            style={motionDivStyle}
            role="tabpanel"
            id={`full-width-tabpanel-0`}
            aria-controls={`full-width-tab-0`}
            key={key}
          >
            <SmallTitle
              textAlign="left"
              color={(theme) => theme.palette.text.white}
            >
              {`${card.title} (${index + 1}/3)`}
            </SmallTitle>
            {card.description?.length &&
              card.description.map((descItem, key) => (
                <AlertInfo
                  key={key}
                  content={{
                    show: true,
                    severity: "info",
                    text: descItem,
                  }}
                />
              ))}
            {card.items.map((item, key) => (
              <Stack
                id={item.type}
                key={key}
                flexDirection="row"
                alignItems="center"
                sx={{ padding: { xs: "0 .2rem", md: "0 1rem" } }}
              >
                <CustomTooltip
                  text="Cette ligne apparaît obligatoirement sur votre site."
                  show={item.show === null}
                  placement="right"
                >
                  <Box>
                    <SwitchButton
                      disabled={item.show === null}
                      checked={item.show}
                      handleCheck={(val) =>
                        handleChange("show", val, card, key)
                      }
                    />
                  </Box>
                </CustomTooltip>
                <CustomFilledInput
                  label={item.label}
                  id={item.type}
                  value={item.value || ""}
                  sx={{ marginLeft: "-11px" }}
                  onChange={(e) =>
                    handleChange("value", e.target.value, card, key)
                  }
                />
              </Stack>
            ))}
          </motion.div>
        ))}
      </SwipeableViews>

      <Stack
        marginTop="2rem"
        alignItems="center"
        justifyContent="center"
        sx={{ color: (theme) => theme.palette.text.white }}
        flexDirection="row"
        gap={1}
        className={styles.shine}
      >
        <SwipeIcon />
        <Typography fontStyle="italic" letterSpacing={1}>
          Faire défiler
        </Typography>
      </Stack>

      <Stepper totalSteps={3} activeStep={index} setActiveStep={setIndex} />
    </Stack>
  )
}

export default function AdminContactForm(props) {
  /********** PROPS **********/
  const { handleClose } = props

  /********** USE-STATES **********/
  const [isFetching, setIsFetching] = useState(false)
  const [contactItems, setContactItems] = useState([])
  const [addressItems, setAddressItems] = useState([])
  const [traditionalContactItems, setTraditionalContactItems] = useState([])
  const [socialMediaItems, setSocialMediaItems] = useState([])

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
  const fetchContact = async () => {
    setIsFetching(true)
    const res = await apiCall.admin.getWebsiteContact()
    if (res && res.ok) {
      const jsonRes = await res.json()
      setContactItems(jsonRes)
    }
    setIsFetching(false)
  }

  // Initial fetch
  useEffect(() => {
    fetchContact()
  }, [])

  useEffect(() => {
    setAddressItems(contactItems.address)
    setSocialMediaItems(contactItems.social_medias)
    setTraditionalContactItems(contactItems.contact)
  }, [contactItems])

  const handleSaveFooter = () => {
    console.log(contactItems)
  }

  const handleCancel = async () => {
    if (handleClose) handleClose()
    // reset form
    await fetchContact()
  }

  if (isFetching) return <PleaseWait />

  /********** RENDER **********/
  return (
    <Stack width="100%" gap={4} ref={ref}>
      <motion.div
        initial="hidden"
        variants={variants(0.5)}
        animate={controls}
        style={{ width: "100%" }}
      >
        <ModalTitle>Modifier les informations de contact</ModalTitle>
      </motion.div>

      <CustomForm gap={4}>
        <motion.div
          initial="hidden"
          variants={variants(2)}
          animate={controls}
          style={{ width: "100%" }}
        >
          <Stack gap={2} width="100%">
            <Caroussel
              addressItems={addressItems}
              traditionalContactItems={traditionalContactItems}
              socialMediaItems={socialMediaItems}
              setContactItems={setContactItems}
              contactItems={contactItems}
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
            <CustomSubmitButton secondary="true" onClick={handleSaveFooter}>
              Enregistrer
            </CustomSubmitButton>
          </Stack>
        </motion.div>
      </CustomForm>
    </Stack>
  )
}
