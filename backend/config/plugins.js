module.exports = ({ env }) => ({
  seo: {
    enabled: true,
  },
  slugify: {
    enabled: true,
    config: {
      contentTypes: {
        product: {
          field: 'slug',
          references: 'name',
        },
      },
    },
  },
  'content-export-import': {
    enabled: true,
    resolve: './src/plugins/content-export-import',
  },
});
