import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../shared/context/auth-context";
import { useAuth } from "../../../shared/hooks/auth-hook";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import UsersList from "../../components/UsersList/UsersList";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal/ErrorModal";

const Users = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { token, login, logout, userId, role } = useAuth();
  const [loadedUsers, setLoadedUsers] = useState([]);

  useEffect(async () => {
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
    } catch (err) {
      console.log(err);
    }
  }, []);

  const userDeniedHandler = (userId) => {
    console.log(userId);
    const usersIndex = loadedUsers.findIndex((user) => user.id === userId);
    let newArray = [...loadedUsers];
    console.log(newArray, userId);
    newArray[usersIndex].status = "Denied";
    setLoadedUsers((prevUsers) => (prevUsers = newArray));
  };

  const userApprovedHandler = (userId) => {
    console.log(userId);
    const usersIndex = loadedUsers.findIndex((user) => user.id === userId);
    let newArray = [...loadedUsers];
    console.log(newArray, userId);
    newArray[usersIndex].status = "Approved";
    setLoadedUsers((prevUsers) => (prevUsers = newArray));
  };

  return (
    <React.Fragment>
      {/* errorModal and loadingSpinner */}
      <ErrorModal error={error} onClear={clearError} />
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
