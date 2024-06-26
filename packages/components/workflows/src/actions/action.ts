// import { WorkflowEnvironment } from "../models/workflow-environment";
// import { BuildActionConfiguration } from "./action-build";
// import { CfnDeployActionConfiguration } from "./action-cfn-deploy";
// import { TestActionConfiguration } from "./action-test-reports";

import { BuildActionConfiguration } from './action-build';
import { CdkBootstrapActionConfiguration } from './action-cdk-bootstrap';
import { CdkDeployActionYamlOutput } from './action-cdk-deploy';
import { CfnDeployActionConfiguration } from './action-cfn-deploy';
import { PublishBlueprintActionConfiguration } from './action-publish-blueprint';
import { TestActionConfiguration } from './action-test-reports';
import { WorkflowEnvironment } from '../environment/workflow-environment';

export enum ActionIdentifierAlias {
  build = 'build',
  deploy = 'deploy',
  test = 'test',
  cdkDeploy = 'cdkDeploy',
  cdkBootstrap = 'cdkBootstrap',
  publishBlueprint = 'publishBlueprint',
}

const ACTION_IDENTIFIERS: { [key: string]: { default: string; prod: string } } = {
  'build': {
    default: 'aws/build-beta@v1',
    prod: 'aws/build@v1',
  },
  'test': {
    default: 'aws/managed-test-gamma@v1',
    prod: 'aws/managed-test@v1',
  },
  'deploy': {
    default: 'aws/cfn-deploy-gamma@v1',
    prod: 'aws/cfn-deploy@v1',
  },
  'cdkDeploy': {
    default: 'aws/cdk-deploy-gamma@v1',
    prod: 'aws/cdk-deploy@v1',
  },
  'cdkBootstrap': {
    default: 'aws/cdk-bootstrap-gamma@v1',
    prod: 'aws/cdk-bootstrap@v1',
  },
  'aws/build@v1': {
    default: 'aws/build-beta@v1',
    prod: 'aws/build@v1',
  },
  'aws/managed-test@v1': {
    default: 'aws/managed-test-gamma@v1',
    prod: 'aws/managed-test@v1',
  },
  'aws/cfn-deploy@v1': {
    default: 'aws/cfn-deploy-gamma@v1',
    prod: 'aws/cfn-deploy@v1',
  },
  'aws/cdk-deploy@v1': {
    default: 'aws/cdk-deploy-gamma@v1',
    prod: 'aws/cdk-deploy@v1',
  },
  'aws/cdk-bootstrap@v1': {
    default: 'aws/cdk-bootstrap-gamma@v1',
    prod: 'aws/cdk-bootstrap@v1',
  },
  'publishBlueprint': {
    default: 'aws/publish-blueprint-action@v1',
    prod: 'aws/publish-blueprint-action@v1',
  },
  'aws/github-actions-runner@v1': {
    default: 'aws/github-actions-runner-beta@v1',
    prod: 'aws/github-actions-runner@v1',
  },
};

export function getDefaultActionIdentifier(identifer: string, environmentIdentifier: string = 'default'): string | undefined {
  if (ACTION_IDENTIFIERS[identifer]) {
    return ACTION_IDENTIFIERS[identifer]?.[environmentIdentifier] ?? ACTION_IDENTIFIERS[identifer]?.default;
  }
  return identifer;
}

type TypeSupportedCompute = ComputeConfiguration;
type TypeSupportedActions =
  | BuildActionConfiguration
  | CfnDeployActionConfiguration
  | TestActionConfiguration
  | CdkDeployActionYamlOutput
  | CdkBootstrapActionConfiguration
  | PublishBlueprintActionConfiguration;

export interface ActionDefiniton {
  Identifier?: string;
  Compute?: TypeSupportedCompute | string;
  Configuration?: TypeSupportedActions;
  DependsOn?: string[];
  Inputs?: InputsDefinition;
  Outputs?: OutputDefinition;
  Environment?: WorkflowEnvironment;
}

export interface ComputeConfiguration {
  Type?: string;
  Fleet?: string;
}

/**
 * Standard action input
 */
export interface InputsDefinition {
  [key: string]: any;
  Sources?: string[];
  Variables?: InputVariable[];
  Artifacts?: string[];
}

export interface InputVariable {
  Name: string;
  Value: string;
}

/**
 * Standard action output
 */
export interface OutputDefinition {
  [key: string]: any;
  Artifacts?: Artifact[];
  Reports?: string[];
  AutoDiscoverReports?: AutoDiscoverReportDefinition;
  Variables?: string[];
}

export interface Artifact {
  Name: string;
  Files: string[];
}

export interface AutoDiscoverReportDefinition {
  Enabled?: boolean;
  ReportNamePrefix?: string;
  ExcludePaths?: string[];
  IncludePaths?: string[];
  SuccessCriteria?: SuccessCriteriaDefinition;
}

export interface SuccessCriteriaDefinition {
  PassRate?: number;
  LineCoverage?: number;
  BranchCoverage?: number;
  Vulnerabilities?: {
    Severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
    Number: number;
  };
}

export function convertInputsToJsonString(input: any): string | undefined {
  if (typeof input === 'string') {
    return input;
  }
  if (input instanceof Array) {
    return JSON.stringify(input);
  }
  if (input instanceof Object) {
    return JSON.stringify(input);
  }
  return undefined;
}
