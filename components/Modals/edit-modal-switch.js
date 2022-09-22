import dynamic from "next/dynamic"
import React from "react"
import withSnacks from "../hocs/withSnacks"
const EditFilmModal = dynamic(() => import("./Edit-Modals/edit-film-modal"))
const EditUserModal = dynamic(() => import("./Edit-Modals/edit-user-modal"))
const EditReferenceModal = dynamic(() =>
  import("./Edit-Modals/edit-reference-modal")
)

function EditModalSwitch(props) {
  /********** PROPS **********/
  const {
    dataId,
    dataModel,
    openEditModal,
    handleCloseEditModal,
    setSeverity,
    setOpenSnackBar,
    setMessageSnack,
  } = props

  // MAIN SWITCH
  switch (dataModel) {
    case "edit-user":
      return (
        <EditUserModal
          userId={dataId}
          openEditModal={openEditModal}
          handleCloseEditModal={handleCloseEditModal}
          setSeverity={setSeverity}
          setOpenSnackBar={setOpenSnackBar}
          setMessageSnack={setMessageSnack}
        />
      )
    case "edit-film":
      return (
        <EditFilmModal
          filmId={dataId}
          openEditModal={openEditModal}
          handleCloseEditModal={handleCloseEditModal}
          setSeverity={setSeverity}
          setOpenSnackBar={setOpenSnackBar}
          setMessageSnack={setMessageSnack}
        />
      )
    case "edit-reference":
      return (
        <EditReferenceModal
          referenceId={dataId}
          openEditModal={openEditModal}
          handleCloseEditModal={handleCloseEditModal}
          setSeverity={setSeverity}
          setOpenSnackBar={setOpenSnackBar}
          setMessageSnack={setMessageSnack}
        />
      )
    default:
      return <></>
  }
}

export default withSnacks(EditModalSwitch)
