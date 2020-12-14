export const configuration: any = {
  dev: {
    Auth: {

      // REQUIRED - Amazon Cognito Region
      region: 'eu-west-1',

      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: 'eu-west-1_RsYNtgHZh',

      userPoolWebClientId: '1e2ft91i9k0vi7kkrv6o73j7df',

      // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: false

    }
  }
}