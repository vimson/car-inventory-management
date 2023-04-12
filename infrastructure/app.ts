#!/usr/bin / env node

import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { ContextVariables } from '../src/types/global.types';
import { PipelineStack } from './stacks/pipeline.stack';

const app = new App();

const stageContextVars = <ContextVariables>app.node.tryGetContext('staging-environment');
const productionContextVars = <ContextVariables>app.node.tryGetContext('production-environment');

new PipelineStack(app, `Pipeline${stageContextVars.stackName}`, stageContextVars, {
  env: { region: stageContextVars.region, account: stageContextVars.account },
});

new PipelineStack(app, `Pipeline${productionContextVars.stackName}`, productionContextVars, {
  env: { region: productionContextVars.region, account: productionContextVars.account },
});

app.synth();
