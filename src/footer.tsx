import {
  Container, Button, Navbar, NavbarBrand, NavbarToggler, Collapse,
  Nav, NavItem, NavLink, NavbarText,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap'

export const Footer = ({ className }: any) => {

  return (
    <div >
      <Navbar className={className} color="white" light expand="md">
        <Nav navbar className="mx-auto">
          <NavItem className="mx-3">
            <a target="_blank" className="text-muted" href="https://uncommon-creative.net/">Home</a>
          </NavItem>
          <NavItem className="mx-3">
            <a target="_blank" className="text-muted" href="https://uncommon-creative.net/contact-us/">Contact Us</a>
          </NavItem>
          <NavItem className="mx-3">
            <a target="_blank" className="text-muted" href="https://s3.eu-central-1.amazonaws.com/files.lexdo.it/wrSle669i1W6Q5TTvS0BngMfpjPnLYwlxfdKLkom59/cookie.pdf">Cookie Policy</a>
          </NavItem>
          <NavItem className="mx-3">
            <a target="_blank" className="text-muted" href="https://s3.eu-central-1.amazonaws.com/files.lexdo.it/qepAQNKrXdw8h1uUOEgoMhm4GUIlTMU9N5L0TCyOlh/informativa-privacy.pdf">Privacy Policy</a>
          </NavItem>
        </Nav>
      </Navbar>
      <div className="text-muted text-center">
        <small>Uncommon Digital SRL © All rights reserved.</small>
      </div>
    </div>
  )
}