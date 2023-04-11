import * as cdk from 'aws-cdk-lib';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { ContextVariables } from '../../src/types/global.types';
import { DefaultStage } from '../stages/default-stage';

export class PipelineStack extends cdk.Stack {
  private contextVars: ContextVariables;

  constructor(
    scope: Construct,
    stackId: string,
    contextVars: ContextVariables,
    props?: cdk.StackProps
  ) {
    super(scope, stackId, props);
    this.contextVars = contextVars;

    const deploymentBranch = this.contextVars.environment === 'Production' ? 'master' : 'stage';
    const repo = codecommit.Repository.fromRepositoryName(this, 'CdkDemoRepo', 'dealer-demo');
    const pipeline = new CodePipeline(this, stackId, {
      pipelineName: stackId,
      codeBuildDefaults: {
        buildEnvironment: {
          privileged: true,
        },
      },
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.codeCommit(repo, deploymentBranch),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    pipeline.addStage(new DefaultStage(this, `Deploy${contextVars.stackName}`, this.contextVars));
  }
}
