'use strict';

/**
 * order router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

const myExtraRoutes = [];

module.exports = customRouter(createCoreRouter('api::order.order'), myExtraRoutes);
