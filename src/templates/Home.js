import React from 'react'
import { graphql, Link } from 'gatsby'
import AddedValue from '../components/AddedValue'
import Container from '../components/Container'
import { buttonStyles } from '../components/Button'
import ExcerptList from '../components/ExcerptList'
import Main from '../components/Main'
import Seo from '../components/Seo'
import shevy, { bs } from '../shevy'
import { mq, getNodes } from '../utils'

export default function Home({ data }) {
  const collections = getNodes(data.allCollectionsJson)
  const recentPosts = getNodes(data.recent)

  return (
    <Container>
      <Main>
        <Seo title="Home" keywords={['Kyle Shevlin']} />
        <Welcome />
        <Collections collections={collections} />
        <hr />
        <h3>Recent Posts</h3>
        <ExcerptList posts={recentPosts} />

        <div css={{ backgroundColor: 'var(--colors-offset)', padding: bs() }}>
          <h3>Looking for more posts?</h3>
          If you're looking for more posts, visit the{' '}
          <Link to="/all-posts">All Posts</Link> page.
        </div>

        <AddedValue />
      </Main>
    </Container>
  )
}

export const query = graphql`
  query HomeQuery($skip: Int!, $limit: Int!) {
    allCollectionsJson(sort: { fields: [order], order: ASC }) {
      edges {
        node {
          name
        }
      }
    }

    recent: allMdx(
      filter: { fileAbsolutePath: { regex: "/posts/" } }
      sort: { fields: [frontmatter___date], order: DESC }
      skip: $skip
      limit: $limit
    ) {
      edges {
        node {
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            excerpt
            slug
            subtitle
            tags
            title
          }
          excerpt(pruneLength: 300)
        }
      }
    }
  }
`

function Welcome() {
  return (
    <section css={{ marginBottom: bs(2) }}>
      <h2>Welcome!</h2>
      <p>
        Hi, I'm Kyle Shevlin, a software engineer and online instructor. This is
        where I share all the content I create. I mostly write articles and
        create courses, focusing on breaking concepts down to their
        fundamentals.
      </p>
      <p>
        Peruse my blog posts, check out one of my courses (or all of them), and
        sign up for my newsletter if you like what you read.
      </p>
      <p>
        If you need to reach out to me,{' '}
        <a href="https://twitter.com/kyleshevlin">Twitter</a> is by far the best
        way to do so.
      </p>
      <p>Enjoy your time here and thank you.</p>
    </section>
  )
}

function Collections({ collections }) {
  return (
    <section>
      <h3>Unsure Where to Start?</h3>
      <p>Try one of these curated collections.</p>
      <div
        css={{
          display: 'grid',
          gridGap: bs(),

          [mq.alpha]: {
            gridTemplateColumns: 'repeat(2, 1fr)',
          },
        }}
      >
        {collections.map(collection => (
          <CollectionItem key={collection.name} collection={collection} />
        ))}
      </div>
    </section>
  )
}

function CollectionItem({ collection }) {
  const { name } = collection

  return (
    <Link
      css={{
        ...buttonStyles,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'var(--fonts-catamaran)',
        fontSize: shevy.h4.fontSize,
        padding: bs(),
      }}
      to={`/collections#${name.replace(' ', '-').toLowerCase()}`}
    >
      <span>{name}</span>
    </Link>
  )
}
