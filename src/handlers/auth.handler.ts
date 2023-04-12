import { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';

export const authorizer: APIGatewayTokenAuthorizerHandler = async (event) => {
  console.log(event);
  const effect = event.authorizationToken === process.env.token ? 'Allow' : 'Deny';
  return {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: '*',
        },
      ],
    },
  };
};
