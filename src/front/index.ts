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

    const url = 'http://fosemberg.dev.test-ru.dom:3000';

    e.preventDefault();

    // @ts-ignore
    const formData = new FormData(formElem);
    const getParams = `?${new URLSearchParams(formData).toString()}`;
    console.log(formData);

    let response = await fetch(`${url}/${getParams}`);

    let result = await response.json();

    console.log(result.message);
  };
}
