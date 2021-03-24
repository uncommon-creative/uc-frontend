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

    },
    'aws_appsync_graphqlEndpoint': 'https://na5y3uyopje3rbqfvb6o6kscli.appsync-api.eu-west-1.amazonaws.com/graphql',
    'aws_appsync_region': 'eu-west-1',
    'aws_appsync_authenticationType': 'AMAZON_COGNITO_USER_POOLS',
    'arbitrators_list_webhook': 'https://dbyc3f5xvj.execute-api.eu-west-1.amazonaws.com/dev/arbitrators',
    'host': 'https://app.uncommon-demo.com',
    'algorand_net': 'TestNet',
    'algorand_poll_account_amount_time': 120000,
    'legal_document_template_key': 'vtl_templates/legal_sow_doc.vtl',
    'works_agreement_key': 'works_agreement.pdf',
    'specs_document_key': 'specs_document',
    'uc_backup_public_key': '3IB3QQKFQACYNQDD2G2CVV7I7ZZDY5ZLFW7SOJQVQG6I4CPCOVE2UU35OA'
  },
  demo: {
    Auth: {

      // REQUIRED - Amazon Cognito Region
      region: 'eu-west-1',

      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: 'eu-west-1_BUjZx7mY6',

      userPoolWebClientId: '3g1f1q1g79aimflohv2ub8jf2q',

      // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: false

    },
    'aws_appsync_graphqlEndpoint': 'https://ffcdzwrsorfytmiktc3id4jw74.appsync-api.eu-west-1.amazonaws.com/graphql',
    'aws_appsync_region': 'eu-west-1',
    'aws_appsync_authenticationType': 'AMAZON_COGNITO_USER_POOLS',
    'arbitrators_list_webhook': 'https://g4uq7oz57f.execute-api.eu-west-1.amazonaws.com/demo/arbitrators',
    'host': 'https://demo.uncommon-demo.com',
    'algorand_net': 'TestNet',
    'algorand_poll_account_amount_time': 120000,
    'legal_document_template_key': 'vtl_templates/legal_sow_doc.vtl',
    'works_agreement_key': 'works_agreement.pdf',
    'specs_document_key': 'specs_document',
    'uc_backup_public_key': '3IB3QQKFQACYNQDD2G2CVV7I7ZZDY5ZLFW7SOJQVQG6I4CPCOVE2UU35OA'
  }
}