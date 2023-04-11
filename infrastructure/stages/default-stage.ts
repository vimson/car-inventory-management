import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DealersStack } from '../stacks/dealers.stack';
import { ContextVariables } from '../../src/types/global.types';

export class DefaultStage extends Stage {
  constructor(
    scope: Construct,
    stackId: string,
    contextVars: ContextVariables,
    props?: StageProps
  ) {
    super(scope, stackId, props);
    new DealersStack(this, contextVars.stackName, contextVars);
  }
}
