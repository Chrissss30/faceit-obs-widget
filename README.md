# FACEIT OBS Widget

Um widget simples e elegante para exibir estatísticas FACEIT em tempo real no OBS (Open Broadcaster Software).

## 🎮 Funcionalidades

- ✅ Busca de perfis públicos FACEIT sem API
- ✅ Exibição de ELO
- ✅ Ranking (se top 1000)
- ✅ Vitórias/Derrotas do dia
- ✅ Win Rate com barra visual
- ✅ Auto-atualização (30 segundos)
- ✅ Design responsivo e moderno
- ✅ Integração fácil com OBS

## 📋 Requisitos

- Node.js 16+
- npm ou yarn

## 🚀 Instalação

### 1. Backend

```bash
cd server
npm install
npm start
```

O servidor rodará em `http://localhost:3001`

### 2. Frontend

Em outro terminal:

```bash
cd client
npm install
npm run dev
```

O widget será aberto em `http://localhost:3000`

## 📺 Como usar no OBS

1. **Abra o OBS**
2. **Clique em "Adicionar Fonte"** (sinal de + na seção Fontes)
3. **Selecione "Browser Source"**
4. **Digite a URL:** `http://localhost:3000`
5. **Defina a resolução:**
   - Largura: 520px
   - Altura: 700px
6. **Aplique!**

## 🎨 Customização

### Trocar servidor de API

No arquivo `.env` dentro de `client`:

```
VITE_API_URL=http://seu-servidor:3001
```

### Modificar intervalo de auto-atualização

Edite em `client/src/App.jsx`, procure por:

```javascript
setInterval(() => {
  fetchPlayerData(nickname);
}, 30000); // 30000ms = 30 segundos
```

## 🔧 Troubleshooting

### Error: "Não foi possível buscar o perfil"
- Verifique se o nickname está correto
- FACEIT pode ter bloqueado o scraping - use `User-Agent` diferente ou adicione delay

### Widget em branco no OBS
- Verifique se ambos servers (backend e frontend) estão rodando
- Abra http://localhost:3000 no navegador para ver se funciona
- Verifique o firewall

### CORS Error
- Backend já tem CORS habilitado, mas se precisar, edite em `server/src/index.js`

## 📦 Estrutura

```
faceit-obs-widget/
├── server/
│   ├── src/
│   │   └── index.js (scraping + API)
│   └── package.json
└── client/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🌐 API Endpoints

### GET `/api/player/:nickname`
Retorna dados do jogador

**Resposta:**
```json
{
  "nickname": "player_name",
  "elo": 2100,
  "ranking": "#450",
  "wins": 5,
  "losses": 2
}
```

### GET `/api/health`
Health check

## 🛠️ Tecnologias

- **Backend:** Express.js + Cheerio (scraping)
- **Frontend:** React + Vite
- **Styling:** CSS3 com gradientes e animações

## ⚠️ Importante

Este widget faz web scraping de dados públicos da FACEIT. Use responsavelmente:
- Não faça muitas requisições simultâneas
- Respeite o `robots.txt` do site
- Se receber erros 429, aguarde antes de fazer nova requisição

## 📝 Licença

MIT

## 🤝 Contribuições

Sinta-se livre para abrir issues e PRs!

---

**Desenvolvido para streamers CS2 🎮**
