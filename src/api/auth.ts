import Amplify, { Auth } from 'aws-amplify';

export const configure = () => {

  Amplify.configure({
    Auth: {

      // REQUIRED - Amazon Cognito Region
      region: 'eu-west-1',

      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: 'eu-west-1_oTpx48dzK',

      userPoolWebClientId: '3q5cqr56mn53eieb2i7l5vokf',

      // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: false

    }
  });

}

export const isAuthenticated = async () => {
  try{
    const user = await Auth.currentAuthenticatedUser();
    return true;
  }catch(error){
    return false;
  }

}