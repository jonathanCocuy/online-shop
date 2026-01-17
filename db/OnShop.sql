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

INSERT INTO products 
  (name, description, price, stock, image_url, active, category)
  VALUES
  ('Wireless Mouse', 'Ergonomic wireless mouse with 6 programmable buttons and precision tracking', 45, 15, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800', true, 'technology'),
('Gaming Headset', 'Professional gaming headset with 7.1 surround sound and noise-canceling microphone', 89, 25, 'https://images.unsplash.com/photo-1599669454699-248893623440?w=800', true, 'technology'),
('USB-C Hub', 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader', 35, 30, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800', true, 'technology'),
('Webcam HD', 'Full HD 1080p webcam with autofocus and built-in microphone', 65, 18, 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=800', true, 'technology'),
('Monitor Stand', 'Adjustable monitor stand with storage compartments and cable management', 55, 12, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', true, 'technology'),
('Laptop Cooling Pad', 'Cooling pad with 5 quiet fans and adjustable height settings', 40, 22, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800', true, 'technology'),
('Mechanical Keyboard', 'RGB mechanical gaming keyboard with blue switches and aluminum frame', 150, 10, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800', true, 'technology'),
('Graphics Tablet', 'Digital drawing tablet with 8192 pressure levels and battery-free pen', 199, 8, 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800', true, 'technology'),
('External SSD', '1TB portable SSD with USB 3.2 Gen 2 and read speeds up to 1050MB/s', 110, 35, 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800', true, 'technology'),
('Desk Lamp LED', 'Adjustable LED desk lamp with touch controls and USB charging port', 48, 20, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800', true, 'technology'),
('Wireless Charger', 'Fast wireless charging pad compatible with Qi-enabled devices', 28, 40, 'https://images.unsplash.com/photo-1591290619762-37788c84bde5?w=800', true, 'technology'),
('HDMI Cable 4K', 'Premium HDMI 2.1 cable supporting 4K at 120Hz and 8K at 60Hz', 22, 50, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', true, 'technology');

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

SELECT * FROM products;

DELETE from products where id;

ALTER TABLE products ADD category varchar(255)