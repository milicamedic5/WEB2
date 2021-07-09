import React, { useContext, useState } from "react";
import { useHttpClient } from "../../../shared/hooks/http-hook";

import Button from "../../../shared/components/FormElements/Button/Button";
import Modal from "../../../shared/components/UIElements/Modal/Modal";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";

import { AuthContext } from "../../../shared/context/auth-context";

import "./WorkRequestItem.css";

const WorkRequestItem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    // setShowConfirmModal(false);
    // try {
    //   await sendRequest(
    //     `http://localhost:5000/api/team/delete/${props.id}`,
    //     "DELETE",
    //     null,
    //     { Authorization: "Bearer " + auth.token }
    //   );
    //   props.onDeleteItem(props.id);
    // } catch (error) {}
    props.onDeleteItem(props.id);
  };
  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this work request? Please note that
          it can't be undone thereafter.
        </p>
      </Modal>
      <tr className="workrequest-item__tr">
        <td className="workrequest-item__td">{props.id}</td>
        <td className="workrequest-item__td">{props.startdate}</td>
        <td className="workrequest-item__td">{props.phone}</td>
        <td className="workrequest-item__td">{props.status}</td>
        <td className="workrequest-item__td">{props.address}</td>
        <td className="workrequest-item__buttons">
          <Button edit to={`/teams/${props.id}`}>
            EDIT
          </Button>
          <Button inverse onClick={showDeleteHandler}>
            DELETE
          </Button>
        </td>
      </tr>
    </React.Fragment>
  );
};

export default WorkRequestItem;
