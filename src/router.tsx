import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";

import { Header } from "./header"
import { HomePage } from './pages/home'
import { LoginPage } from './pages/login'
import { SignupPage } from './pages/signup'
import { SignupConfirmPage } from './pages/signupConfirm'

import { selectors as AuthSelectors } from './store/slices/auth'
const PrivateRoute = ({ children, ...rest }: any) => {

  let history = useHistory();
  const isLogged = useSelector(AuthSelectors.isLogged)
  const isChecked = useSelector(AuthSelectors.isChecked)

  return (
    <Route
      {...rest}
      render={
        props => {
          console.log("isLogged: ", isLogged)
          return (
            <>
              {isChecked ? (
                <>
                  {isLogged ? (
                    children

                  ) : (
                      <Redirect to="/login" />
                    )}
                </>
              ) : (
                  <p>waiting</p>
                )
              }

            </>
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
          <PrivateRoute path="/users">
            <Users />
          </PrivateRoute>
          <PrivateRoute path="/" >
            <HomePage />
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
