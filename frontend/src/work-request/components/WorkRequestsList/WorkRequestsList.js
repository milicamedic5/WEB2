import React, { useState } from "react";

import WorkRequestItem from "../WorkRequestItem/WorkRequestItem";

import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import "./WorkRequestsList.css";

const ID_SORT = "ID";
const START_DATE_SORT = "STARTDATE";

const WorkRequestsList = (props) => {
  if (!props.items || props.items.length === 0) {
    return <h2 className="teams-list__content">No work requests added yet.</h2>;
  }

  const sortHandler = (type) => {
    props.sortUpdateArray(type);
  };

  return (
    <table className="workrequests__table">
      <thead>
        <tr>
          <th onClick={() => sortHandler(ID_SORT)}>
            ID
            {!props.sortIDAsc && <FaAngleDown />}
            {props.sortIDAsc && <FaAngleUp />}
          </th>
          <th onClick={() => sortHandler(START_DATE_SORT)}>
            Start Date
            {!props.sortStartDateAsc && <FaAngleDown />}
            {props.sortStartDateAsc && <FaAngleUp />}
          </th>
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
            creator={item.createdby}
            onDeleteWorkRequest={props.onDelete}
          />
        ))}
      </tbody>
    </table>
  );
};

export default WorkRequestsList;
