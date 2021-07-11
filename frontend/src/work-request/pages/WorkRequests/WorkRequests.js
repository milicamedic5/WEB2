import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";

import Card from "../../../shared/components/UIElements/Card/Card";
import Button from "../../../shared/components/FormElements/Button/Button";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import WorkRequestsList from "../../components/WorkRequestsList/WorkRequestsList";

import "./WorkRequests.css";

const WorkRequests = () => {
  const userId = useParams().userId;
  const [workRequests, setWorkRequests] = useState([]);
  const [mineWorkRequests, setMineWorkRequests] = useState([]);
  const [showAllWorkRequests, setShowAllWorkRequests] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/workrequest/get-all",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        const responseDataMine = await sendRequest(
          "http://localhost:5000/api/workrequest/get-mine",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setWorkRequests(responseData);
        setMineWorkRequests(responseDataMine);
        console.log(responseData);
        console.log(responseDataMine);
      } catch (err) {}
    };
    fetchAll();
  }, [sendRequest, auth.token]);

  const addWorkRequestHandler = () => {
    history.push(`/${userId}/workrequests/add-workrequest`);
  };

  const deleteWorkRequestHandler = (workRequestId) => {
    setWorkRequests((prevState) =>
      prevState.filter((workRequest) => workRequest.id !== workRequestId)
    );
    setMineWorkRequests((prevState) =>
      prevState.filter((workRequest) => workRequest.id !== workRequestId)
    );
  };

  const workRequestListHandler = () => {
    setShowAllWorkRequests((prevState) => !prevState);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <Card className="workrequest__card">
        <Button
          inverse={showAllWorkRequests ? false : true}
          onClick={workRequestListHandler}
        >
          ALL
        </Button>
        <Button
          inverse={!showAllWorkRequests ? false : true}
          onClick={workRequestListHandler}
        >
          MINE
        </Button>
      </Card>
      <Card className="teams__card">
        <Button onClick={addWorkRequestHandler} add right>
          ADD NEW
        </Button>
        {showAllWorkRequests && workRequests && (
          <WorkRequestsList
            items={workRequests}
            onDelete={deleteWorkRequestHandler}
          />
        )}
        {!showAllWorkRequests && mineWorkRequests && (
          <WorkRequestsList
            items={mineWorkRequests}
            onDelete={deleteWorkRequestHandler}
          />
        )}
      </Card>
    </React.Fragment>
  );
};

export default WorkRequests;
