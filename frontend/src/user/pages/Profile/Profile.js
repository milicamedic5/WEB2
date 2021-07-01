import React from 'react';
import { useParams } from "react-router";

import Card from '../../../shared/components/UIElements/Card/Card';
import './Profile.css';

const Profile = () => {

  // get user
  const userId = useParams().userId;

  return (
    <Card className="profile__container">
      <h2>Profile</h2>
      <div>
        <p>First Name:</p>
        <p className="profile__data">Milica</p>
      </div>
      <div>
        <p>Last Name:</p>
        <p className="profile__data">Medic</p>
      </div>
      <div>
        <p>Email:</p>
        <p className="profile__data">milica5.medic@gmail.com</p>
      </div>
      <div>
        <p>Profile status:</p>
        <p className="profile__data">Approved</p>
      </div>
    </Card>
  );
};

export default Profile;