export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    const backendUrl = 'https://nameless.devbysushil.com';
  
    const headers = {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
  
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>User Feedback</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body class="font-sans">
          <div class="w-screen mt-10 p-6">
              <div class="flex justify-between space-x-4 dark:text-white" id="feedback-container">
                  <!-- Feedback will be injected here -->
              </div>
          </div>
          <script>
              async function fetchFeedback() {
                  try {
                      const response = await fetch(\`${backendUrl}/api/feedback?username=${username}\`);
                      const data = await response.json();
                      const feedbackContainer = document.getElementById('feedback-container');
  
                      if (data.feedback.length === 0) {
                          feedbackContainer.innerHTML += '<p class="text-gray-500 text-center">No feedback available for this user.</p>';
                          return;
                      }
  
                      data.feedback.forEach(feedback => {
                          const feedbackItem = document.createElement('div');
                          feedbackItem.className = 'p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 flex-1';
                          feedbackItem.innerHTML = \`
                              <h4 class="font-semibold text-lg">\${feedback.content.trim()}</h4>
                              <div class="flex justify-between">
                                  <div class="flex items-center">
                                  \${generateStars(feedback.rating)} <!-- Inject stars here -->
                                  </div>
                              <p class="text-gray-600">Rating: \${feedback.rating}</p>
                              </div>
                              <p class="text-gray-500 text-sm">Date: \${new Date(feedback.createdAt).toLocaleString()}</p>
                          \`;
                          feedbackContainer.appendChild(feedbackItem);
                      });
                  } catch (error) {
                      console.error('Error fetching feedback:', error);
                      const feedbackContainer = document.getElementById('feedback-container');
                      feedbackContainer.innerHTML += '<p class="text-red-500 text-center">Error loading feedback.</p>';
                  }
              }
  
              function generateStars(rating) {
                  let stars = '';
                  for (let i = 1; i <= 5; i++) {
                      if (i <= rating) {
                          stars += \`
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffa348" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                              </svg>
                          \`;
                      } else {
                          stars += \`
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d3d3d3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                              </svg>
                          \`;
                      }
                  }
                  return stars;
              }
  
              // Fetch feedback on load
              window.onload = fetchFeedback;
          </script>
      </body>
      </html>
    `;
  
    return new Response(htmlContent, { headers });
  }
  
