const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        console.log('Session ID:', sessionId);

        if (sessionId) {
            fetch(`/api/checkout/session/${sessionId}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Stripe Session Details:', data);
                })
                .catch(error => {
                    console.error('Error fetching session details:', error);
                });
        }