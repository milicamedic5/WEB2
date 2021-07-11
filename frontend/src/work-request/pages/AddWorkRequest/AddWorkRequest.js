import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth-context";
import Button from "../../../shared/components/FormElements/Button/Button";
// import Input from "../../../shared/components/FormElements/Input/Input";
import Card from "../../../shared/components/UIElements/Card/Card";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import Modal from "../../../shared/components/UIElements/Modal/Modal";
import { useHttpClient } from "../../../shared/hooks/http-hook";
// import { VALIDATOR_REQUIRE } from "../../../shared/util/validators";
// import { useForm } from "../../../shared/hooks/form-hook";
import BasicInformation from "../../components/BasicInformation/BasicInformation";

import "./AddWorkRequest.css";

const BASIC_INFO = "BASIC_INFO";
const HISTORY_OF_STATE_CHANGES = "HISTORY_OF_STATE_CHANGES";
const MULTIMEDIA_ATTACHMENTS = "MULTIMEDIA_ATTACHMENTS";
const EQUIPMENT = "EQUIPMENT";

const AddWorkRequest = () => {
  const userId = useParams().userId;
  const id = useParams().id;
  const auth = useContext(AuthContext);
  const [activeButton, setActiveButton] = useState(BASIC_INFO);
  const [wantedButton, setWantedButton] = useState(BASIC_INFO);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loggedUser, setLoggedUser] = useState();
  const [workRequest, setWorkRequest] = useState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  let tempType;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/user/get/${userId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        if (id) {
          const responseDataWorkRequest = await sendRequest(
            `http://localhost:5000/api/workrequest/get/${id}`,
            "GET",
            null,
            {
              Authorization: "Bearer " + auth.token,
            }
          );
          setWorkRequest(responseDataWorkRequest);
        }
        setLoggedUser(responseData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [sendRequest]);

  const buttonHandler = (type) => {
    switch (type) {
      case BASIC_INFO:
        setWantedButton((prevState) => (prevState = BASIC_INFO));
        break;
      case HISTORY_OF_STATE_CHANGES:
        setWantedButton((prevState) => (prevState = HISTORY_OF_STATE_CHANGES));
        break;
      case MULTIMEDIA_ATTACHMENTS:
        setWantedButton((prevState) => (prevState = MULTIMEDIA_ATTACHMENTS));
        break;
      case EQUIPMENT:
        setWantedButton((prevState) => (prevState = EQUIPMENT));
        break;
      default:
        setWantedButton((prevState) => (prevState = BASIC_INFO));
        break;
    }
    showLeaveHandler();
  };

  const confirmLeaveHandler = () => {
    cancelLeaveHandler();
    switch (wantedButton) {
      case BASIC_INFO:
        setActiveButton((prevState) => (prevState = BASIC_INFO));
        break;
      case HISTORY_OF_STATE_CHANGES:
        setActiveButton((prevState) => (prevState = HISTORY_OF_STATE_CHANGES));
        break;
      case MULTIMEDIA_ATTACHMENTS:
        setActiveButton((prevState) => (prevState = MULTIMEDIA_ATTACHMENTS));
        break;
      case EQUIPMENT:
        setActiveButton((prevState) => (prevState = EQUIPMENT));
        break;
      default:
        setActiveButton((prevState) => (prevState = BASIC_INFO));
        break;
    }
  };

  const showLeaveHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelLeaveHandler = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="add-workrequest__container">
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <Modal
        show={showConfirmModal}
        onCancel={cancelLeaveHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelLeaveHandler}>
              CANCEL
            </Button>
            <Button onClick={confirmLeaveHandler}>YES</Button>
          </React.Fragment>
        }
      >
        <p>
          Are you sure you want to leave {activeButton}? Please save all the
          changes you like first.
        </p>
      </Modal>
      {!isLoading && (
        <div className="add-workrequest__nav">
          <Button
            inverse={activeButton === BASIC_INFO ? false : true}
            onClick={() => buttonHandler(BASIC_INFO)}
          >
            BASIC INFORMATION
          </Button>
          <Button
            inverse={activeButton === HISTORY_OF_STATE_CHANGES ? false : true}
            onClick={() => buttonHandler(HISTORY_OF_STATE_CHANGES)}
          >
            HISTORY OF STATE CHANGES
          </Button>
          <Button
            inverse={activeButton === MULTIMEDIA_ATTACHMENTS ? false : true}
            onClick={() => buttonHandler(MULTIMEDIA_ATTACHMENTS)}
          >
            MULTIMEDIA ATTACHMENTS
          </Button>
          <Button
            inverse={activeButton === EQUIPMENT ? false : true}
            onClick={() => buttonHandler(EQUIPMENT)}
          >
            EQUIPMENT
          </Button>
        </div>
      )}
      {!isLoading && loggedUser && activeButton === BASIC_INFO && (
        <BasicInformation
          user={loggedUser.firstname + " " + loggedUser.lastname}
          userId={userId}
          workRequest={workRequest}
        />
      )}
      {/* {activeButton === BASIC_INFO && <BasicInformation userId={userId} />}
    {activeButton === BASIC_INFO && <BasicInformation userId={userId} />}
    {activeButton === BASIC_INFO && <BasicInformation userId={userId} />} */}
    </div>
  );
};

export default AddWorkRequest;
