import React, { useEffect, useState } from "react";
import UsersList from "../../components/UsersList/UsersList";

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState([
    {name: 'Milica', lastName: 'Medic', email: 'milica5.medic@gmail.com', approved: 'waiting'},
    {name: 'Milos', lastName: 'Bakmaz', email: 'milosbakmaz5@gmail.com', approved: 'approved'},
    {name: 'Dejan', lastName: 'Males', email: 'malesdejan54@gmail.com', approved: 'denied'},
  ]);

  useEffect(() => {
    //get users
  }, []);

  return (
    <React.Fragment>
      {/* errorModal and loadingSpinner */}
      {loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;