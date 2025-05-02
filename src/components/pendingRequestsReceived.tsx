import React, { useEffect, useState } from 'react';
import apiClient from '../utils/axios';
import { MDBListGroup, MDBListGroupItem, MDBBtn } from 'mdb-react-ui-kit';
import { IRequest } from '../utils/interfaces';

const PendingRequestsReceived: React.FC = () => {
  const [requests, setRequests] = useState<IRequest[]>([]);

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

  const handleAccept = async (requestId: string) => {
    try {
      await apiClient.put(`/friendRequests/${requestId}`, {
        status: 'accepted',
      });
      alert('Friend request accepted!');

      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept friend request. Please try again.');
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await apiClient.put(`/friendRequests/${requestId}`, {
        status: 'rejected',
      });
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
      alert('Friend request declined!');
    } catch (error) {
      console.error('Error declining request:', error);
      alert('Failed to decline friend request. Please try again.');
    }
  };

  return (
    <div>
      <h5>Pending Requests Received</h5>
      <MDBListGroup>
        {requests.map((request: IRequest, index: number) => (
          <MDBListGroupItem
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={request.userId.profilePicture}
                alt={`${request.userId.username}'s profile`}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  marginRight: '10px',
                }}
              />
              <span style={{ marginRight: '10px' }}>{request.userId.username}</span>
              <span
                style={{
                  backgroundColor: '#ffc107',
                  color: '#fff',
                  padding: '5px 10px',
                  borderRadius: '15px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                Pending
              </span>
            </div>
            <div>
              <MDBBtn
                size="sm"
                color="success"
                style={{ marginRight: '5px' }}
                onClick={() => handleAccept(request._id)}
              >
                Accept
              </MDBBtn>
              <MDBBtn
                size="sm"
                color="danger"
                onClick={() => handleDecline(request._id)}
              >
                Decline
              </MDBBtn>
            </div>
          </MDBListGroupItem>
        ))}
      </MDBListGroup>
    </div>
  );
};

export default PendingRequestsReceived;