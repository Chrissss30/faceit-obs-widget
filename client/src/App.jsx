import { useEffect, useMemo, useState } from 'react';
import './App.css';

const FACEIT_LEVEL_ICONS = {
  1: 'https://support.faceit.com/hc/article_attachments/11345480868764',
  2: 'https://support.faceit.com/hc/article_attachments/11345494083356',
  3: 'https://support.faceit.com/hc/article_attachments/11345519346332',
  4: 'https://support.faceit.com/hc/article_attachments/11345507782300',
  5: 'https://support.faceit.com/hc/article_attachments/11345494079004',
  6: 'https://support.faceit.com/hc/article_attachments/11345526591772',
  7: 'https://support.faceit.com/hc/article_attachments/11345507775388',
  8: 'https://support.faceit.com/hc/article_attachments/11345494072220',
  9: 'https://support.faceit.com/hc/article_attachments/11345519335964',
  10: 'https://support.faceit.com/hc/article_attachments/11345507770524'
};

function App() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const isObsMode = params.get('obs') === '1';
  const nickFromUrl = params.get('nick') || '';
  const lastSavedNick = localStorage.getItem('faceit_last_nickname') || '';
  const initialNickname = nickFromUrl || lastSavedNick;

  const [nickname, setNickname] = useState(initialNickname);
  const [activeNickname, setActiveNickname] = useState(initialNickname);
  const [displayNickname, setDisplayNickname] = useState(initialNickname);
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    (window.location.hostname === 'localhost' ? 'http://localhost:3001' : '');

  const inferLevelFromElo = (eloValue) => {
    const elo = Number(eloValue);
    if (!Number.isFinite(elo) || elo <= 0) return 0;
    if (elo <= 800) return 1;
    if (elo <= 950) return 2;
    if (elo <= 1100) return 3;
    if (elo <= 1250) return 4;
    if (elo <= 1400) return 5;
    if (elo <= 1550) return 6;
    if (elo <= 1750) return 7;
    if (elo <= 2000) return 8;
    if (elo <= 2250) return 9;
    return 10;
  };

  const fetchPlayerData = async (playerNick) => {
    const normalizedNick = playerNick.trim();
    if (!normalizedNick) {
      setError('Digite um nickname valido');
      return;
    }

    setDisplayNickname(normalizedNick);
    setActiveNickname(normalizedNick);
    localStorage.setItem('faceit_last_nickname', normalizedNick);
    setLoading(true);
    setError('');

    try {
      const url = `${API_URL}/api/player/${encodeURIComponent(normalizedNick)}?t=${Date.now()}`;
      const response = await fetch(url, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (!response.ok) {
        let body = null;
        try {
          body = await response.json();
        } catch (_e) {
          // ignore
        }
        setError(body?.error || 'Nao foi possivel buscar o perfil. Verifique o nickname.');
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

  useEffect(() => {
    if (initialNickname) fetchPlayerData(initialNickname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!autoRefresh || !activeNickname) return;
    const interval = setInterval(() => fetchPlayerData(activeNickname), 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, activeNickname]);

  const formatEloChange = (change) => {
    if (!change || change === 0) return '(+0)';
    if (change > 0) return `(+${change})`;
    return `(${change})`;
  };

  const effectiveLevel =
    Number(playerData?.level) > 0 ? Number(playerData.level) : inferLevelFromElo(playerData?.elo);

  const top1000 = Boolean(playerData?.isTop1000 && playerData?.rankingPosition);
  const levelIcon = FACEIT_LEVEL_ICONS[effectiveLevel] || playerData?.levelIconUrl || '';

  return (
    <div className={`app ${isObsMode ? 'obs-mode' : ''}`}>
      {!isObsMode && (
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
      )}

      {error && !isObsMode && <div className="error-message">{error}</div>}

      {playerData && !error && (
        <div className="widget-display">
          <div className="widget-bar">
            <div className="left-icon-slot">
              {top1000 ? (
                <div className="top-rank-badge" title={`Top ${playerData.rankingPosition}`}>
                  <span className="top-rank-number">#{playerData.rankingPosition}</span>
                  <span className="top-rank-emblem-wrap">
                    <span className="top-rank-right-icon" />
                  </span>
                </div>
              ) : levelIcon ? (
                <img src={levelIcon} alt={`Level ${effectiveLevel}`} className="level-icon" />
              ) : (
                <div className="level-pill">{effectiveLevel || 0}</div>
              )}
            </div>

            <div className="identity">
              <span className="nick">{displayNickname || playerData.nickname}</span>
              <span className="elo-value">{playerData.elo}</span>
              <span
                className="elo-change"
                style={{
                  color:
                    (playerData.eloChange || 0) > 0
                      ? '#44ff8a'
                      : (playerData.eloChange || 0) < 0
                        ? '#ff4e4e'
                        : '#c2c8d0'
                }}
              >
                {formatEloChange(playerData.eloChange || 0)}
              </span>
            </div>

            <div className="result-boxes">
              <span className="result-box win-box">{playerData.wins}</span>
              <span className="result-box loss-box">{playerData.losses}</span>
            </div>
          </div>

          {!isObsMode && (
            <label className="auto-refresh">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              Auto (30s)
            </label>
          )}
        </div>
      )}

      {!isObsMode && (
        <div className="info-section">
          <p>Para usar no OBS: Adicionar -&gt; Browser Source e copiar a URL</p>
          <code className="url-example">
            http://localhost:3000?obs=1&amp;nick={nickname || 'SEU_NICK'}
          </code>
        </div>
      )}
    </div>
  );
}

export default App;
