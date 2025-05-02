import apiClient from "../utils/axios";

import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";
import { FaUserEdit, FaKey } from "react-icons/fa";
import { colorPalette } from "../utils/colorPalette";
import { ChangePassword } from "../components/changePassword";

const Profile: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    profilePicture: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get("/users/me");
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.put("/users/me", formData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    try {
      await apiClient.put("/users/me/password", {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert("Password updated successfully!");
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Please try again.");
    }
  };

  return (
    <MDBContainer className="py-5">
      <MDBRow className="justify-content-center">
        <MDBCol md="6" lg="5">
          <MDBCard>
            <MDBCardBody>
              <h3
                className="text-center mb-4"
                style={{ color: colorPalette.primary }}
              >
                <FaUserEdit className="me-2" />
                Edit Profile
              </h3>
              <div className="d-flex justify-content-center text-center mb-4">
                {formData.profilePicture ? (
                  <img
                    src={formData.profilePicture}
                    alt="Profile"
                    className="rounded-circle"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                    style={{ width: "100px", height: "100px" }}
                  >
                    <FaUserEdit size={40} color={colorPalette.primary} />
                  </div>
                )}
              </div>
              <form onSubmit={handleProfileSubmit}>
                <MDBInput
                  label="Username"
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="mb-3"
                />
                <MDBInput
                  label="Email (Immutable)"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="mb-3"
                />
                <MDBInput
                  label="First Name"
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="mb-3"
                />
                <MDBInput
                  label="Last Name"
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="mb-3"
                />
                <MDBBtn
                  type="submit"
                  style={{
                    backgroundColor: colorPalette.primary,
                    borderColor: colorPalette.primary,
                  }}
                  block
                >
                  Save Changes
                </MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="6" lg="5" className="mt-4 mt-lg-0">
          {!showChangePassword ? (
            <MDBBtn
              onClick={() => setShowChangePassword(true)}
              style={{
                backgroundColor: colorPalette.secondary,
                borderColor: colorPalette.secondary,
              }}
              block
            >
              <FaKey className="me-2" />
              Change Password
            </MDBBtn>
          ) : (
            <ChangePassword
              passwordData={passwordData}
              handlePasswordChange={handlePasswordChange}
              handlePasswordSubmit={handlePasswordSubmit}
              onClose={() => setShowChangePassword(false)}
            />
          )}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Profile;