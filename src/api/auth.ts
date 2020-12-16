import userEvent from '@testing-library/user-event';
import Amplify, { Auth } from 'aws-amplify';
import { env } from 'process';
import { configuration } from '../config'

export const configure = () => {

  const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"
  Amplify.configure(configuration[stage]);

}

export const isAuthenticated = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return true;
  } catch (error) {
    return false;
  }

}

export const getAuthenticatedUser = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
    return user;
  } catch (error) {
    console.log('in error with getAuthenticatedUser')
  }
}

export const confirm = async (username: any, code: any) => {
  try {
    const confirm = await Auth.confirmSignUp(username, code);
    console.log('with result: ', confirm)
    return confirm
  } catch (error) {
    console.log('with error: ', error)
    throw error;
  }
}

export const login = async (username: any, password: any) => {

  try {
    const user = await Auth.signIn(username, password);
    console.log('with result: ', user)
    return user
  } catch (error) {
    console.log('with error: ', error)
    throw error;
  }
}

export const signup = async (email: any, password: any, given_name: any, family_name: any) => {
  try {
    const user = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        given_name,
        family_name
        // 'custom:favorite_flavor': 'Cookie Dough'  // custom attribute, not standard
      }
    })
    console.log('with signup result: ', user)
  } catch (error) {
    console.log('with signup error: ', error)
    throw error;
  }
}