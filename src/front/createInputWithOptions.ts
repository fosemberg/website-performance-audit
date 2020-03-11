/**
 * создание селектора из массива данных
 * @param input - форма, в которой находится селектор
 * @param optionsData - массив данных для селектора
 * @param currentInputData - текущий объекта
 * @param onClickOption
 */
export let createInputWithOptions = function (selectedElement, optionsData, currentInputData, onClickOption = (option: string) => {}) {
  const {id} = selectedElement;
  var selectIdPostfix = 'Select';
  var dataListIdPostfix = 'DataList';
  var buttonIdPostfix = 'Button';

  var buttonTextOpen = '▲';
  var buttonTextClose = '▼';

  var HTMLOption = function (value, isSelected) {
    return '<option ' + (isSelected ? 'selected ' : '') + 'value="' + value + '">' + value + '</option>';
  };

  var rootElement = document.createElement('div');
  var dataList = document.createElement('dataList');
  var select = document.createElement('select');
  var button = document.createElement('button');
  var input = document.createElement('input');

  rootElement.id = id;
  // @ts-ignore
  rootElement.style = "display: inline-block;";
  input.setAttribute('list', id + dataListIdPostfix);
  dataList.id = <string>input.getAttribute('list');
  dataList.style.position = 'absolute';

  var HTMLOptions = '';
  for (var i = 0; i < optionsData.length; i++) {
    var optionData = optionsData[i];
    var isSelected = optionData === currentInputData;
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
      var currentOptionValue = input.value;
      onClickOption(currentOptionValue);
      for (var i = 0; i < optionsData.length; i++) {
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
    hideDataList();
  }

  select.onchange = fillFormWithOptions;
  input.onfocus = hideDataList;

  input.value = currentInputData;
  select.innerHTML = HTMLOptions;
  dataList.appendChild(select);

  // var inputClone = input.cloneNode(true);
  // inputClone.id = id + 'Input';
  rootElement.appendChild(input);
  rootElement.appendChild(dataList);
  rootElement.appendChild(button);
  selectedElement.parentElement.insertBefore(rootElement, selectedElement);

  selectedElement.parentNode.removeChild(selectedElement);
  // input = inputClone;
  return id;
};
