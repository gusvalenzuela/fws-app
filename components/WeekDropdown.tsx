import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { generateNumbersArray } from '../lib/utils'

const WeekDropdown = ({ week, setWeek }) => (
  <>
    <span>
      Week{' '}
      <Dropdown
        className="custom-dropdown"
        onChange={(e, { value }) => setWeek(value)}
        options={generateNumbersArray(1, 17).map((num) => ({
          key: num,
          value: num,
          text: `${num}`,
        }))}
        value={week}
        text={`${week}`}
        inline
      />
    </span>
  </>
)

export default WeekDropdown
