import React from 'react';
import {useParams} from 'react-router-dom';

const WorkRequests = () => {
  const userId = useParams().userId;
  return (
    <div>
      hello from work requests + {userId}
    </div>
  );
};

export default WorkRequests;