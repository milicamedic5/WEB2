import React from "react";

import WorkRequestItem from "../WorkRequestItem/WorkRequestItem";

const WorkRequestsList = (props) => {
  if (!props.items || props.items.length === 0) {
    return <h2 className="teams-list__content">No work requests added yet.</h2>;
  }

  return (
    <table className="workrequests__table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Start Date</th>
          <th>Phone</th>
          <th>Status</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        {props.items.map((item) => (
          <WorkRequestItem
            key={item.id}
            id={item.id}
            startdate={item.startdate}
            phone={item.phone}
            status={item.status}
            address={item.address}
          />
        ))}
      </tbody>
    </table>
  );
};

export default WorkRequestsList;
