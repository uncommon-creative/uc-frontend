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
import { Footer } from './footer'
import { HomePage } from './pages/home'
import { LoginPage } from './pages/login'
import { SignupPage } from './pages/signup'
import { SignupConfirmPage } from './pages/signupConfirm'
import { ProfilePage } from './pages/profile'
import { CreateAlgoAccountPage } from './pages/createAlgoAccount'
import { CreateStatementOfWorkPage } from './pages/createStatementOfWork'
import { StatementOfWorkPage } from './pages/statementOfWork'
import { ArbitratorsPage } from './pages/arbitrators'
import { OptinAssetPage } from './pages/optinAssets'

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
              {isChecked ?
                (
                  <>
                    {isLogged ?
                      (
                        children
                      )
                      :
                      <Redirect to="/login" />
                    }
                  </>
                )
                :
                (
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
      <Header className=" sticky-top shadow" />
      <Container className="d-flex pt-3" style={{ minHeight: 'calc(100vh - 91px - 130px)' }}>
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
          <Route path="/arbitrators">
            <ArbitratorsPage />
          </Route>
          <PrivateRoute path="/optin-assets">
            <OptinAssetPage />
          </PrivateRoute>
          <PrivateRoute path="/profile">
            <ProfilePage />
          </PrivateRoute>
          <PrivateRoute path="/create-algo-account">
            <CreateAlgoAccountPage />
          </PrivateRoute>
          <PrivateRoute path="/create-statement-of-work">
            <CreateStatementOfWorkPage />
          </PrivateRoute>
          <PrivateRoute path="/statement-of-work/:code">
            <StatementOfWorkPage />
          </PrivateRoute>
          <PrivateRoute path="/" >
            <HomePage />
          </PrivateRoute>
        </Switch>
      </Container>
      <Footer className="mt-3" />
    </ConnectedRouter>
  );
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
