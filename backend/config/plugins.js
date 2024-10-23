module.exports = ({ env }) => ({
  seo: {
    enabled: true,
  },
  email: {
    config: {
      provider: 'strapi-provider-email-brevo',
      providerOptions: {
        apiKey: env('BREVO_API_KEY'),
      },
      settings: {
        defaultSenderEmail: 'orhsherostore@gmail.com',
        defaultSenderName: 'Oak Ridge Hero Store Admin Panel',
        defaultReplyTo: 'orhsherostore@gmail.com',
      },
    },
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
