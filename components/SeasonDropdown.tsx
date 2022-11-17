import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { generateNumbersArray } from '../lib/utils'
import Store from '../lib/stores/FootballPool'

const SeasonDropdown = ({ maxYear = 2022 }) => {
  const seasonYr = Store((s) => s.seasonYear || s.currentSeasonYear)

  return (
    <>
      <span>Season </span>
      <Dropdown
        className="season-dropdown"
        onChange={(e, { value }) => Store.setState({ seasonYear: value })}
        options={generateNumbersArray(2020, maxYear).map((num) => ({
          key: num,
          value: num,
          text: `${num}`,
        }))}
        value={seasonYr}
        text={`${seasonYr}`}
        inline
      />
    </>
  )
}
export default SeasonDropdown
