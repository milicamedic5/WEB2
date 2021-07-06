import React from "react";
import { useHistory } from "react-router-dom";

import Button from "../../../shared/components/FormElements/Button/Button";
import Card from "../../../shared/components/UIElements/Card/Card";

import TeamsList from "../../components/TeamsList/TeamsList";
import "./Teams.css";

const Teams = () => {
  const history = useHistory();

  const teams = [
    {
      id: 1,
      name: "team1",
      members: [
        {
          id: 11,
          firstname: "Milica",
          lastname: "Medic",
          email: "milica5.medic@gmail.com",
        },
      ],
    },
    {
      id: 2,
      name: "team2",
      members: [
        {
          id: 11,
          firstname: "Milica",
          lastname: "Medic",
          email: "milica5.medic@gmail.com",
        },
        {
          id: 12,
          firstname: "Marko",
          lastname: "Medic",
          email: "marko.medic@gmail.com",
        },
      ],
    },
    {
      id: 3,
      name: "team3",
      members: [
        {
          id: 11,
          firstname: "Milica",
          lastname: "Medic",
          email: "milica5.medic@gmail.com",
        },
        {
          id: 12,
          firstname: "Aleksandar",
          lastname: "Medic",
          email: "aca.medic@gmail.com",
        },
        {
          id: 13,
          firstname: "Stefan",
          lastname: "Medic",
          email: "stefan.medic@gmail.com",
        },
      ],
    },
  ];

  const addTeamHandler = () => {
    history.push("/teams/add-team");
  };

  return (
    <React.Fragment>
      <Card className="teams__card">
        <Button onClick={addTeamHandler} add right>
          ADD NEW
        </Button>
        {teams && <TeamsList items={teams} />}
      </Card>
    </React.Fragment>
  );
};

export default Teams;
