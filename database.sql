DROP DATABASE IF EXISTS hotbyte;
CREATE DATABASE IF NOT EXISTS hotbyte;
USE hotbyte;
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    gender VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE RESTRICT
);

CREATE TABLE user_addresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    zip_code VARCHAR(20),
    is_default BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_address_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE restaurants (
    restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_user_id INT NOT NULL,
    restaurant_name VARCHAR(150) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_restaurant_owner FOREIGN KEY (owner_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE restaurant_addresses (
    restaurant_address_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL UNIQUE,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    CONSTRAINT fk_address_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE
);

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE menu_items (
    menu_item_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    category_id INT NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    availability_time VARCHAR(100),
    dietary_info VARCHAR(50),
    taste_info VARCHAR(100),
    nutritional_info TEXT,
    is_out_of_stock BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_menu_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
    CONSTRAINT fk_menu_category FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT
);

CREATE TABLE menu_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    menu_item_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    display_order INT DEFAULT 1,
    CONSTRAINT fk_menuimage_menu FOREIGN KEY (menu_item_id) REFERENCES menu_items(menu_item_id) ON DELETE CASCADE
);

CREATE TABLE carts (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    total_cost DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_cartitem_cart FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
    CONSTRAINT fk_cartitem_menu FOREIGN KEY (menu_item_id) REFERENCES menu_items(menu_item_id) ON DELETE CASCADE
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    shipping_address_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'Pending',
    payment_method VARCHAR(50) NOT NULL,
    estimated_delivery_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_order_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE RESTRICT,
    CONSTRAINT fk_order_address FOREIGN KEY (shipping_address_id) REFERENCES user_addresses(address_id) ON DELETE RESTRICT
);

CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    purchased_price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_orderitem_menu FOREIGN KEY (menu_item_id) REFERENCES menu_items(menu_item_id) ON DELETE RESTRICT
);

CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,
    payment_status VARCHAR(50) DEFAULT 'Pending',
    amount DECIMAL(10, 2) NOT NULL,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

