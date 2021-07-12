import React from "react";

import HistoryOfStateChangesItem from "../HistoryOfStateChangesItem/HistoryOfStateChangesItem";

import "./HistoryOfStateChangesList.css";

const HistoryOfStateChangesList = (props) => {
  return (
    <table className="history_of_state_changes__table">
      <thead>
        <tr>
          <th>Change Date</th>
          <th>State</th>
        </tr>
      </thead>
      <tbody>
        {props.items.map((item) => (
          <HistoryOfStateChangesItem
            key={item.id}
            id={item.id}
            changedate={item.startdate}
            state={item.state}
          />
        ))}
      </tbody>
    </table>
  );
};

export default HistoryOfStateChangesList;
