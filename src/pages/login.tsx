import apiClient from "../utils/axios";

import { useState } from "react";
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBIcon
} from "mdb-react-ui-kit";
import { useAuth } from "../components/authProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setToken } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });

      if(response.status >= 200 && response.status < 300) {
        const { token, user } = response.data;

        setToken(token);
        setUser(user);

        alert("Login successful!");

        return window.location.href = "/";
      }

      throw new Error("Login failed");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials. Please try again.");
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

        <h4 className="text-center mb-4">Login</h4>
        <MDBInput
          wrapperClass="mb-4"
          label="Email address"
          id="form1"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <MDBInput
          wrapperClass="mb-4"
          label="Password"
          id="form2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="d-flex justify-content-between mx-3 mb-4">
          <a href="!#">Forgot password?</a>
        </div>

        <MDBBtn className="mb-4" onClick={handleLogin}>
          Sign in
        </MDBBtn>

        <div className="text-center">
          <p>
            Not a member? <a href="/register">Register</a>
          </p>
          <p>or sign in with:</p>

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

export default Login;
