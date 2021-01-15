import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container, Button, Navbar, NavbarBrand, NavbarToggler, Collapse,
  Nav, NavItem, NavLink, NavbarText,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap'
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
            <NavLink href="/arbitrators">Arbitrators</NavLink>
          </NavItem>
        </Nav>
        <Nav navbar>

          {isAuthenticated ? (
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>{userAttributes.given_name} {userAttributes.family_name}</DropdownToggle>
              <DropdownMenu right>
                <DropdownItem header>AL: {userAttributes.public_key}</DropdownItem>
                <DropdownItem header>KUDOS: 12</DropdownItem>
                <DropdownItem divider />
                <DropdownItem tag="a" href="/profile">Profile</DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={() => {
                  dispatch(AuthActions.willLogoutUser());
                }}>Logout</DropdownItem>

              </DropdownMenu>
            </UncontrolledDropdown>
          ) : (
              <NavItem>
                <NavLink href="/login/">Login</NavLink>
              </NavItem>
            )
          }
        </Nav>

      </Collapse>
    </Navbar>
  )
}