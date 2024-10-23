module.exports = {
    async beforeCreate(event) {
      console.log("Before create Order:", event);
      const { data } = event.params;
      // Check if email and password are correct
      if (data.email && data.password) {
        if (!(data.email.endsWith('@students.ocps.net') || data.email.endsWith('@ocps.net'))|| data.password !== 'Hero123') {
          throw new Error('Invalid email or password');
        }
        // Remove email and password from data
        delete data.password;
      } else {
        throw new Error('Email and password are required');
      }
      const { cart_items } = data;
      console.log("Data before processing:", event.params.data);
      console.log("cart_items", cart_items);
      const productCollection = {};
  
      if (cart_items && Array.isArray(cart_items)) {
        // Check inventory for all items
        for (const item of cart_items) {
          console.log("Checking inventory for item:", item);
          const product = await strapi.entityService.findOne('api::product.product', item.id, {
            fields: ['id', 'name', 'inventory', 'price'],
          });
          console.log("Product found:", product);
          productCollection[product.id] = product;
  
          if (!product) {
            throw new Error(`Product with id ${item.id} not found`);
          }
  
          if (product.inventory < item.quantity) {
            throw new Error(`Not enough inventory for product: ${product.name}. Requested: ${item.quantity}, Available: ${product.quantity}`);
          }
        }
        
        console.log("productCollection", productCollection);
        // If we've made it here, we have enough inventory for all items
        const orderItems = [];
        for (const item of cart_items) {
          try {
            console.log("Creating order item for product:", item);
            const orderItem = await strapi.entityService.create('api::order-item.order-item', {
              data: {
                quantity: item.quantity,
                product: item.id,
                price: productCollection[item.id].price * item.quantity,
              },
            });
            console.log("Order item created:", orderItem);
            orderItems.push(orderItem.id);
          } catch (error) {
            console.error(`Error creating order item for product ${item.id}:`, error);
            throw error; // Re-throw the error to stop the order creation process
          }
        }
        // Associate the created order items with the order
        data.order_items = orderItems;
        console.log("Order items:", orderItems);
        // Remove cart_items from the data as we've processed it
        delete data.cart_items
      }
      console.log("Data after processing:", event.params.data);
    },
  
    async afterCreate(event) {
      console.log("After create Order:", event);
      const order_items = event.params.data.order_items;
      console.log("Order items:", order_items);
  
      if (order_items && Array.isArray(order_items)) {
        for (const itemId of order_items) {
          const orderItem = await strapi.entityService.findOne('api::order-item.order-item', itemId, {
            populate: ['product'],
          });
          console.log("Order item found:", orderItem);
  
          if (orderItem && orderItem.product) {
            const { product, quantity } = orderItem;
            console.log("Updating inventory for product:", product);
            console.log("product", product.id, 'id');
            await strapi.entityService.update('api::product.product', product.id, {
              data: {
                inventory: product.inventory - quantity,
              },
            });
          }
        }
      }
    },
  
    async beforeDelete(event) {
      console.log("Before delete Order:", event);
      const { params } = event;
      console.log("Before delete Order:", params);
      // Retrieve the order that is about to be deleted
      const result = await strapi.entityService.findOne('api::order.order', params.where.id, {
        populate: {
          order_items: {
            populate: ['product']
          }
        },
      });
      console.log("Order to be deleted:", result.order_items);
      // update inventory for each order item
      for (const orderItem of result.order_items) {
        console.log("Order item found:", orderItem);
        const { product, quantity } = orderItem;
        console.log("Updating inventory for product:", product);
        await strapi.entityService.update('api::product.product', product.id, {
          data: {
            inventory: product.inventory + quantity,
          },  
        });
      }

      // // Assign the order_items to the result for use in the subsequent code
      // console.log("result.order_items", result.order_items);
      // if (result.order_items && Array.isArray(result.order_items)) {
      //   for (const orderItem of result.order_items) {
      //     console.log("Order item found:", orderItem);

      //     if (orderItem && orderItem.product) {
      //       const { product, quantity } = orderItem;
      //       console.log("Updating inventory for product:", product, quantity);
            
      //       // Fetch the latest product data
      //       const latestProduct = await strapi.entityService.findOne('api::product.product', product.id, {
      //         fields: ['id', 'inventory'],
      //       });
      //       console.log("latestProduct", latestProduct);

      //       await strapi.entityService.update('api::product.product', latestProduct.id, {
      //         data: {
      //           inventory: latestProduct.inventory + quantity,
      //         },
      //       });
      //     }
      //   }

      //   // Delete the associated order items
      //   for (const orderItemId of result.order_items) {
      //     await strapi.entityService.delete('api::order-item.order-item', orderItemId);
      //   }
      // }
      // console.log("Event after delete:", event);
      return event;
    },
    async beforeDeleteMany(event) {
      throw new Error('Bulk deletion of orders is not allowed.');
    },
  
    // async afterDeleteMany(event) {
    //   console.log("After delete many Orders:", event);
    //   console.log("After delete many Orders params:", JSON.stringify(event.params, null, 2));

    //   const { where } = event.params;
    //   console.log("Where:", JSON.stringify(where, null, 2));
    //   if (where && where.$and && where.$and[0] && where.$and[0].id && where.$and[0].id.$in) {
    //     const deletedOrderIds = where.$and[0].id.$in;
    //     console.log("Deleted order IDs:", deletedOrderIds);

    //     for (const orderId of deletedOrderIds) {
    //       // Fetch the order items for this order
    //       const orderItems = await strapi.entityService.findMany('api::order-item.order-item', {
    //         filters: { order: orderId },
    //         populate: ['product'],
    //       });
    //       console.log("Order items:", JSON.stringify(orderItems, null, 2));

    //       for (const orderItem of orderItems) {
    //         if (orderItem.product) {
    //           const { product, quantity } = orderItem;
    //           console.log("Updating inventory for product:", product);
    //           await strapi.entityService.update('api::product.product', product.id, {
    //             data: {
    //               inventory: product.inventory + quantity,
    //             },
    //           });
    //         }

    //         // Delete the order item
    //         await strapi.entityService.delete('api::order-item.order-item', orderItem.id);
    //       }
    //     }
    //   } else {
    //     console.log("Unable to determine deleted order IDs from event params");
    //   }
    // },
  };