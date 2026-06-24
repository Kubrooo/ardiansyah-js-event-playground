// Logic Playground Event JS

// --- Fungsi Pembantu: Logging ke Konsol ---
function addLog(consoleId, type, message) {
  const consoleLogs = document.getElementById(consoleId);
  if (!consoleLogs) return;

  // Hapus baris placeholder jika ada
  const placeholder = consoleLogs.querySelector('.info');
  if (placeholder && placeholder.textContent.includes('Menunggu interaksi...')) {
    placeholder.remove();
  }

  // Ambil stempel waktu (timestamp)
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${(now.getMilliseconds() / 10).toFixed(0).padStart(2, '0')}`;

  const logLine = document.createElement('div');
  logLine.className = `log-line ${type}`;
  logLine.innerHTML = `<span>[${timeStr}]</span> ${message}`;

  consoleLogs.appendChild(logLine);
  
  // Batasi hanya menyimpan 20 log terakhir agar hemat memori
  while (consoleLogs.children.length > 20) {
    consoleLogs.removeChild(consoleLogs.firstChild);
  }

  // Gulir otomatis ke bagian bawah
  consoleLogs.scrollTop = consoleLogs.scrollHeight;
}

// Fungsi pembantu untuk membersihkan log
function setupConsoleClear(buttonId, consoleId) {
  const btn = document.getElementById(buttonId);
  btn.addEventListener('click', () => {
    const logs = document.getElementById(consoleId);
    if (logs) {
      logs.innerHTML = '<div class="log-line info">Menunggu interaksi...</div>';
    }
  });
}

// Inisialisasi tombol bersihkan
setupConsoleClear('clear-click', 'logs-click');
setupConsoleClear('clear-input', 'logs-input');
setupConsoleClear('clear-keydown', 'logs-keydown');
setupConsoleClear('clear-mousemove', 'logs-mousemove');
setupConsoleClear('clear-dragdrop', 'logs-dragdrop');


// ==========================================
// 1. EVENT CLICK (Ripple & Counter)
// ==========================================
const rippleBtn = document.getElementById('ripple-btn');
const clickCounter = document.getElementById('click-counter');
let count = 0;

rippleBtn.addEventListener('click', (e) => {
  // 1. Update counter
  count++;
  clickCounter.textContent = count;
  
  // Efek animasi memantul (bounce) pada counter
  clickCounter.style.transform = 'scale(1.3)';
  setTimeout(() => {
    clickCounter.style.transform = 'scale(1)';
  }, 150);

  // 2. Efek animasi ripple gelombang
  const rect = rippleBtn.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  rippleBtn.appendChild(ripple);

  // Hapus elemen ripple setelah animasi selesai
  setTimeout(() => {
    ripple.remove();
  }, 600);

  // 3. Log event
  addLog('logs-click', 'event', `click: hitung=${count}, clientX=${e.clientX.toFixed(0)}, clientY=${e.clientY.toFixed(0)}`);
});


// ==========================================
// 2. EVENT INPUT (Typography Playground)
// ==========================================
const textInput = document.getElementById('text-playground-input');
const fontSlider = document.getElementById('font-size-slider');
const fontSizeVal = document.getElementById('font-size-val');
const textPreview = document.getElementById('text-playground-preview');

textInput.addEventListener('input', (e) => {
  const val = e.target.value;
  textPreview.textContent = val || 'Pratinjau kosong';
  
  addLog('logs-input', 'event', `input (teks): "${val}"`);
});

fontSlider.addEventListener('input', (e) => {
  const size = e.target.value;
  fontSizeVal.textContent = `${size}px`;
  textPreview.style.fontSize = `${size}px`;
  
  addLog('logs-input', 'event', `input (slider): ukuran=${size}px`);
});


// ==========================================
// 3. EVENT KEYDOWN (Key Visualizer)
// ==========================================
const keyTarget = document.getElementById('key-target');
const keyVal = document.getElementById('key-val');
const keyCode = document.getElementById('key-code');
const keyWhich = document.getElementById('key-which');
const keyModifiers = document.getElementById('key-modifiers');

keyTarget.addEventListener('keydown', (e) => {
  // Mencegah scrolling halaman saat menekan spasi atau tombol panah ketika fokus ke target
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
    e.preventDefault();
  }

  // Update UI keycards
  const keyDisplay = e.key === ' ' ? 'Spasi' : e.key;
  keyVal.textContent = keyDisplay;
  keyCode.textContent = e.code;
  keyWhich.textContent = e.which;

  // Periksa tombol pengubah yang aktif
  const activeMods = [];
  if (e.shiftKey) activeMods.push('Shift');
  if (e.ctrlKey) activeMods.push('Ctrl');
  if (e.altKey) activeMods.push('Alt');
  if (e.metaKey) activeMods.push('Meta');
  keyModifiers.textContent = activeMods.join(' + ') || 'Tidak Ada';

  // Efek kedip border pada elemen target saat ditekan
  keyTarget.style.borderColor = 'var(--secondary)';
  keyTarget.style.background = 'rgba(139, 92, 246, 0.1)';
  setTimeout(() => {
    keyTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    keyTarget.style.background = 'rgba(255, 255, 255, 0.03)';
  }, 200);

  // Log key info
  addLog('logs-keydown', 'event', `keydown: tombol="${keyDisplay}", kode="${e.code}", kode_angka=${e.which}`);
});


// ==========================================
// 4. EVENT MOUSEMOVE (3D Parallax Card)
// ==========================================
const mousePlayground = document.getElementById('mouse-playground');
const parallaxCard = document.getElementById('parallax-card');

let lastLogTime = 0;

mousePlayground.addEventListener('mousemove', (e) => {
  const rect = mousePlayground.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // 1. Kalkulasi kemiringan Paralaks 3D
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((centerY - y) / centerY) * 15; // Maksimal 15 derajat
  const rotateY = ((x - centerX) / centerX) * 15;

  parallaxCard.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

  // 2. Koordinat efek glow cahaya
  const cardRect = parallaxCard.getBoundingClientRect();
  const cardX = e.clientX - cardRect.left;
  const cardY = e.clientY - cardRect.top;
  
  // Ubah background gradient secara langsung di JS untuk mengikuti kursor
  parallaxCard.style.background = `radial-gradient(circle at ${cardX}px ${cardY}px, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 80%), linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)`;

  // Throttled logging (hanya log setiap 150ms agar konsol tidak banjir)
  const now = Date.now();
  if (now - lastLogTime > 150) {
    addLog('logs-mousemove', 'event', `mousemove: koordinatX=${x.toFixed(0)}px, koordinatY=${y.toFixed(0)}px, glowX=${cardX.toFixed(0)}px`);
    lastLogTime = now;
  }
});

// Kembalikan posisi kartu saat mouse meninggalkan playground
mousePlayground.addEventListener('mouseleave', () => {
  parallaxCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
  parallaxCard.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)';
  addLog('logs-mousemove', 'warning', `mouseleave: kursor meninggalkan area playground`);
});


// ==========================================
// 5. EVENT DRAG & DROP
// ==========================================
const dragItems = document.querySelectorAll('.drag-item');
const dragColumns = document.querySelectorAll('.drag-column');

dragItems.forEach(item => {
  const text = item.querySelector('span').textContent;

  item.addEventListener('dragstart', (e) => {
    item.classList.add('dragging');
    e.dataTransfer.setData('text/plain', item.id);
    addLog('logs-dragdrop', 'success', `dragstart: mulai menarik item "${text}"`);
  });

  item.addEventListener('dragend', () => {
    item.classList.remove('dragging');
    addLog('logs-dragdrop', 'info', `dragend: selesai menarik item "${text}"`);
  });
});

dragColumns.forEach(column => {
  const colTitle = column.querySelector('.column-title').textContent;

  column.addEventListener('dragover', (e) => {
    e.preventDefault(); // Diperlukan agar drop diperbolehkan!
    column.classList.add('drag-over');
  });

  column.addEventListener('dragenter', (e) => {
    e.preventDefault();
    column.classList.add('drag-over');
    addLog('logs-dragdrop', 'event', `dragenter: melayang di atas "${colTitle}"`);
  });

  column.addEventListener('dragleave', () => {
    column.classList.remove('drag-over');
    addLog('logs-dragdrop', 'info', `dragleave: meninggalkan "${colTitle}"`);
  });

  column.addEventListener('drop', (e) => {
    column.classList.remove('drag-over');
    const id = e.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(id);
    
    if (draggedElement) {
      column.appendChild(draggedElement);
      const text = draggedElement.querySelector('span').textContent;
      addLog('logs-dragdrop', 'success', `drop: meletakkan "${text}" di dalam "${colTitle}"`);
    }
  });
});

// Logs status awal
addLog('logs-click', 'info', 'Console Click siap.');
addLog('logs-input', 'info', 'Console Input siap. Silakan ketik teks atau geser slider.');
addLog('logs-keydown', 'info', 'Console Keydown siap. Klik kotak di atas terlebih dahulu untuk fokus.');
addLog('logs-mousemove', 'info', 'Console Mousemove siap. Gerakkan kursor di atas area kartu.');
addLog('logs-dragdrop', 'info', 'Console Drag & Drop siap. Tarik item tugas.');
