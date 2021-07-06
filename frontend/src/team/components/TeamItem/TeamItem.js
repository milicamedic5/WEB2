import React from "react";

import Button from "../../../shared/components/FormElements/Button/Button";

import "./TeamItem.css";

const TeamItem = (props) => {
  return (
    <li className="user-item">
      <div>
        <h3 className="user-item__name">{props.name}</h3>
        <div className="user-item__members">
          {props.members &&
            props.members.map((member) => (
              <div className="user-item__member">
                <span>{member.firstname} | </span>
                <span>{member.lastname} | </span>
                <span>{member.email}</span>
              </div>
            ))}
        </div>
      </div>
      <div className="user-item__buttons">
        <Button edit>EDIT</Button>
        <Button inverse>DELETE</Button>
      </div>
    </li>
  );
};

export default TeamItem;
