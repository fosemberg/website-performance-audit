import {env as _env} from "../../config/env";
import {Env, ExternalInput} from "../../config/types";

export const getEnvironmentNames = (env: Env = _env): Array<string> => env.environments.map(environment => environment.name);

export const getSiteNamesByEnvironmentName = (environmentName: string, env: Env = _env): Array<string> => {
  for (const environment of env.environments) {
    if (environmentName === environment.name) {
      return environment.sites.map(site => site.name);
    }
  }
  return [];
};

export const checkValidExternalInput = (
  {
    env: environment,
    site: siteName,
    tag: siteTag,
    iterations = 1,
  }: ExternalInput
): true | Error => {
  if (!environment) {
    throw new Error('No env');
  }
  if (!getEnvironmentNames().includes(environment)) {
    throw new Error(`env not in config envs: ${getEnvironmentNames()}`);
  }
  if (!siteName) {
    throw new Error(`No site`);
  }
  if (!getSiteNamesByEnvironmentName(environment).includes(siteName)) {
    throw new Error(`site not in config envs: ${getSiteNamesByEnvironmentName(environment)}`);
  }
  if (!siteTag) {
    throw new Error('No tag');
  }
  if (typeof(iterations) !== 'number') {
    throw new Error('iterations should be number');
  }
  return true;
};
