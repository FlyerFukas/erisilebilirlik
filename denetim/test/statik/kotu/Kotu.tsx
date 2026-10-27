export function Kotu({ tarih, hata, veri }: { tarih: Date; hata: Error; veri: object }) {
  return (
    <div>
      <a href="/burs/1">Buraya tıklayın</a>
      <button>Gönder</button>
      <p>{tarih.toLocaleDateString()}</p>
      <p>{new Intl.NumberFormat("en-US").format(1250.5)}</p>
      <input type="password" onPaste={(e) => e.preventDefault()} autoComplete="off" />
      <video src="/tanitim.mp4" autoPlay muted />
      <pre>{JSON.stringify(veri)}</pre>
      <p className="hata">{hata.message}</p>
      <button onClick={() => {}}><svg width="16" height="16"></svg></button>
      <label>
        <input type="checkbox" defaultChecked />
        Kampanya ve bülten e-postaları almak istiyorum
      </label>
    </div>
  );
}
