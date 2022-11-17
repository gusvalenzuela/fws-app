import React from 'react'
import At from './at'
import Vs from './vs'

// this simpply returns the desired version matchup card
// "at" = typical away team @ home team matchup
// "vs" = 1 v 1 type matchups (e.g. mma, boxing, tennis)
const MatchupVersion = ({ version, ...props }) =>
  version && version === 'vs' ? <Vs {...props} /> : <At {...props} />

export default MatchupVersion
