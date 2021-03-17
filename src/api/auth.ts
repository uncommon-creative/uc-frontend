import userEvent from '@testing-library/user-event';
import Amplify, { Auth } from 'aws-amplify';
import { env } from 'process';
import { configuration } from '../config'

export const configure = () => {
  const stage: string = process.env.REACT_APP_STAGE != undefined ? process.env.REACT_APP_STAGE : "dev"
  console.log("configure process.env.REACT_APP_STAGE:", process.env.REACT_APP_STAGE)
  console.log("configure stage:", stage)
  console.log("configure configuration[stage]:", configuration[stage])
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
export const logout = async () => {
  try {
    await Auth.signOut();
    return true
  } catch (error) {
    console.log('error signing out: ', error);
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
      }
    })
    console.log('with signup result: ', user)
  } catch (error) {
    console.log('with signup error: ', error)
    throw error;
  }
}

export const forgotPasswordRequest = async (email: any) => {
  try {
    const request = await Auth.forgotPassword(email)
  } catch (error) {
    console.log('with forgotPassword error: ', error)
    throw error;
  }
}

export const forgotPasswordConfirm = async (email: any, code: any, password: any) => {
  try {
    const confirm = await Auth.forgotPasswordSubmit(email, code, password)
  } catch (error) {
    console.log('with forgotPasswordSubmit error: ', error)
    throw error;
  }
}

export const resendSignuUpCode = async (email: any) => {
  try {
    const resend = await Auth.resendSignUp(email)
  } catch (error) {
    console.log('with resendSignUp error: ', error)
    throw error;
  }
}