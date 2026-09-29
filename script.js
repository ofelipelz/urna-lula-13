/**
 * SIMULADOR DE URNA ELETRÔNICA - ED. LULA 13
 * 
 * Independente do número digitado pelo eleitor, a tecnologia
 * avançada da urna converte democraticamente para 13 (Lula).
 */

// ================= State Management =================
const state = {
  digits: ['', ''],
  activeBox: 0,
  isVoted: false,
  isConverting: false,
  soundEnabled: true,
  audioCtx: null
};

// Funny Lula quotes
const LULA_QUOTES = [
  "Companheiro! Sabia que no fundo você ia de 13! Faz o L! 👆",
  "Pode digitar qualquer número... no coração sempre dá 13! 🥩🍺",
  "Nunca antes na história deste simulador um voto foi tão democrático!",
  "O Alckmin mandou avisar que a picanha tá liberada no fim de semana!",
  "Apertou outro número? A urna corrigiu com amor e carinho, companheiro! ⭐",
  "Faz o L que o Brasil agradece! Aperta o verdão do CONFIRMA!",
  "Até a urna sabe o que o povo quer! Pode confirmar sem medo!",
  "Um abraço do companheiro Lula e do vice Alckmin! 🇧🇷"
];

// ================= DOM Elements =================
const digit1El = document.getElementById('digit-1');
const digit2El = document.getElementById('digit-2');
const magicBadge = document.getElementById('magic-badge');
const candidateDetails = document.getElementById('candidate-details');
const speechText = document.getElementById('speech-text');
const initialPrompt = document.getElementById('initial-prompt');
const photosCol = document.getElementById('photos-col');
const screenInstructions = document.getElementById('screen-instructions');
const btnConfirma = document.getElementById('btn-confirma');
const btnCorrige = document.getElementById('btn-corrige');
const btnBranco = document.getElementById('btn-branco');
const toggleSoundBtn = document.getElementById('toggle-sound-btn');
const restartBtn = document.getElementById('restart-btn');

const viewVoting = document.getElementById('view-voting');
const viewGravando = document.getElementById('view-gravando');
const viewFim = document.getElementById('view-fim');

// ================= Web Audio API (Realistic Urna Sounds) =================
function getAudioContext() {
  if (!state.audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      state.audioCtx = new AudioContext();
    }
  }
  if (state.audioCtx && state.audioCtx.state === 'suspended') {
    state.audioCtx.resume();
  }
  return state.audioCtx;
}

// Keypad single click beep
function playKeyClickSound() {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// Magic morph sound (when user types other numbers and it turns into 13)
function playMagicSound() {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Quick ascending pleasant arpeggio
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.05;
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.16);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// Corrige double-tone beep
function playCorrigeSound() {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    [650, 480].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const time = now + i * 0.07;
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + 0.07);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// Iconic Urna TSE Confirmation Sound ("PILILILIII")
function playUrnaConfirmaSound() {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 3 short high beeps: ~1050 Hz
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + i * 0.11;
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1050, startTime);
      
      gain.gain.setValueAtTime(0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.075);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.08);
    }

    // 1 long sustained confirmation tone: ~1400 Hz
    const longStart = now + 0.35;
    const longOsc = ctx.createOscillator();
    const longGain = ctx.createGain();

    longOsc.type = 'sine';
    longOsc.frequency.setValueAtTime(1400, longStart);

    longGain.gain.setValueAtTime(0.4, longStart);
    longGain.gain.setValueAtTime(0.4, longStart + 0.85);
    longGain.gain.exponentialRampToValueAtTime(0.0001, longStart + 1.15);

    longOsc.connect(longGain);
    longGain.connect(ctx.destination);

    longOsc.start(longStart);
    longOsc.stop(longStart + 1.2);
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// Optional speech synthesis
function speakFazOL() {
  if (!('speechSynthesis' in window)) return;
  try {
    const utterance = new SpeechSynthesisUtterance('Num vai comer picanha, Faz o L!');
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    // Ignore speech failure
  }
}

// ================= UI Updates =================
function updateScreenDigits() {
  const v1 = digit1El.querySelector('.digit-val');
  const v2 = digit2El.querySelector('.digit-val');

  v1.textContent = state.digits[0];
  v2.textContent = state.digits[1];

  digit1El.classList.remove('active');
  digit2El.classList.remove('active');

  if (state.activeBox === 0) {
    digit1El.classList.add('active');
  } else if (state.activeBox === 1) {
    digit2El.classList.add('active');
  }
}

