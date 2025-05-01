import { useState } from "react";
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await apiClient.post("/auth/register", {
        username,
        email,
        password,
        firstName,
        lastName,
      });

      if (response.status >= 200 && response.status < 300) {
        return navigate("/login");
      }

      throw new Error("Registration failed");

    } catch (error) {
      console.error("Registration failed:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <MDBContainer
        className="p-3 my-5 d-flex flex-column"
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <h4 className="text-center mb-4">Register</h4>

        <MDBInput
          wrapperClass="mb-4"
          label="Username"
          id="registerUsername"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <MDBInput
          wrapperClass="mb-4"
          label="First Name"
          id="registerFirstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <MDBInput
          wrapperClass="mb-4"
          label="Last Name"
          id="registerLastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <MDBInput
          wrapperClass="mb-4"
          label="Email address"
          id="registerEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <MDBInput
          wrapperClass="mb-4"
          label="Password"
          id="registerPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <MDBBtn className="mb-4" onClick={handleRegister}>
          Sign up
        </MDBBtn>

        <div className="text-center">
          <p>
            Already a member? <a href="/login">Login</a>
          </p>
          <p>or sign up with:</p>

          <div
            className="d-flex justify-content-between mx-auto"
            style={{ width: "40%" }}
          >
            <MDBBtn
              tag="a"
              color="none"
              className="m-1"
              style={{ color: "#1266f1" }}
            >
              <MDBIcon fab icon="google" size="sm" />
            </MDBBtn>
          </div>
        </div>
      </MDBContainer>
    </div>
  );
};

export default Register;
