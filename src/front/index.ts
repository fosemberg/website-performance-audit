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
    const url = 'http://fosemberg.dev.test-ru.dom:3000';

    // @ts-ignore
    const formData = new FormData(formElem);
    const getParams = `?${new URLSearchParams(formData).toString()}`;
    console.log(formData);

    let response;

    try {
      response = await fetch(`${url}/${getParams}`);
      let result = await response.json();
      if (output) {
        output.innerText = JSON.stringify(response, null, 2);
      }
      console.log(result.message);
    } catch (e) {
      if (output) {
        output.innerText = e.toString();
      }
      console.error(e);
    }
  }
}
