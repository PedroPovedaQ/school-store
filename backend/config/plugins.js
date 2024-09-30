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
});
