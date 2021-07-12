import React, { useState, useContext, useEffect } from "react";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import Card from "../../../shared/components/UIElements/Card/Card";
import Button from "../../../shared/components/FormElements/Button/Button";
import Modal from "../../../shared/components/UIElements/Modal/Modal";
import HistoryOfStateChangesList from "./HistoryOfStateChangesList/HistoryOfStateChangesList";
import { AuthContext } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";

import "./HistoryOfStateChanges.css";

const HistoryOfStateChanges = (props) => {
  console.log(props);
  const [stateChanges, setStateChanges] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [wantedAction, setWantedAction] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [addedNew, setAddedNew] = useState(0);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/statechange/get-mine/${props.workRequest.id}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setStateChanges(responseData);
      } catch (err) {}
    };
    fetchAll();
  }, [sendRequest, auth.token, addedNew]);

  const wantedActionHandler = (type) => {
    setWantedAction(type);
    showActionConfirmHandler();
  };

  const confirmActionHandler = async () => {
    cancelConfirmActionHandler();
    try {
      await sendRequest(
        "http://localhost:5000/api/statechange/add",
        "POST",
        JSON.stringify({
          ChangeDate: new Date().toLocaleDateString(),
          State: wantedAction,
          WorkRequestId: props.workRequest.id,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setAddedNew((prevState) => prevState + 1);
    } catch (err) {}
  };

  const showActionConfirmHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelConfirmActionHandler = () => {
    setShowConfirmModal(false);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <Modal
        show={showConfirmModal}
        onCancel={cancelConfirmActionHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelConfirmActionHandler}>
              CANCEL
            </Button>
            <Button onClick={confirmActionHandler}>YES</Button>
          </React.Fragment>
        }
      >
        <p>
          Are you sure you want to change state of document to "{wantedAction}"?
        </p>
      </Modal>
      <div className="history_of_state_changes">
        {!isLoading &&
          props.workRequest &&
          (!stateChanges ||
            stateChanges.length === 0 ||
            stateChanges[stateChanges.length - 1].state === "Deny") && (
            <Card className="history_of_state_changes__actions">
              <Button onClick={() => wantedActionHandler("Approve")}>
                APPROVE
              </Button>
              <Button inverse onClick={() => wantedActionHandler("Deny")}>
                DENY
              </Button>
              <Button danger onClick={() => wantedActionHandler("Cancel")}>
                CANCEL
              </Button>
            </Card>
          )}
        {!isLoading && stateChanges && stateChanges.length !== 0 && (
          <Card className="history_of_state_changes__table">
            <HistoryOfStateChangesList items={stateChanges} />
          </Card>
        )}
        {!props.workRequest && (
          <Card className="history_of_state_changes__table">
            You should add document first.
          </Card>
        )}
      </div>
    </React.Fragment>
  );
};

export default HistoryOfStateChanges;
