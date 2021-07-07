import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import Button from "../../../shared/components/FormElements/Button/Button";
import Card from "../../../shared/components/UIElements/Card/Card";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal/ErrorModal";
import { AuthContext } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";

import TeamsList from "../../components/TeamsList/TeamsList";
import "./Teams.css";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const history = useHistory();

  useEffect(async () => {
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/team/get-all",
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setTeams(responseData);
    } catch (err) {}
  }, []);

  const addTeamHandler = () => {
    history.push("/teams/add-team");
  };

  const deleteTeamHandler = (teamId) => {
    console.log(teamId);
    setTeams((prevState) => prevState.filter((team) => team.id !== teamId));
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="teams__card">
        <Button onClick={addTeamHandler} add right>
          ADD NEW
        </Button>
        {teams && <TeamsList items={teams} onDelete={deleteTeamHandler} />}
      </Card>
    </React.Fragment>
  );
};

export default Teams;
