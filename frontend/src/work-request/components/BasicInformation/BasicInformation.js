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
import { useHistory } from "react-router";

import "./BasicInformation.css";

const BasicInformation = (props) => {
  const [isTeamMemberRole, setIsTeamMemberRole] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [formState, inputHandler, setFormData] = useForm(
    {
      type: {
        value: (props.workRequest && props.workRequest.type) || "Planned Work",
        isValid: true,
      },
      status: {
        value: (props.workRequest && props.workRequest.status) || "Draft",
        isValid: true,
      },
      incident: {
        value: (props.workRequest && props.workRequest.incident) || "INC1",
        isValid: true,
      },
      startdate: {
        value:
          props.workRequest && props.workRequest.startdate
            ? new Date(props.workRequest.startdate)
            : "",
        isValid:
          props.workRequest && props.workRequest.startdate ? true : false,
      },
      enddate: {
        value:
          props.workRequest && props.workRequest.enddate
            ? new Date(props.workRequest.enddate)
            : "",
        isValid: props.workRequest && props.workRequest.enddate ? true : false,
      },
      createdby: {
        value: props.workRequest && props.user,
        isValid: true,
      },
      purpose: {
        value: (props.workRequest && props.workRequest.purpose) || "",
        isValid: props.workRequest && props.workRequest.type ? true : false,
      },
      details: {
        value: (props.workRequest && props.workRequest.details) || "",
        isValid: props.workRequest && props.workRequest.details ? true : false,
      },
      notes: {
        value: (props.workRequest && props.workRequest.notes) || "",
        isValid: props.workRequest && props.workRequest.notes ? true : false,
      },
      emergencywork: {
        value:
          (props.workRequest && props.workRequest.emergencywork) || "false",
        isValid: true,
      },
      company: {
        value: (props.workRequest && props.workRequest.company) || "",
        isValid: props.workRequest && props.workRequest.company ? true : false,
      },
      phone: {
        value: (props.workRequest && props.workRequest.phone) || "",
        isValid: props.workRequest && props.workRequest.phone ? true : false,
      },
      createddate: {
        value:
          props.workRequest && props.workRequest.createddate
            ? new Date(props.workRequest.createddate)
            : new Date().toLocaleDateString(),
        isValid: true,
      },
    },
    false
  );

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    if (props.workRequest) {
      try {
        await sendRequest(
          `http://localhost:5000/api/workrequest/${props.workRequest.id}`,
          "PATCH",
          JSON.stringify({
            Type: formState.inputs.type.value,
            Status: formState.inputs.status.value,
            Incident: formState.inputs.incident.value,
            StartDate: formState.inputs.startdate.value,
            EndDate: formState.inputs.enddate.value,
            Purpose: formState.inputs.purpose.value,
            Details: formState.inputs.details.value,
            Notes: formState.inputs.notes.value,
            Company: formState.inputs.company.value,
            Phone: formState.inputs.phone.value,
            EmergencyWork: formState.inputs.emergencywork.value,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        history.push(`/${auth.userId}/workrequests`);
      } catch (error) {}
    } else {
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
        history.push(`/${auth.userId}/workrequests`);
      } catch (err) {}
    }
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
            initialValue={
              (props.workRequest && props.workRequest.type) || "Planned Work"
            }
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
            initialValue={
              (props.workRequest && props.workRequest.status) || "Draft"
            }
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
            initialValue={
              (props.workRequest && props.workRequest.incident) || "INC1"
            }
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
            initialValue={
              props.workRequest && props.workRequest.startdate
                ? new Date(props.workRequest.startdate)
                : ""
            }
            initialValid={
              props.workRequest && props.workRequest.startdate ? true : false
            }
            errorText="Please pick start date.time."
          />
          <Input
            id="enddate"
            element="input"
            label="End date/time:"
            type="date"
            onInput={inputHandler}
            initialValue={
              (props.workRequest && props.workRequest.enddate) || ""
            }
            initialValid={
              props.workRequest && props.workRequest.enddate ? true : false
            }
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
            initialValue={
              (props.workRequest && props.workRequest.purpose) || ""
            }
            initialValid={
              props.workRequest && props.workRequest.purpose ? true : false
            }
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter purpose of work request."
          />
          <Input
            id="details"
            label="Details:"
            type="text"
            onInput={inputHandler}
            initialValue={
              (props.workRequest && props.workRequest.details) || ""
            }
            initialValid={
              props.workRequest && props.workRequest.details ? true : false
            }
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter details of work request."
          />
          <Input
            id="notes"
            label="Notes:"
            type="text"
            onInput={inputHandler}
            initialValue={(props.workRequest && props.workRequest.notes) || ""}
            initialValid={
              props.workRequest && props.workRequest.notes ? true : false
            }
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter notes of work request."
          />
          <Input
            id="company"
            element="input"
            label="Company:"
            type="text"
            initialValue={
              (props.workRequest && props.workRequest.company) || ""
            }
            initialValid={
              props.workRequest && props.workRequest.company ? true : false
            }
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please pick company."
          />
          <Input
            id="phone"
            element="input"
            label="Phone No:"
            type="tel"
            initialValue={(props.workRequest && props.workRequest.phone) || ""}
            initialValid={
              props.workRequest && props.workRequest.phone ? true : false
            }
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
            initialValue={
              (props.workRequest && props.workRequest.createddate) ||
              new Date().toLocaleDateString()
            }
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
              initialValue={
                (props.workRequest && props.workRequest.emergencywork) ||
                "false"
              }
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
