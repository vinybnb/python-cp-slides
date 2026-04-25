// Password Protection for Python CP Slides
// Change PASS_HASH to update password. Generate: btoa('your_password')
const PASS_HASH = 'cHl0aG9uY3A='; // btoa('pythoncp')
const AUTH_KEY = 'pycp_auth';

function isAuthed() {
  return localStorage.getItem(AUTH_KEY) === PASS_HASH;
}

function setAuthed() {
  localStorage.setItem(AUTH_KEY, PASS_HASH);
}

function createModal() {
  const overlay = document.createElement('div');
  overlay.id = 'auth-overlay';
  overlay.innerHTML = `
    <div id="auth-modal">
      <button id="auth-close">&times;</button>
      <div class="auth-icon">🔒</div>
      <h2>Nhập mật khẩu</h2>
      <p>Khóa học yêu cầu mật khẩu để truy cập</p>
      <input type="password" id="auth-input" placeholder="Mật khẩu..." autocomplete="off">
      <div id="auth-error"></div>
      <button id="auth-submit">Mở khóa</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const style = document.createElement('style');
  style.textContent = `
    #auth-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    #auth-modal {
      background: linear-gradient(135deg, #12122a, #1a1a3e);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px; padding: 40px; width: 380px;
      text-align: center; position: relative;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      animation: slideUp 0.3s ease;
    }
    @keyframes slideUp { from { transform:translateY(30px);opacity:0; } to { transform:translateY(0);opacity:1; } }
    #auth-close {
      position: absolute; top: 12px; right: 16px;
      background: none; border: none; color: #64748b;
      font-size: 24px; cursor: pointer; transition: color 0.2s;
    }
    #auth-close:hover { color: #fff; }
    .auth-icon { font-size: 48px; margin-bottom: 12px; }
    #auth-modal h2 {
      font-family: 'Be Vietnam Pro', sans-serif;
      color: #fff; font-size: 22px; margin: 0 0 8px;
    }
    #auth-modal p {
      color: #94a3b8; font-size: 14px; margin: 0 0 20px;
      font-family: 'Be Vietnam Pro', sans-serif;
    }
    #auth-input {
      width: 100%; padding: 14px 18px; border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.15);
      background: rgba(255,255,255,0.05); color: #fff;
      font-size: 16px; font-family: 'JetBrains Mono', monospace;
      outline: none; transition: border-color 0.2s;
      box-sizing: border-box;
    }
    #auth-input:focus { border-color: #00d4ff; }
    #auth-error {
      color: #ff6b6b; font-size: 13px; min-height: 20px;
      margin: 8px 0; font-family: 'Be Vietnam Pro', sans-serif;
    }
    #auth-submit {
      width: 100%; padding: 14px; border: none; border-radius: 12px;
      background: linear-gradient(135deg, #00d4ff, #a855f7);
      color: #fff; font-size: 16px; font-weight: 700;
      cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
      font-family: 'Be Vietnam Pro', sans-serif;
    }
    #auth-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,212,255,0.3); }
  `;
  document.head.appendChild(style);

  return overlay;
}

function showModal(onSuccess) {
  const overlay = createModal();
  const input = document.getElementById('auth-input');
  const submit = document.getElementById('auth-submit');
  const error = document.getElementById('auth-error');
  const close = document.getElementById('auth-close');

  function tryAuth() {
    if (btoa(input.value) === PASS_HASH) {
      setAuthed();
      overlay.remove();
      if (onSuccess) onSuccess();
    } else {
      error.textContent = '❌ Sai mật khẩu. Vui lòng thử lại.';
      input.value = '';
      input.focus();
      input.style.borderColor = '#ff6b6b';
      setTimeout(() => { input.style.borderColor = ''; }, 1500);
    }
  }

  submit.addEventListener('click', tryAuth);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryAuth(); });
  close.addEventListener('click', () => overlay.remove());
  setTimeout(() => input.focus(), 100);
}

// --- INDEX PAGE: intercept lesson links ---
function initIndexAuth() {
  document.querySelectorAll('a.lesson-card').forEach(link => {
    link.addEventListener('click', (e) => {
      if (isAuthed()) return; // Already authed, allow navigation
      e.preventDefault();
      const href = link.getAttribute('href');
      showModal(() => { window.location.href = href; });
    });
  });
}

// --- LESSON PAGE: check auth on load ---
function initLessonAuth() {
  if (!isAuthed()) {
    // Hide content until authed
    document.querySelector('.reveal').style.visibility = 'hidden';
    showModal(() => {
      document.querySelector('.reveal').style.visibility = 'visible';
    });
  }
}
