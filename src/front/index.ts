import {createInputWithOptions} from "./createInputWithOptions";

createInputWithOptions(document.getElementById('env'), [1, 2, 3, 4], 1);
createInputWithOptions(document.getElementById('site'), [1, 2, 3, 4], 1);

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
