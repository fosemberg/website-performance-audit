import {createInputWithOptions} from "./createInputWithOptions";
import {env} from "../../config/env";

const environmentNames = env.environments.map(environment => environment.name);

const getSiteNamesByEnvironmentName = (environmentName) => {
  for (const environment of env.environments) {
    if (environmentName === environment.name) {
      return environment.sites.map(site => site.name);
    }
  }
};

const onPickNewEnvironment = (newEnvironment) => {
  const siteNames = getSiteNamesByEnvironmentName(newEnvironment);
  createInputWithOptions(document.getElementById('site'), siteNames, siteNames && siteNames[0] || '');
};

createInputWithOptions(document.getElementById('env'), environmentNames, environmentNames[0], onPickNewEnvironment);
onPickNewEnvironment(environmentNames[0]);

const formElem = document.getElementById('formElem');
if (formElem) {
  formElem.onsubmit = async (e) => {
    e.preventDefault();
    const output = document.getElementById('output');
    if (output) {
      output.innerText = 'Sending...';
    }
    const backUrl = `${env.origin}:${env.port}`;

    // @ts-ignore
    const formData = new FormData(formElem);
    const getParams = `?${new URLSearchParams(formData).toString()}`;
    console.log(formData);

    let response;
    const url = `${backUrl}/${getParams}`;
    try {
      response = await fetch(url);
      let result = await response.json();
      if (output) {
        output.innerText = `url: ${url}\n${JSON.stringify(result, null, 2)}`;
      }
      console.log(result);
    } catch (e) {
      if (output) {
        output.innerText = `url: ${url}\n${e.toString()}`;
      }
      console.error(e);
    }
  }
}
