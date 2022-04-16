import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { generateNumbersArray } from '../lib/utils'
import Store from '../lib/stores/FootballPool'

const WeekDropdown = () => {
  const week = Store((s) => s.week || s.currentWeek)

  return (
    <>
      <span>Week </span>
      <Dropdown
        className="custom-dropdown"
        onChange={(e, { value }) => Store.setState({ week: value })}
        options={generateNumbersArray().map((num) => ({
          key: num,
          value: num,
          text: `${num}`,
        }))}
        value={week}
        text={`${week}`}
        inline
      />
    </>
  )
}

export default WeekDropdown
