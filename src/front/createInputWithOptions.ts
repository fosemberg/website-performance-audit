/**
 * создание селектора из массива данных
 * @param input - форма, в которой находится селектор
 * @param optionsData - массив данных для селектора
 * @param currentInputData - текущий объекта
 * @param onClickOption - callback, вызывается при выборе опции
 */
export let createInputWithOptions = function (selectedInput, optionsData, currentInputData, onClickOption = (option: string) => {}) {
  const {id} = selectedInput;
  let selectIdPostfix = 'Select';
  let dataListIdPostfix = 'DataList';
  let buttonIdPostfix = 'Button';

  let buttonTextOpen = '▲';
  let buttonTextClose = '▼';

  let HTMLOption = function (value, isSelected) {
    return '<option ' + (isSelected ? 'selected ' : '') + 'value="' + value + '">' + value + '</option>';
  };

  let rootElement = document.createElement('div');
  let dataList = document.createElement('dataList');
  let select = document.createElement('select');
  let button = document.createElement('button');
  let input = selectedInput.tagName === 'INPUT'
    ? selectedInput.cloneNode(true)
    : selectedInput.getElementsByTagName('INPUT')[0].cloneNode(true);
  input.id = id + 'Input';

  rootElement.id = id;
  // @ts-ignore
  rootElement.style = "display: inline-block;";
  input.setAttribute('list', id + dataListIdPostfix);
  dataList.id = <string>input.getAttribute('list');
  dataList.style.position = 'absolute';

  let HTMLOptions = '';
  for (let i = 0; i < optionsData.length; i++) {
    let optionData = optionsData[i];
    let isSelected = optionData === currentInputData;
    HTMLOptions += HTMLOption(optionData, isSelected);
  }

  select.setAttribute('size', optionsData.length);
  select.multiple = true;
  select.style.overflow = 'hidden';
  select.id = id + selectIdPostfix;

  button.innerText = buttonTextClose;
  button.id = id + buttonIdPostfix;

  input.id = id + 'Input';

  function hideDataList() {
    dataList.style.display = '';
    button.innerText = buttonTextClose;
  }

  button.onclick = function (event) {
    event.preventDefault();

    if (dataList.style.display === '') {
      dataList.style.display = 'block';
      // @ts-ignore
      this.textContent = buttonTextOpen;
      let currentOptionValue = input.value;
      for (let i = 0; i < optionsData.length; i++) {
        if (optionsData[i] === currentOptionValue) {
          select.selectedIndex = i;
          break;
        }
      }
    } else {
      hideDataList();
    }
  };

  function fillFormWithOptions(event) {
    input.value = optionsData[event.target.selectedIndex];
    onClickOption(input.value);
    hideDataList();
  }

  select.onchange = fillFormWithOptions;
  input.onfocus = hideDataList;

  input.value = currentInputData;
  select.innerHTML = HTMLOptions;
  dataList.appendChild(select);

  rootElement.appendChild(input);
  rootElement.appendChild(dataList);
  rootElement.appendChild(button);
  selectedInput.parentElement.insertBefore(rootElement, selectedInput);

  selectedInput.parentNode.removeChild(selectedInput);
  return id;
};
