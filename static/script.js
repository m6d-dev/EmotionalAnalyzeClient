const form = document.getElementById('emotionForm');
const resultsDiv = document.getElementById('results');

const colors = {
    angry: '#e53935',
    disgust: '#4caf50',
    fear: '#9c27b0',
    happy: '#ffeb3b',
    sad: '#2196f3',
    surprise: '#ff9800',
    neutral: '#9e9e9e'
};

document.addEventListener('DOMContentLoaded', () => {
  try {
    // Берём токен из localStorage
    const token = localStorage.getItem('access_token');
    const path = window.location.pathname;

    console.log('Current path:', path);
    console.log('Token:', token);

    // ✅ Если токен есть и мы на login/register → редиректим на index
    if (token && (path.endsWith('login.html') || path.endsWith('register.html'))) {
      console.log('Redirecting to index because user is already logged in');
      window.location.replace('/index.html'); // replace — не оставляет историю
      return;
    }

    // ✅ Если токена нет и мы на приватной странице → редиректим на login
    if (!token && !path.endsWith('login.html') && !path.endsWith('register.html')) {
      console.log('Redirecting to login because user is not logged in');
      window.location.replace('/login.html');
      return;
    }
  } catch (err) {
    console.error('Error in auth check:', err);
  }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    resultsDiv.innerHTML = '<div class="analyzing">Analyzing...</div>';

    const files = document.getElementById('images').files;
    if (!files.length) {
    resultsDiv.innerHTML = '<div class="analyzing">Please select at least one image!</div>';
    return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
      }
    const token = localStorage.getItem('access_token');

    try {
    const response = await fetch('http://109.69.18.107:8000/api/v1/emotions/analyze/', {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${token}`
      },
      body: formData
    });


    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    resultsDiv.innerHTML = '';

    const results = Array.isArray(data.result) ? data.result : [data.result];

    for (let i = 0; i < files.length; i++) {
        const div = document.createElement('div');
        div.className = 'result-item';

        const img = document.createElement('img');
        img.src = URL.createObjectURL(files[i]);
        img.alt = `Image ${i+1}`;
        div.appendChild(img);

        const result = results[i];

        if (typeof result === 'string') {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'dominant error';
        errorDiv.textContent = result;
        div.appendChild(errorDiv);
        } else {
        const dominant = document.createElement('div');
        dominant.className = 'dominant';
        dominant.textContent = result.dominant_emotion || 'Unknown';
        div.appendChild(dominant);

        const emotionsDiv = document.createElement('div');
        emotionsDiv.className = 'emotions';

        for (const [key, value] of Object.entries(result.emotion)) {
            const barContainer = document.createElement('div');
            barContainer.className = 'emotion-bar';

            const nameDiv = document.createElement('div');
            nameDiv.className = 'emotion-name';
            nameDiv.textContent = key;

            const bar = document.createElement('div');
            bar.className = 'bar-container';

            const fill = document.createElement('div');
            fill.className = 'bar-fill';
            fill.style.width = `${parseFloat(value).toFixed(2)}%`;
            fill.style.backgroundColor = colors[key] || '#fff';

            bar.appendChild(fill);

            const percentDiv = document.createElement('div');
            percentDiv.className = 'percent';
            percentDiv.textContent = `${parseFloat(value).toFixed(2)}%`;

            barContainer.appendChild(nameDiv);
            barContainer.appendChild(bar);
            barContainer.appendChild(percentDiv);

            emotionsDiv.appendChild(barContainer);
        }

        div.appendChild(emotionsDiv);
        }

        resultsDiv.appendChild(div);
    }

    } catch (error) {
    resultsDiv.innerHTML = `<div class="analyzing">Error: ${error.message}</div>`;
    }
});