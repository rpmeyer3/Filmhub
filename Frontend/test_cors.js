import fetch from 'node-fetch';

fetch('http://localhost:8000/api/movies/', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Origin': 'http://localhost:3001'
  }
})
.then(response => {
  console.log('Status:', response.status);
  console.log('CORS Headers:');
  console.log('  Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
  console.log('  Access-Control-Allow-Credentials:', response.headers.get('Access-Control-Allow-Credentials'));
  return response.json();
})
.then(data => {
  console.log('Success! Received', data.count, 'movies');
  console.log('First movie:', data.movies[0].title);
  
  // Test the filtering logic
  const movies = data.movies;
  const running = movies.filter(m => m.is_running === true);
  const comingSoon = movies.filter(m => m.is_coming_soon === true);
  
  console.log('Running movies:', running.length, '- Titles:', running.map(m => m.title));
  console.log('Coming soon movies:', comingSoon.length, '- Titles:', comingSoon.map(m => m.title));
})
.catch(err => console.error('Error:', err));