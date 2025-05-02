import Sidebar from "../components/sideBarFriends";
import PendingRequestsSent from "../components/pendingRequestsSent";
import PendingRequestsReceived from "../components/pendingRequestsReceived";
import SearchUsers from "../components/searchUser";
import apiClient from "../utils/axios";

import React, { useState, useEffect } from "react";

const FriendList: React.FC = () => {
  const [activeSection, setActiveSection] = useState("search");
  const [friends, setFriends] = useState<
    { id: number; username: string; profilePicture: string }[]
  >([]);

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

  const renderSection = () => {
    switch (activeSection) {
      case "search":
        return <SearchUsers />;
      case "friends":
        return (
          <div>
            <h5>My Friends</h5>
            <ul>
              {friends.map((friend) => (
                <li
                  key={friend.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <img
                    src={friend.profilePicture}
                    alt={`${friend.username}'s profile`}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  <span>{friend.username}</span>
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
      <Sidebar setActiveSection={setActiveSection} />
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          padding: "30px",
          backgroundColor: "#f9f9f9",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        {renderSection()}
      </div>
    </div>
  );
};

export default FriendList;
