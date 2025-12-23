import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

// レースセルコンポーネント
const RaceCell = ({ race, selectedRaceId, onRaceSelect, venue }) => {
  const isSelected = selectedRaceId === race.id;
  let cellClasses = "race-cell";
  if (isSelected) cellClasses += " selected";
  else cellClasses += " upcoming";

  return (
    <Link
      to={`/race/${venue.name}/${race.raceNum}`}
      className={cellClasses}
      onClick={() => onRaceSelect(race.id)}
    >
      <div className="race-num">{race.raceNum}R</div>
      <div className="race-time">{race.time}</div>
    </Link>
  );
};

// メインコンポーネント
const App = () => {
  const [raceData, setRaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRaceId, setSelectedRaceId] = useState(null);

  const loadRaceData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/server/RaceTest.json'); // JSON ファイルのパス
      if (!res.ok) throw new Error("JSON読み込み失敗");
      const json = await res.json();
      setRaceData(json);
    } catch (err) {
      console.error(err);
      setRaceData(null);
    } finally {
      setLoading(false);
    }
  };

  // 初回ロード
  useEffect(() => {
    loadRaceData();
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>読み込み中...</p>;
  if (!raceData) return <p style={{ padding: '20px' }}>データがありません</p>;

  const COLUMN_WIDTH_PX = 200;
  const GAP_PX = 20;
  const PADDING_X_PX = 24;

  const appWidth =
    COLUMN_WIDTH_PX * raceData.venues.length +
    GAP_PX * (raceData.venues.length - 1) +
    PADDING_X_PX;

  const raceColumnsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px 0px 36px',
    gap: `${GAP_PX}px`,
    width: '100%',
    maxWidth: `${appWidth}px`,
    margin: '0 auto'
  };

  return (
    <div className="app-container">
      <div className="app-main-content" style={{ maxWidth: `${appWidth}px` }}>
        {/* 上部ボタン */}
        <header className="main-header">
          <Link to="/baken" className="nav-button">馬券の買い方</Link>
          <Link to="/use" className="nav-button">使い方</Link>
          <button type="button" className="nav-button update-button" onClick={loadRaceData}>更新</button>
        </header>

        {/* 日付 */}
        <div className="date-line">{raceData.date}</div>

        {/* 開催名 */}
        <div className="course-header-wrapper">
          {raceData.venues.map(venue => (
            <span
              key={venue.name}
              className="course-header-item"
              style={{ width: `${COLUMN_WIDTH_PX}px` }}
            >
              {venue.session}
            </span>
          ))}
        </div>

        {/* レース一覧 */}
        <div className="race-columns-container" style={raceColumnsStyle}>
          {raceData.venues.map(venue => (
            <div
              key={venue.name}
              id={`venue-${venue.name}`}
              className="race-column"
              style={{ width: `${COLUMN_WIDTH_PX}px`, gap: '16px' }}
            >
              {venue.races.map(race => (
                <RaceCell
                  key={race.id}
                  race={race}
                  selectedRaceId={selectedRaceId}
                  onRaceSelect={setSelectedRaceId}
                  venue={venue}
                />
              ))}
            </div>
          ))}
        </div>

        {/* レース詳細
        <div className="race-detail-area">
          <h3 className="detail-header">選択中のレース詳細</h3>
          {selectedRaceId ? (
            <div className="selected-race-info">
              <p className="race-id-text">Race ID: {selectedRaceId}</p>
            </div>
          ) : (
            <p className="no-selection-message">
              レースセルをクリックして詳細を確認できます。
            </p>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default App;