import React, { useEffect, useState } from 'react';
import apiClient from '../utils/axios';
import { MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';

const PendingRequestsReceived: React.FC = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await apiClient.get('/friendRequests/received', {
          params: { status: 'pending' },
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div>
      <h5>Pending Requests Received</h5>
            <MDBListGroup>
              {requests.map((request: any, index: number) => (
                <MDBListGroupItem
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={request.userId.profilePicture}
                  alt={`${request.userId.username}'s profile`}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <span style={{ marginRight: "10px" }}>{request.userId.username}</span>
                <span
                  style={{
                    backgroundColor: "#ffc107",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "15px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  Pending
                </span>
              </MDBListGroupItem>
              ))}
            </MDBListGroup>
    </div>
  );
};

export default PendingRequestsReceived;