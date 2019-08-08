module.exports = {
  siteMetadata: {
    title: `swyx dot io`,
    name: `swyx`,
    siteUrl: `https://swyx.io`,
    description: `Personal site for shawn swyx wang`,
    hero: {
      heading: `swyx's writing`,
      maxWidth: 652,
    },
    social: [
      {
        name: `twitter`,
        url: `https://twitter.com/swyx`,
      },
      {
        name: `github`,
        url: `https://github.com/sw-yx/swyxdotio`,
      },
    ],
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: 'content/collections/talks2019',
        name: 'talks2019',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: 'content/collections/talks2018',
        name: 'talks2018',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: 'content/collections/drafts',
        name: 'draftPosts',
      },
    },
    {
      resolve: '@narative/gatsby-theme-novela',
      options: {
        contentPosts: 'content/posts',
        contentAuthors: 'content/authors',
        basePath: '/writing',
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `swyx dot io`,
        short_name: `swyx`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: `favicon.png`,
      },
    },
  ],
}
