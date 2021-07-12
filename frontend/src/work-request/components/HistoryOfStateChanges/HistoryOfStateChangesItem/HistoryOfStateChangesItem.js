import React from "react";

const HistoryOfStateChangesItem = (props) => {
  return (
    <tr className="workrequest-item__tr">
      <td className="workrequest-item__td">{props.changedate}</td>
      <td className="workrequest-item__td">{props.state}</td>
    </tr>
  );
};

export default HistoryOfStateChangesItem;
