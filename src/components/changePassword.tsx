import React from "react";
import { MDBCard, MDBCardBody, MDBBtn, MDBIcon, MDBInput } from "mdb-react-ui-kit";
import { FaKey } from "react-icons/fa";
import { colorPalette } from "../utils/colorPalette";

export const ChangePassword: React.FC<{
  passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}> = ({
  passwordData,
  handlePasswordChange,
  handlePasswordSubmit,
  onClose,
}) => {
  return (
    <MDBCard>
      <MDBCardBody>
        <div className="d-flex justify-content-between align-items-center">
          <h3
            className="text-center mb-4"
            style={{ color: colorPalette.secondary }}
          >
            <FaKey className="me-2" />
            Change Password
          </h3>
          <MDBBtn
            color="link"
            className="rounded-circle p-2"
            onClick={onClose}
            style={{
              color: "white",
              backgroundColor: "rgba(158, 0, 0, 0.8)",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
          >
            <MDBIcon fas icon="times" />
          </MDBBtn>
        </div>
        <form onSubmit={handlePasswordSubmit}>
          <MDBInput
            label="Current Password"
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            className="mb-3"
          />
          <MDBInput
            label="New Password"
            id="newPassword"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="mb-3"
          />
          <MDBInput
            label="Confirm New Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            className="mb-3"
          />
          <MDBBtn
            type="submit"
            style={{
              backgroundColor: colorPalette.secondary,
              borderColor: colorPalette.secondary,
            }}
            block
          >
            Change Password
          </MDBBtn>
        </form>
      </MDBCardBody>
    </MDBCard>
  );
};