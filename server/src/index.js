const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
// Carrega variáveis de ambiente: prioriza `.env.local` se existir
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const envLocal = path.join(__dirname, '..', '.env.local');
const envDefault = path.join(__dirname, '..', '.env');
if (fs.existsSync(envLocal)) {
  dotenv.config({ path: envLocal });
} else if (fs.existsSync(envDefault)) {
  dotenv.config({ path: envDefault });
} else {
  dotenv.config();
}

const app = express();
// Desativa ETag para evitar respostas 304 "Not Modified"
app.disable('etag');

// Log simples de requisições para debug
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Função para fazer scraping do perfil FACEIT
async function scrapePlayerProfile(nickname) {
  // Se FACEIT API key estiver configurada, usa a API oficial primeiro
  const FACEIT_API_KEY = process.env.FACEIT_API_KEY;
  if (FACEIT_API_KEY) {
    try {
      // Busca jogador pela API
      const playerResp = await axios.get(`https://open.faceit.com/data/v4/players?nickname=${encodeURIComponent(nickname)}`, {
        headers: { Authorization: `Bearer ${FACEIT_API_KEY}` },
        timeout: 8000,
        validateStatus: null
      });

      if (playerResp.status === 200 && playerResp.data) {
        const pdata = playerResp.data;
        // Tenta extrair elo para CS:GO
        const elo = pdata.games?.csgo?.faceit_elo || pdata.faceit_elo || 'N/A';
        const resolvedNickname = pdata.nickname || pdata.player_name || pdata.player_id || nickname;

        // Tenta buscar histórico de partidas para contar wins/losses/eloChange do dia
        let wins = 0;
        let losses = 0;
        let eloChanges = [];
        try {
          const playerId = pdata.player_id || pdata.playerId || pdata.player_id || pdata.player_id || pdata._id || pdata.id;
          if (playerId) {
            const historyResp = await axios.get(`https://open.faceit.com/data/v4/players/${playerId}/history?game=csgo&limit=50`, {
              headers: { Authorization: `Bearer ${FACEIT_API_KEY}` },
              timeout: 8000,
              validateStatus: null
            });

            if (historyResp.status === 200 && Array.isArray(historyResp.data?.items)) {
              const items = historyResp.data.items;
              const today = new Date();
              const todayY = today.getUTCFullYear();
              const todayM = today.getUTCMonth();
              const todayD = today.getUTCDate();

              for (const it of items) {
                // Vários formatos possíveis: procurar timestamp em created_at, started_at ou date
                const ts = it.started_at || it.created_at || it.date || it.timestamp || it.match_start || null;
                let matchDate = null;
                if (ts) {
                  // timestamp em segundos ou ms ou ISO
                  if (typeof ts === 'number') {
                    matchDate = ts > 1e12 ? new Date(ts) : new Date(ts * 1000);
                  } else {
                    matchDate = new Date(ts);
                  }
                }

                if (matchDate && matchDate.getUTCFullYear() === todayY && matchDate.getUTCMonth() === todayM && matchDate.getUTCDate() === todayD) {
                  const result = it.result || it.match_result || it.outcome || it.type || null;
                  const resStr = (typeof result === 'string') ? result.toLowerCase() : null;
                  if (resStr && resStr.includes('win')) wins++;
                  else if (resStr && (resStr.includes('loss') || resStr.includes('lose') || resStr.includes('defeat'))) losses++;
                  else if (it.teams) {
                    // tentar inferir por estrutura de teams
                    // procurar propriedade 'result' dentro de team entries
                    try {
                      for (const t of Object.values(it.teams)) {
                        if (t.result && typeof t.result === 'string') {
                          const r = t.result.toLowerCase();
                          if (r.includes('win')) wins++;
                          else if (r.includes('loss') || r.includes('lose')) losses++;
                        }
                      }
                    } catch (e) { /* ignore */ }
                  }
                  
                  // Capturar mudança de ELO
                  if (it.elo_change !== undefined && it.elo_change !== null) {
                    eloChanges.push(it.elo_change);
                  } else if (it.player_stats && it.player_stats.elo_change !== undefined) {
                    eloChanges.push(it.player_stats.elo_change);
                  } else if (it.stats && it.stats.elo_change !== undefined) {
                    eloChanges.push(it.stats.elo_change);
                  }
                }
              }
            }
          }
        } catch (e) {
          // falha ao obter histórico - subir com wins/losses = 0
        }

        // Calcular média de mudança de ELO
        let eloChange = 0;
        if (eloChanges.length > 0) {
          const sum = eloChanges.reduce((a, b) => a + b, 0);
          eloChange = Math.round(sum / eloChanges.length);
        }

        return { nickname: resolvedNickname, elo: elo, ranking: 'N/A', wins, losses, eloChange };
      }
    } catch (err) {
      console.error('Erro na FACEIT API:', err.message);
      // segue para fallback de scraping
    }
  }
  try {
    const url = `https://www.faceit.com/en/players/${nickname}`;
    
    // Cabeçalhos mais completos para tentar evitar bloqueio por Cloudflare
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://www.faceit.com/',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-User': '?1',
        'Sec-Fetch-Dest': 'document'
      },
      timeout: 12000,
      validateStatus: null // vamos tratar códigos HTTP manualmente
    });

    if (response.status === 403) {
      console.error('Faceit bloqueou a requisição (403) para', url);
      return {
        error: 'Bloqueado ao buscar dados no FACEIT (403). Tente novamente mais tarde ou use a FACEIT API / Puppeteer.',
        nickname: nickname
      };
    }

    if (response.status >= 400) {
      console.error('Erro HTTP ao buscar perfil FACEIT:', response.status, url);
      return {
        error: `Erro ao buscar perfil FACEIT (status ${response.status}).`,
        nickname: nickname
      };
    }

    const $ = cheerio.load(response.data);
    
    // Extrai informações do HTML
    const eloText = $('[class*="level"]').first().text().trim();
    const elo = eloText.match(/\d+/)?.[0] || 'N/A';
    
    // Procura pelo ranking se existir
    let ranking = 'N/A';
    const rankingText = $('body').text();
    if (rankingText.includes('#') && rankingText.includes('1000')) {
      const match = rankingText.match(/#(\d+)/);
      if (match) {
        const rankNum = parseInt(match[1]);
        if (rankNum <= 1000) {
          ranking = `#${rankNum}`;
        }
      }
    }

    // Extrai dados de vitórias/derrotas
    // Isso geralmente está no histórico de partidas
    const stats = {
      elo: elo,
      ranking: ranking,
      wins: 0,
      losses: 0,
      nickname: nickname
    };

    // Tenta extrair stats do histórico
    const matchElements = $('[class*="match"]');
    let winsToday = 0;
    let lossesToday = 0;

    matchElements.each((i, elem) => {
      const text = $(elem).text().toLowerCase();
      if (text.includes('win') || text.includes('vitória')) {
        winsToday++;
      } else if (text.includes('loss') || text.includes('derrota')) {
        lossesToday++;
      }
    });

    // Se encontrou dados do dia
    if (winsToday > 0 || lossesToday > 0) {
      stats.wins = winsToday;
      stats.losses = lossesToday;
    } else {
      // Valor padrão se não encontrar
      stats.wins = 0;
      stats.losses = 0;
    }

    return stats;
  } catch (error) {
    console.error('Erro ao fazer scraping:', error.message);
    return {
      error: 'Não foi possível buscar o perfil. Verifique o nickname.',
      nickname: nickname
    };
  }
}

// Rota para obter dados do jogador
app.get('/api/player/:nickname', async (req, res) => {
  const { nickname } = req.params;

  if (!nickname || nickname.trim() === '') {
    return res.status(400).json({ error: 'Nickname é obrigatório' });
  }

  const stats = await scrapePlayerProfile(nickname);
  // Evita cache no cliente e intermediários
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  return res.json(stats);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🎮 Servidor FACEIT Widget rodando em http://localhost:${PORT}`);
});
