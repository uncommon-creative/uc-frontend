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

import * as AuthApi from './api/auth'
import { selectors as AuthSelectors } from './store/slices/auth'
import { useSelector } from "react-redux";
const PrivateRoute = ({ children, ...rest }: any) => {

  let history = useHistory();
  // const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  // const [waiting, setWaiting] = React.useState(true)
  const isLogged = useSelector(AuthSelectors.isLogged)
  const isChecked = useSelector(AuthSelectors.isChecked)

  // React.useEffect(() => {
  //   AuthApi.isAuthenticated().then((result) => {
  //     if (result) {
  //       console.log("isAuthenticated true?: ", result)
  //       setWaiting(false);
  //       setIsLoggedIn(true);
  //     } else {
  //       console.log("isAuthenticated: ", result)
  //       setWaiting(false);
  //       setIsLoggedIn(false);
  //       history.push('/login')
  //     }
  //   })
  //     .catch((error) => {
  //       setWaiting(false);
  //       setIsLoggedIn(false)
  //     })
  //   return () => { }
  // }, [])

  // React.useEffect(() => {

  //   if(isLogged){
  //     console.log('inside isLogged = true');
  //     setWaiting(false);
  //     setIsLoggedIn(true);
  //   }else{
  //     setWaiting(false);
  //     setIsLoggedIn(false);
  //   }
  //   return () => {}
  // }, [isLogged])

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
            // isLoggedIn == "LOGGED" ?
            // <Component {...props} />
            // children
            // : (
            // <Redirect to="/login" />
            // <LoginPage />
            // )
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
