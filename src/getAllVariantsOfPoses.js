/**
 * проверить все ли значения в массиве являются нулями
 * @param arr - входной массив
 * @returns {boolean}
 */
const checkIsAllZerosInArray = arr => !arr.join('').replace(/0/g,'');

/**
 * @param lengths - длины массивов
 * @param posesMax - максимальные значения позиций (по факту длины массивов)
 * @param allVariantsOfPoses - все варианты позиций, которые могут быть
 * @param isShift - идет ли сейчас сдвиг
 * @param cur - текущая позиция
 * @returns {Array.<Array.<number>>}
 */
const getAllVariantsOfPoses = (lengths, posesMax = [...lengths], allVariantsOfPoses = [], isShift = false, cur = 0) => {
  if (!isShift) {
    allVariantsOfPoses.push(lengths);
  }
  const _poses = [...lengths];
  if (_poses[cur] !== 0) {
    _poses[cur] -= 1;
    if (isShift) {
      // get number from right and make everything left from number this as big as before
      for (let i = 0; i < cur; i++) {
        _poses[i] = posesMax[i];
      }
      getAllVariantsOfPoses(_poses, posesMax, allVariantsOfPoses, false, 0);
    } else {
      getAllVariantsOfPoses(_poses, posesMax, allVariantsOfPoses, false, cur, allVariantsOfPoses);
    }
  } else {
    if (!checkIsAllZerosInArray(_poses)) {
      getAllVariantsOfPoses(_poses, posesMax, allVariantsOfPoses, true, cur + 1, allVariantsOfPoses);
    }
  }
  return allVariantsOfPoses;
};

module.exports = getAllVariantsOfPoses;
