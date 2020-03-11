import {createInputWithOptions} from "./createInputWithOptions";
import {env} from "../../config/env";

const environmentNames = env.environments.map(environment => environment.name);
const siteNames = env.environments.reduce(
  (environmentNames: string[], environment) =>
    environmentNames.concat(
      environment.sites.reduce(
        (siteNames: string[], site) =>
          environmentNames.includes(site.name)
            ? siteNames
            : siteNames.concat(site.name)
        , []
        )
    ), []
);

createInputWithOptions(document.getElementById('env'), environmentNames, environmentNames[0]);
createInputWithOptions(document.getElementById('site'), siteNames, siteNames[0]);
createInputWithOptions(document.getElementById('site'), siteNames, siteNames[1]);

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
