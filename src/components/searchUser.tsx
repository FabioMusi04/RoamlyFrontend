import React, { useState } from "react";
import apiClient from "../utils/axios";
import {
  MDBInput,
  MDBBtn,
  MDBListGroup,
  MDBListGroupItem,
  MDBIcon,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardFooter,
} from "mdb-react-ui-kit";

const SearchUsers: React.FC = () => {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState<
    { profilePicture: string; username: string; _id: string }[]
  >([]);

  const handleSearch = async () => {
    try {
      const response = await apiClient.get("/users/search", {
        params: { username },
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleAddFriend = async (id: string) => {
    try {
      await apiClient.post("/friendRequests", {
        receiverId: id,
      });

      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request. Please try again.");
    }
  };

  return (
    <MDBCard className="mt-4">
      <MDBCardHeader className="text-center">
        <h5>Search Users</h5>
      </MDBCardHeader>
      <MDBCardBody>
        <MDBInput
          label="Search by name"
          type="text"
          className="mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        {results.length === 0 ? (
          <p className="text-center text-muted">0 users matched</p>
        ) : (
          <MDBListGroup>
            {results.map((user) => (
              <MDBListGroupItem
                key={user._id}
                className="d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center">
                  <img
                    src={user.profilePicture}
                    alt={`${user.username}'s profile`}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  <span>{user.username}</span>
                </div>
                <MDBBtn
                  size="sm"
                  color="primary"
                  onClick={async () => await handleAddFriend(user._id)}
                >
                  <MDBIcon fas icon="user-plus" className="me-2" />
                  Add Friend
                </MDBBtn>
              </MDBListGroupItem>
            ))}
          </MDBListGroup>
        )}
      </MDBCardBody>
      <MDBCardFooter className="text-center text-muted">
        Search and connect with friends!
      </MDBCardFooter>
    </MDBCard>
  );
};

export default SearchUsers;
