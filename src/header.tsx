import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container, Button, Navbar, NavbarBrand, NavbarToggler, Collapse,
  Nav, NavItem, NavLink, NavbarText,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap'
import { Link, useHistory, Redirect } from "react-router-dom";
import * as AuthApi from './api/auth'
import { selectors as AuthSelectors } from './store/slices/auth'
import { actions as AuthActions } from './store/slices/auth'

import { selectors as ProfileSelectors } from './store/slices/profile'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

export const Header = ({ className }: any) => {

  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const isAuthenticated = useSelector(AuthSelectors.isAuthenticated);
  const userAttributes = useSelector(ProfileSelectors.getProfile)
  const dispatch = useDispatch()
  
  return (
    <Navbar className={className} color="primary" light expand="md">
      <NavbarBrand href="/">Uncommon Creative</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>

        <Nav className="mr-auto" navbar>
          <NavItem>
            <NavLink tag={Link} to="/arbitrators">Arbitrators</NavLink>
          </NavItem>
        </Nav>
        <Nav navbar>

          {isAuthenticated ? (
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle data-cy='headerProfileToggler' nav caret>{userAttributes.given_name} {userAttributes.family_name}</DropdownToggle>
              <DropdownMenu right>
                <DropdownItem header>Email: {userAttributes.email}</DropdownItem>
                <DropdownItem header>AL: {userAttributes.public_key}</DropdownItem>
                <DropdownItem header>KUDOS: 12</DropdownItem>
                <DropdownItem divider />
                <DropdownItem tag={Link} to="/profile">Profile</DropdownItem>
                <DropdownItem divider />
                <DropdownItem data-cy='logout' onClick={() => {
                  dispatch(AuthActions.willLogoutUser());
                }}>Logout</DropdownItem>

              </DropdownMenu>
            </UncontrolledDropdown>
          ) : (
              <NavItem>
                <NavLink href="/login">Login</NavLink>
              </NavItem>
            )
          }
        </Nav>

      </Collapse>
    </Navbar>
  )
}