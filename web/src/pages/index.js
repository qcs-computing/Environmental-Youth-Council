import React from "react";
import { graphql } from "gatsby";
import {
  mapEdgesToNodes,
  filterOutDocsWithoutSlugs,
  filterOutDocsPublishedInTheFuture
} from "../lib/helpers";
import BlogPostPreviewList from "../components/blog-post-preview-list";
import Container from "../components/container";
import GraphQLErrorList from "../components/graphql-error-list";
import SEO from "../components/seo";
import Layout from "../components/layout";
import "../layouts/tachyons/css/tachyons.css";
import "../layouts/custom.css";
import Header from "../components/header";
import Footer from "../components/footer";
import Subheader from "../components/subheader";
import Subheaditem from "../components/subheaditem";
import Helmet from "react-helmet";
import OGImage from "../images/og.jpg";

export const query = graphql`
  fragment SanityImage on SanityMainImage {
    crop {
      _key
      _type
      top
      bottom
      left
      right
    }
    hotspot {
      _key
      _type
      x
      y
      height
      width
    }
    asset {
      _id
    }
  }

  query IndexPageQuery {
    site: sanitySiteSettings(_id: { regex: "/(drafts.|)siteSettings/" }) {
      title
      description
      keywords
    }
    focus: allSanityFocus(sort: { order: ASC, fields: [order] }) {
      edges {
        node {
          mainImage {
            ...SanityImage
            alt
          }
          title
          _rawExcerpt
        }
      }
    }
    about: allSanityAbout(sort: { order: ASC, fields: [order] }) {
      edges {
        node {
          mainImage {
            ...SanityImage
            alt
          }
          title
          _rawExcerpt
        }
      }
    }
    posts: allSanityPost(
      limit: 6
      sort: { fields: [publishedAt], order: DESC }
      filter: { slug: { current: { ne: null } }, publishedAt: { ne: null } }
    ) {
      edges {
        node {
          id
          publishedAt
          mainImage {
            ...SanityImage
            alt
          }
          title
          _rawExcerpt
          slug {
            current
          }
        }
      }
    }
  }
`;
console.log({ OGImage });
const IndexPage = props => {
  const { data, errors } = props;

  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    );
  }

  const site = (data || {}).site;
  const postNodes = (data || {}).posts
    ? mapEdgesToNodes(data.posts)
        .filter(filterOutDocsWithoutSlugs)
        .filter(filterOutDocsPublishedInTheFuture)
    : [];

  const focusNodes = data && data.focus && mapEdgesToNodes(data.focus);
  const aboutNodes = data && data.about && mapEdgesToNodes(data.about);
  console.log(aboutNodes);
  console.log({ OGImage });

  if (!site) {
    throw new Error(
      'Missing "Site settings". Open the studio at http://localhost:3333 and add some content to "Site settings" and restart the development server.'
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{site.title}</title>
        <meta property="title" content={site.title} />

        <meta property="og:title" content={site.title} />
        <meta property="description" content={site.description} />
        <meta
          property="image"
          content="https://environmental-youth-council.netlify.com/static/og-39aa5b62b7b76ab64ac4a6154fe2f72c.jpg"
        />
        <meta
          property="og:image"
          content="https://environmental-youth-council.netlify.com/static/og-39aa5b62b7b76ab64ac4a6154fe2f72c.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        {/* <meta
          property="twitter:image"
          content="https://environmental-youth-council.netlify.com/static/og-39aa5b62b7b76ab64ac4a6154fe2f72c.jpg"
        /> */}
      </Helmet>
      {/* <SEO title={site.title} description={site.description} keywords={site.keywords} /> */}
      <Subheader nodes={aboutNodes} focusNodes={focusNodes} />
      <Container>
        {/* <Subheaditem nodes={focusNodes} /> */}
        {/* {focusNodes && <Subheaditem nodes={focusNodes} />} */}
        {/* <Header /> */}
        {/* <h1 hidden>Welcome to {site.title}</h1>
        {postNodes && (
          <BlogPostPreviewList
            title='Latest blog posts'
            nodes={postNodes}
            browseMoreHref='/archive/'
          />
        )} */}
      </Container>
    </Layout>
  );
};
export default IndexPage;
