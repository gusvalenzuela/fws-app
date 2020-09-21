export const generateNumbersArray = (count = 1, max = 17) => {
  let array = [];

  while (count <= max) {
    array.push(count);
    count++;
  }

  return array;
};
