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
        setWorkRequests(responseData);
      } catch (err) {}
    };
    fetchAll();
  }, []);

  const addWorkRequestHandler = () => {
    history.push(`/${userId}/workrequests/add-workrequest`);
  };

  const deleteWorkRequestHandler = (workRequestId) => {
    setWorkRequests((prevState) =>
      prevState.filter((workRequest) => workRequest.id !== workRequestId)
    );
  };
  const items = [
    {
      id: 1,
      startdate: "20/07/2021",
      phone: "065/55-555-55",
      status: "ok",
      address: "Novi Sad",
    },
    {
      id: 2,
      startdate: "20/07/2021",
      phone: "065/55-555-55",
      status: "okkkkkKKKKK",
      address: "Novi Sad",
    },
    {
      id: 3,
      startdate: "20/07/2021",
      phone: "065/55-555-55",
      status: "ok",
      address: "Novi Sad",
    },
  ];
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <Card className="teams__card">
        <Button onClick={addWorkRequestHandler} add right>
          ADD NEW
        </Button>
        {workRequests && (
          <WorkRequestsList
            items={workRequests}
            onDelete={deleteWorkRequestHandler}
          />
        )}
      </Card>
    </React.Fragment>
  );
};

export default WorkRequests;
