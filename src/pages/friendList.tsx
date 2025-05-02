import Sidebar from "../components/sideBarFriends";
import PendingRequestsSent from "../components/pendingRequestsSent";
import PendingRequestsReceived from "../components/pendingRequestsReceived";
import SearchUsers from "../components/searchUser";
import apiClient from "../utils/axios";

import React, { useState, useEffect } from "react";
import { IRequest } from "../utils/interfaces";

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
          <div>
            <h5>My Friends</h5>
            <ul>
              {friends.map((request: IRequest) => (
                <li
                  key={request._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
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
                  <span style={{ flex: 1 }}>{request.receiverId.username}</span>
                  <button
                    onClick={() => removeFriend(request._id)}
                    style={{
                      backgroundColor: "#ff4d4f",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
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
    <div
      style={{
        height: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "1200px",
          height: "100%",
          backgroundColor: "#f9f9f9",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: "0 0 35%",
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRight: "1px solid #e0e0e0",
          }}
        >
          <Sidebar setActiveSection={setActiveSection} />
        </div>
        <div
          style={{
            flex: "1",
            padding: "30px",
          }}
        >
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default FriendList;
