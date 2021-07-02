import React from 'react';
import Button from '../../../shared/components/FormElements/Button/Button';

import Card from '../../../shared/components/UIElements/Card/Card';
import './UserItem.css';

const UserItem = props => {
    return (
        <li className="user-item">
            <Card className="user-item__content">
                <div>
                    <div className="user-item__info">
                        <h2>{props.name} {props.lastName}</h2>
                        <h3>{props.email}</h3>
                        <h3>status: {props.approved}</h3>
                    </div>
                    {props.approved === "waiting" && <Button danger>DENY</Button>}
                    {props.approved === "waiting" && <Button>APPROVE</Button>}
                </div>
            </Card>
        </li>
    );
};

export default UserItem;