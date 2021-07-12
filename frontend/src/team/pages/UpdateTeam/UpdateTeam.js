import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { VALIDATOR_REQUIRE } from "../../../shared/util/validators";
import Input from "../../../shared/components/FormElements/Input/Input";
import Button from "../../../shared/components/FormElements/Button/Button";
import Card from "../../../shared/components/UIElements/Card/Card";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import UsersList from "../../../user/components/UsersList/UsersList";
import { useForm } from "../../../shared/hooks/form-hook";

const UpdateTeam = (props) => {
  const teamId = useParams().id;
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [team, setTeam] = useState();
  const [members, setMembers] = useState([]);
  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/team/get/${teamId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        const responseDataOther = await sendRequest(
          `http://localhost:5000/api/team/get-other/${teamId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        const merged = [
          ...responseData.members.map((member) => {
            return { ...member, minusDisabled: false, plusDisabled: true };
          }),
          ...responseDataOther.map((member) => {
            return { ...member, minusDisabled: true, plusDisabled: false };
          }),
        ];
        setTeam({
          id: responseData.id,
          name: responseData.name,
          members: merged,
        });
        setMembers(
          responseData.members.map((member) => {
            return member.id;
          })
        );
        setFormData(
          {
            name: {
              value: responseData.name,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchTeam();
  }, [sendRequest, auth.token, formState, setFormData, teamId]);
  //wafafwafwafwaaaaa
  //wafafwafwafwaaaaa
  const removeMemberHandler = (userId) => {
    const userIndexAllUsers = team.members.indexOf(
      team.members.find((x) => x.id === userId)
    );
    const newArrayAllUsers = [...team.members];
    newArrayAllUsers[userIndexAllUsers].minusDisabled = true;
    newArrayAllUsers[userIndexAllUsers].plusDisabled = false;
    setTeam(
      (prevState) => (prevState = { ...prevState, members: newArrayAllUsers })
    );

    const userIndex = members.indexOf(userId);
    const newArray = [...members];
    newArray.splice(userIndex, 1);
    setMembers((prevState) => (prevState = newArray));
  };
  const addMemberHandler = (userId) => {
    const userIndexAllUsers = team.members.indexOf(
      team.members.find((x) => x.id === userId)
    );
    const newArrayAllUsers = [...team.members];
    newArrayAllUsers[userIndexAllUsers].plusDisabled = true;
    newArrayAllUsers[userIndexAllUsers].minusDisabled = false;
    setTeam(
      (prevState) => (prevState = { ...prevState, members: newArrayAllUsers })
    );
    setMembers((prevState) => [...prevState, userId]);
  };

  const updateTeamHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/team/${teamId}`,
        "PATCH",
        JSON.stringify({
          Name: formState.inputs.name.value,
          MembersIds: members,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/teams");
    } catch (error) {}
  };

  return (
    <React.Fragment>
      {/* errorModal and loadingSpinner */}
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {team && (
        <Card className="update-team__form">
          <form onSubmit={updateTeamHandler}>
            <Input
              id="name"
              element="input"
              label="Team Name"
              type="text"
              onInput={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a team name."
              initialValue={team.name}
              initialValid={true}
            />
            <p style={{ margin: "1rem 0", fontSize: "14px" }}>
              NOTE: Each team should have at least one member. Please pick some.
            </p>
            <Button
              disabled={!formState.isValid || members.length === 0}
              type="submit"
            >
              UPDATE TEAM
            </Button>
          </form>
        </Card>
      )}
      {team && team.members && (
        <UsersList
          team
          items={team.members}
          removeMemberHandler={removeMemberHandler}
          addMemberHandler={addMemberHandler}
        />
      )}
    </React.Fragment>
  );
};

export default UpdateTeam;
