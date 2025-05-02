import React from "react";

import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
} from "mdb-react-ui-kit";
import {
  FaMapMarkerAlt,
  FaUser,
  FaSignOutAlt,
  FaUserFriends,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { colorPalette } from "../utils/colorPalette";
import { useAuth } from "./authProvider";

const NavbarMenu: React.FC = () => {
  const userInfo = useAuth();

  const isLoggedIn = userInfo.token !== null;

  return (
    <MDBNavbar
      style={{ backgroundColor: colorPalette.primary }}
      dark
      expand="md"
    >
      <MDBNavbarBrand className="mx-3">
        <strong style={{ color: colorPalette.accent }}>Roamly</strong>
      </MDBNavbarBrand>

      <MDBNavbarNav className="d-flex justify-content-end">
        {isLoggedIn ? (
          <>
            <MDBNavbarItem className="mx-3">
              <MDBNavbarLink href="/">
                <FaMapMarkerAlt /> Pin Location
              </MDBNavbarLink>
            </MDBNavbarItem>

            <MDBNavbarItem className="mx-3">
              <MDBNavbarLink href="/profile">
                <FaUser /> Profile
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem className="mx-3">
              <MDBNavbarLink href="/friendlist">
                <FaUserFriends /> Friendlist
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem className="mx-3">
              <MDBNavbarLink onClick={() => userInfo.logout()} href="/login">
                <FaSignOutAlt /> Logout
              </MDBNavbarLink>
            </MDBNavbarItem>
          </>
        ) : (
          <>
            <MDBNavbarItem className="mx-3">
              <MDBNavbarLink href="/register">
                <FaUserPlus /> Register
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem className="mx-3">
              <MDBNavbarLink href="/login">
                <FaSignInAlt /> Login
              </MDBNavbarLink>
            </MDBNavbarItem>
          </>
        )}
      </MDBNavbarNav>
    </MDBNavbar>
  );
};

export default NavbarMenu;