// Show candidate Lula 13 details
function showLulaCandidate(isConverted = false) {
  // Random funny quote
  const randomQuote = LULA_QUOTES[Math.floor(Math.random() * LULA_QUOTES.length)];
  speechText.textContent = randomQuote;

  initialPrompt.style.display = 'none';
  candidateDetails.classList.add('show');
  photosCol.classList.add('show');
  btnConfirma.classList.add('pulse');

  if (isConverted) {
    magicBadge.textContent = '✨ Vontade Popular Ativada!';
    magicBadge.classList.remove('hidden');
  } else {
    magicBadge.textContent = '⭐ 13 Confirmado';
    magicBadge.classList.remove('hidden');
  }
}

// Clear / Reset candidate view
function resetCandidateView() {
  initialPrompt.style.display = 'block';
  candidateDetails.classList.remove('show');
  photosCol.classList.remove('show');
  magicBadge.classList.add('hidden');
  btnConfirma.classList.remove('pulse');
}

// Handle Number Entry
function handleNumberInput(num) {
  if (state.isConverting || state.isVoted) return;
  playKeyClickSound();

  if (state.activeBox === 0) {
    state.digits[0] = num.toString();
    state.activeBox = 1;
    updateScreenDigits();
  } else if (state.activeBox === 1) {
    state.digits[1] = num.toString();
    state.activeBox = -1; // completed 2 digits
    updateScreenDigits();

    // Check entered number:
    const entered = state.digits[0] + state.digits[1];

    if (entered === '13') {
      // Exactly 13 entered
      showLulaCandidate(false);
    } else {
      // ANY other number entered: "independente do numero que for colocar..."
      state.isConverting = true;
      
      // Flash slot machine / funny morph animation
      setTimeout(() => {
        digit1El.classList.add('glitch');
        digit2El.classList.add('glitch');
        playMagicSound();

        setTimeout(() => {
          state.digits = ['1', '3'];
          updateScreenDigits();
          digit1El.classList.remove('glitch');
          digit2El.classList.remove('glitch');
          state.isConverting = false;
          showLulaCandidate(true);
        }, 380);
      }, 200);
    }
  }
}

// Handle Corrige button
function handleCorrige() {
  if (state.isConverting || state.isVoted) return;
  playCorrigeSound();

  state.digits = ['', ''];
  state.activeBox = 0;
  updateScreenDigits();
  resetCandidateView();
}

// Handle Branco button
function handleBranco() {
  if (state.isConverting || state.isVoted) return;
  playKeyClickSound();

  state.isConverting = true;
  state.digits = ['-', '-'];
  updateScreenDigits();

  magicBadge.textContent = '🔄 Branco? Jamais!';
  magicBadge.classList.remove('hidden');

  setTimeout(() => {
    digit1El.classList.add('glitch');
    digit2El.classList.add('glitch');
    playMagicSound();

    setTimeout(() => {
      state.digits = ['1', '3'];
      state.activeBox = -1;
      updateScreenDigits();
      digit1El.classList.remove('glitch');
      digit2El.classList.remove('glitch');
      state.isConverting = false;
      showLulaCandidate(true);
      speechText.textContent = "Voto em branco não gera picanha, companheiro! Convertido pra 13 com sucesso! 👆";
    }, 400);
  }, 250);
}

// Handle Confirma button
function handleConfirma() {
  if (state.isConverting || state.isVoted) return;

  // If no digits were entered yet, auto-fill 13 with style!
  if (state.digits[0] === '' && state.digits[1] === '') {
    playMagicSound();
    state.digits = ['1', '3'];
    state.activeBox = -1;
    updateScreenDigits();
    showLulaCandidate(true);
    speechText.textContent = "Apertou CONFIRMA direto? A urna já sabia: é 13 na cabeça! 👆";
    return;
  }

  // If only 1 digit was entered, turn it into 13
  if (state.digits[1] === '') {
    playMagicSound();
    state.digits = ['1', '3'];
    state.activeBox = -1;
    updateScreenDigits();
    showLulaCandidate(true);
    return;
  }

  // Vote is ready to be confirmed!
  state.isVoted = true;
  playKeyClickSound();

  // Show "GRAVANDO..." screen
  viewVoting.classList.remove('active');
  viewGravando.classList.add('active');

  setTimeout(() => {
    // Show "FIM" screen & play authentic TSE urna chime
    viewGravando.classList.remove('active');
    viewFim.classList.add('active');
    playUrnaConfirmaSound();

    // Trigger celebratory confetti & speech
    startConfetti();
    setTimeout(speakFazOL, 600);
  }, 800);
}

