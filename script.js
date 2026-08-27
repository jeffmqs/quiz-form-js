/* =================== CONFIG =================== */
// script.js
const GAS_URL = 'https://script.google.com/macros/s/AKfycbyvsifJedEWPtNO_jCxazHjbzN4MoSYieNp1izQBP2eBGT1l239LtNFz72SeICsw76jxw/exec';


/* =================== TELAS =================== */
const scrIntro  = document.getElementById('screen-intro');
const scrSign   = document.getElementById('screen-signup');
const scrQuiz   = document.getElementById('screen-quiz');
const scrResult = document.getElementById('screen-result');

function show(el){
  [scrIntro, scrSign, scrQuiz, scrResult].forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function goTo(name){
  if (name === 'intro')  return show(scrIntro);
  if (name === 'signup') return show(scrSign);
  if (name === 'quiz')   return show(scrQuiz);
  if (name === 'result') return show(scrResult);
}

/* =================== INTRO → CADASTRO =================== */
document.getElementById('btnStart').addEventListener('click', () => {
  resetFlowForNewRun();
  goTo('signup');
});

/* =================== VOLTAR =================== */
document.querySelectorAll('.formHeader .btn.ghost').forEach(btn => {
  btn.textContent = '';
  btn.setAttribute('aria-label', 'Voltar');
  btn.addEventListener('click', onBack);
});
function onBack(){
  if (scrResult.classList.contains('active')) return goTo('intro');
  if (scrQuiz.classList.contains('active')){
    if (step > 0){ step--; renderQuestion(); }
    else goTo('signup');
    return;
  }
  if (scrSign.classList.contains('active')) return goTo('intro');
  goTo('intro');
}

/* =================== FORMULÁRIO RBS =================== */

let signupData = {};

const setErr = (name, msg) => {
  const el = document.querySelector(`.error[data-for="${name}"]`);
  if (el) el.textContent = msg || '';
};

const btnContinuarQuiz = document.getElementById('btnContinuarQuiz');

btnContinuarQuiz.addEventListener('click', () => {
  step = 0;
  goTo('quiz');
  renderQuestion();
});

/* =================== QUIZ =================== */
const questions = [
  { title: 'Quando você pensa no seu futuro, o que mais te motiva?',
    options: [
      { label: 'Comunicar ideias que inspiram ou informam o mundo.', k: 'H' },
      { label: 'Criar soluções inteligentes para problemas complexos.', k: 'E' },
      { label: 'Cuidar das pessoas e fazer diferença na vida delas.', k: 'S' },
    ]},
  { title: 'Imagine que está vivendo um dia perfeito. O que você está fazendo?',
    options: [
      { label: 'Conversando, escrevendo ou apresentando um projeto criativo.', k:'H' },
      { label: 'Resolvendo desafios lógicos, programando ou construindo algo novo.', k:'E' },
      { label: 'Ajudando alguém com atenção, empatia e conhecimento.', k:'S' },
    ]},
  { title: 'Seus amigos sempre te procuram para…',
    options: [
      { label: 'Falar sobre sentimentos, conselhos ou ideias inspiradoras.', k:'H' },
      { label: 'Ajudar a entender algo difícil ou resolver um problema.',    k:'E' },
      { label: 'Oferecer apoio, cuidado ou acolhimento.',                    k:'S' },
    ]},
  { title: 'Sobre seu jeito de ver o mundo...',
    options: [
      { label: '“As palavras têm o poder de mudar o mundo.”', k:'H' },
      { label: '“Tudo tem uma lógica. É só encontrar a fórmula.”', k:'E' },
      { label: '“Cuidar de alguém é a forma mais nobre de se conectar.”', k:'S' },
    ]},
  { title: 'Onde você se imagina trabalhando daqui a 10 anos?',
    options: [
      { label: 'Em uma agência, redação, palco ou frente às câmeras.', k:'H' },
      { label: 'Num laboratório, escritório de tecnologia ou empresa de inovação.', k:'E' },
      { label: 'Em um hospital, clínica, ONG ou comunidade.', k:'S' },
    ]},
  { title: 'Se você fosse liderar uma campanha social, qual seria o tema?',
    options: [
      { label: 'Combate à desinformação e valorização da cultura.', k:'H' },
      { label: 'Soluções sustentáveis e tecnologias verdes.',        k:'E' },
      { label: 'Saúde mental e bem-estar para todos.',               k:'S' },
    ]},
  { title: 'Seu estilo de aprendizado é mais próximo de...',
    options: [
      { label: 'Atividades práticas com interação e criatividade.', k:'H' },
      { label: 'Raciocínio analítico, exatas e desafios com lógica.', k:'E' },
      { label: 'Experiências reais e empatia com o outro.', k:'S' },
    ]},
  { title: 'Qual é o seu papel natural em uma equipe?',
    options: [
      { label: 'Aquele que articula, apresenta ideias e motiva.', k:'H' },
      { label: 'Quem organiza, estrutura e propõe soluções técnicas.', k:'E' },
      { label: 'O que escuta, acolhe e traz equilíbrio ao grupo.', k:'S' },
    ]},
  { title: 'O que mais importa para você em uma profissão?',
    options: [
      { label: 'Liberdade de expressão e impacto cultural.', k:'H' },
      { label: 'Desafios constantes, inovação e raciocínio.', k:'E' },
      { label: 'Transformar vidas e promover bem-estar.',     k:'S' },
    ]},
  { title: 'Num universo cheio de protagonistas incríveis, quem tem mais a ver com você?',
    options: [
      { label: 'Como o Homem-Aranha (Peter Parker) ou a Katara (Avatar: A Lenda de Aang), você sente que nasceu para cuidar das pessoas e fazer a diferença com empatia e coragem.', k:'S' },
      { label: 'Como o Tony Stark (Homem de Ferro) ou a Hermione Granger (Harry Potter), você é movido(a) pela curiosidade, ama resolver problemas e usa a mente como sua maior ferramenta.', k:'E' },
      { label: 'Como o Miles Morales (Aranhaverso) ou a Raven (Jovens Titãs), você tem estilo, visão crítica e se expressa com intensidade. Sua força está em ser autêntico(a).', k:'H' },
    ]},
];

let answers = [];
let scores  = { H:0, E:0, S:0 };
let step    = 0;

const qTitle      = document.getElementById('qTitle');
const qOptions    = document.getElementById('qOptions');
const btnNext     = document.getElementById('btnNext');
const progressTxt = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');

/* Embaralhamento estável por pergunta */
const shuffledOptions = {};
function shuffleArray(arr){
  const a = arr.slice();
  for (let i=a.length-1; i>0; i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

function renderQuestion(){
  setErr('quiz','');
  const q = questions[step];
  if (!shuffledOptions[step]) shuffledOptions[step] = shuffleArray(q.options);
  const opts = shuffledOptions[step];

  qTitle.textContent = q.title;
  qOptions.innerHTML = '';
  const letters = ['A','B','C'];
  opts.forEach((opt, idx) => {
    const id = `opt-${step}-${idx}`;
    const wrap = document.createElement('label');
    wrap.className = 'option';
    wrap.setAttribute('data-letter', letters[idx]);
    wrap.innerHTML = `
      <input type="radio" name="answer" value="${opt.k}" id="${id}">
      <span>${opt.label}</span>
    `;
    qOptions.appendChild(wrap);
  });

  if (answers[step]) {
    const val = answers[step];
    const optToSelect = Array.from(qOptions.querySelectorAll('label.option')).find(l => l.querySelector('input')?.value === val);
    if (optToSelect){ optToSelect.classList.add('selected'); optToSelect.querySelector('input').checked = true; }
  }

  progressTxt.textContent = `${step+1}/${questions.length}`;
  progressBar.style.width = `${((step+1)/questions.length)*100}%`;
}

qOptions.addEventListener('click', (e) => {
  const label = e.target.closest('label.option');
  if (!label) return;
  const input = label.querySelector('input[type="radio"]');
  if (input) input.checked = true;
  qOptions.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
  label.classList.add('selected');
});

/* Envio ao GAS com retry leve */
async function fetchWithTimeout(url, opts={}, ms=9000){
  const ctrl = new AbortController(); const t=setTimeout(()=>ctrl.abort(),ms);
  try{ return await fetch(url,{...opts,signal:ctrl.signal}); }
  finally{ clearTimeout(t); }
}
async function postToGAS(payload){
  const req = { method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body: JSON.stringify(payload) };
  const delays=[0,800,1500];
  for (let i=0;i<delays.length;i++){
    if (delays[i]) await new Promise(r=>setTimeout(r,delays[i]));
    try{
      const resp = await fetchWithTimeout(GAS_URL, req, 9000);
      if (resp.type === 'opaque' || resp.ok) return true;
    }catch(_){}
  }
  return false;
}

/* Botão OK do quiz */
btnNext.addEventListener('click', async () => {
  const chosen = document.querySelector('input[name="answer"]:checked');
  if (!chosen){ setErr('quiz','Selecione uma opção para continuar.'); return; }
  setErr('quiz','');

  const newK = chosen.value;
  const prevK = answers[step];
  if (prevK) scores[prevK] = Math.max(0, scores[prevK]-1);
  answers[step] = newK;
  scores[newK]++;

  if (step < questions.length - 1){
    step++; renderQuestion();
  } else {
    const result = pickWinner(scores);
    const oldLabel = btnNext.textContent;
    btnNext.disabled = true; btnNext.textContent = 'Enviando…';

    const ok = await postToGAS({
      ...signupData,
      respostas: answers,
      placar: scores,
      perfil: result
    });

    btnNext.disabled = false; btnNext.textContent = oldLabel;

    renderResult(result);
    goTo('result');

    const sendMsg = document.getElementById('sendMsg');
    if (ok){ sendMsg.style.color='#1a7f37'; sendMsg.textContent='✅ Concluído com sucesso!'; }
    else   { sendMsg.style.color='#b40000'; sendMsg.textContent='⚠️ Não foi possível enviar automaticamente.'; }
  }
});

/* Desempate aleatório */
function pickWinner({H,E,S}){
  const max = Math.max(H,E,S);
  const tied=[]; if (H===max) tied.push('H'); if (E===max) tied.push('E'); if (S===max) tied.push('S');
  return tied[Math.floor(Math.random()*tied.length)];
}

/* =================== RESULTADO =================== */
const resultContent = document.getElementById('resultContent');

function renderResult(k){

  let title='', desc='', cursos=[];

  if (k==='H'){
    title = 'Seu perfil é: Humanas & Comunicação';

    desc  = 'Você tem o dom da expressão, da empatia e da conexão com o outro. Seu futuro pode estar entre as palavras, ideias e relações.';

    cursos = [
      { nome:'Administração', link:'https://portal.unicap.br/w/curso/administracao#presencial/' },
      { nome:'Ciências da Religião', link:'https://portal.unicap.br/w/ciencia-da-religiao/' },
      { nome:'Ciências Econômicas', link:'https://portal.unicap.br/w/ciencia-economica#presencial/' },
      { nome:'Ciências Contábeis', link:'https://portal.unicap.br/w/ciencias-contabeis#presencial/' },
      { nome:'Direito', link:'https://portal.unicap.br/w/direito#presencial/' },
      { nome:'Filosofia', link:'https://portal.unicap.br/w/filosofia-licenciatura#presencial/' },
      { nome:'Gestão de RH', link:'https://portal.unicap.br/w/gestao-de-recursos-humanos/' },
      { nome:'História', link:'https://portal.unicap.br/w/historia#presencial/' },
      { nome:'Jornalismo', link:'https://portal.unicap.br/w/jornalismo#presencial/' },
      { nome:'Letras (Português, Português e Inglês)', link:'https://portal.unicap.br/w/letras-portugues-e-ingles#presencial/' },
      { nome:'Pedagogia', link:'https://portal.unicap.br/w/pedagogia#presencial/' },
      { nome:'Mídias Sociais', link:'https://portal.unicap.br/w/midias-sociais-digitais/' },
      { nome:'Psicologia', link:'https://portal.unicap.br/w/psicologia#presencial/' },
      { nome:'Publicidade e Propaganda', link:'https://portal.unicap.br/w/publicidade-e-propaganda#presencial/' },
      { nome:'Teologia', link:'https://portal.unicap.br/w/teologia#presencial/' }
    ];
  }

  if (k==='E'){
    title = 'Seu perfil é: Exatas & Tecnologia';

    desc  = 'Você tem uma mente lógica, investigativa e movida a desafios. Curioso por natureza, adora entender como as coisas funcionam e busca criar soluções para o mundo.';

    cursos = [
      { nome:'Arquitetura e Urbanismo', link:'https://portal.unicap.br/w/arquitetura-e-urbanismo#presencial/' },
      { nome:'Banco de Dados – IA e Ciência de Dados', link:'https://portal.unicap.br/w/banco-de-dados#presencial/' },
      { nome:'Ciência da Computação', link:'https://portal.unicap.br/w/ciencia-da-computacao#presencial/' },
      { nome:'Ciências Contábeis', link:'https://portal.unicap.br/w/ciencias-contabeis#presencial/' },
      { nome:'Ciências Econômicas', link:'https://portal.unicap.br/w/ciencia-economica#presencial/' },
      { nome:'Engenharia da Complexidade (pioneiro e internacional)', link:'https://portal.unicap.br/w/engenharia-da-complexidade#presencial/' },
      { nome:'Engenharias (Civil e de Produção)', link:'https://portal.unicap.br/w/engenharia-civil#presencial/' },
      { nome:'Inteligência Artificial', link:'https://portal.unicap.br/w/inteligencia-artificial#presencial/' },
      { nome:'Jogos Digitais', link:'https://portal.unicap.br/w/jogos-digitais#presencial/' },
      { nome:'Logística', link:'https://portal.unicap.br/w/logistica/' },
      { nome:'Matemática', link:'https://portal.unicap.br/w/matematica/' },
      { nome:'Sistemas para a Internet', link:'https://portal.unicap.br/w/sistemas-para-internet#presencial/' }
    ];
  }

  if (k==='S'){
    title = 'Seu perfil é: Saúde & Ciências da Vida';

    desc  = 'Você tem empatia, sensibilidade e vontade genuína de cuidar do outro. Sua vocação é transformar vidas por meio do conhecimento e do acolhimento.';

    cursos = [
      { nome:'Medicina', link:'https://portal.unicap.br/w/medicina#presencial/' },
      { nome:'Enfermagem', link:'https://portal.unicap.br/w/enfermagem#presencial/' },
      { nome:'Psicologia', link:'https://portal.unicap.br/w/psicologia#presencial/' },
      { nome:'Fisioterapia', link:'https://portal.unicap.br/w/fisioterapia#presencial/' },
      { nome:'Fonoaudiologia', link:'https://portal.unicap.br/w/fonoaudiologia#presencial/' },
      { nome:'Farmácia', link:'https://portal.unicap.br/w/farmacia#presencial/' },
      { nome:'Nutrição', link:'https://portal.unicap.br/w/nutricao#presencial/' },
      { nome:'Ciências Biológicas', link:'https://portal.unicap.br/w/ciencias-biologicas-licenciatura/' }
    ];
  }

  resultContent.innerHTML = `
    <h3>${title}</h3>

    <p>${desc}</p>

    <p><strong>Cursos Unicap para você:</strong></p>

    <ul>
      ${cursos.map(c => `
        <li>
          <a 
            href="${c.link}" 
            target="_blank" 
            rel="noopener noreferrer"
            style="color:#0000EE; text-decoration:underline;"
          >
            ${c.nome}
          </a>
        </li>
      `).join('')}
    </ul>
  `;
}
/* =================== UTIL =================== */
function resetFlowForNewRun(){
  answers = [];
  scores = { H:0, E:0, S:0 };
  step = 0;

  for (const k in shuffledOptions) {
    delete shuffledOptions[k];
  }

  const sendMsg = document.getElementById('sendMsg');

  if (sendMsg) {
    sendMsg.textContent = '';
  }
}

/* ====== UX extras ====== */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;

  if (scrQuiz.classList.contains('active')) {
    e.preventDefault();
    document.getElementById('btnNext').click();
  }
});

/* =================== LINK DIRETO PARA O QUIZ =================== */

const params = new URLSearchParams(window.location.search);

if (params.get('etapa') === 'quiz') {
  step = 0;
  goTo('quiz');
  renderQuestion();
}
