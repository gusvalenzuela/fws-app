import React from 'react'
import { Divider, Header } from 'semantic-ui-react'
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react'
import type { SportsTeam } from '../additional'

const ByeTeamsSection = ({ teams }) => (
  <>
    {teams.length ? (
      <Divider horizontal>
        <Header as="h4">Teams on Bye</Header>
      </Divider>
    ) : null}
    {
      // teams fed into this component should have an image
      // in cloudinary, as it spits out an image for each team given
      teams.length
        ? teams.map((team: SportsTeam) => (
            /* team logo / image  */
            <CloudinaryContext
              key={`bye-${team.abbreviation}`}
              cloudName="fwscloud"
              style={{ display: 'inline', margin: '.5rem 1rem' }}
            >
              {/* hosting the images on cloudinary */}
              <Image
                publicId={`NFL-Team_logos/${team.abbreviation || 'nfl'}.png`}
                alt={`${team.abbreviation}'s team logo`}
                id="team-logo-img"
              >
                <Transformation width="42" height="42" crop="thumb" />
                <Transformation
                  overlay={{
                    fontFamily: 'Times',
                    fontSize: 20,
                    text: `${team.mascot}`,
                  }}
                  y="30"
                />
              </Image>
            </CloudinaryContext>
          ))
        : null
    }
  </>
)

export default ByeTeamsSection
