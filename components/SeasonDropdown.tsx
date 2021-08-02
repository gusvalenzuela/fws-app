import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { generateNumbersArray } from '../lib/utils'

const SeasonDropdown = ({ season, setSeasonYear, maxYear = 2021 }) => (
  <>
    <span>Season </span>
    <Dropdown
      className="season-dropdown"
      onChange={(e, { value }) => setSeasonYear(value)}
      options={generateNumbersArray(2020, maxYear).map((num) => ({
        key: num,
        value: num,
        text: `${num}`,
      }))}
      value={season}
      text={`${season}`}
      inline
    />
  </>
)

export default SeasonDropdown
