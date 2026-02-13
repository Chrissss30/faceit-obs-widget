import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [nickname, setNickname] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const fetchPlayerData = async (playerNick) => {
    if (!playerNick.trim()) {
      setError('Digite um nickname válido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/player/${playerNick}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setPlayerData(null);
      } else {
        setPlayerData(data);
        setError('');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPlayerData(nickname);
  };

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    if (!autoRefresh || !nickname) return;

    const interval = setInterval(() => {
      fetchPlayerData(nickname);
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, nickname]);

  return (
    <div className="app">
      <div className="widget-container">
        <div className="widget-header">
          <h1>FACEIT Stats</h1>
          <p>Live Widget para OBS</p>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Digite o nickname FACEIT..."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="input"
          />
          <button type="submit" className="btn-search" disabled={loading}>
            {loading ? 'Carregando...' : 'Buscar'}
          </button>
        </form>

        {playerData && !error && (
          <div className="player-stats">
            <div className="player-header">
              <h2>{playerData.nickname?.toUpperCase()}</h2>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">ELO</div>
                <div className="stat-value elo">{playerData.elo}</div>
              </div>

              {playerData.ranking !== 'N/A' && (
                <div className="stat-card">
                  <div className="stat-label">RANKING</div>
                  <div className="stat-value ranking">{playerData.ranking}</div>
                </div>
              )}

              <div className="stat-card">
                <div className="stat-label">VITÓRIAS (Hoje)</div>
                <div className="stat-value wins">{playerData.wins}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">DERROTAS (Hoje)</div>
                <div className="stat-value losses">{playerData.losses}</div>
              </div>
            </div>

            {playerData.wins > 0 || playerData.losses > 0 ? (
              <div className="winrate">
                <div className="winrate-label">Win Rate (Hoje)</div>
                <div className="winrate-bar">
                  <div
                    className="winrate-fill"
                    style={{
                      width: `${((playerData.wins / (playerData.wins + playerData.losses)) * 100) || 0}%`
                    }}
                  ></div>
                </div>
                <div className="winrate-percent">
                  {playerData.wins + playerData.losses > 0
                    ? ((playerData.wins / (playerData.wins + playerData.losses)) * 100).toFixed(1)
                    : 0}
                  %
                </div>
              </div>
            ) : null}

            <label className="auto-refresh">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              Auto-atualizar (30s)
            </label>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
          </div>
        )}

        {!playerData && !error && nickname && loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Buscando dados...</p>
          </div>
        )}

        <div className="widget-footer">
          <p>Para usar no OBS: Adicionar → Browser Source e copiar a URL</p>
          <code className="url-example">http://localhost:3000</code>
        </div>
      </div>
    </div>
  );
}

export default App;
