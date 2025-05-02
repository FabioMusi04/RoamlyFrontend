import Sidebar from "../components/sideBarFriends";
import PendingRequestsSent from "../components/pendingRequestsSent";
import PendingRequestsReceived from "../components/pendingRequestsReceived";
import SearchUsers from "../components/searchUser";
import apiClient from "../utils/axios";

import React, { useState, useEffect } from "react";
import { IRequest } from "../utils/interfaces";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBListGroup,
  MDBListGroupItem,
  MDBBtn,
  MDBIcon,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardFooter,
} from "mdb-react-ui-kit";

const FriendList: React.FC = () => {
  const [activeSection, setActiveSection] = useState("search");
  const [friends, setFriends] = useState<IRequest[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await apiClient.get("/friendRequests/me", {
          params: { status: "accepted" },
        });

        setFriends(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  const removeFriend = async (friendId: string) => {
    try {
      await apiClient.delete(`/friendRequests/${friendId}`);
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend._id !== friendId)
      );
      alert("Friend removed successfully!");
    } catch (error) {
      console.error("Error removing friend:", error);
      alert("Failed to remove friend. Please try again.");
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "search":
        return <SearchUsers />;
      case "friends":
        return (
          <MDBCard className="mt-4">
            <MDBCardHeader className="text-center">
              <h5>Friends List</h5>
            </MDBCardHeader>
            <MDBCardBody>
              <MDBListGroup>
                {friends.map((request: IRequest) => (
                  <MDBListGroupItem
                    key={request._id}
                    className="d-flex align-items-center mb-2"
                  >
                    <img
                      src={request.receiverId.profilePicture}
                      alt={`${request.receiverId.username}'s profile`}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    />
                    <span className="flex-grow-1">
                      {request.receiverId.username}
                    </span>
                    <MDBBtn
                      color="link"
                      onClick={() => removeFriend(request._id)}
                      className="p-0"
                    >
                      <MDBIcon
                        icon="trash-alt"
                        style={{
                          color: "#ff4d4f",
                          fontSize: "18px",
                        }}
                      />
                    </MDBBtn>
                  </MDBListGroupItem>
                ))}
              </MDBListGroup>
            </MDBCardBody>
            <MDBCardFooter className="text-center">
              <p className="text-muted">You have {friends.length} friends.</p>
            </MDBCardFooter>
          </MDBCard>
        );
      case "received":
        return <PendingRequestsReceived />;
      case "sent":
        return <PendingRequestsSent />;
      default:
        return null;
    }
  };

  return (
    <MDBContainer fluid className="py-5">
      <MDBRow className="justify-content-center">
        <MDBCol md="3" lg="2" className="mb-4">
          <Sidebar setActiveSection={setActiveSection} />
        </MDBCol>
        <MDBCol md="9" lg="8">
          {renderSection()}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default FriendList;
