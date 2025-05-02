import React from "react";
import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import { FaSearch, FaUserFriends, FaInbox, FaPaperPlane } from "react-icons/fa";
import { colorPalette } from "../utils/colorPalette";

const Sidebar: React.FC<{ setActiveSection: (section: string) => void }> = ({
  setActiveSection,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        left: "20px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "180px",
        backgroundColor: colorPalette.secondary,
        color: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MDBListGroup>
        <MDBListGroupItem
          tag="button"
          action
          style={{ backgroundColor: "transparent", color: "white" }}
          onClick={() => setActiveSection("search")}
        >
          <FaSearch /> Search
        </MDBListGroupItem>
        <MDBListGroupItem
          tag="button"
          action
          style={{ backgroundColor: "transparent", color: "white" }}
          onClick={() => setActiveSection("friends")}
        >
          <FaUserFriends /> Friends
        </MDBListGroupItem>
        <MDBListGroupItem
          tag="button"
          action
          style={{ backgroundColor: "transparent", color: "white" }}
          onClick={() => setActiveSection("received")}
        >
          <FaInbox /> Received
        </MDBListGroupItem>
        <MDBListGroupItem
          tag="button"
          action
          style={{ backgroundColor: "transparent", color: "white" }}
          onClick={() => setActiveSection("sent")}
        >
          <FaPaperPlane /> Sent
        </MDBListGroupItem>
      </MDBListGroup>
    </div>
  );
};

export default Sidebar;