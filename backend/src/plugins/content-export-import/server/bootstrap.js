'use strict';

module.exports = (params) => {
  // bootstrap phase
  params.strapi.db.lifecycles.subscribe({
    models: ['admin::user'],
    async afterCreate({ result }) {
      console.log('afterCreate', result);
      const { registrationToken, email } = result;
      if (!registrationToken) return;
      
      // Email invite logic goes here
      // get env variables
      const { RAILWAY_PUBLIC_DOMAIN } = process.env;

      // move to a f
      params.strapi.service('plugin::email.email').send({
        to: email,
        subject: 'Confirm your email',
        text: `<p>Please confirm your email by clicking the following link: <a href="${RAILWAY_PUBLIC_DOMAIN}/admin/auth/register?registrationToken=${registrationToken}">Confirm email</a></p>`,
      });
    },
  });
};
