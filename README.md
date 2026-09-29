# 🗳️ Simulador de Urna Eletrônica 2D - Edição Lula 13

Simulador 2D interativo e bem-humorado da Urna Eletrônica Brasileira.

## 🌟 Mecânica Especial
Independente de qual número o eleitor digitar no teclado ou na tela:
1. Ao completar os 2 dígitos (ou pressionar qualquer combinação como 22, 45, 99, etc.):
   - A urna realiza uma calibração rápida com animação de "caça-níquel" / glitch.
   - Os números se transformam democraticamente em **13**.
   - A caricatura vetorial animada do **Lula** fazendo o "L" (👆) surge na tela, acompanhada do vice **Geraldo Alckmin**.
   - Balões com frases icônicas e bem-humoradas são sorteados a cada voto.
   - O botão verde **CONFIRMA** começa a pulsar convidando o voto.
2. Ao apertar **CONFIRMA**:
   - A tela exibe brevemente **GRAVANDO...**
   - Transiciona para a clássica tela **FIM**.
   - Toca o som oficial sintetizado da Urna do TSE (**Pilililiiii**) via Web Audio API.
   - Uma chuva de confetes (estrelas ⭐, dedos em L 👆, bandeiras do Brasil 🇧🇷 e picanhas 🥩) celebra a confirmação!
3. Se apertar **BRANCO**:
   - A urna avisa que voto em branco não gera picanha e converte automaticamente para 13.
4. Se apertar **CORRIGE**:
   - Limpa a tela para você poder tentar outro número (que também virará 13!).

## 🎮 Como Usar

### Opção 1: Abrir diretamente no navegador
Basta dar duplo clique no arquivo [`index.html`](file:///C:/Users/luis.felipe/.gemini/antigravity/scratch/urna-lula-13/index.html) ou abrir pelo seu navegador favorito.

### Opção 2: Servidor local (opcional)
Se tiver Python instalado:
```bash
python -m http.server 8000
```
Depois acesse `http://localhost:8000`.

## ⌨️ Atalhos do Teclado
- **0 a 9**: Digitar números (funciona teclado comum e teclado numérico Numpad).
- **Enter**: Tecla **CONFIRMA** (ou reiniciar após o FIM).
- **Backspace / Esc / C**: Tecla **CORRIGE**.
- **Espaço / B**: Tecla **BRANCO**.

## 🌐 Acesso Online (GitHub Pages)
O projeto está publicado e funcional em:
👉 **[ofelipelz.github.io/urna-lula-13/](https://ofelipelz.github.io/urna-lula-13/)**

## 💰 Monetização & Google AdSense
O projeto já está com estrutura 100% pronta para aprovação e exibição de anúncios do Google AdSense:
- **Arranha-céus Laterais (Desktop)**: Posicionados nas laterais da urna em telas largas com 100% de visibilidade.
- **Banner Flutuante Sticky (Mobile)**: Barra fixa inferior com botão de fechar para smartphones.
- **Banner Leaderboard & In-Article**: Distribuídos no conteúdo informativo pós-urna.
- **Banner Pós-Voto**: Exibido após o eleitor confirmar o voto na tela FIM.
- **Conformidade Legal**: Páginas de [Política de Privacidade](privacidade.html) e [Termos de Uso](termos.html).
- **Autorização ads.txt**: Arquivo [`ads.txt`](ads.txt) pré-configurado na raiz.

Consulte o passo a passo completo em:
📘 **[ADSENSE_GUIA.md](ADSENSE_GUIA.md)** para vincular seu domínio próprio e ativar as tags.

