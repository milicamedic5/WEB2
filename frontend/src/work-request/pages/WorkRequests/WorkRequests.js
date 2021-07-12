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
import { useStateWithCallbackLazy } from "use-state-with-callback";

import "./WorkRequests.css";

const ID_SORT = "ID";
const START_DATE_SORT = "STARTDATE";

const WorkRequests = () => {
  const userId = useParams().userId;
  const [workRequests, setWorkRequests] = useState([]);
  const [mineWorkRequests, setMineWorkRequests] = useState([]);
  const [showAllWorkRequests, setShowAllWorkRequests] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [sortIDAsc, setSortIDAsc] = useState(false);
  const [sortStartDateAsc, setSortStartDateAsc] = useState(false);

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

  const sortUpdateArray = (type) => {
    switch (type) {
      case ID_SORT:
        if (sortIDAsc === true) {
          if (showAllWorkRequests) {
            const newArray = [...workRequests].sort((a, b) => a.id - b.id);
            setWorkRequests(newArray);
          } else {
            const newArray = [...mineWorkRequests].sort((a, b) => a.id - b.id);
            setMineWorkRequests(newArray);
          }
        } else {
          if (showAllWorkRequests) {
            const newArray = [...workRequests].sort((a, b) => b.id - a.id);
            setWorkRequests(newArray);
          } else {
            const newArray = [...mineWorkRequests].sort((a, b) => b.id - a.id);
            setMineWorkRequests(newArray);
          }
        }
        break;
      case START_DATE_SORT:
        if (sortStartDateAsc === true) {
          if (showAllWorkRequests) {
            const newArray = [...workRequests].sort((a, b) =>
              a.startdate > b.startdate ? 1 : b.startdate > a.startdate ? -1 : 0
            );
            setWorkRequests(newArray);
          } else {
            const newArray = [...mineWorkRequests].sort((a, b) =>
              a.startdate > b.startdate ? 1 : b.startdate > a.startdate ? -1 : 0
            );
            setMineWorkRequests(newArray);
          }
        } else {
          if (showAllWorkRequests) {
            const newArray = [...workRequests].sort((a, b) =>
              b.startdate > a.startdate ? 1 : a.startdate > b.startdate ? -1 : 0
            );
            setWorkRequests(newArray);
          } else {
            const newArray = [...mineWorkRequests].sort((a, b) =>
              b.startdate > a.startdate ? 1 : a.startdate > b.startdate ? -1 : 0
            );
            setMineWorkRequests(newArray);
          }
        }
        break;
      default:
        break;
    }
  };

  const sortUpdateArrayHandler = (type) => {
    switch (type) {
      case ID_SORT:
        setSortIDAsc(!sortIDAsc);
        break;
      case START_DATE_SORT:
        setSortStartDateAsc(!sortStartDateAsc);
        break;
      default:
        break;
    }
    sortUpdateArray(type);
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
            sortIDAsc={sortIDAsc}
            sortStartDateAsc={sortStartDateAsc}
            sortUpdateArray={sortUpdateArrayHandler}
          />
        )}
        {!showAllWorkRequests && mineWorkRequests && (
          <WorkRequestsList
            items={mineWorkRequests}
            onDelete={deleteWorkRequestHandler}
            sortIDAsc={sortIDAsc}
            sortStartDateAsc={sortStartDateAsc}
            sortUpdateArray={sortUpdateArrayHandler}
          />
        )}
      </Card>
    </React.Fragment>
  );
};

export default WorkRequests;
