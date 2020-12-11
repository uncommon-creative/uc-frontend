import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

import { Home } from './pages/Home'

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
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <PrivateRoute path="/">
            <Home />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  );
}

function About() {
  return <h2>About</h2>;
}

function Login() {
  return <h2>Login</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
