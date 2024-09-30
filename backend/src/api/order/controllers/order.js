'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);

    const enhancedData = await Promise.all(
      data.map(async (order) => {
        const populatedOrder = await strapi.entityService.findOne('api::order.order', order.id, {
          populate: {
            order_items: {
              fields: ['display_name'],
            },
          },
        });

        const orderItemsDisplay = populatedOrder.order_items
          .map(item => item.display_name)
          .join('\n');

        return this.sanitizeOutput({ ...order, order_items_display: orderItemsDisplay }, ctx);
      })
    );

    return { data: enhancedData, meta };
  },

  async findOne(ctx) {
    const { data, meta } = await super.findOne(ctx);

    const populatedOrder = await strapi.entityService.findOne('api::order.order', data.id, {
      populate: {
        order_items: {
          fields: ['display_name'],
        },
      },
    });

    const orderItemsDisplay = populatedOrder.order_items
      .map(item => item.display_name)
      .join('\n');

    const enhancedData = this.sanitizeOutput({ ...data, order_items_display: orderItemsDisplay }, ctx);

    return { data: enhancedData, meta };
  },
}));
