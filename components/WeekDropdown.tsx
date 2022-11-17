import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { generateNumbersArray } from '../lib/utils'
import Store from '../lib/stores/FootballPool'

const WeekDropdown = () => {
  const week = Store((s) => s.week || s.currentWeek)
  const year = Store((s) => s.seasonYear || s.currentSeasonYear)

  const maxWeek = year < 2021 ? 17 : 18

  return (
    <>
      <span>Week </span>
      <Dropdown
        className="custom-dropdown"
        onChange={(e, { value }) => Store.setState({ week: value })}
        options={generateNumbersArray(1, maxWeek).map((num) => ({
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
