import React, { useContext } from "react";
import { useHttpClient } from "../../../shared/hooks/http-hook";

import Button from "../../../shared/components/FormElements/Button/Button";
import Card from "../../../shared/components/UIElements/Card/Card";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import "./UserItem.css";
import { AuthContext } from "../../../shared/context/auth-context";

const UserItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const userDeniedHandler = async () => {
    const status = "Denied";
    try {
      await sendRequest(
        "http://localhost:5000/api/user/set-status",
        "POST",
        JSON.stringify({
          UserId: props.id,
          Status: status,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ` + auth.token,
        }
      );
      props.onDeny(props.id);
    } catch (error) {
      console.log(error);
    }
  };

  const userApprovedHandler = async () => {
    const status = "Approved";
    try {
      await sendRequest(
        "http://localhost:5000/api/user/set-status",
        "POST",
        JSON.stringify({
          UserId: props.id,
          Status: status,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ` + auth.token,
        }
      );
      props.onApprove(props.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <li className="user-item">
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner />}
      <Card className="user-item__content">
        <div>
          <div className="user-item__info">
            <h2>
              {props.firstname} {props.lastname}
            </h2>
            <h3>{props.email}</h3>
            {!props.team && (
              <h3>
                Status:{" "}
                <span
                  style={{
                    color:
                      props.status === "Approved"
                        ? "green"
                        : props.status === "Denied"
                        ? "red"
                        : "blue",
                  }}
                >
                  {props.status}
                </span>
              </h3>
            )}
            {!props.team && <h3>Role: {props.role}</h3>}
          </div>
          {!props.team && props.status === "Waiting" && (
            <Button onClick={userDeniedHandler} danger>
              DENY
            </Button>
          )}
          {!props.team && props.status === "Waiting" && (
            <Button onClick={userApprovedHandler}>APPROVE</Button>
          )}
          {props.team && (
            <Button
              disabled={props.minusDisabled}
              onClick={() => props.removeMemberHandler(props.id)}
              danger
            >
              -
            </Button>
          )}
          {props.team && (
            <Button
              disabled={props.plusDisabled}
              onClick={() => props.addMemberHandler(props.id)}
            >
              +
            </Button>
          )}
        </div>
      </Card>
    </li>
  );
};

export default UserItem;
