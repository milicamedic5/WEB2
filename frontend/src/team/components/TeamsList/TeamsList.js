import React from "react";

import TeamItem from "../TeamItem/TeamItem";
import "./TeamsList.css";

const TeamsList = (props) => {
  if (!props.items || props.items.length === 0) {
    return <h2 className="teams-list__content">No teams added yet.</h2>;
  }

  console.log(props.items);
  return (
    <ul className="teams-list">
      {props.items.map((item) => (
        <div key={item.id}>
          <TeamItem
            id={item.id}
            name={item.name}
            members={item.members}
            onDeleteItem={props.onDelete}
          />
          <hr />
        </div>
      ))}
    </ul>
  );
};

export default TeamsList;
