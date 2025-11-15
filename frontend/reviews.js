document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('reviews-container');
  
  // The backend API endpoint
  const API_URL = 'https://awp-mini-project.onrender.com/api/feedback';

  // Function to create the star rating
  function getStarRating(rating) {
    return '⭐'.repeat(rating);
  }

  // Function to format the date
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  async function fetchAndDisplayReviews() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews.');
      }

      const reviews = await response.json();

      // Clear the "Loading..." message
      container.innerHTML = '';

      if (reviews.length === 0) {
        container.innerHTML = '<p>No reviews yet. Be the first!</p>';
        return;
      }

      // Create and append a card for each review
      reviews.forEach((review) => {
        const card = document.createElement('div');
        card.className = 'review-card';

        card.innerHTML = `
          <h3>${review.name}</h3>
          <div class="rating">${getStarRating(review.rating)}</div>
          <p class="message">${review.message}</p>
        `;
        
        container.appendChild(card);
      });

    } catch (err) {
      console.error('Error fetching reviews:', err);
      container.innerHTML = '<p class="error">Failed to load reviews. Please try again later.</p>';
    }
  }

  // Initial load
  fetchAndDisplayReviews();

});
