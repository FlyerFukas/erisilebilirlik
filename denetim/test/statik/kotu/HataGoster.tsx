// Kötü örnek: sunucu eyleminin fırlattığı hata metni doğrudan ekrana basılıyor.
export function HataGoster({ eylem }: { eylem: () => Promise<void> }) {
  async function calistir(setHata: (m: string) => void) {
    try { await eylem(); } catch (e) { setHata((e as Error).message); }
  }
  return <button onClick={() => calistir(() => {})}>Kaydı arşivle</button>;
}
export async function servis() {
  try { await fetch("/x"); } catch (e) { return { hata: `Servise ulaşılamadı: ${(e as Error).message}` }; }
}
