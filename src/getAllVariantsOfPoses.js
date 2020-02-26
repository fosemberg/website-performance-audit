const checkIsAllZerosInArray = arr => !arr.join('').replace(/0/g,'');

const getAllVariantsOfPoses = (poses, posesMax = [...poses], allVariantsOfPoses = [], isShift = false, cur = 0) => {
  if (!isShift) {
    allVariantsOfPoses.push(poses);
  }
  const _poses = [...poses];
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
