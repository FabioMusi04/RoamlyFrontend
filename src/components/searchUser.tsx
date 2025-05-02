import React, { useState } from 'react';
import apiClient from '../utils/axios';
import { MDBInput } from 'mdb-react-ui-kit';

const SearchUsers: React.FC = () => {
  const [username, setUsername] = useState('');
  const [results, setResults] = useState<{ profilePicture: string; username: string }[]>([]);

  const handleSearch = async () => {
    try {
      const response = await apiClient.get('/users/search', {
        params: { username },
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  return (
    <div>
      <h5>Search Users</h5>
      <MDBInput
        label="Search by name"
        type="text"
        className="mb-3"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={() => {
          if (username.trim().length >= 2) {
            handleSearch();
          }
        }}
      />
      {results.length === 0 ? (
        <p>0 users matched</p>
      ) : (
        <ul>
          {results.map((user, index) => (
            <li key={index}>
              <img
                src={user.profilePicture}
                alt={`${user.username}'s profile`}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  marginRight: '10px',
                }}
              />
              {user.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchUsers;
