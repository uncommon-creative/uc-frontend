import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { Header } from "./header";
import { Container } from "reactstrap";

import { Home } from './pages/home'
import { LoginPage } from './pages/login'
import { SignupPage } from './pages/signup'
import { SignupConfirmPage } from './pages/signupConfirm'

import * as AuthApi from './api/auth'

const PrivateRoute = ({ children: Component, ...rest }: any) => {

  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  React.useEffect(() => {
    AuthApi.isAuthenticated().then((result) => {
      if (result) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    })
      .catch((error) => {
        setIsLoggedIn(false)
      })
    return () => { }
  }, [])

  return (
    <Route
      {...rest}
      render={props => {
        return (
          isLoggedIn ? (
            <Component {...props} />
          ) : (
              <Redirect to="/login" />
            )
        )
      }
      }
    />
  )
}

export const AppRouter = () => {
  return (
    <Router>
      <Header className="mb-3" />
      <Container fluid>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/signup/confirm/:code">
            <SignupConfirmPage />
          </Route>          
          <Route path="/signup/confirm/">
            <SignupConfirmPage />
          </Route>          
          <Route path="/signup">
            <SignupPage />
          </Route>          
          <Route path="/users">
            <Users />
          </Route>
          <PrivateRoute path="/">
            <Home />
          </PrivateRoute>
        </Switch>
      </Container>
    </Router>
  );
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
