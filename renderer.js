const axios = require('axios');

async function login() {
  const clientId = '1144187317486112818';  // 실제 클라이언트 ID로 대체
  const redirectUri = 'https://test.cloudtype.io/callback';

  const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify`;
  const loginWindow = window.open(authUrl, '_blank', 'width=600,height=800');
  
  document.getElementById('message').style.display = 'block';
  document.getElementById('sub-message').style.display = 'block';

  document.getElementById('text1').style.display = 'none';
  document.getElementById('text2').style.display = 'none';
  document.getElementById('login-button').style.display = 'none';

  // 5초 후에 창이 열리지 않았을 경우 처리
  setTimeout(() => {
    if (!loginWindow || loginWindow.closed || typeof loginWindow.closed == 'undefined') {
      alert('창이 열리지 않았습니다. 팝업이 차단되었는지 확인해주세요.');
    }
  }, 5000);
}

window.addEventListener('message', async (event) => {
  if (event.data.type === 'discord-auth') {
    const { code } = event.data;
    const profile = await getDiscordProfile(code);
    displayProfile(profile);
  }
});  

// 새 창에서 부모 창으로 메시지 요청을 보내는 함수
function requestAuthCode() {
  window.opener.postMessage({ type: 'get-auth-code' }, '*');
}

// 인증 후 새 창에서 이 함수를 호출하여 부모 창으로 메시지를 요청
if (window.opener) {
  requestAuthCode();
}

async function getDiscordProfile(code) {
  try {
    const response = await axios.post('http://localhost:3000/auth', { code });
    return response.data;
  } catch (error) {
    console.error('Error fetching Discord profile:', error);
  }
}

function displayProfile(profile) {
    document.getElementById('message').style.display = 'none';
    document.getElementById('sub-message').style.display = 'none';
  
    document.getElementById('profile').style.display = 'block';
    document.getElementById('username').innerText = `Username: ${profile.username}`;
    document.getElementById('avatar').src = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
    document.getElementById('logout-button').style.display = 'block';
  }

  function logout() {
    // 로그아웃 로직 추가
    document.getElementById('text1').style.display = 'block';
    document.getElementById('text2').style.display = 'block';
    document.getElementById('login-button').style.display = 'block';
    document.getElementById('profile').style.display = 'none';
    document.getElementById('logout-button').style.display = 'none';
}
  
