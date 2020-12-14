import React from "react";
import { useSelector } from "react-redux";
import { Container, Button, Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, NavbarText } from 'reactstrap'
import * as AuthApi from './api/auth'
import { selectors as AuthSelectors } from './store/slices/auth'

export const Header = ({className}: any) => {

  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const isAuthenticated = useSelector(AuthSelectors.isAuthenticated);

  return (
    <Navbar className={className} color="primary" light expand="md">
      <NavbarBrand href="/">Uncommon Creative</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar>
          {isAuthenticated &&
            <>
              <NavItem>
                <NavLink href="/components/">Lista</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/reactstrap/reactstrap">Nuovo</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>Modifica</DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>Option 1</DropdownItem>
                  <DropdownItem>Option 2</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Reset</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </>
          }
        </Nav>
        <Nav navbar>

          {isAuthenticated ? (
            <NavbarText>Logout</NavbarText>
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