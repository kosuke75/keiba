import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./horse.css";

export default function Horse() {
  const { horseName } = useParams();
  const [horse, setHorse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/server/HorseTest.json");
        const json = await res.json();

        const decodedName = decodeURIComponent(horseName);
        const horseData = json.horses.find(h => h.name === decodedName);

        if (!horseData) throw new Error("馬データなし");

        setHorse(horseData);
      } catch (err) {
        console.error(err);
        setHorse(null);
      }
    }

    load();
  }, [horseName]);

  if (!horse) {
    return (
      <div className="horse-container">
        <button onClick={() => navigate(-1)}>← 戻る</button>
        <h1>馬データなし</h1>
        <p>データが存在しないか、読み込み中です。</p>
      </div>
    );
  }

  return (
    <div className="horse-container">
      <button onClick={() => navigate(-1)}>← 戻る</button>
      <h1>{horse.name}</h1>

      <table>
        <tbody>
          <tr><td>馬番</td><td>{horse.num}</td></tr>
          <tr><td>枠</td><td>{horse.waku}</td></tr>
          <tr><td>性齢</td><td>{horse.serei}</td></tr>
          <tr><td>斤量</td><td>{horse.weight}</td></tr>
          <tr><td>騎手</td><td>{horse.jockey}</td></tr>
          <tr><td>調教師</td><td>{horse.trainer}</td></tr>
          <tr><td>オッズ</td><td>{horse.odds}</td></tr>
          <tr><td>馬体重</td><td>{horse.bataiju}</td></tr>
        </tbody>
      </table>

      <div className="horse-history">
        <h2>過去レース成績</h2>
        {horse.pastRaces && horse.pastRaces.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>日付</th>
                <th>開催場</th>
                <th>レース名</th>
                <th>着順</th>
                <th>頭数</th>
                <th>タイム</th>
                <th>騎手</th>
              </tr>
            </thead>
            <tbody>
              {horse.pastRaces.map((r, i) => (
                <tr key={i}>
                  <td>{r.date}</td>
                  <td>{r.venue}</td>
                  <td>{r.title}</td>
                  <td>{r.rank}</td>
                  <td>{r.total}</td>
                  <td>{r.time}</td>
                  <td>{r.jockey}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>過去レースデータなし</p>
        )}
      </div>
    </div>
  );
}