import { Link } from "react-router-dom";

export default function Use() {
  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>このサイトの使い方</h1>

      <section>
        <h2>① 開催場の確認</h2>
        <p>トップページでは、本日開催されている競馬場を一覧で確認できる。</p>
      </section>

      <section>
        <h2>② レース選択</h2>
        <p>見たい競馬場を選択し、1R〜12Rの中から対象のレースをクリックする。</p>
      </section>

      <section>
        <h2>③ 出馬表の閲覧</h2>
        <p>レースページでは、出馬表・馬番・騎手などの情報を確認できる。</p>
      </section>

      <section>
        <h2>④ 情報の更新</h2>
        <p>「更新」ボタンを押すことで、最新のオッズや出走情報を取得できる。</p>
      </section>

      <div style={{ marginTop: "32px" }}>
        <Link to="/" className="nav-button">トップページへ戻る</Link>
      </div>
    </div>
  );
}