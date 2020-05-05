import React, { Fragment } from 'react'
import { graphql, Link } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import BannerImage from '../components/BannerImage'
import BeardStrokes from '../components/BeardStrokes'
import PostAuthor from '../components/PostAuthor'
import PostContent from '../components/PostContent'
import PostDate from '../components/PostDate'
import PostHeader from '../components/PostHeader'
import PostOpenSourceContribution from '../components/PostOpenSourceContribution'
import PostTags from '../components/PostTags'
import RelatedPosts from '../components/RelatedPosts'
import Seo from '../components/Seo'
import TotalBeardStrokes from '../components/TotalBeardStrokes'
import { bs } from '../shevy'

const newerOrOlderPostWrap = {
  paddingTop: bs(0.25),
  paddingBottom: bs(0.25)
}

const newerOrOlderHeading = theme => ({
  fontFamily: theme.fonts.catamaran,
  fontWeight: 700
})

const Post = ({
  data,
  pageContext: { olderPost, newerPost, relatedPosts }
}) => {
  const { md, mdx } = data
  const file = md ? md : mdx
  const {
    frontmatter: {
      coverImage,
      date,
      description,
      keywords,
      slug,
      subtitle,
      tags,
      title
    }
  } = file

  return (
    <Fragment>
      <Seo title={title} description={description} keywords={keywords || []} />

      <div
        css={{
          '> h3': {
            marginTop: bs(2)
          }
        }}
      >
        {coverImage && (
          <BannerImage
            src={coverImage.childImageSharp.original.src}
            alt={`${title} Banner`}
          />
        )}
        <PostDate date={date} />
        <TotalBeardStrokes slug={slug} />
        <PostHeader {...{ subtitle, title }} />
        {renderContent(file)}

        {tags && <PostTags items={tags} />}

        <BeardStrokes slug={slug} />

        {relatedPosts && <RelatedPosts posts={relatedPosts} />}

        <PostOpenSourceContribution />

        <div css={{ marginTop: bs(2) }}>
          {newerPost ? (
            <div css={newerOrOlderPostWrap}>
              <span css={newerOrOlderHeading}>Newer Post: </span>
              <Link to={newerPost.frontmatter.slug}>
                {newerPost.frontmatter.title}
              </Link>
            </div>
          ) : null}

          {olderPost ? (
            <div css={newerOrOlderPostWrap}>
              <span css={newerOrOlderHeading}>Older Post: </span>
              <Link to={olderPost.frontmatter.slug}>
                {olderPost.frontmatter.title}
              </Link>
            </div>
          ) : null}
        </div>

        <PostAuthor />
      </div>
    </Fragment>
  )
}

export default Post

export const pageQuery = graphql`
  query($slug: String!) {
    md: markdownRemark(
      fileAbsolutePath: { regex: "/posts/" }
      frontmatter: { slug: { eq: $slug } }
    ) {
      html
      frontmatter {
        coverImage {
          childImageSharp {
            original {
              src
            }
          }
        }
        date(formatString: "MMMM DD, YYYY")
        description
        keywords
        slug
        subtitle
        tags
        title
      }
    }

    mdx: mdx(
      fileAbsolutePath: { regex: "/posts/" }
      frontmatter: { slug: { eq: $slug } }
    ) {
      body
      frontmatter {
        coverImage {
          childImageSharp {
            original {
              src
            }
          }
        }
        date(formatString: "MMMM DD, YYYY")
        description
        keywords
        slug
        subtitle
        tags
        title
      }
    }
  }
`

const renderContent = file => {
  if (file.html) {
    return <PostContent content={file.html} />
  }

  return <MDXRenderer>{file.body}</MDXRenderer>
}
