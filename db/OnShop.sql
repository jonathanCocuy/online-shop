CREATE DATABASE online_shop;

USE online_shop;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user', -- user | admin
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  quantity INT DEFAULT 1,
  UNIQUE(user_id, product_id)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_name VARCHAR(255),
  price DECIMAL(10,2),
  quantity INT
);

SHOW TABLES;

SELECT * FROM users;





