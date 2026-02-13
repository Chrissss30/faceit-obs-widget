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
      // Evita cache do navegador adicionando timestamp e instrução de cache
      const url = `${API_URL}/api/player/${playerNick}?t=${Date.now()}`;
      const response = await fetch(url, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
      // Se status não for OK, tenta ler o json ou mostrar erro genérico
      if (!response.ok) {
        let body = null;
        try { body = await response.json(); } catch (e) { /* ignore */ }
        setError(body?.error || 'Não foi possível buscar o perfil. Verifique o nickname.');
        setPlayerData(null);
        setLoading(false);
        return;
      }

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

  // Calcular mudança de ELO com +/- formato
  const formatEloChange = (change) => {
    if (!change || change === 0) return '(+0)';
    if (change > 0) return `(+${change})`;
    return `(${change})`;
  };

  return (
    <div className="app">
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Nickname FACEIT"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="input"
          />
          <button type="submit" className="btn-search" disabled={loading}>
            {loading ? '...' : 'Go'}
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {playerData && !error && (
        <div className="widget-display">
          <div className="widget-bar">
            <span className="nick">{playerData.nickname}</span>
            <span className="separator">|</span>
            <span className="elo-info">
              <span className="elo-value">{playerData.elo}</span>
              <span className="elo-label">ELO</span>
              <span className="elo-change" style={{ color: (playerData.eloChange || 0) > 0 ? '#00ff00' : (playerData.eloChange || 0) < 0 ? '#ff4444' : '#aaa' }}>
                {formatEloChange(playerData.eloChange || 0)}
              </span>
            </span>
            <span className="separator">|</span>
            <span className="w-l-info">
              <span className="wins">{playerData.wins}W</span>
              <span className="separator-small">·</span>
              <span className="losses">{playerData.losses}L</span>
            </span>
          </div>

          <label className="auto-refresh">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto (30s)
          </label>
        </div>
      )}

      <div className="info-section">
        <p>Para usar no OBS: Adicionar → Browser Source e copiar a URL</p>
        <code className="url-example">http://localhost:3000</code>
      </div>
    </div>
  );
}

export default App;
