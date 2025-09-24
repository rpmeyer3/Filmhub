from django.core.management.base import BaseCommand
from movies.models import Movie


class Command(BaseCommand):
    help = 'Populate database with sample movie data for demo'

    def handle(self, *args, **options):
        # Sample movie data for demo purposes
        sample_movies = [
            {
                'title': 'The Matrix',
                'year': '1999',
                'imdb_id': 'tt0133093',
                'plot': 'A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.',
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
                'genre': 'Action, Sci-Fi',
                'director': 'Lana Wachowski, Lilly Wachowski',
                'actors': 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
                'runtime': '136 min',
                'imdb_rating': '8.7'
            },
            {
                'title': 'Inception',
                'year': '2010',
                'imdb_id': 'tt1375666',
                'plot': 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
                'genre': 'Action, Drama, Sci-Fi',
                'director': 'Christopher Nolan',
                'actors': 'Leonardo DiCaprio, Marion Cotillard, Ellen Page',
                'runtime': '148 min',
                'imdb_rating': '8.8'
            },
            {
                'title': 'The Dark Knight',
                'year': '2008',
                'imdb_id': 'tt0468569',
                'plot': 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
                'genre': 'Action, Crime, Drama',
                'director': 'Christopher Nolan',
                'actors': 'Christian Bale, Heath Ledger, Aaron Eckhart',
                'runtime': '152 min',
                'imdb_rating': '9.0'
            },
            {
                'title': 'Interstellar',
                'year': '2014',
                'imdb_id': 'tt0816692',
                'plot': 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
                'genre': 'Adventure, Drama, Sci-Fi',
                'director': 'Christopher Nolan',
                'actors': 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
                'runtime': '169 min',
                'imdb_rating': '8.6'
            },
            {
                'title': 'Avengers: Endgame',
                'year': '2019',
                'imdb_id': 'tt4154796',
                'plot': 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos\' actions.',
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg',
                'genre': 'Action, Adventure, Drama',
                'director': 'Anthony Russo, Joe Russo',
                'actors': 'Robert Downey Jr., Chris Evans, Mark Ruffalo',
                'runtime': '181 min',
                'imdb_rating': '8.4'
            },
            {
                'title': 'Spider-Man: No Way Home',
                'year': '2021',
                'imdb_id': 'tt10872600',
                'plot': 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.',
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_SX300.jpg',
                'genre': 'Action, Adventure, Fantasy',
                'director': 'Jon Watts',
                'actors': 'Tom Holland, Zendaya, Benedict Cumberbatch',
                'runtime': '148 min',
                'imdb_rating': '8.2'
            },
            {
                'title': 'Dune: Part Two',
                'year': '2024',
                'imdb_id': 'tt15239678',
                'plot': 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg',
                'genre': 'Action, Adventure, Drama',
                'director': 'Denis Villeneuve',
                'actors': 'Timothée Chalamet, Zendaya, Rebecca Ferguson',
                'runtime': '166 min',
                'imdb_rating': '8.8'
            },
            {
                'title': 'Oppenheimer',
                'year': '2023',
                'imdb_id': 'tt15398776',
                'plot': 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
                'poster_url': 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg',
                'genre': 'Biography, Drama, History',
                'director': 'Christopher Nolan',
                'actors': 'Cillian Murphy, Emily Blunt, Robert Downey Jr.',
                'runtime': '180 min',
                'imdb_rating': '8.4'
            }
        ]

        # Clear existing movies
        Movie.objects.all().delete()
        self.stdout.write('Cleared existing movie data')

        # Create sample movies
        created_count = 0
        for movie_data in sample_movies:
            movie, created = Movie.objects.get_or_create(
                imdb_id=movie_data['imdb_id'],
                defaults=movie_data
            )
            if created:
                created_count += 1
                self.stdout.write(f'Created movie: {movie.title}')
            else:
                self.stdout.write(f'Movie already exists: {movie.title}')

        self.stdout.write(
            self.style.SUCCESS(f'Successfully populated database with {created_count} movies')
        )