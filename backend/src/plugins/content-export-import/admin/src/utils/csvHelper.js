const VALUE_DELIMITER = ',';
const ROW_DELIMITER = '\n';

const getRow = (keys, item) => keys.map(k => removeNewLines(item[k])).join(VALUE_DELIMITER);

const removeNewLines = (value) => (typeof value === 'string')
  ? value.replace(/\n/g, ' ')
  : value;

export const convertToCsv = (data) => {
  if (!data || typeof data !== 'object') return '';
  const hasRows = Array.isArray(data);
  let keys = hasRows ? Object.keys(data[0]) : Object.keys(data);
  let rows = hasRows
    ? data.map(item => getRow(keys, item)).join(ROW_DELIMITER)
    : getRow(keys, data);
  // Detect if this is an order
  console.log(keys, 'keys');
  if (keys.includes("order_items")) {
    // Add new columns for order items
    keys = [...keys.filter(k => k !== "order_items"), "product_name", "product_price", "product_quantity", "product_total"];
    
    let csvRows = [];
    const processOrder = (order) => {
      const baseOrderData = keys.filter(k => k !== "product_name" && k !== "product_price" && k !== "product_quantity" && k !== "product_total")
        .map(k => removeNewLines(order[k]));
      
      order.order_items.forEach((item, index) => {
        const lineItemTotal = (parseFloat(item.price) * parseInt(item.quantity)).toFixed(2);
        const sanitizedItemName = removeNewLines(item.display_name).split('- Quantity')[0];
        // if index is 0, add the base order data, otherwise add empty strings for the order specific keys
        // count the number of order specific keys
        // create orderSpecificKeys array
        const orderSpecificKeys = keys.filter(k => k !== "product_name" && k !== "product_price" && k !== "product_quantity" && k !== "product_total");
        const orderSpecificKeysCount = orderSpecificKeys.length;
        
        const rowData = [
          ...(index === 0 ? baseOrderData : baseOrderData.map((datum, index) => index == 0 ? datum : '')),
          sanitizedItemName,
          item.price/parseInt(item.quantity),
          item.quantity,
          item.price
        ];
        csvRows.push(rowData.join(VALUE_DELIMITER));
      });
    };

    if (hasRows) {
      data.forEach(processOrder);
    } else {
      processOrder(data);
    }
    
    rows = csvRows.join(ROW_DELIMITER);
     // rename key total to order_total
     keys = keys.map(k => k === "total" ? "order_total" : k);
     keys = keys.map(k => k === "id" ? "order_id" : k);
     
  } else {
    rows = hasRows
      ? data.map(item => getRow(keys, item)).join(ROW_DELIMITER)
      : getRow(keys, data);
  }

  return [keys.join(VALUE_DELIMITER), rows].join(ROW_DELIMITER);
}
