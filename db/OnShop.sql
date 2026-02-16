-- ============================================
-- ONLINE SHOP - Query completa (MySQL)
-- Elimina la base y la recrea desde cero.
-- Ejecutar todo de una vez. Sin ALTER, solo DROP + CREATE + INSERT.
-- ============================================

DROP DATABASE IF EXISTS online_shop;
CREATE DATABASE online_shop;
USE online_shop;

-- --------------------------------------------
-- 1. Usuarios
-- --------------------------------------------
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------
-- 2. Categorías
-- --------------------------------------------
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (id, name) VALUES (1, 'technology');

-- --------------------------------------------
-- 3. Productos
-- --------------------------------------------
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url TEXT,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  category_id INT NOT NULL,
  user_id INT DEFAULT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_user_id ON products(user_id);

INSERT INTO products (name, description, price, stock, image_url, active, currency, category_id) VALUES
('Wireless Mouse', 'Ergonomic wireless mouse with 6 programmable buttons and precision tracking', 45, 15, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800', TRUE, 'USD', 1),
('Gaming Headset', 'Professional gaming headset with 7.1 surround sound and noise-canceling microphone', 89, 25, 'https://images.unsplash.com/photo-1599669454699-248893623440?w=800', TRUE, 'USD', 1),
('USB-C Hub', 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader', 35, 30, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800', TRUE, 'USD', 1),
('Webcam HD', 'Full HD 1080p webcam with autofocus and built-in microphone', 65, 18, 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=800', TRUE, 'USD', 1),
('Monitor Stand', 'Adjustable monitor stand with storage compartments and cable management', 55, 12, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', TRUE, 'USD', 1),
('Laptop Cooling Pad', 'Cooling pad with 5 quiet fans and adjustable height settings', 40, 22, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800', TRUE, 'USD', 1),
('Mechanical Keyboard', 'RGB mechanical gaming keyboard with blue switches and aluminum frame', 150, 10, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800', TRUE, 'USD', 1),
('Graphics Tablet', 'Digital drawing tablet with 8192 pressure levels and battery-free pen', 199, 8, 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800', TRUE, 'USD', 1),
('External SSD', '1TB portable SSD with USB 3.2 Gen 2 and read speeds up to 1050MB/s', 110, 35, 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800', TRUE, 'USD', 1),
('Desk Lamp LED', 'Adjustable LED desk lamp with touch controls and USB charging port', 48, 20, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800', TRUE, 'USD', 1),
('Wireless Charger', 'Fast wireless charging pad compatible with Qi-enabled devices', 28, 40, 'https://images.unsplash.com/photo-1591290619762-37788c84bde5?w=800', TRUE, 'USD', 1),
('HDMI Cable 4K', 'Premium HDMI 2.1 cable supporting 4K at 120Hz and 8K at 60Hz', 22, 50, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', TRUE, 'USD', 1);

-- --------------------------------------------
-- 4. Carrito
-- --------------------------------------------
CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_product (user_id, product_id),
  CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_cart_user_id ON cart_items(user_id);

-- --------------------------------------------
-- 5. Favoritos
-- --------------------------------------------
CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_favorite (user_id, product_id),
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_favorites_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- --------------------------------------------
-- 6. Pedidos
-- --------------------------------------------
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- --------------------------------------------
-- 7. Ítems de pedido
-- --------------------------------------------
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_name VARCHAR(255),
  price DECIMAL(10,2),
  quantity INT,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
