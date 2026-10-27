export function Iyi({ tarih }: { tarih: Date }) {
  return (
    <div>
      <a href="/burs/1">Erasmus+ bursunun ayrıntıları</a>
      <button>Başvuruyu gönder</button>
      <p>{tarih.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</p>
      <p>{new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(1250.5)}</p>
      <input type="password" autoComplete="current-password" />
      <video src="/tanitim.mp4" controls />
      <p className="hata">Kayıt şu an yapılamadı. Yazdıkların duruyor, birazdan tekrar dene.</p>
      <button aria-label="Paylaş"><svg width="16" height="16"></svg></button>
      <label>
        <input type="checkbox" />
        Kampanya ve bülten e-postaları almak istiyorum
      </label>
    </div>
  );
}
