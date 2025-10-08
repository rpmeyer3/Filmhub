Deliverable 5 — Cinema E-Booking System Database Schema

Assignment context

Goal: Map the Cinema E-Booking System (CES) domain model to a relational schema and deliver a runnable database definition.
Scope: Include every entity from the class diagram, define keys, constraints, and relationships, and prepare the schema for demonstration during Deliverable 6.
Submission: No formal upload is required, but the schema must be ready to execute in MySQL (or another relational database) when presenting Deliverable 6.
Reference diagram: ../Deliverble_4/diagram.mermaid (Mermaid class diagram).

Domain to relational mapping

User, Admin, Customer -> users, admins, customers, customer_states. The users table stores shared authentication data and the role; subtype tables capture admin and customer details. Customer state is normalized into a lookup table.
PaymentCard -> payment_cards. Unique card numbers per system, and a trigger enforces a maximum of three saved cards per customer.
Cinema, Showroom -> cinemas, showrooms. Supports one cinema (or more if needed) with labelled showrooms and capacity metadata.
Movie -> movies. Stores title, genre, runtime, and optional synopsis.
Show -> shows. Associates a movie with a showroom and start time and enforces one show per showroom timeslot.
Booking -> bookings. Connects a customer to a show, optionally referencing a promotion.
Ticket -> tickets, ticket_types. Tracks per-seat sales tied to bookings and ticket type definitions.
Promotion -> promotions. Holds discount percentage and expiration details with validation.

Table definitions and keys

users
PK: id
Columns: username (unique), password_hash, role
Purpose: Shared authentication record for admins and customers.

admins
PK and FK: user_id pointing to users.id
Notes: Subtype marker for admin accounts.

customer_states
PK: code (values include ACTIVE, INACTIVE, SUSPENDED)
Usage: Referenced by customers.state_code.

customers
PK and FK: user_id pointing to users.id
Columns: first_name, last_name, email (unique), state_code
Constraints: Email unique per system.

payment_cards
PK: id
FK: customer_id pointing to customers.user_id
Constraints: Unique card_number and a trigger prevents more than three cards per customer.

cinemas
PK: id
Columns: name, location
Notes: Supports the required theatre with potential future expansion.

showrooms
PK: id
FK: cinema_id pointing to cinemas.id
Constraints: Unique combination of cinema_id and label, capacity stored as a positive integer.

movies
PK: id
Columns: title, genre, duration_minutes, synopsis
Notes: Duration stored in minutes per requirements.

shows
PK: id
FK: showroom_id pointing to showrooms.id and movie_id pointing to movies.id
Constraints: Unique combination of showroom_id and start_time, duration_minutes stored alongside the start time.

ticket_types
PK: id
Columns: code, description, base_price
Usage: Lookup for Adult, Senior, and Child ticket categories with room to extend.

promotions
PK: id
Columns: code, description, discount_percentage, expiration_date
Constraints: Discount bounded between 0 and 100 percent and promotion codes unique.

bookings
PK: id
FK: customer_id pointing to customers.user_id, show_id pointing to shows.id, promotion_id (nullable) pointing to promotions.id
Constraints: total_price must be non-negative and booking_date defaults to creation timestamp.

tickets
PK: id
FK: booking_id pointing to bookings.id, show_id pointing to shows.id, ticket_type_id pointing to ticket_types.id
Constraints: Unique combination of show_id and seat_number, and a trigger ensures ticket records match the show referenced by the booking.

Relationship summary

User hierarchy: users.role differentiates admins and customers while subtype tables reinforce referential integrity.
Customer lifecycle: customers.state_code references customer_states to enforce active, inactive, and suspended states.
Cinema layout: cinemas relate one to many with showrooms through showrooms.cinema_id.
Programme scheduling: shows connect movies to showroom timeslots, and bookings and tickets reference the show to maintain integrity.
Sales flow: customers relate one to many with bookings and bookings relate one to many with tickets; promotions optionally discount bookings and ticket types drive pricing granularity.
Payment storage: payment_cards.customer_id ensures cards belong to a single customer with enforced storage limits.

Constraint highlights

Enumerations: customer_states and ticket_types seeded with the mandated values.
Seat availability: Unique show_id and seat_number pairing prevents duplicate seat assignments per show.
Promotion validity: discount_percentage constrained between 0 and 100 and expiration_date stores the cutoff for use.
Business triggers: trg_limit_payment_cards caps stored cards per customer at three, and trg_ticket_show_consistency guarantees tickets reference the same show as their booking.

SQL implementation

The full schema lives in ces_schema.sql. Example DDL: CREATE SCHEMA IF NOT EXISTS ces; USE ces; CREATE TABLE users (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, role ENUM(ADMIN, CUSTOMER) NOT NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP); additional statements in the file create the remaining tables, foreign keys, seed data, and triggers.

Running the script (MySQL 8.0 or newer)

Run SOURCE path/to/ces_schema.sql in your MySQL client.

After execution, run quick integrity checks such as SHOW TABLES FROM ces; SELECT * FROM ces.customer_states; SELECT * FROM ces.ticket_types.

Demo preparation for Deliverable 6

Step 1: Import the schema into a MySQL instance (local container, managed service, and so on).
Step 2: Seed a minimal dataset that includes a cinema, showrooms, movies, shows, a customer, a booking, and tickets.
Step 3: Exercise triggers by trying to add a fourth payment card and a mismatched ticket to demonstrate enforcement.
Step 4: Prepare SQL snippets or UI mockups to showcase CRUD operations across key entities.

Next steps and enhancements

Extend the seed data with richer examples for demos.
Add additional constraints, such as ensuring showtimes are future dated, via stored procedures or application logic.
Coordinate with Deliverable 6 so API and data layers align with this schema through migrations or ORM models.

