export const generateNumbersArray = (count = 1, max = 17) => {
  const array = []
  let min = count

  while (min <= max) {
    array.push(min)
    min += 1
  }
  return array
}

export const getWeekNumber = (date) => {
  const datetoCompare = new Date(date || null)
  const onejan = new Date(datetoCompare.getFullYear(), 0, 1)
  const week = Math.ceil(
    ((datetoCompare - onejan) / 86400000 + onejan.getDay() + 1) / 7
  )
  return week
}
