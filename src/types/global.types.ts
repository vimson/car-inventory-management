type ContextVariables = {
  stackName: string;
  environment: 'Production' | 'Staging' | 'Test' | 'Development';
  account: string;
  region: string;
  apiVersion: string;
  ddbTableName: string;
};

export { ContextVariables };