CREATE TABLE order_tracking (
    tracking_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status_update VARCHAR(100) NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tracking_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

SHOW TABLES;
use hotbyte;
USE hotbyte;

-- Roles
INSERT INTO roles (role_name, description) VALUES 
('ADMIN', 'System Administrator'),
('CUSTOMER', 'Regular Customer'),
('RESTAURANT_OWNER', 'Restaurant Owner'),
('DELIVERY_PARTNER', 'Delivery Partner'),
('SUPPORT', 'Customer Support Staff');

-- Users
INSERT INTO users (role_id, full_name, email, password_hash, contact_number, gender, is_active) VALUES
(1, 'Admin User', 'admin@hotbyte.com', '$2a$10$MoxOHJ7PkMidUWC5KFjbCO5/fTiMVwQhy09AVEPzXHqqo0AE7oQ5C', '9999999999', 'Other', 1),
(2, 'Customer John', 'john@gmail.com', '$2a$10$MoxOHJ7PkMidUWC5KFjbCO5/fTiMVwQhy09AVEPzXHqqo0AE7oQ5C', '9876543210', 'Male', 1),
(3, 'Restaurant Owner Bob', 'bob@pizza.com', '$2a$10$MoxOHJ7PkMidUWC5KFjbCO5/fTiMVwQhy09AVEPzXHqqo0AE7oQ5C', '8888888888', 'Male', 1),
(3, 'Restaurant Owner Alice', 'alice@burger.com', '$2a$10$MoxOHJ7PkMidUWC5KFjbCO5/fTiMVwQhy09AVEPzXHqqo0AE7oQ5C', '7777777777', 'Female', 1),
(4, 'Delivery Guy Dave', 'dave@deliver.com', '$2a$10$MoxOHJ7PkMidUWC5KFjbCO5/fTiMVwQhy09AVEPzXHqqo0AE7oQ5C', '6666666666', 'Male', 1);

-- User Addresses
INSERT INTO user_addresses (user_id, address_line_1, city, state, zip_code, is_default) VALUES 
(2, '123 Customer St', 'New York', 'NY', '10001', TRUE),
(2, '456 Secondary St', 'New York', 'NY', '10002', FALSE),
(3, '789 Owner Ave', 'Los Angeles', 'CA', '90001', TRUE),
(4, '321 Delivery Blvd', 'Chicago', 'IL', '60007', TRUE),
(5, '654 Support Road', 'Houston', 'TX', '77001', TRUE);

-- Restaurants
INSERT INTO restaurants (owner_user_id, restaurant_name, contact_number, is_active, created_at) VALUES 
(3, 'Charlie''s Pizzeria', '3334445551', TRUE, NOW()),
(3, 'Charlie''s Burger Joint', '3334445552', TRUE, NOW()),
(3, 'Charlie''s Vegan Cafe', '3334445553', TRUE, NOW()),
(3, 'Charlie''s Sushi', '3334445554', TRUE, NOW()),
(3, 'Charlie''s Desserts', '3334445555', TRUE, NOW());

-- Restaurant Addresses
INSERT INTO restaurant_addresses (restaurant_id, address_line_1, address_line_2, city, state, zip_code) VALUES 
(1, '100 Pizza Lane', NULL, 'Los Angeles', 'CA', '90002'),
(2, '200 Burger Blvd', NULL, 'Los Angeles', 'CA', '90003'),
(3, '300 Vegan Ave', NULL, 'Los Angeles', 'CA', '90004'),
(4, '400 Sushi Way', NULL, 'Los Angeles', 'CA', '90005'),
(5, '500 Dessert St', NULL, 'Los Angeles', 'CA', '90006');

-- Categories
INSERT INTO categories (category_name, description) VALUES 
('Breakfast', 'Morning meals to start the day'),
('Lunch', 'Mid-day meals'),
('Dinner', 'Evening meals'),
('Appetizer', 'Starters and light bites'),
('Main Course', 'Hearty and fulfilling main dishes'),
('Dessert', 'Sweet treats and cakes'),
('Burger', 'Juicy grilled burgers'),
('Pizza', 'Authentic Italian Pizzas'),
('Italian', 'Pasta, pizzas, and Italian classics'),
('Arabian', 'Shawarmas, kebabs, and Arabian delights'),
('Chinese', 'Noodles, rice, and stir-fries'),
('South Indian', 'Dosas, idlis, and traditional dishes'),
('North Indian', 'Curries, naan, and tandoori specials'),
('Beverages', 'Refreshing drinks and shakes'),
('Fast Food', 'Quick and tasty meals'),
('Snacks', 'Light bites for anytime'),
('Vegetarian', 'Pure vegetarian meals'),
('Non Vegetarian', 'Meat and poultry dishes'),
('Vegan', 'Healthy plant-based meals'),
('Others', 'Miscellaneous items');

-- Menu Items
INSERT INTO menu_items (restaurant_id, category_id, item_name, description, price, discount_price, availability_time, dietary_info, taste_info, nutritional_info, is_out_of_stock, created_at) VALUES 
(1, 1, 'Margherita Pizza', 'Classic cheese and tomato pizza', 12.99, NULL, '10:00-22:00', 'Vegetarian', 'Savory', '500 kcal', FALSE, NOW()),
(2, 2, 'Cheeseburger', 'Beef patty with cheese', 8.99, 7.99, '11:00-23:00', 'Non-Vegetarian', 'Savory', '800 kcal', FALSE, NOW()),
(3, 3, 'Vegan Salad', 'Mixed greens with vinaigrette', 10.99, NULL, '08:00-20:00', 'Vegan', 'Fresh', '200 kcal', FALSE, NOW()),
(4, 4, 'Spicy Tuna Roll', 'Tuna with spicy mayo', 14.99, 12.99, '12:00-22:00', 'Pescatarian', 'Spicy', '400 kcal', FALSE, NOW()),
(5, 5, 'Chocolate Cake', 'Rich chocolate layer cake', 6.99, NULL, '10:00-23:00', 'Vegetarian', 'Sweet', '600 kcal', FALSE, NOW());

-- Carts
INSERT INTO carts (user_id, total_cost, created_at, updated_at) VALUES 
(2, 0.00, NOW(), NOW()),
(3, 0.00, NOW(), NOW()),
(4, 0.00, NOW(), NOW()),
(5, 0.00, NOW(), NOW()),
(1, 0.00, NOW(), NOW());

-- Cart Items
INSERT INTO cart_items (cart_id, menu_item_id, quantity, unit_price) VALUES 
(1, 1, 2, 12.99),
(1, 2, 1, 7.99),
(2, 3, 3, 10.99),
(3, 4, 1, 12.99),
(4, 5, 4, 6.99);

-- Update Carts total cost based on items
UPDATE carts SET total_cost = (SELECT SUM(quantity * unit_price) FROM cart_items WHERE cart_items.cart_id = carts.cart_id) WHERE cart_id IN (1, 2, 3, 4);

-- Orders
INSERT INTO orders (user_id, restaurant_id, shipping_address_id, total_amount, order_status, payment_method, estimated_delivery_time, created_at) VALUES 
(2, 1, 1, 25.98, 'Delivered', 'Credit Card', DATE_ADD(NOW(), INTERVAL 30 MINUTE), NOW()),
(2, 2, 1, 7.99, 'Pending', 'PayPal', DATE_ADD(NOW(), INTERVAL 45 MINUTE), NOW()),
(3, 3, 3, 32.97, 'In Transit', 'Cash on Delivery', DATE_ADD(NOW(), INTERVAL 20 MINUTE), NOW()),
(4, 4, 4, 12.99, 'Preparing', 'Credit Card', DATE_ADD(NOW(), INTERVAL 60 MINUTE), NOW()),
(5, 5, 5, 27.96, 'Delivered', 'Debit Card', DATE_ADD(NOW(), INTERVAL 40 MINUTE), NOW());

-- Order Items
INSERT INTO order_items (order_id, menu_item_id, quantity, purchased_price) VALUES 
(1, 1, 2, 12.99),
(2, 2, 1, 7.99),
(3, 3, 3, 10.99),
(4, 4, 1, 12.99),
(5, 5, 4, 6.99);

-- Payments
INSERT INTO payments (order_id, transaction_id, payment_status, amount, processed_at) VALUES 
(1, 'TXN10001', 'Completed', 25.98, NOW()),
(2, 'TXN10002', 'Pending', 7.99, NOW()),
(3, 'TXN10003', 'Completed', 32.97, NOW()),
(4, 'TXN10004', 'Completed', 12.99, NOW()),
(5, 'TXN10005', 'Completed', 27.96, NOW());

-- Order Tracking
INSERT INTO order_tracking (order_id, status_update, description, updated_at) VALUES 
(1, 'Delivered', 'Order has been delivered to the customer', NOW()),
(2, 'Order Placed', 'Order received by restaurant', NOW()),
(3, 'In Transit', 'Driver is on the way', NOW()),
(4, 'Preparing', 'Restaurant is preparing the food', NOW()),
(5, 'Delivered', 'Order has been delivered to the customer', NOW());


