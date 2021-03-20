const { Client } = require('pg');
const DB = require('./config');

const connectionString = `postgres://${DB.DB_USERNAME}:${DB.DB_PASSWORD}@localhost:5432/${DB.DB_NAME}`;
const client = new Client(connectionString);

client.connect();

const getAllProducts = function(page, count, callback) {
  let startId = (page - 1) * count + 1;
  let endId = startId + count - 1;
  let queryString = `SELECT * FROM product WHERE id>=${startId} AND id<=${endId}`;

  client.query(queryString, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results.rows);
    }
  });
};

const getProductById = function(product_id, callback) {
  let queryStringOne = `SELECT * FROM product WHERE product.id=${product_id}`;
  let queryStringTwo = `SELECT feature, value FROM features WHERE productId=${product_id}`;

  client.query(queryStringOne, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      let response = results.rows[0];
      client.query(queryStringTwo, (err, results) => {
        if (err) {
          callback(err, null);
        } else {
          response.features = results.rows;
          callback(null, response);
        }
      });
    }
  });
};

const getAllStyles = function(product_id, callback) {
  let queryString = `SELECT st.id AS style_id, st.name, st.original_price, st.sale_price, st.default_style, p.thumbnail_url, p.url, sk.id AS sku_id, sk.size, sk.quantity FROM styles AS st, photos AS p, skus AS sk WHERE st.productId=${product_id} AND p.styleId=st.id AND sk.styleId=st.id`;
  let response = { product_id };

  client.query(queryString, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      let transformedResults = [];

      for (let i = 0; i < results.rows.length; i++) {
        let result = results.rows[i];
        let urls = [];
        let photos = [];
        let skus = {};
        let isNewStyle = true;

        for (let j = 0; j < transformedResults.length; j++) {
          if (transformedResults[j].style_id === result.style_id) {
            isNewStyle = false;
            break;
          }
        }

        if (isNewStyle) {
          for (let j = 0; j < results.rows.length; j++) {
            let style = results.rows[j];

            if (style.style_id === result.style_id && !urls.includes(style.url)) {
              urls.push(style.url);
              photos.push({thumbnail_url: style.thumbnail_url, url: style.url});
            }

            if (style.style_id === result.style_id && !skus[style.sku_id]) {
              skus[style.sku_id] = {quantity: style.quantity, size: style.size};
            }
          }

          result.original_price = result.original_price.toString();
          result.sale_price = result.sale_price ? result.sale_price.toString() : '0';
          result['default?'] = !!result.default_style;
          result.photos = photos;
          result.skus = skus;
          delete result.default_style;
          delete result.thumbnail_url;
          delete result.url;
          delete result.sku_id;
          delete result.quantity;
          delete result.size;
          transformedResults.push(result);
        }
      }

      response.results = results.rows;
      callback(null, response);
    }
  });
};

const getAllRelatedProducts = function(product_id, callback) {
  let queryString = `SELECT related_product_id FROM related WHERE current_product_id=${product_id}`;

  client.query(queryString, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results.rows.map(item => item.related_product_id));
    }
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  getAllStyles,
  getAllRelatedProducts
};