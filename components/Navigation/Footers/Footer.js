import { useEffect } from "react"
import { Stack, Typography, Box } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import FacebookIcon from "../../../public/medias/social_icons/facebook.svg"
import InstagramIcon from "../../../public/medias/social_icons/instagram.svg"
import LinkedinIcon from "../../../public/medias/social_icons/linkedin.svg"
import YoutubeIcon from "../../../public/medias/social_icons/youtube.svg"
import SecuredPaymentIcon from "../../../public/medias/warranties/secured-payment-icon.svg"
import PaypalIcon from "../../../public/medias/warranties/paypal-icon.svg"
import CreditCardIcon from "../../../public/medias/warranties/credit-card-icon.svg"
import QualityIcon from "../../../public/medias/warranties/quality-icon.svg"
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice"
import { useAnimation, motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import SmallText from "../../ReusableComponents/text/small-text"
import InTextLink from "../../ReusableComponents/text/in-text-link"
import CenteredMaxWidthContainer from "../../ReusableComponents/containers/centered-max-width-container"
import CustomLink from "../../ReusableComponents/custom-link"
import ScaleUpOnHoverStack from "../../ReusableComponents/animations/scale-up-on-hover-stack"

/********** CONSTANTES **********/
const logoUrl = "/logos/logo.svg"

const SOCIAL_MEDIAS = [
  {
    type: "youtube",
    image: YoutubeIcon,
    link: "https://www.youtube.com/c/NarcoProd",
  },
  {
    type: "instagram",
    image: InstagramIcon,
    link: "https://www.instagram.com/tarte_a_la_courgette",
  },
  {
    type: "facebook",
    image: FacebookIcon,
    link: "https://www.facebook.com/kioulekiou/",
  },
]

const warrantiesButtons = [
  {
    image: SecuredPaymentIcon,
    text: "Paiement sécurisé",
  },
  {
    image: CreditCardIcon,
    text: "Paiement par carte bancaire",
  },
  {
    image: PaypalIcon,
    text: "Paiement par PayPal",
  },
  {
    image: QualityIcon,
    text: "Un gage de qualité",
  },
]

const Credits = () => {
  return (
    <Stack alignItems="center" textAlign="center" margin="3rem auto 0">
      <SmallText>
        © Quentin Hébert 2022 · Vidéaste et Développeur web en Freelance ·
        Réalisateur - Cadreur - Monteur - Développeur JS Full-Stack · Site web
        developpé par Quentin Hébert ·{" "}
        <InTextLink
          href="/about-website"
          text="Plus d'informations"
          openNewTab
        />
      </SmallText>
    </Stack>
  )
}

const Email = () => {
  return (
    <Typography
      display="flex"
      alignItems="center"
      gap={1}
      color="text.white"
      sx={{ "&:hover": { color: (theme) => theme.palette.text.secondary } }}
    >
      <LocalPostOfficeIcon />
      <InTextLink
        href="mailto:hello@quentinhebert.com"
        text="hello@quentinhebert.com"
        letterSpacing={1}
        fontStyle="italic"
      />
    </Typography>
  )
}

const SocialMedias = () => {
  return (
    <Stack direction="row" width={"100%"} justifyContent="center" gap={2}>
      {SOCIAL_MEDIAS.map((social, key) => (
        <ScaleUpOnHoverStack>
          <CustomLink key={key} href={social.link} openNewTab>
            <Image src={social.image} height="40%" width="40%" />
          </CustomLink>
        </ScaleUpOnHoverStack>
      ))}
    </Stack>
  )
}

const Logo = () => (
  <ScaleUpOnHoverStack direction="row" justifyContent="center">
    <Link href="/" passHref>
      <Image src={logoUrl} width="150%" height="80%" />
    </Link>
  </ScaleUpOnHoverStack>
)

export default function Footer(props) {
  /********** STYLE **********/
  const motionDivStyle = {
    display: "flex",
    width: "100%",
    justifyContent: "center",
  }

  /********** ANIMATION **********/
  const [ref, inView] = useInView()
  const variants = (key) => {
    // For the footer content part
    if (key < 3)
      return {
        visible: {
          opacity: 1,
          scaleX: 1,
          transition: { duration: 0.7, delay: key / 10 },
        },
        hidden: { opacity: 0, scaleX: 0 },
      }
    // For the website credits part
    return {
      visible: {
        opacity: 1,
        transition: { duration: 0.7, delay: key / 10 },
      },
      hidden: { opacity: 0 },
    }
  }
  const controls = useAnimation()

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [controls, inView])

  return (
    <Box
      ref={ref}
      component="footer"
      width={"100%"}
      paddingTop={10}
      margin={0}
      paddingBottom={4}
      sx={{
        backgroundImage: "url(/medias/footer-wave.svg)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <CenteredMaxWidthContainer>
        {/* FOOTER CONTENT */}
        <Stack
          alignItems="center"
          gap={5}
          sx={{
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <motion.div
            initial="hidden"
            variants={variants(0)}
            animate={controls}
            style={motionDivStyle}
          >
            <Logo />
          </motion.div>

          <motion.div
            initial="hidden"
            variants={variants(1)}
            animate={controls}
            style={motionDivStyle}
          >
            <Email />
          </motion.div>

          <motion.div
            initial="hidden"
            variants={variants(2)}
            animate={controls}
            style={motionDivStyle}
          >
            <SocialMedias />
          </motion.div>
        </Stack>

        {/* WEBSITE CREDITS */}
        <motion.div
          initial="hidden"
          variants={variants(3)}
          animate={controls}
          style={motionDivStyle}
        >
          <Credits />
        </motion.div>
      </CenteredMaxWidthContainer>
    </Box>
  )
}
