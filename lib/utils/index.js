export const generateNumbersArray = (count = 1, max = 17) => {
  let array = [];

  while (count <= max) {
    array.push(count);
    count++;
  }

  return array;
};

export const getWeekNumber = (date) => {
  let datetoCompare = date ? new Date(date) : new Date();
  let onejan = new Date(datetoCompare.getFullYear(), 0, 1);
  let week = Math.ceil(
    ((datetoCompare - onejan) / 86400000 + onejan.getDay() + 1) / 7
  );
  return week;
};
