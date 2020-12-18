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
import { history } from './store'
import { ConnectedRouter } from 'connected-react-router'

import { Header } from './header'
import { HomePage } from './pages/home'
import { LoginPage } from './pages/login'
import { SignupPage } from './pages/signup'
import { SignupConfirmPage } from './pages/signupConfirm'
import { CreateAlgoAccountPage } from './pages/createAlgoAccount'

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
    <ConnectedRouter history={history}>
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
          <PrivateRoute path="/create-algo-account">
            <CreateAlgoAccountPage />
          </PrivateRoute>
          <PrivateRoute path="/" >
            <HomePage />
          </PrivateRoute>
        </Switch>
      </Container>
    </ConnectedRouter>
  );
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
