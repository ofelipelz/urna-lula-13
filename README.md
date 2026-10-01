> *"A sua maior virtude deve ser a gana pelo conhecimento, já que a melhor arma da humanidade é o saber."*

---

# 🗳️ Simulador de Urna Eletrônica - Edição Democrática 13 ⭐

[![Website Status](https://img.shields.io/website?down_color=red&down_message=offline&up_color=green&up_message=online&url=https%3A%2F%2Ffaz-o-l.blog.br)](https://faz-o-l.blog.br)
[![SSL Certificate](https://img.shields.io/badge/SSL-Let's%20Encrypt%20Active%20🔒-success)](https://faz-o-l.blog.br)
[![License](https://img.shields.io/badge/Licen%C3%A7a-MIT-blue.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20JS%20Vanilla-orange)](#-tecnologias-utilizadas)
[![Audio](https://img.shields.io/badge/Web%20Audio-100%25%20Sintetizado-purple)](#-efeitos-sonoros-e-%C3%A1udio-sintetizado)

> **Disponível online em:** 👉 **[https://faz-o-l.blog.br](https://faz-o-l.blog.br)**

---

## 💡 Como Nasceu o Projeto

> **Nota do Autor:** Este projeto foi criado e desenvolvido basicamente através de engenharia de prompts refinados no **Gemini 3.8 Flash** (operando sempre no modo **HIGH**), combinado com o conhecimento técnico, mesmo que em nível mais básico, do programador. A premissa central era criar algo simples, viral, visualmente autêntico e de fácil compreensão para qualquer visitante, unindo humor brasileiro, tecnologia web moderna e conformidade técnica para monetização.

A ideia nasceu da clássica brincadeira política das redes sociais: um simulador hiper-realista da urna eletrônica brasileira onde, **não importa o número digitado pelo eleitor**, o sistema democraticamente converte a escolha para o **13 (Lula)** com efeitos sonoros mágicos, fotos oficiais, frases cômicas e confetes comemorativos ao confirmar.

---

## ✨ Funcionalidades Principais

### 1. 🗳️ Urna Eletrônica Interativa com Conversão Automática
* **Teclado Tátil Completo**: Reproduz visualmente e mecanicamente o teclado oficial do TSE (números de 0 a 9, ponto tátil de acessibilidade na tecla 5, e botões `BRANCO`, `CORRIGE` e `CONFIRMA`).
* **Suporte Completo a Teclado Físico**: Números de `0` a `9`, `Enter` para confirmar, `Backspace`/`Esc`/`C` para corrigir e `Espaço`/`B` para voto em branco.
* **A Magia do 13**:
  * Ao digitar qualquer número de 2 dígitos diferente de 13, a tela pisca em efeito glitch, toca um arpeggio mágico e transforma os números no clássico `1` e `3`.
  * Exibe automaticamente a foto de **Luiz Inácio Lula da Silva** e do vice **Geraldo Alckmin**.
  * Gera frases aleatórias engraçadas no balão de fala (*"Companheiro! Sabia que no fundo você ia de 13! Faz o L! 👆"*, *"O Alckmin mandou avisar que a picanha tá liberada!"*).
  * Ao tentar votar em `BRANCO`, a urna avisa: *"Voto em branco não gera picanha, companheiro! Convertido pra 13 com sucesso! 👆"*.

### 2. 🔊 Efeitos Sonoros com Web Audio API Pura (Sem MP3s pesados)
Toda a sonoplastia do simulador foi programada utilizando síntese matemática de ondas sonoras via **Web Audio API nativa** do navegador:
* **Bip de Digitação**: Onda senoidal com decaimento exponencial rápido (1000 Hz ➔ 750 Hz).
* **Bip de Correção**: Tom duplo decrescente característico (650 Hz e 480 Hz).
* **Arpeggio Mágico**: Subida tonal trifásica suave em onda triangular ao converter os números.
* **O Lendário Som do TSE ("PILILILIII")**: Reprodução fiel dos 3 bips curtos em 1050 Hz finalizando no tom longo sustentado e decrescente em 1400 Hz.
* **Síntese de Voz (SpeechSynthesis API)**: Narração em português ao término do voto (*"Num vai comer picanha, Faz o L!"*).

### 3. 🎉 Motor de Confetes Nativo em Canvas HTML5
* Efeito de celebração desenhado frame a frame em `<canvas>`, disparando dezenas de partículas dinâmicas com rotação, gravidade e símbolos comemorativos (`⭐`, `👆`, `13`, `🇧🇷`, `🥩`).

### 4. ☁️ Contador de Votos em Tempo Real na Nuvem
* Integração com a API de contagem em tempo real (**CountAPI**).
* **Sincronia Estrita**: O contador da barra de topo (*"Votos Confirmados: X"*) e a tela FIM da urna (*"Voto nº X registrado no Brasil"*) são mantidos 100% idênticos e sincronizados.
* **Proteção Anti-Flood**: Cooldown de 2,5 segundos entre confirmações e fallback automático em `localStorage` para manter a experiência funcional mesmo sem conexão de rede.

### 5. 📊 Pesquisa Secreta Extra-Oficial de Intenção de Voto
* **Coleta Silenciosa e Segura**: Antes de qualquer número ser convertido para 13 na tela, o sistema registra em segundo plano a **primeira intenção real do eleitor** (apenas os 2 primeiros dígitos digitados ou a tecla branco).
* **Candidatos de 2026 Pré-Cadastrados**:
  * `13`: Luiz Inácio Lula da Silva (PT)
  * `22`: Flávio Bolsonaro (PL)
  * `14`: Renan Santos (Missão)
  * `55`: Ronaldo Caiado (PSD)
  * `30`: Romeu Zema (Novo)
  * `70`: Augusto Cury (Avante)
  * `28`: Pablo Marçal (PRTB)
  * `21`: Edmilson Costa (PCB)
  * `16`: Hertz Dias (PSTU)
  * `80`: Samara Martins (UP)
  * `35`: Wilson Grassi (Democrata)
  * `27`: Clariana Barão (DC)
  * `29`: Rui Costa Pimenta (PCO)
  * `BRANCO`: Votos em branco
  * `NULOS`: Quaisquer outras combinações numéricas
* **Tabela Dinâmica e Sleek Scrollbar**: Candidatos que recebem votos entram automaticamente no ranking com ordenação decrescente por quantidade de votos, cálculo de porcentagem em tempo real, badges oficiais e barra de rolagem estilizada (`custom-scrollbar`) com cabeçalho sticky.

### 6. 💰 Arquitetura Otimizada para Google AdSense e LGPD
* **Posicionamentos Estratégicos de Alta Visibilidade (Active View > 70%)**:
  * 2 Banners laterais *Skyscraper* (160×600) no Desktop.
  * 1 Banner flutuante fixo (*Sticky Anchor*) no rodapé para Mobile.
  * 1 Bloco de alta atenção na tela `FIM` pós-voto.
  * 1 Banner horizontal largo (728×90 / Responsivo) separando a urna da pesquisa.
  * 1 Bloco in-article nativo na seção educativa.
* **Compliance LGPD**: Banner de consentimento de cookies para armazenamento e conformidade com diretrizes do Google AdSense.
* **Páginas Obrigatórias**: Termos de Uso (`termos.html`), Política de Privacidade (`privacidade.html`) e arquivo `ads.txt` configurado na raiz.

---

## 🛠️ Tecnologias Utilizadas

```
faz-o-l.blog.br
│
├── Frontend:
│   ├── HTML5 Semântico
│   ├── CSS3 Moderno (CSS Grid, Flexbox, Animações, Custom Properties)
│   ├── JavaScript Vanilla ES6+ (Sem frameworks pesados como React ou Vue)
│   ├── Web Audio API (Sintetizador analógico virtual de sons)
│   ├── HTML5 Canvas API (Motor de partículas para confetes)
│   └── Web Speech API (Síntese de fala)
│
├── Infraestrutura & Hospedagem:
│   ├── GitHub Pages (Branch main)
│   ├── CDN Global Fastly (Nó de borda em São Paulo / GRU - Latência ~1ms)
│   ├── Certificado SSL/TLS Automático (Let's Encrypt com HTTPS forçado)
│   └── Registro.br (Gestão de DNS Apex + CNAME)
│
└── APIs & Serviços:
    ├── CountAPI (Persistência e apuração em tempo real de votos)
    └── Google AdSense (Monetização programática)
```

---

## 🚀 Como Executar o Projeto Localmente

Como o projeto é construído em **JavaScript puro (Vanilla)**, não é necessário instalar dependências pesadas do Node.js nem rodar compiladores.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/ofelipelz/urna-lula-13.git
   cd urna-lula-13
   ```

2. **Abra o arquivo diretamente no navegador:**
   * Basta dar um duplo clique em `index.html` ou utilizar a extensão **Live Server** do VS Code.
   * Alternativamente, utilizando Python:
     ```bash
     python -m http.server 8000
     ```
   * Acesse `http://localhost:8000` no seu navegador.

---

## 📁 Estrutura de Arquivos

```
urna-lula-13/
├── index.html        # Estrutura principal da urna, banners, tabela e cards
├── style.css         # Design autêntico da urna eletrônica, responsividade e temas
├── script.js         # Lógica da urna, Web Audio API, pesquisa em nuvem e confetes
├── ads.txt           # Declaração oficial de inventário do Google AdSense
├── CNAME             # Configuração de domínio customizado (faz-o-l.blog.br)
├── termos.html       # Termos de Uso para compliance do Google AdSense
├── privacidade.html  # Política de Privacidade LGPD / GDPR
└── README.md         # Documentação completa do projeto
```

---

## ⚖️ Isenção de Responsabilidade (Disclaimer Legal)

Este projeto tem finalidade **exclusivamente satírica, humorística, educacional e de entretenimento**. 

* **Não possui vínculo oficial** com o Tribunal Superior Eleitoral (TSE), partidos políticos ou entidades governamentais.
* A pesquisa extra-oficial de intenção de voto exibida no site é de caráter recreativo, baseada em amostras voluntárias dos usuários do simulador, **sem representatividade estatística ou metodologia científica**, em conformidade com o Art. 33 da Lei Federal nº 9.504/1997.

---

## 👨‍💻 Autor

Criado com dedicação e bom humor por **[@ofelipelz](https://github.com/ofelipelz)**.

Se você gostou da ideia ou achou o código interessante, deixe uma ⭐ no repositório!
