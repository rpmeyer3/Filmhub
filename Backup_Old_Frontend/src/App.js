import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Movie App</h1>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to the Movie App!</h2>
          <p className="text-gray-600">
            This is a placeholder for your movie application. The frontend is set up with React and Tailwind CSS.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
