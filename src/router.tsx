import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory
} from "react-router-dom";
import { Header } from "./header";
import { Container } from "reactstrap";

import { HomePage } from './pages/home'
import { LoginPage } from './pages/login'
import { SignupPage } from './pages/signup'
import { SignupConfirmPage } from './pages/signupConfirm'
import { ForgotPasswordPage } from './pages/ForgotPassword'

import * as AuthApi from './api/auth'
import { selectors as AuthSelectors } from './store/slices/auth'
import { useSelector } from "react-redux";
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
          <Route path="/forgot-password">
            <ForgotPasswordPage />
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
