import React, { useContext, useState } from "react";
import { useHttpClient } from "../../../shared/hooks/http-hook";

import Button from "../../../shared/components/FormElements/Button/Button";
import Modal from "../../../shared/components/UIElements/Modal/Modal";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal/ErrorModal";

import "./TeamItem.css";
import { AuthContext } from "../../../shared/context/auth-context";

const TeamItem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/team/delete/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      props.onDeleteItem(props.id);
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this team? Please note that it can't
          be undone thereafter.
        </p>
      </Modal>
      <li className="user-item">
        <div>
          <h3 className="user-item__name">{props.name}</h3>
          <div className="user-item__members">
            {props.members &&
              props.members.map((member) => (
                <div key={member.id} className="user-item__member">
                  <span>{member.firstname} | </span>
                  <span>{member.lastname} | </span>
                  <span>{member.email}</span>
                </div>
              ))}
          </div>
        </div>
        <div className="user-item__buttons">
          <Button edit to={`/teams/${props.id}`}>
            EDIT
          </Button>
          <Button inverse onClick={showDeleteHandler}>
            DELETE
          </Button>
        </div>
      </li>
    </React.Fragment>
  );
};

export default TeamItem;
