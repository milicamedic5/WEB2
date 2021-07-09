import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth-context";
import Button from "../../../shared/components/FormElements/Button/Button";
import Input from "../../../shared/components/FormElements/Input/Input";
import Card from "../../../shared/components/UIElements/Card/Card";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal/ErrorModal";
import { VALIDATOR_REQUIRE } from "../../../shared/util/validators";
import { useForm } from "../../../shared/hooks/form-hook";
import { useHttpClient } from "../../../shared/hooks/http-hook";

import "./BasicInformation.css";

const BasicInformation = (props) => {
  const [isTeamMemberRole, setIsTeamMemberRole] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm(
    {
      type: {
        value: "Planned Work",
        isValid: true,
      },
      status: {
        value: "Draft",
        isValid: true,
      },
      incident: {
        value: "INC1",
        isValid: true,
      },
      startdate: {
        value: "",
        isValid: false,
      },
      enddate: {
        value: "",
        isValid: false,
      },
      createdby: {
        value: props.user,
        isValid: true,
      },
      purpose: {
        value: "",
        isValid: false,
      },
      details: {
        value: "",
        isValid: false,
      },
      notes: {
        value: "",
        isValid: false,
      },
      emergencywork: {
        value: "false",
        isValid: true,
      },
      company: {
        value: "",
        isValid: false,
      },
      phone: {
        value: "",
        isValid: false,
      },
      createddate: {
        value: new Date().toLocaleDateString(),
        isValid: true,
      },
    },
    false
  );

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    try {
      await sendRequest(
        "http://localhost:5000/api/workrequest/add",
        "POST",
        JSON.stringify({
          Type: formState.inputs.type.value,
          Status: formState.inputs.status.value,
          Incident: formState.inputs.incident.value,
          StartDate: formState.inputs.startdate.value,
          EndDate: formState.inputs.enddate.value,
          CreatedBy: props.userId,
          Purpose: formState.inputs.purpose.value,
          Details: formState.inputs.details.value,
          Notes: formState.inputs.notes.value,
          Company: formState.inputs.company.value,
          Phone: formState.inputs.phone.value,
          CreatedDate: formState.inputs.createddate.value,
          EmergencyWork: formState.inputs.emergencywork.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="add-workrequest__basic-information_card">
        <form onSubmit={formSubmitHandler}>
          <Input
            id="type"
            element="select"
            label="Type:"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please pick a type."
            initialValue="Planned Work"
            initialValid={true}
            selectOptions={[
              { value: "Planned Work" },
              { value: "Non Planned Work" },
            ]}
          />
          <Input
            id="status"
            element="input"
            label="Status:"
            type="text"
            initialValue="Draft"
            initialValid={true}
            disabled={true}
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please pick status."
          />
          <Input
            id="incident"
            element="select"
            label="Incident:"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please pick an incident."
            initialValue="INC1"
            initialValid={true}
            selectOptions={[
              { value: "INC1" },
              { value: "INC2" },
              { value: "INC3" },
            ]}
          />
          <Input
            id="startdate"
            element="input"
            label="Start date/time:"
            type="date"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please pick start date.time."
          />
          <Input
            id="enddate"
            element="input"
            label="End date/time:"
            type="date"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please pick end date.time."
          />
          <Input
            id="createdby"
            element="input"
            label="Created by:"
            type="text"
            disabled={true}
            initialValue={props.user}
            initialValid={true}
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please pick creator."
          />
          <Input
            id="purpose"
            label="Purpose:"
            type="text"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter purpose of work request."
          />
          <Input
            id="details"
            label="Details:"
            type="text"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter details of work request."
          />
          <Input
            id="notes"
            label="Notes:"
            type="text"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter notes of work request."
          />
          <Input
            id="company"
            element="input"
            label="Company:"
            type="text"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please pick company."
          />
          <Input
            id="phone"
            element="input"
            label="Phone No:"
            type="tel"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter phone number."
          />
          <Input
            id="createddate"
            element="input"
            label="Date/time created:"
            type="text"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            initialValue={new Date().toLocaleDateString()}
            initialValid={true}
            disabled={true}
            errorText="Please enter date of creation."
          />
          <div className="add-workrequest__basic-information_emergency-work">
            <Input
              id="emergencywork"
              label="Emergency Work:"
              type="checkbox"
              element="checkbox"
              onInput={inputHandler}
              validators={[]}
              initialValid={true}
              initialValue="false"
              checked={false}
            />
          </div>
          <Button type="submit" disabled={!formState.isValid}>
            SAVE
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default BasicInformation;
