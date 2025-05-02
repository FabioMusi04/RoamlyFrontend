import React from 'react';
import { MDBInput } from 'mdb-react-ui-kit';

const SearchUsers: React.FC = () => (
  <div>
    <h5>Search Users</h5>
    <MDBInput label="Search by name" type="text" className="mb-3" />
  </div>
);

export default SearchUsers;
