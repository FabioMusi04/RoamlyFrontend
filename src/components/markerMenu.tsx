import React from "react";

import {
  MDBContainer,
  MDBTextArea,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
} from "mdb-react-ui-kit";
import { DescriptionMenuProps } from "../utils/interfaces";
import { FaTimes } from "react-icons/fa";
import { colorPalette } from "../utils/colorPalette";

const DescriptionMenu: React.FC<DescriptionMenuProps> = ({
  description,
  onDescriptionChange,
  onSave,
  onCancel,
  onClose,
}) => (
  <MDBContainer
    className="description-menu"
    style={{
      position: "fixed",
      top: 0,
      right: 0,
      height: "100%",
      width: "300px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
      zIndex: 1000,
      overflowY: "auto",
    }}
  >
    <MDBCard style={{ border: "none", height: "100%", display: "flex", flexDirection: "column" }}>
      <MDBCardBody style={{ flex: 1 }}>
        <MDBBtn
          color="danger"
          aria-label="Close"
          title="Close"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "0.6rem 0.6rem",
            fontSize: "1rem",
            borderRadius: "100%",
            boxShadow: "0 2px 6px rgba(158, 158, 158, 0.2)",
            transition: "background-color 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colorPalette.secondary,
            color: "#fff",
          }}
          onClick={onClose}
        >
          <FaTimes />
        </MDBBtn>
        <MDBCardTitle style={{ color: colorPalette.primary }}>Add Description</MDBCardTitle>
        <MDBTextArea
          value={description}
          onChange={onDescriptionChange}
          rows={5}
          className="mb-3"
          style={{
            borderColor: colorPalette.secondary,
          }}
        />
      </MDBCardBody>
      <div
        style={{
          padding: "1rem",
          borderTop: `1px solid ${colorPalette.secondary}`,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <MDBBtn
          onClick={onSave}
          color="primary"
          className="me-2"
          style={{
            backgroundColor: colorPalette.primary,
            borderColor: colorPalette.primary,
          }}
        >
          Save
        </MDBBtn>
        <MDBBtn
          onClick={onCancel}
          color="danger"
          style={{
            backgroundColor: colorPalette.accent,
            borderColor: colorPalette.accent,
          }}
        >
          Cancel Marker
        </MDBBtn>
      </div>
    </MDBCard>
  </MDBContainer>
);

export default DescriptionMenu;
