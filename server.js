const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

const clientId = '1144187317486112818';
const clientSecret = 'LuQu2KUbQM5EZm53DCOdzaoUcwYARFzD';
const redirectUri = 'https://port-0-test-lyl8ynsqc934c8c0.sel5.cloudtype.app/callback';

app.post('/auth', async (req, res) => {
  const { code } = req.body;
  try {
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = tokenResponse.data;

    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    res.json(userResponse.data);
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).send('Authentication failed');
  }
});

app.get('/callback', (req, res) => {
    const code = req.query.code;
    res.send(`<script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'discord-auth', code: '${code}' }, '*');
                  window.close();
                } else {
                  window.addEventListener('message', (event) => {
                    if (event.data && event.data.type === 'get-auth-code') {
                      event.source.postMessage({ type: 'discord-auth', code: '${code}' }, '*');
                    }
                  });
                }
              </script>`);
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
