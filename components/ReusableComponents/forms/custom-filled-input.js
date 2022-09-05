import { TextField } from "@mui/material"
import { styled } from "@mui/system"

const CssFilledInput = styled((props) => (
  <TextField
    size="small"
    variant="filled"
    InputProps={{ disableUnderline: true }}
    sx={{
      width: "100%",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiFilledInput-root": {
    overflow: "hidden",
    borderRadius: 4,
    // backgroundColor: theme.palette.background.main,
    background: `linear-gradient(-20deg, rgb(0,0,0) 0%, ${theme.palette.background.main} 80%)`,
    color: theme.palette.text.white, // input value
    "&:hover": {
      backgroundColor: theme.palette.background.main,
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.main,
    },
  },
  "& .MuiFormLabel-root.Mui-focused.Mui-error": {
    color: "#f44336",
  },
  "& .MuiFormLabel-root.Mui-focused": {
    color: theme.palette.secondary.main,
  },
  "& .MuiFilledInput-root.Mui-error": {
    color: "#f44336",
    margin: 0,
    marginLeft: 0,
  },
  "& .MuiFormHelperText-root.Mui-error": {
    color: "#fff",
    margin: 0,
  },
}))

export default function CustomFilledInput(props) {
  return <CssFilledInput {...props} />
}
