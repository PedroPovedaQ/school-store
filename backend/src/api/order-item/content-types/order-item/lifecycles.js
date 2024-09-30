module.exports = {
  async beforeCreate(event) {
    console.log("beforeCreate", event);
    const { data } = event.params;
    console.log("data", data);
    await setDisplayName(data);
  },
  async beforeUpdate(event) {
    const { data } = event.params;
    // Retrieve the entire order item data using the entityService API
    const orderItem = await strapi.entityService.findOne('api::order-item.order-item', event.params.where.id, {
      populate: ['product'],
    });

    if (orderItem) {
      // Update the data object with the retrieved information
      data.product = orderItem.product;
      data.quantity = orderItem.quantity;
    } else {
      console.error('Order item not found');
    }
   data.display_name = await setDisplayName(orderItem);
  },
};

async function setDisplayName(data) {
  let productId;
  console.log("data", JSON.stringify(data));
  productId = data.product?.id ? data.product.id : data.product;

  if (productId && data.quantity) {
    console.log("productId", productId, "quantity", data.quantity);
    
    // Fetch the product with populated data
    const product = await strapi.entityService.findOne('api::product.product', productId, {
      populate: ['name'],
    });
    console.log("product", product);

    if (product) {
      data.display_name = `${product.name} - Quantity: ${data.quantity}`;
    } else {
      console.error(`Product with id ${productId} not found`);
      data.display_name = `Unknown Product - Quantity: ${data.quantity}`;
    }
  } else {
    console.error('Product ID or quantity is missing', { productId, quantity: data.quantity });
    data.display_name = 'Invalid Order Item';
  }
  return data.display_name;
}