import React from 'react'
import Container from './Container'
import { bs } from '../shevy'

export default function AnnouncementBanner() {
  return (
    <div
      css={{
        backgroundColor: 'var(--components-announcementBanner-background)',
        color: 'var(--components-announcementBanner-text)',
        fontFamily: 'var(--fonts-catamaran)',
        paddingTop: bs(0.5),
        paddingBottom: bs(0.5),
      }}
    >
      <Container>
        <div>
          The election is undergoing in the United States and we need leaders
          who will help us make progress regarding COVID-19. I encourage you to
          vote for <strong>Biden/Harris</strong> and your local representatives
          ready to listen to science and reason to fight this pandemic.
        </div>
      </Container>
    </div>
  )
}
