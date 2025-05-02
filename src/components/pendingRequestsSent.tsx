import React from 'react';
import { MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';

const PendingRequestsSent: React.FC = () => (
  <div>
    <h5>Pending Requests Sent</h5>
    <MDBListGroup>
      <MDBListGroupItem>Request 1</MDBListGroupItem>
      <MDBListGroupItem>Request 2</MDBListGroupItem>
    </MDBListGroup>
  </div>
);

export default PendingRequestsSent;
