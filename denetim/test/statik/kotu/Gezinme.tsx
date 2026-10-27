import { useRouter } from "next/navigation";
import { Swiper } from "swiper/react";

// Katalog v0.4 statik kalıpları: gezinen buton, sayfa değiştiren açılır liste, kendiliğinden dönen slayt, sağ tık engeli.
export function Gezinme() {
  const router = useRouter();
  return (
    <div>
      <button onClick={() => router.push("/burslar")}>Burslarım</button>
      <select aria-label="Ülke" onChange={(e) => router.push(`/ulke/${e.target.value}`)}>
        <option value="tr">Türkiye</option>
      </select>
      <Swiper autoplay={{ delay: 3000 }} />
    </div>
  );
}

if (typeof document !== "undefined") document.addEventListener("contextmenu", (e) => e.preventDefault());
