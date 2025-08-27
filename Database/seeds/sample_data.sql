-- Sample data for testing the movie application
-- This data can be loaded after running Django migrations

-- Sample movies (these would typically come from OMDB API)
INSERT INTO movies_movie (title, year, imdb_id, plot, genre, director, actors, runtime, imdb_rating, created_at, updated_at) VALUES
('The Shawshank Redemption', '1994', 'tt0111161', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 'Drama', 'Frank Darabont', 'Tim Robbins, Morgan Freeman', '142 min', '9.3', datetime('now'), datetime('now')),
('The Godfather', '1972', 'tt0068646', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 'Crime, Drama', 'Francis Ford Coppola', 'Marlon Brando, Al Pacino', '175 min', '9.2', datetime('now'), datetime('now')),
('The Dark Knight', '2008', 'tt0468569', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', 'Action, Crime, Drama', 'Christopher Nolan', 'Christian Bale, Heath Ledger', '152 min', '9.0', datetime('now'), datetime('now'));

-- Note: User data would be created through Django's User model
-- Favorites and reviews would be created through the API endpoints
