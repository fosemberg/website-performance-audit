import {ExternalInput, Input} from "../../config/types";
import {env} from "../../config/env";

export const convertExternalInputToInternal = (
  {
    env: environment,
    site: siteName,
    tag: siteTag,
    iterations = env.iterations,
  }: ExternalInput
): Input => ({
  environment,
  siteName,
  siteTag,
  iterations,
});
