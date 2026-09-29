# 🚀 Guia Completo: Conectar Domínio e Ativar Google AdSense

Este projeto já está **100% preparado** com todos os blocos de anúncios, páginas de conformidade legal (Privacidade e Termos de Uso), conteúdo editorial estruturado e arquivo `ads.txt`.

Siga este passo a passo quando você adquirir o seu domínio próprio.

---

## 📌 Passo 1: Comprar seu Domínio Próprio

O Google AdSense não aprova subdomínios gratuitos como `.github.io`. Você precisa de um domínio próprio (ex: `simuladorurna.com.br`, `urnademocratica.com`, `fazool.com.br`, etc.).

- **Onde comprar**:
  - [Registro.br](https://registro.br) (~R$ 40/ano para domínios `.com.br`)
  - [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)
  - [Hostinger](https://www.hostinger.com.br) ou [GoDaddy](https://www.godaddy.com)

---

## 🌐 Passo 2: Configurar o DNS para o GitHub Pages

Após comprar o domínio, configure os apontamentos de DNS no painel do seu registrador:

### 1. Registros Tipo **A** (para o domínio raiz, ex: `seudominio.com.br`):
Crie 4 registros do tipo `A` apontando para os IPs do GitHub Pages:
| Tipo | Nome / Host | Valor / Destino |
|------|-------------|-----------------|
| `A`  | `@`         | `185.199.108.153` |
| `A`  | `@`         | `185.199.109.153` |
| `A`  | `@`         | `185.199.110.153` |
| `A`  | `@`         | `185.199.111.153` |

### 2. Registro Tipo **CNAME** (para o subdomínio `www`, ex: `www.seudominio.com.br`):
| Tipo    | Nome / Host | Valor / Destino |
|---------|-------------|-----------------|
| `CNAME` | `www`       | `ofelipelz.github.io.` |

*(Aguarde a propagação do DNS, que costuma levar de 15 minutos a 2 horas).*

---

## ⚙️ Passo 3: Ativar o Domínio no Repositório do GitHub

1. Acesse o seu repositório: [github.com/ofelipelz/urna-lula-13](https://github.com/ofelipelz/urna-lula-13)
2. Vá em **Settings** > **Pages** (no menu esquerdo).
3. Na seção **Custom domain**, digite o seu domínio (ex: `seudominio.com.br`) e clique em **Save**.
4. Aguarde a verificação do DNS e marque a opção **Enforce HTTPS** (para ativar o certificado SSL gratuito).
5. O GitHub criará automaticamente o arquivo `CNAME` no repositório.

---

## 💰 Passo 4: Criar Conta e Solicitar Aprovação no Google AdSense

1. Acesse [adsense.google.com](https://adsense.google.com) e entre com sua conta Google.
2. No menu lateral, clique em **Sites** > **Adicionar site**.
3. Insira o seu domínio próprio (ex: `seudominio.com.br`) e clique em **Salvar e continuar**.
4. O AdSense fornecerá o seu **ID de Editor** no formato: `ca-pub-XXXXXXXXXXXXXXXX` (16 dígitos).

---

## 📝 Passo 5: Ativar os Blocos no Código

Com o seu `ca-pub-XXXXXXXXXXXXXXXX` em mãos:

### 1. Atualizar o `ads.txt`:
Abra o arquivo [`ads.txt`](ads.txt) e substitua `pub-0000000000000000` pelo seu ID numérico:
```text
google.com, pub-SEU_NUMERO_AQUI, DIRECT, f08c47fec0942fa0
```

### 2. Ativar a tag no `<head>` do `index.html`:
Abra [`index.html`](index.html), localize o trecho no `<head>` e descomente a tag:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-SEU_ID_AQUI"
     crossorigin="anonymous"></script>
```

### 3. Ativar os Espaços de Anúncio Pré-Configurados:
No painel do AdSense, vá em **Anúncios** > **Por bloco de anúncios** e crie os blocos correspondentes:

1. **Arranha-céus Laterais (Desktop)**:
   - Crie 2 blocos verticais ou responsivos.
   - Descomente as tags `<ins class="adsbygoogle" ...>` em `.ad-skyscraper-left` e `.ad-skyscraper-right` inserindo seus `data-ad-slot`.
   - *Rendimento: 100% de visibilidade imediata em telas grandes sem atrapalhar a urna.*

2. **Banner Mobile Flutuante (Sticky Footer)**:
   - Crie um bloco horizontal de 320x50 ou responsivo.
   - Descomente a tag em `#mobile-sticky-ad`.
   - *Rendimento: Fica fixo na tela do celular com botão de fechar, gerando impressões ativas contínuas.*

3. **Banner Leaderboard (Topo do Conteúdo / Pós-Urna)**:
   - Crie um bloco responsivo ou 728x90.
   - Descomente a tag em `#ad-container-top`.

4. **Anúncio In-Article (Meio do Conteúdo)**:
   - Crie um bloco do tipo "In-article".
   - Descomente a tag em `.in-article-ad-wrap`.

5. **Anúncio Pós-Voto (Tela FIM)**:
   - Descomente a tag em `.fim-ad-slot`.

---

## ⏱️ Quanto tempo leva para aprovar?

- A análise do Google AdSense costuma levar de **2 a 14 dias úteis**.
- O projeto já possui todos os requisitos exigidos pelo Google:
  - ✅ Política de Privacidade ([`privacidade.html`](privacidade.html))
  - ✅ Termos de Uso ([`termos.html`](termos.html))
  - ✅ Conteúdo editorial informativo e FAQ sobre a urna eletrônica
  - ✅ Navegação clara e responsiva
  - ✅ Arquivo `ads.txt` na raiz
  - ✅ Design sem sobreposição abusiva de publicidade
