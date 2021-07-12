import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import UsersList from "../../components/UsersList/UsersList";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";

const Users = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/user/get-all",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        setLoadedUsers(responseData);
      } catch (err) {}
    };
    fetchAll();
  }, [sendRequest, auth.token]);

  const userDeniedHandler = (userId) => {
    const usersIndex = loadedUsers.findIndex((user) => user.id === userId);
    let newArray = [...loadedUsers];
    newArray[usersIndex].status = "Denied";
    setLoadedUsers((prevUsers) => (prevUsers = newArray));
  };

  const userApprovedHandler = (userId) => {
    const usersIndex = loadedUsers.findIndex((user) => user.id === userId);
    let newArray = [...loadedUsers];
    newArray[usersIndex].status = "Approved";
    setLoadedUsers((prevUsers) => (prevUsers = newArray));
  };

  return (
    <React.Fragment>
      {/* errorModal and loadingSpinner */}
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {loadedUsers && (
        <UsersList
          items={loadedUsers}
          onDeny={userDeniedHandler}
          onApprove={userApprovedHandler}
        />
      )}
    </React.Fragment>
  );
};

export default Users;
