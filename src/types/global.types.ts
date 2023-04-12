type ContextVariables = {
  stackName: string;
  environment: 'Production' | 'Staging' | 'Test' | 'Development';
  account: string;
  region: string;
  apiVersion: string;
  ddbTableName: string;
  awsRegion: string;
  token: string;
};

export { ContextVariables };
