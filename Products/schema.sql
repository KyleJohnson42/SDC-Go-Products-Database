DROP DATABASE IF EXISTS products;

CREATE DATABASE products;

\c products;

CREATE TABLE product (
  id SERIAL,
  name TEXT,
  slogan TEXT,
  description TEXT,
  category TEXT,
  default_price INT,
  PRIMARY KEY (id)
);

CREATE TABLE features (
  id SERIAL,
  productId INT NOT NULL,
  feature TEXT,
  value TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (productId) REFERENCES product (id)
);

CREATE TABLE related (
  id SERIAL,
  current_product_id INT NOT NULL,
  related_product_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (current_product_id) REFERENCES product (id),
  FOREIGN KEY (related_product_id) REFERENCES product (id)
);

CREATE TABLE styles (
  id SERIAL,
  productId INT NOT NULL,
  name TEXT,
  sale_price INT,
  original_price INT,
  default_style INT,
  PRIMARY KEY (id),
  FOREIGN KEY (productId) REFERENCES product (id)
);

CREATE TABLE photos (
  id SERIAL,
  styleId INT NOT NULL,
  url TEXT,
  thumbnail_url TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (styleId) REFERENCES styles (id)
);

CREATE TABLE skus (
  id SERIAL,
  styleId INT NOT NULL,
  size TEXT,
  quantity INT,
  PRIMARY KEY (id),
  FOREIGN KEY (styleId) REFERENCES styles (id)
);