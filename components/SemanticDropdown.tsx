import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { generateNumbersArray } from '../lib/utils'
import Store from '../lib/stores/FootballPool'

const SemanticDropdown = () => {
  const week = Store((s) => s.week) || Store.getState().currentWeek // Store.week initializes as undefined

  return (
    <Dropdown
      className="week-dropdown"
      onChange={(e, { value }) => Store.setState({ week: value })}
      options={generateNumbersArray(1, 17).map((num) => ({
        key: num,
        value: num,
        text: `Week ${num}`,
      }))}
      value={week}
      text={`Week ${week?.toString()}`}
      inline
    />
  )
}

export default SemanticDropdown
