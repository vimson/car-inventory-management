import { APIGatewayProxyResult } from 'aws-lambda';

export const parseJson = (json: string): any => {
  try {
    return JSON.parse(json);
  } catch (error: unknown) {
    return {};
  }
};

export const buildResponse = (
  statusCode: number,
  body: Record<string, any>
): APIGatewayProxyResult => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
  };
};
