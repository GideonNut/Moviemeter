// Script to add sample TV series to the database
// Run this with: node scripts/add-sample-tv-shows.js

const sampleTVShows = [
  {
    title: "The Last of Us (2023)",
    description: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZGUzYTI3M2EtZmM0Yy00NGUyLWI4NzEtN2VjYzA0NzJmNjkxXkEyXkFqcGdeQXVyMTM1NjM2ODg1._V1_.jpg",
    isTVSeries: true
  },
  {
    title: "House of the Dragon (2022)",
    description: "The story of House Targaryen set 200 years before the events of Game of Thrones.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZjRlZDIyNDMtYzEwZi00NWE1LTlmZWQtYzY4ODA1MmQxZWRmXkEyXkFqcGdeQXVyMTM1NjM2ODg1._V1_.jpg",
    isTVSeries: true
  },
  {
    title: "Severance (2022)",
    description: "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjkwMzYyOTg3NF5BMl5BanBnXkFtZTgwODUwMjM0NzM@._V1_.jpg",
    isTVSeries: true
  },
  {
    title: "The Bear (2022)",
    description: "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BOWY4MmFiY2QtMzE2YS00NzY3LWFjMTQtYzBjMjJmNjlkOTZkXkEyXkFqcGdeQXVyMTM1NjM2ODg1._V1_.jpg",
    isTVSeries: true
  },
  {
    title: "Shogun (2024)",
    description: "A bold English navigator becomes both a player and pawn in complex political games in feudal Japan.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZjRlZDIyNDMtYzEwZi00NWE1LTlmZWQtYzY4ODA1MmQxZWRmXkEyXkFqcGdeQXVyMTM1NjM2ODg1._V1_.jpg",
    isTVSeries: true
  }
];

async function addSampleTVShows() {
  try {
    for (const show of sampleTVShows) {
      const response = await fetch('http://localhost:3000/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(show),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Added: ${show.title}`);
      } else {
        console.error(`❌ Failed to add: ${show.title}`);
      }
    }
    console.log('🎉 Sample TV shows added successfully!');
  } catch (error) {
    console.error('Error adding sample TV shows:', error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  addSampleTVShows();
}

module.exports = { addSampleTVShows };
