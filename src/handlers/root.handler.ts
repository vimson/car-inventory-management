import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

export const rootHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Welcome to Car dealers API - Contact team@help.com to get started',
    }),
  };
};
