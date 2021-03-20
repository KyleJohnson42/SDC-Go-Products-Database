const express = require('express');
const db = require('./database');

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/products', (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let count = parseInt(req.query.count) || 5;

  db.getAllProducts(page, count, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

app.get('/products/:product_id', (req, res) => {
  let product_id = req.params.product_id;

  db.getProductById(product_id, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

app.get('/products/:product_id/styles', (req, res) => {
  let product_id = req.params.product_id;

  db.getAllStyles(product_id, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

app.get('/products/:product_id/related', (req, res) => {
  let product_id = req.params.product_id;

  db.getAllRelatedProducts(product_id, (err, results) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(results);
    }
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});