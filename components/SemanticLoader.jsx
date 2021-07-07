import React from 'react'
import { Loader, Dimmer } from 'semantic-ui-react'

const SemanticLoader = ({ text, children }) => (
  <Dimmer inverted active>
    <Loader size="large">{text}</Loader>
    {children}
  </Dimmer>
)

export default SemanticLoader
