document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedback-form');
  const statusEl = document.getElementById('form-status');
  
  // The backend API endpoint
  const API_URL = 'https://awp-mini-project.onrender.com/api/feedback';

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop the form from reloading the page

    // Get values from the form
    const name = document.getElementById('name').value;
    const rating = document.getElementById('rating').value;
    const message = document.getElementById('message').value;

    // Clear previous status
    statusEl.textContent = '';
    statusEl.className = '';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, rating, message }),
      });

      if (response.ok) {
        // Success!
        statusEl.textContent = 'Thank you for your feedback!';
        statusEl.className = 'success';
        form.reset(); // Clear the form
      } else {
        // Handle server errors
        const errorData = await response.json();
        statusEl.textContent = `Error: ${errorData.msg || 'Submission failed.'}`;
        statusEl.className = 'error';
      }
    } catch (err) {
      // Handle network errors
      console.error('Fetch error:', err);
      statusEl.textContent = 'Network error. Please try again later.';
      statusEl.className = 'error';
    }
  });

});
