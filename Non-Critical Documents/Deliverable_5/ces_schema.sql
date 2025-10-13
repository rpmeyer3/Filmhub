-- Cinema E-Booking System (CES) Database Schema
-- Target platform: MySQL 8.0+

/*
    Running the script:
    1. Adjust the schema name as desired.
    2. Execute in a MySQL client with sufficient privileges.
*/

CREATE SCHEMA IF NOT EXISTS ces;
USE ces;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS ticket_types;
DROP TABLE IF EXISTS shows;
DROP TABLE IF EXISTS showrooms;
DROP TABLE IF EXISTS cinemas;
DROP TABLE IF EXISTS payment_cards;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS customer_states;
DROP TABLE IF EXISTS movies;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE movies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    duration_minutes SMALLINT UNSIGNED NOT NULL,
    synopsis TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE customer_states (
    code VARCHAR(20) PRIMARY KEY,
    description VARCHAR(100) NOT NULL
) ENGINE = InnoDB;

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'CUSTOMER') NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE admins (
    user_id BIGINT UNSIGNED PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE customers (
    user_id BIGINT UNSIGNED PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    state_code VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (state_code) REFERENCES customer_states(code)
) ENGINE = InnoDB;

CREATE TABLE payment_cards (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED NOT NULL,
    card_number VARCHAR(25) NOT NULL,
    billing_address VARCHAR(255) NOT NULL,
    expiration_date DATE NOT NULL,
    nickname VARCHAR(50) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_payment_cards_number (card_number),
    FOREIGN KEY (customer_id) REFERENCES customers(user_id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE cinemas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE showrooms (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cinema_id BIGINT UNSIGNED NOT NULL,
    label VARCHAR(50) NOT NULL,
    capacity SMALLINT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_showroom_label (cinema_id, label),
    FOREIGN KEY (cinema_id) REFERENCES cinemas(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE shows (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    showroom_id BIGINT UNSIGNED NOT NULL,
    movie_id BIGINT UNSIGNED NOT NULL,
    start_time DATETIME NOT NULL,
    duration_minutes SMALLINT UNSIGNED NOT NULL,
    FOREIGN KEY (showroom_id) REFERENCES showrooms(id) ON DELETE RESTRICT,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE RESTRICT,
    UNIQUE KEY uq_show_start (showroom_id, start_time)
) ENGINE = InnoDB;

CREATE TABLE ticket_types (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(100) NOT NULL,
    base_price DECIMAL(8,2) NOT NULL CHECK (base_price >= 0)
) ENGINE = InnoDB;

CREATE TABLE promotions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    expiration_date DATE NULL
) ENGINE = InnoDB;

CREATE TABLE bookings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED NOT NULL,
    show_id BIGINT UNSIGNED NOT NULL,
    promotion_id BIGINT UNSIGNED NULL,
    booking_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    FOREIGN KEY (customer_id) REFERENCES customers(user_id) ON DELETE CASCADE,
    FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE RESTRICT,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE TABLE tickets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT UNSIGNED NOT NULL,
    show_id BIGINT UNSIGNED NOT NULL,
    ticket_type_id BIGINT UNSIGNED NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    price DECIMAL(8,2) NOT NULL CHECK (price >= 0),
    UNIQUE KEY uq_ticket_show_seat (show_id, seat_number),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE RESTRICT,
    FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(id) ON DELETE RESTRICT
) ENGINE = InnoDB;

-- Seed lookup values
INSERT INTO customer_states (code, description) VALUES
    ('ACTIVE', 'Active customer'),
    ('INACTIVE', 'Inactive customer'),
    ('SUSPENDED', 'Suspended customer')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO ticket_types (code, description, base_price) VALUES
    ('ADULT', 'Adult ticket', 15.00),
    ('SENIOR', 'Senior ticket', 12.00),
    ('CHILD', 'Child ticket', 10.00)
ON DUPLICATE KEY UPDATE description = VALUES(description), base_price = VALUES(base_price);

-- Business rule enforcement: limit three cards per customer
DELIMITER $$
CREATE TRIGGER trg_limit_payment_cards
BEFORE INSERT ON payment_cards
FOR EACH ROW
BEGIN
    IF (SELECT COUNT(*) FROM payment_cards WHERE customer_id = NEW.customer_id) >= 3 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Customers may store up to 3 payment cards.';
    END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_ticket_show_consistency
BEFORE INSERT ON tickets
FOR EACH ROW
BEGIN
    DECLARE booking_show BIGINT UNSIGNED;
    SELECT show_id INTO booking_show FROM bookings WHERE id = NEW.booking_id;
    IF booking_show IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Booking does not exist.';
    ELSEIF booking_show <> NEW.show_id THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ticket show must match booking show.';
    END IF;
END $$
DELIMITER ;
