import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import { useAuth } from "../../../shared/hooks/auth-hook";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { VALIDATOR_REQUIRE } from "../../../shared/util/validators";
import Input from "../../../shared/components/FormElements/Input/Input";
import Button from "../../../shared/components/FormElements/Button/Button";
import Card from "../../../shared/components/UIElements/Card/Card";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal/ErrorModal";
import UsersList from "../../../user/components/UsersList/UsersList";
import { useForm } from "../../../shared/hooks/form-hook";

import "./AddTeam.css";

const AddTeam = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { token, login, logout, userId, role } = useAuth();
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [errorMembers, setErrorMembers] = useState(false);
  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(async () => {
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/user/get-all",
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setLoadedUsers(
        responseData
          .filter((x) => x.role === "Dispecer")
          .map((user) => {
            return { ...user, minusDisabled: true, plusDisabled: false };
          })
      );
    } catch (err) {
      console.log(err);
    }
  }, []);

  const removeMemberHandler = (userId) => {
    const userIndexAllUsers = loadedUsers.indexOf(
      loadedUsers.find((x) => x.id === userId)
    );
    const newArrayAllUsers = [...loadedUsers];
    newArrayAllUsers[userIndexAllUsers].minusDisabled = true;
    newArrayAllUsers[userIndexAllUsers].plusDisabled = false;
    setLoadedUsers((prevState) => (prevState = newArrayAllUsers));

    const userIndex = members.indexOf(userId);
    const newArray = [...members];
    newArray.splice(userIndex, 1);
    setMembers((prevState) => (prevState = newArray));
  };
  const addMemberHandler = (userId) => {
    const userIndexAllUsers = loadedUsers.indexOf(
      loadedUsers.find((x) => x.id === userId)
    );
    const newArrayAllUsers = [...loadedUsers];
    newArrayAllUsers[userIndexAllUsers].plusDisabled = true;
    newArrayAllUsers[userIndexAllUsers].minusDisabled = false;
    setLoadedUsers((prevState) => (prevState = newArrayAllUsers));
    setErrorMembers(false);
    setMembers((prevState) => [...prevState, userId]);
  };

  const addTeamHandler = (event) => {
    event.preventDefault();
    // poslati zahtev ka backu za dodavanje novog TIMA
    if (members.length === 0) {
      setErrorMembers(true);
    }
    console.log(members);
  };

  return (
    <React.Fragment>
      {/* errorModal and loadingSpinner */}
      <ErrorModal error={error} onClear={clearError} />
      <Card className="add-team__form">
        <form onSubmit={addTeamHandler}>
          <Input
            id="name"
            element="input"
            label="Team Name"
            type="text"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a team name."
          />
          <p style={{ margin: "1rem 0", fontSize: "14px" }}>
            NOTE: Each team should have at least one member. Please pick some.
          </p>
          <Button
            disabled={!formState.isValid || members.length === 0}
            type="submit"
          >
            ADD NEW TEAM
          </Button>
        </form>
      </Card>
      {loadedUsers && (
        <UsersList
          team
          items={loadedUsers}
          removeMemberHandler={removeMemberHandler}
          addMemberHandler={addMemberHandler}
        />
      )}
    </React.Fragment>
  );
};

export default AddTeam;
