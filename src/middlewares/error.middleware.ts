import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ZodError } from 'zod';

type PromiseHandler<TEvent = any, TResult = any> = (
  event: TEvent,
  context?: Context
) => Promise<TResult>;

class GenericError extends Error {
  statusCode: number;
  message: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

const errorHandler =
  (logger?: Function) =>
  (
    handler: PromiseHandler<APIGatewayProxyEvent, APIGatewayProxyResult>
  ): PromiseHandler<APIGatewayProxyEvent, APIGatewayProxyResult> =>
  async (event: APIGatewayProxyEvent, context?: Context): Promise<APIGatewayProxyResult> => {
    try {
      if (context) {
        return await handler(event, context);
      } else {
        return await handler(event);
      }
    } catch (error: unknown) {
      let statusCode = 500;
      let errorMessage = 'Internal Server Error';
      const errorStack = error;

      if (error instanceof GenericError) {
        statusCode = error.statusCode;
        errorMessage = error.message ?? errorMessage;
      }

      if (error instanceof ZodError) {
        return {
          statusCode: 400,
          body: JSON.stringify({ status: 'Bad request | validation_error', issues: error.issues }),
        };
      }

      if (logger) {
        logger(errorStack);
      } else {
        console.log(errorStack);
      }

      return {
        statusCode: statusCode,
        body: JSON.stringify({ message: errorMessage }),
      };
    }
  };

export { errorHandler, GenericError };
