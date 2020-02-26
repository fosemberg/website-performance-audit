import {getAllVariantsOfPoses} from "./getAllVariantsOfPoses";

test('make all variants of poses for [1, 2, 3]: ', () => {
  const inputValue = [1, 2, 3];
  const expectedValue = [
    [1, 2, 3],
    [0, 2, 3],
    [1, 1, 3],
    [0, 1, 3],
    [1, 0, 3],
    [0, 0, 3],
    [1, 2, 2],
    [0, 2, 2],
    [1, 1, 2],
    [0, 1, 2],
    [1, 0, 2],
    [0, 0, 2],
    [1, 2, 1],
    [0, 2, 1],
    [1, 1, 1],
    [0, 1, 1],
    [1, 0, 1],
    [0, 0, 1],
    [1, 2, 0],
    [0, 2, 0],
    [1, 1, 0],
    [0, 1, 0],
    [1, 0, 0],
    [0, 0, 0]
  ];
  expect(getAllVariantsOfPoses(inputValue)).toStrictEqual(expectedValue);
});

test('input value don\'t change after getAllVariantsOfPoses [1, 2, 3]: ', () => {
  const inputValue = [1, 2, 3];
  const backupInputValue = [...inputValue];
  getAllVariantsOfPoses(inputValue);
  expect(inputValue).toStrictEqual(backupInputValue);
});
