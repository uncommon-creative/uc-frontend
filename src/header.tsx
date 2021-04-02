import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container, Button, Navbar, NavbarBrand, NavbarToggler, Collapse,
  Nav, NavItem, NavLink, NavbarText,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link, useHistory, Redirect } from "react-router-dom";

import * as AuthApi from './api/auth'
import { selectors as AuthSelectors } from './store/slices/auth'
import { actions as AuthActions } from './store/slices/auth'
import { selectors as ProfileSelectors, actions as ProfileActions } from './store/slices/profile'
import { LinkBlockExplorer } from './components/common/LinkBlockExplorer'

import UCLogo from './images/UC.webp'

export const Header = ({ className }: any) => {

  let history = useHistory();
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const isAuthenticated = useSelector(AuthSelectors.isAuthenticated);
  const userAttributes = useSelector(ProfileSelectors.getProfile)
  const user = useSelector(AuthSelectors.getUser)
  const dispatch = useDispatch()

  return (
    <Navbar className={className} color="secondary" light expand="md" style={{ height: '130px' }}>
      <NavbarBrand href="/" className="px-4">
        <img src={UCLogo} height="100" alt="Uncommon Creative Logo" />
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>

        <Nav className="mr-auto" navbar>

        </Nav>
        <Nav navbar>
          <NavItem>
            <NavLink tag={Link} to="/arbitrators">Arbitrators</NavLink>
          </NavItem>

          {isAuthenticated ? (
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle data-cy='headerProfileToggler' nav caret>{userAttributes.given_name} {userAttributes.family_name}</DropdownToggle>
              <DropdownMenu right>
                <DropdownItem header>Email: {userAttributes.email}</DropdownItem>
                {/* <DropdownItem header>ALGO: {userAttributes.public_key}</DropdownItem> */}
                <DropdownItem header>
                  {userAttributes.public_key && <LinkBlockExplorer title={'ALGO: ' + userAttributes.public_key.substring(0, 6) + '...'} type="address" id={userAttributes.public_key} />}
                </DropdownItem>
                <DropdownItem header>KUDOS: 12</DropdownItem>
                <DropdownItem divider />
                <DropdownItem data-cy='profile' onClick={() => {
                  dispatch(ProfileActions.willGoToProfile({ user: user.username, history: history }));
                }}>Profile</DropdownItem>
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