/**
 * SIMULADOR DE URNA ELETRÔNICA - ED. LULA 13
 * 
 * Independente do número digitado pelo eleitor, a tecnologia
 * avançada da urna converte democraticamente para 13 (Lula).
 */

(() => {
  'use strict';

  // ================= State Management =================
  const state = {
  digits: ['', ''],
  activeBox: 0,
  isVoted: false,
  isConverting: false,
  soundEnabled: true,
  audioCtx: null,
  pendingResearchVote: null
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

// Online Counter Elements
const onlineVotesCountEl = document.getElementById('online-votes-count');
const onlineVotesBadge = document.getElementById('online-votes-badge');
const fimVoteNumberEl = document.getElementById('fim-vote-number');

// ================= Online Votes Counter (Cloud API) =================
const COUNT_API_BASE = 'https://countapi.mileshilliard.com/api/v1';
const COUNT_KEY = 'urna_lula_13_ofelipelz';
let totalOnlineVotes = 13;

async function fetchOnlineVotes() {
  try {
    const res = await fetch(`${COUNT_API_BASE}/get/${COUNT_KEY}`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.value === 'number') {
        totalOnlineVotes = data.value;
        updateOnlineVotesDisplay(totalOnlineVotes);
        return;
      }
    }
  } catch (err) {
    console.warn('Contador offline, usando cache local:', err);
  }
  const saved = localStorage.getItem('urna_votes_count');
  if (saved) {
    totalOnlineVotes = parseInt(saved, 10);
  }
  updateOnlineVotesDisplay(totalOnlineVotes);
}

let lastVoteTimestamp = 0;
const VOTE_COOLDOWN_MS = 2500; // 2.5s cooldown para evitar flood/spam

async function recordOnlineVote() {
  const now = Date.now();
  if (now - lastVoteTimestamp < VOTE_COOLDOWN_MS) {
    return;
  }
  lastVoteTimestamp = now;

  let newTotal = totalOnlineVotes + 1;
  try {
    const res = await fetch(`${COUNT_API_BASE}/hit/${COUNT_KEY}`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.value === 'number') {
        newTotal = data.value;
      }
    }
  } catch (err) {
    console.warn('Erro ao registrar voto online, salvando localmente:', err);
  }
  totalOnlineVotes = newTotal;
  localStorage.setItem('urna_votes_count', newTotal.toString());
  updateOnlineVotesDisplay(newTotal, true);
}

function updateOnlineVotesDisplay(count, shouldAnimate = false) {
  if (onlineVotesCountEl) {
    onlineVotesCountEl.textContent = count.toLocaleString('pt-BR');
  }
  if (fimVoteNumberEl) {
    fimVoteNumberEl.textContent = count.toLocaleString('pt-BR');
  }
  if (shouldAnimate && onlineVotesBadge) {
    onlineVotesBadge.classList.add('bump');
    setTimeout(() => onlineVotesBadge.classList.remove('bump'), 600);
  }
}

// Fetch on startup
fetchOnlineVotes();

// ================= Cookie Management & Pesquisa Estatística =================
function setCookie(name, value, days = 365) {
  try {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;SameSite=Lax`;
  } catch (e) {
    console.warn('Erro ao salvar cookie:', e);
  }
}

function getCookie(name) {
  try {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(cname) === 0) {
        return c.substring(cname.length, c.length);
      }
    }
  } catch (e) {
    console.warn('Erro ao ler cookie:', e);
  }
  return null;
}

// ================= Tabela da Pesquisa Extra-Oficial de Intenção (100% Tempo Real) =================
const CANDIDATES_REGISTRY = {
  '13': {
    num: '13',
    name: 'Luiz Inácio Lula da Silva',
    party: 'PT - Partido dos Trabalhadores',
    badgeClass: 'badge-13',
    fillClass: 'fill-13'
  },
  '22': {
    num: '22',
    name: 'Flávio Bolsonaro',
    party: 'PL - Partido Liberal',
    badgeClass: 'badge-22',
    fillClass: 'fill-22'
  },
  '14': {
    num: '14',
    name: 'Renan Santos',
    party: 'Missão',
    badgeClass: 'badge-14',
    fillClass: 'fill-14'
  },
  '55': {
    num: '55',
    name: 'Ronaldo Caiado',
    party: 'PSD - Partido Social Democrático',
    badgeClass: 'badge-55',
    fillClass: 'fill-55'
  },
  '30': {
    num: '30',
    name: 'Romeu Zema',
    party: 'NOVO',
    badgeClass: 'badge-30',
    fillClass: 'fill-30'
  },
  '70': {
    num: '70',
    name: 'Augusto Cury',
    party: 'Avante',
    badgeClass: 'badge-70',
    fillClass: 'fill-70'
  },
  '28': {
    num: '28',
    name: 'Pablo Marçal',
    party: 'PRTB - Renovador Trabalhista',
    badgeClass: 'badge-28',
    fillClass: 'fill-28'
  },
  '21': {
    num: '21',
    name: 'Edmilson Costa',
    party: 'PCB - Partido Comunista Brasileiro',
    badgeClass: 'badge-21',
    fillClass: 'fill-21'
  },
  '16': {
    num: '16',
    name: 'Hertz Dias',
    party: 'PSTU - Partido Socialista dos Trabalhadores Unificado',
    badgeClass: 'badge-16',
    fillClass: 'fill-16'
  },
  '80': {
    num: '80',
    name: 'Samara Martins',
    party: 'UP - Unidade Popular',
    badgeClass: 'badge-80',
    fillClass: 'fill-80'
  },
  '35': {
    num: '35',
    name: 'Wilson Grassi',
    party: 'Democrata',
    badgeClass: 'badge-35',
    fillClass: 'fill-35'
  },
  '27': {
    num: '27',
    name: 'Clariana Barão',
    party: 'DC - Democracia Cristã',
    badgeClass: 'badge-27',
    fillClass: 'fill-27'
  },
  '29': {
    num: '29',
    name: 'Rui Costa Pimenta',
    party: 'PCO - Partido da Causa Operária',
    badgeClass: 'badge-29',
    fillClass: 'fill-29'
  },
  'branco': {
    num: 'BRANCO',
    name: 'Votos em Branco',
    party: 'Tecla BRANCO pressionada',
    badgeClass: 'badge-branco',
    fillClass: 'fill-branco'
  },
  'nulos': {
    num: 'NULOS',
    name: 'Votos Nulos',
    party: 'Dígitos aleatórios / outros números',
    badgeClass: 'badge-nulos',
    fillClass: 'fill-nulos'
  }
};

// Armazenamento em memória dos votos reais em tempo real
let pesquisaRealVotes = {
  '13': 19,
  '22': 2,
  '14': 0,
  '55': 0,
  '30': 0,
  '70': 0,
  '28': 0,
  '21': 0,
  '16': 0,
  '80': 0,
  '35': 0,
  '27': 0,
  '29': 0,
  'branco': 1,
  'nulos': 2
};

// Voto gravado do usuário atual
let userResearchChoice = localStorage.getItem('urna_user_research_choice') || null;
const votoSalvoCookie = getCookie('urna_primeiro_voto_digitado') || localStorage.getItem('urna_primeiro_voto_digitado');
if (votoSalvoCookie && !userResearchChoice) {
  if (CANDIDATES_REGISTRY[votoSalvoCookie]) userResearchChoice = votoSalvoCookie;
  else if (votoSalvoCookie === 'BRANCO') userResearchChoice = 'branco';
  else userResearchChoice = 'nulos';
}

try {
  localStorage.removeItem('urna_pesquisa_tabela_adicionais');
} catch (e) {}

// Chaves para buscar dados reais na nuvem (candidatos de 2026 + branco + nulos)
const TRACKED_CLOUD_KEYS = ['13', '22', '14', '55', '30', '70', '28', '21', '16', '80', '35', '27', '29', 'branco', 'nulo'];

async function fetchPesquisaRealVotes() {
  try {
    const promises = TRACKED_CLOUD_KEYS.map(async (candKey) => {
      const apiEndpoint = `${COUNT_API_BASE}/get/urna_voto_${candKey}_ofelipelz`;
      try {
        const res = await fetch(apiEndpoint);
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.value === 'number') {
            return { key: candKey === 'nulo' ? 'nulos' : candKey, value: data.value };
          }
        }
      } catch (e) {}
      return null;
    });

    const results = await Promise.allSettled(promises);
    results.forEach((res) => {
      if (res.status === 'fulfilled' && res.value) {
        const { key, value } = res.value;
        pesquisaRealVotes[key] = value;
      }
    });

    renderPesquisaDynamicTable();
  } catch (err) {
    console.warn('Erro ao atualizar votos da pesquisa na nuvem:', err);
    renderPesquisaDynamicTable();
  }
}

// Computa o primeiro voto digitado pelo eleitor
async function computarVotoNaTabela(digits) {
  // Regra fundamental: "Apenas os primeiros números que digitou são registrados."
  if (userResearchChoice) {
    return;
  }

  let targetKey = 'nulos';
  if (digits === 'BRANCO') targetKey = 'branco';
  else if (CANDIDATES_REGISTRY[digits]) targetKey = digits;
  else {
    // Qualquer outro número aleatório ou inválido
    targetKey = 'nulos';
  }

  userResearchChoice = targetKey;
  pesquisaRealVotes[targetKey] = (pesquisaRealVotes[targetKey] || 0) + 1;

  try {
    localStorage.setItem('urna_user_research_choice', targetKey);
  } catch (e) {}

  // Renderiza imediatamente com animação na linha votada
  renderPesquisaDynamicTable(targetKey);

  // Envia incremento em tempo real para a nuvem
  const cloudKey = targetKey === 'nulos' ? 'nulo' : targetKey;
  try {
    fetch(`${COUNT_API_BASE}/hit/urna_voto_${cloudKey}_ofelipelz`).catch(() => {});
  } catch (e) {}
}

function renderPesquisaDynamicTable(highlightKey = null) {
  const tbody = document.getElementById('pesquisa-tbody');
  const totalValEl = document.getElementById('pesquisa-total-val');
  if (!tbody || !totalValEl) return;

  // Calcula o total REAL absoluto de votos da pesquisa
  const allKeys = Object.keys(pesquisaRealVotes);
  const totalVotes = allKeys.reduce((acc, k) => acc + (pesquisaRealVotes[k] || 0), 0);

  totalValEl.textContent = totalVotes.toLocaleString('pt-BR');

  // Determina quais candidatos exibir:
  // 13, 22, BRANCO e NULOS aparecem sempre.
  // Qualquer outro candidato só aparece se tiver recebido pelo menos 1 voto!
  const keysToShow = allKeys.filter(k => {
    if (k === '13' || k === '22' || k === 'branco' || k === 'nulos') return true;
    return (pesquisaRealVotes[k] || 0) > 0;
  });

  // Ordena por quantidade de votos em ordem decrescente (posições)
  keysToShow.sort((a, b) => {
    const vA = pesquisaRealVotes[a] || 0;
    const vB = pesquisaRealVotes[b] || 0;
    if (vB !== vA) return vB - vA;
    // Desempate
    const order = ['13', '22', 'branco', 'nulos'];
    const idxA = order.indexOf(a);
    const idxB = order.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  // Monta as linhas da tabela
  let html = '';
  keysToShow.forEach((k, index) => {
    const pos = index + 1;
    let posBadge = `${pos}º`;
    let posClass = '';
    if (pos === 1) { posBadge = '🥇 1º'; posClass = 'pos-1'; }
    else if (pos === 2) { posBadge = '🥈 2º'; posClass = 'pos-2'; }
    else if (pos === 3) { posBadge = '🥉 3º'; posClass = 'pos-3'; }

    const cand = CANDIDATES_REGISTRY[k] || {
      num: k.toUpperCase(),
      name: `Candidato Nº ${k}`,
      party: 'Outros votos computados',
      badgeClass: 'badge-custom',
      fillClass: 'fill-custom'
    };

    const votes = pesquisaRealVotes[k] || 0;
    const pctNum = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : '0.0';
    const pctStr = `${pctNum.replace('.', ',')}%`;

    const isUserChoice = (userResearchChoice === k);
    const isPulse = (highlightKey === k);

    html += `
      <tr class="row-candidato row-${k} ${isPulse ? 'voted-pulse' : ''}" id="row-cand-${k}">
        <td class="col-pos">
          <span class="pos-badge ${posClass}">${posBadge}</span>
        </td>
        <td class="col-num">
          <span class="cand-badge ${cand.badgeClass}">${cand.num}</span>
        </td>
        <td class="col-cand">
          <div class="cand-info">
            <div class="cand-name-row">
              <strong class="cand-name">${cand.name}</strong>
              ${isUserChoice ? '<span class="user-vote-tag">✓ Seu Voto</span>' : ''}
            </div>
            <span class="cand-party">${cand.party}</span>
          </div>
        </td>
        <td class="col-bar">
          <div class="progress-track">
            <div class="progress-fill ${cand.fillClass}" style="width: ${pctNum}%;"></div>
          </div>
        </td>
        <td class="col-pct">
          <strong class="pct-val font-mono">${pctStr}</strong>
        </td>
        <td class="col-votos text-right">
          <span class="votos-val font-mono">${votes.toLocaleString('pt-BR')}</span>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// Inicia busca e sincronização periódica a cada 20 segundos
document.addEventListener('DOMContentLoaded', () => {
  renderPesquisaDynamicTable();
  fetchPesquisaRealVotes();
});
renderPesquisaDynamicTable();
fetchPesquisaRealVotes();
setInterval(fetchPesquisaRealVotes, 20000);

// Obtém o estado de consentimento do usuário ('true', 'false' ou null para indeciso)
function getCookieConsent() {
  const c = getCookie('urna_cookie_consent') || localStorage.getItem('urna_cookie_consent');
  if (c === 'true') return true;
  if (c === 'false') return false;
  return null;
}

// Armazena a primeira dupla de dígitos digitada pelo eleitor para fins de pesquisa
// REGRA ESTRITA: Só grava em cookies se o usuário PERMITIU o uso de cookies.
function registrarVotoPesquisa(digits) {
  try {
    // Computa imediatamente na tabela visual de intenção de voto
    computarVotoNaTabela(digits);

    const consent = getCookieConsent();

    // 1. Se o usuário expressamente RECUSOU cookies, não grava absolutamente nada
    if (consent === false) {
      console.log('🔒 [Pesquisa] Cookies recusados pelo visitante. Nenhum dado foi coletado.');
      return;
    }

    // 2. Se o usuário ainda NÃO decidiu (o banner ainda está visível na tela):
    if (consent === null) {
      // Guarda apenas temporariamente na memória RAM da sessão
      if (!state.pendingResearchVote) {
        state.pendingResearchVote = digits;
        console.log(`⏳ [Pesquisa] Voto '${digits}' mantido em memória temporária. Aguardando decisão do usuário no banner.`);
      }
      return;
    }

    // 3. Se o usuário já PERMITIU os cookies (consent === true):
    gravarVotoPesquisaDefinitivo(digits);

  } catch (err) {
    console.warn('Erro ao processar voto na pesquisa:', err);
  }
}

// Grava o voto efetivamente nos cookies e armazenamento local após consentimento confirmado
function gravarVotoPesquisaDefinitivo(digits) {
  try {
    const agora = new Date().toISOString();
    const dataLegivel = new Date().toLocaleString('pt-BR');

    // Verifica se já existe um primeiro voto registrado neste navegador
    const primeiroVotoExistente = getCookie('urna_primeiro_voto_digitado') || localStorage.getItem('urna_primeiro_voto_digitado');

    if (!primeiroVotoExistente) {
      // Grava o primeiro voto da pesquisa em cookie por 365 dias
      setCookie('urna_primeiro_voto_digitado', digits, 365);
      setCookie('urna_primeiro_voto_data', agora, 365);

      // Redundância em localStorage
      localStorage.setItem('urna_primeiro_voto_digitado', digits);
      localStorage.setItem('urna_primeiro_voto_data', agora);

      console.log(`%c[Pesquisa com Consentimento]%c Primeiro voto registrado em cookie: %c${digits}%c (${dataLegivel})`,
        'background: #dc2626; color: #fff; font-weight: bold; padding: 2px 5px; border-radius: 3px;',
        'color: #94a3b8;',
        'color: #22c55e; font-weight: bold; font-size: 1.1em;',
        'color: #94a3b8;'
      );
    } else {
      console.log(`%c[Pesquisa com Consentimento]%c Voto subsequente: %c${digits}%c`,
        'background: #334155; color: #fff; font-weight: bold; padding: 2px 5px; border-radius: 3px;',
        'color: #94a3b8;',
        'color: #f59e0b; font-weight: bold;',
        'color: #94a3b8;'
      );
    }

    // Registra no histórico detalhado
    let historico = [];
    try {
      const historicoRaw = localStorage.getItem('urna_pesquisa_historico') || getCookie('urna_pesquisa_historico');
      if (historicoRaw) {
        historico = JSON.parse(historicoRaw);
      }
    } catch (e) {
      historico = [];
    }

    historico.push({
      digitos: digits,
      data: agora,
      isPrimeiro: !primeiroVotoExistente
    });

    if (historico.length > 50) historico = historico.slice(-50);
    const historicoJson = JSON.stringify(historico);
    localStorage.setItem('urna_pesquisa_historico', historicoJson);
    setCookie('urna_pesquisa_historico', historicoJson, 365);

  } catch (err) {
    console.warn('Erro ao gravar voto definitivo na pesquisa:', err);
  }
}

// API de consulta no console para o pesquisador / proprietário (Imutável)
window.urnaPesquisa = Object.freeze({
  obterPrimeiroVoto: () => getCookie('urna_primeiro_voto_digitado') || localStorage.getItem('urna_primeiro_voto_digitado'),
  obterData: () => getCookie('urna_primeiro_voto_data') || localStorage.getItem('urna_primeiro_voto_data'),
  obterHistorico: () => {
    try {
      return JSON.parse(localStorage.getItem('urna_pesquisa_historico') || getCookie('urna_pesquisa_historico') || '[]');
    } catch (e) {
      return [];
    }
  },
  relatorio: function() {
    const primeiro = this.obterPrimeiroVoto();
    const data = this.obterData();
    const hist = this.obterHistorico();
    console.log('%c📊 RELATÓRIO DA PESQUISA DE INTENÇÃO DE VOTO', 'color: #f59e0b; font-size: 14px; font-weight: bold;');
    console.table({
      'Primeiro Voto Registrado': primeiro || 'Nenhum ainda',
      'Data/Hora': data ? new Date(data).toLocaleString('pt-BR') : '-',
      'Total de Tentativas Registradas': hist.length
    });
    if (hist.length > 0) {
      console.log('%cHistórico de Dígitos Tentados:', 'color: #94a3b8; font-weight: bold;');
      console.table(hist.map((h, i) => ({
        '#': i + 1,
        'Dígitos': h.digitos,
        'Primeiro Voto?': h.isPrimeiro ? 'SIM ⭐' : 'Não',
        'Data/Hora': new Date(h.data).toLocaleString('pt-BR')
      })));
    }
    return { primeiroVoto: primeiro, data, historico: hist };
  },
  limparDados: function() {
    setCookie('urna_primeiro_voto_digitado', '', -1);
    setCookie('urna_primeiro_voto_data', '', -1);
    setCookie('urna_pesquisa_historico', '', -1);
    localStorage.removeItem('urna_primeiro_voto_digitado');
    localStorage.removeItem('urna_primeiro_voto_data');
    localStorage.removeItem('urna_user_research_choice');
    localStorage.removeItem('urna_pesquisa_tabela_adicionais');
    userResearchChoice = null;
    renderPesquisaDynamicTable();
    fetchPesquisaRealVotes();
    console.log('Dados da pesquisa e tabela limpos com sucesso.');
  }
});

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

    // Registra a dupla de dígitos digitada em cookie para fins de pesquisa (antes da conversão)
    registrarVotoPesquisa(entered);

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

  // Registra intenção de voto em branco para a pesquisa
  registrarVotoPesquisa('BRANCO');

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
  
  // Computar voto online na nuvem
  recordOnlineVote();

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

// ================= Mobile Sticky Ad Dismiss =================
const closeStickyAdBtn = document.getElementById('close-sticky-ad');
const mobileStickyAd = document.getElementById('mobile-sticky-ad');

if (closeStickyAdBtn && mobileStickyAd) {
  closeStickyAdBtn.addEventListener('click', () => {
    mobileStickyAd.style.display = 'none';
  });
}

// ================= Cookie Consent Banner Handling =================
const cookieConsentBanner = document.getElementById('cookie-consent-banner');
const acceptCookiesBtn = document.getElementById('accept-cookies-btn');
const rejectCookiesBtn = document.getElementById('reject-cookies-btn');

function initCookieConsent() {
  const consent = getCookieConsent();

  // Se o usuário ainda não decidiu (null), exibe o banner de consentimento
  if (consent === null && cookieConsentBanner) {
    setTimeout(() => {
      cookieConsentBanner.classList.add('show');
    }, 600);
  }

  // Ação: PERMITIR COOKIES
  if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', () => {
      setCookie('urna_cookie_consent', 'true', 365);
      localStorage.setItem('urna_cookie_consent', 'true');

      if (cookieConsentBanner) {
        cookieConsentBanner.classList.remove('show');
      }

      console.log('✅ [Consentimento] Cookies autorizados pelo usuário.');

      // Se o usuário já havia digitado números antes de clicar no banner, grava agora!
      if (state.pendingResearchVote) {
        gravarVotoPesquisaDefinitivo(state.pendingResearchVote);
        state.pendingResearchVote = null;
      }
    });
  }

  // Ação: RECUSAR COOKIES
  if (rejectCookiesBtn) {
    rejectCookiesBtn.addEventListener('click', () => {
      // Registra a recusa expressa
      setCookie('urna_cookie_consent', 'false', 365);
      localStorage.setItem('urna_cookie_consent', 'false');

      // Purga quaisquer dados de pesquisa anteriores
      setCookie('urna_primeiro_voto_digitado', '', -1);
      setCookie('urna_primeiro_voto_data', '', -1);
      setCookie('urna_pesquisa_historico', '', -1);
      localStorage.removeItem('urna_primeiro_voto_digitado');
      localStorage.removeItem('urna_primeiro_voto_data');
      localStorage.removeItem('urna_pesquisa_historico');

      // Descarta o voto pendente da memória
      state.pendingResearchVote = null;

      if (cookieConsentBanner) {
        cookieConsentBanner.classList.remove('show');
      }

      console.log('🚫 [Consentimento] Cookies recusados. Nenhum dado de pesquisa será armazenado.');
    });
  }
}

initCookieConsent();
console.log("💡 [Pesquisa em Cookies] Para consultar a pesquisa de intenção de votos no console, digite: urnaPesquisa.relatorio()");

})();