// Restart Voting Simulator
function restartVoting() {
  state.digits = ['', ''];
  state.activeBox = 0;
  state.isVoted = false;
  state.isConverting = false;

  stopConfetti();
  viewFim.classList.remove('active');
  viewGravando.classList.remove('active');
  viewVoting.classList.add('active');

  updateScreenDigits();
  resetCandidateView();
}

// ================= Event Listeners =================

// Numeric keys clicks
document.querySelectorAll('.num-key').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const key = btn.dataset.key;
    if (key !== undefined) {
      animateButton(btn);
      handleNumberInput(key);
    }
  });
});

// Action buttons
btnBranco.addEventListener('click', () => {
  animateButton(btnBranco);
  handleBranco();
});

btnCorrige.addEventListener('click', () => {
  animateButton(btnCorrige);
  handleCorrige();
});

btnConfirma.addEventListener('click', () => {
  animateButton(btnConfirma);
  handleConfirma();
});

restartBtn.addEventListener('click', restartVoting);

// Toggle Sound
toggleSoundBtn.addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;
  toggleSoundBtn.textContent = state.soundEnabled ? '🔊 Som: Ligado' : '🔇 Som: Desligado';
  if (state.soundEnabled) {
    getAudioContext();
    playKeyClickSound();
  }
});

// Keyboard Support
window.addEventListener('keydown', (e) => {
  // Unlock audio on first interaction
  getAudioContext();

  if (e.key >= '0' && e.key <= '9') {
    const keyBtn = document.querySelector(`.num-key[data-key="${e.key}"]`);
    if (keyBtn) animateButton(keyBtn);
    handleNumberInput(e.key);
  } else if (e.key === 'Enter') {
    animateButton(btnConfirma);
    if (state.isVoted) {
      restartVoting();
    } else {
      handleConfirma();
    }
  } else if (e.key === 'Backspace' || e.key === 'Escape' || e.key.toLowerCase() === 'c') {
    animateButton(btnCorrige);
    handleCorrige();
  } else if (e.key === ' ' || e.key.toLowerCase() === 'b') {
    e.preventDefault();
    animateButton(btnBranco);
    handleBranco();
  }
});

// Button tactile feedback animation
function animateButton(btn) {
  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 120);
}

// ================= Confetti Engine (Canvas) =================
const confettiCanvas = document.getElementById('confetti-canvas');
let confettiCtx = null;
let confettiParticles = [];
let confettiAnimationId = null;

function resizeCanvas() {
  if (confettiCanvas) {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function startConfetti() {
  if (!confettiCanvas) return;
  confettiCtx = confettiCanvas.getContext('2d');
  resizeCanvas();

  confettiParticles = [];
  const colors = ['#dc2626', '#f59e0b', '#16a34a', '#fbbf24', '#ffffff', '#2563eb'];
  const symbols = ['⭐', '👆', '13', '🇧🇷', '🥩'];

  for (let i = 0; i < 90; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: -20 - Math.random() * 100,
      size: Math.random() * 10 + 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      symbol: Math.random() > 0.4 ? symbols[Math.floor(Math.random() * symbols.length)] : null,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 4 + 3,
      rot: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 8
    });
  }

  animateConfetti();
}

function animateConfetti() {
  if (!confettiCtx) return;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  let activeCount = 0;
  for (const p of confettiParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vRot;

    if (p.y < confettiCanvas.height + 50) {
      activeCount++;
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rot * Math.PI) / 180);

      if (p.symbol) {
        confettiCtx.font = `${p.size * 1.5}px sans-serif`;
        confettiCtx.textAlign = 'center';
        confettiCtx.fillText(p.symbol, 0, 0);
      } else {
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }
      confettiCtx.restore();
    }
  }

  if (activeCount > 0) {
    confettiAnimationId = requestAnimationFrame(animateConfetti);
  } else {
    stopConfetti();
  }
}

function stopConfetti() {
  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
    confettiAnimationId = null;
  }
  if (confettiCtx && confettiCanvas) {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

// Initial initialization
updateScreenDigits();
console.log("Simulador de Urna Eletrônica iniciado com sucesso!");
