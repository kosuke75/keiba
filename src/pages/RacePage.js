import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./RacePage.css";

const YOSOU_MARKS = [
  { value: "none", label: "---", className: "yosou-none" },
  { value: "honmei", label: "◎", className: "yosou-honmei" },
  { value: "taikou", label: "◯", className: "yosou-taikou" },
  { value: "tanana", label: "▲", className: "yosou-kuro" },
  { value: "renshita", label: "△", className: "yosou-shiro" },
  { value: "oshirase", label: "☆", className: "yosou-ana" }
];

const COLUMN_LABELS = {
  yosou: "予想印",
  jockey: "騎手",
  weight: "斤量",
  serei: "性齢",
  trainer: "調教師",
  odds: "予想オッズ",
  bataiju: "馬体重"
};

// 初期値も title と time に変更
const EMPTY_RACE_DATA = {
  title: "レース名（未取得）",
  time: "時間未取得",
  horses: []
};

export default function RacePage() {
  const { venue, raceNum } = useParams();
  const [data, setData] = useState(EMPTY_RACE_DATA);
  const [visible, setVisible] = useState({
    yosou: true,
    jockey: true,
    weight: true,
    serei: true,
    trainer: true,
    odds: true,
    bataiju: true
  });
  const [yosou, setYosou] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/server/RaceTest.json");
        const json = await res.json();

        const venueData = json.venues.find(v => v.name === venue);
        if (!venueData) throw new Error("開催場データなし");

        const raceData = venueData.races.find(r => r.raceNum.toString() === raceNum);
        if (!raceData) throw new Error("レースデータなし");

        setData(raceData);
      } catch (err) {
        console.error(err);
        setData(EMPTY_RACE_DATA);
      }
    }

    load();
  }, [venue, raceNum]);

  function getMarkClass(num) {
    const selected = yosou[num] || "none";
    const markData = YOSOU_MARKS.find(m => m.value === selected);
    return markData ? markData.className : "";
  }

  return (
    <div className="race-container">
      <header>
        <Link to="/" className="back-button">← メインページへ戻る</Link>
        <h1>{data.title}</h1>
        <p>{data.time}</p>
      </header>

      {/* 表示切替パネル */}
      <div className="control-panel">
        <h2>表示項目カスタマイズ</h2>
        {Object.keys(visible).map(key => (
          <label key={key}>
            <input
              type="checkbox"
              checked={visible[key]}
              onChange={() =>
                setVisible(prev => ({ ...prev, [key]: !prev[key] }))
              }
            />
            {COLUMN_LABELS[key]}
          </label>
        ))}
      </div>

      {/* 出馬表 */}
      <table id="race-table">
        <thead>
          <tr>
            {visible.yosou && <th>印</th>}
            <th>馬番</th>
            <th>枠</th>
            <th>馬名</th>
            {visible.serei && <th>性齢</th>}
            {visible.weight && <th>斤量</th>}
            {visible.jockey && <th>騎手</th>}
            {visible.trainer && <th>調教師</th>}
            {visible.odds && <th>オッズ</th>}
            {visible.bataiju && <th>馬体重</th>}
          </tr>
        </thead>

        <tbody>
          {data.horses.length === 0 ? (
            <tr>
              <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                データなし（ダミー）
              </td>
            </tr>
          ) : (
            data.horses.map(h => (
              <tr key={h.num}>
                {visible.yosou && (
                  <td className={getMarkClass(h.num)}>
                    <select
                      value={yosou[h.num] || "none"}
                      onChange={e =>
                        setYosou(prev => ({ ...prev, [h.num]: e.target.value }))
                      }
                    >
                      {YOSOU_MARKS.map(m => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </td>
                )}
                <td>{h.num}</td>
                <td>{h.waku}</td>
                <td>
                  <Link
                    to={`/horse/${encodeURIComponent(h.name)}`}
                    state={{ venue, raceNum }}
                    className="horse-link"
                  >
                    {h.name}
                  </Link>
                </td>
                {visible.serei && <td>{h.serei}</td>}
                {visible.weight && <td>{h.weight}</td>}
                {visible.jockey && <td>{h.jockey}</td>}
                {visible.trainer && <td>{h.trainer}</td>}
                {visible.odds && <td>{h.odds}</td>}
                {visible.bataiju && <td>{h.bataiju}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}