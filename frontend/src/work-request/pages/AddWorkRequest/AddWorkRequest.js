import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth-context";
import Button from "../../../shared/components/FormElements/Button/Button";
// import Input from "../../../shared/components/FormElements/Input/Input";
import Card from "../../../shared/components/UIElements/Card/Card";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
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
  const auth = useContext(AuthContext);
  const [activeButton, setActiveButton] = useState(BASIC_INFO);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loggedUser, setLoggedUser] = useState();

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

  return (
    <div className="add-workrequest__container">
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
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
        />
      )}
      {/* {activeButton === BASIC_INFO && <BasicInformation userId={userId} />}
    {activeButton === BASIC_INFO && <BasicInformation userId={userId} />}
    {activeButton === BASIC_INFO && <BasicInformation userId={userId} />} */}
    </div>
  );
};

export default AddWorkRequest;
