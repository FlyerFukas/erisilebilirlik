import Link from "next/link";
import { useState } from "react";

// Doğru kullanım: gezinme bağlantıyla, açılır liste yalnız durumu değiştirir, özel sağ tık menüsü tek öğede.
export function Gezinme() {
  const [ulke, setUlke] = useState("tr");
  return (
    <div>
      <Link href="/burslar">Burslarım</Link>
      <select aria-label="Ülke" value={ulke} onChange={(e) => setUlke(e.target.value)}>
        <option value="tr">Türkiye</option>
      </select>
      <canvas aria-label="Harita" onContextMenu={(e) => e.preventDefault()} />
      <button type="button" onClick={() => setUlke("tr")}>Türkiye&apos;yi seç</button>
    </div>
  );
}
