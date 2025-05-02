import React from "react";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import { FaSearch, FaUserFriends, FaInbox, FaPaperPlane } from "react-icons/fa";
import { colorPalette } from "../utils/colorPalette";

const Sidebar: React.FC<{ setActiveSection: (section: string) => void }> = ({
  setActiveSection,
}) => {
  const itemStyle = {
    backgroundColor: "transparent",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px",
    padding: "10px 15px",
    borderRadius: "8px",
    transition: "background-color 0.3s ease",
  };

  const hoverStyle = {
    backgroundColor: colorPalette.primary,
    cursor: "pointer",
  };

  return (
    <div
      style={{
        width: "200px",
        backgroundColor: colorPalette.secondary,
        color: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
      }}
    >
      <MDBListGroup style={{ gap: "10px" }}>
        <MDBListGroupItem
          tag="button"
          action
          style={itemStyle}
          onClick={() => setActiveSection("search")}
          onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
          onMouseOut={(e) => Object.assign(e.currentTarget.style, itemStyle)}
        >
          <FaSearch /> Search
        </MDBListGroupItem>
        <MDBListGroupItem
          tag="button"
          action
          style={itemStyle}
          onClick={() => setActiveSection("friends")}
          onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
          onMouseOut={(e) => Object.assign(e.currentTarget.style, itemStyle)}
        >
          <FaUserFriends /> Friends
        </MDBListGroupItem>
        <MDBListGroupItem
          tag="button"
          action
          style={itemStyle}
          onClick={() => setActiveSection("received")}
          onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
          onMouseOut={(e) => Object.assign(e.currentTarget.style, itemStyle)}
        >
          <FaInbox /> Received
        </MDBListGroupItem>
        <MDBListGroupItem
          tag="button"
          action
          style={itemStyle}
          onClick={() => setActiveSection("sent")}
          onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
          onMouseOut={(e) => Object.assign(e.currentTarget.style, itemStyle)}
        >
          <FaPaperPlane /> Sent
        </MDBListGroupItem>
      </MDBListGroup>
    </div>
  );
};

export default Sidebar;