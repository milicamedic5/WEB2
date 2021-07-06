import React from "react";

import UserItem from "../UserItem/UserItem";
import Card from "../../../shared/components/UIElements/Card/Card";
import "./UsersList.css";

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found!</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          firstname={user.firstname}
          lastname={user.lastname}
          email={user.email}
          status={user.status}
          role={user.role}
          onDeny={props.onDeny}
          onApprove={props.onApprove}
          team={props.team}
          minusDisabled={user.minusDisabled}
          plusDisabled={user.plusDisabled}
          removeMemberHandler={props.removeMemberHandler}
          addMemberHandler={props.addMemberHandler}
        />
      ))}
    </ul>
  );
};

export default UsersList;
