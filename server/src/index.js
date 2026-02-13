const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Função para fazer scraping do perfil FACEIT
async function scrapePlayerProfile(nickname) {
  try {
    const url = `https://www.faceit.com/en/players/${nickname}`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

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
  res.json(stats);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🎮 Servidor FACEIT Widget rodando em http://localhost:${PORT}`);
});
