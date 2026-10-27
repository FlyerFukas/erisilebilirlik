// Etkileşim senaryoları (--etkilesim): formu gerçekten gönderip ne olduğuna bakar.
//   B08  boş gönderimde hata mesajı çıkıyor mu, alanın yanında mı
//   B08  gönderim başarısız olunca girilen veri korunuyor mu
//   S04  gönderime 1 sn içinde görünür tepki var mı
//
// GÜVENLİK: bu bağlamda sayfadan çıkan bütün yazma istekleri (GET/HEAD/OPTIONS dışındaki her yöntem)
// ağ katmanında kesilir ve başka siteye yönlenme engellenir. Canlı sitede kayıt oluşmaz, e-posta gitmez,
// ödeme başlamaz. Bu yüzden "gönderim başarısız" durumu gerçek bir ağ hatasının taklididir.
// Şifre alanı hiç doldurulmaz; arama formları (GET, role=search) atlanır.

const ORNEK = { email: "ornek@posta.test", tel: "0532 000 00 00", number: "5", url: "https://ornek.test", date: "2027-01-15" };

export async function etkilesimOlc(tr, url, a) {
  const ctx = await tr.newContext({ viewport: { width: 1366, height: 800 }, locale: "tr-TR", ...(a.oturum ? { storageState: a.oturum } : {}) });
  const koken = new URL(url).origin;
  await ctx.route("**/*", (istek) => {
    const r = istek.request();
    if (!["GET", "HEAD", "OPTIONS"].includes(r.method())) return istek.abort("failed");
    if (r.isNavigationRequest() && r.frame() === r.frame().page()?.mainFrame() && new URL(r.url()).origin !== koken) return istek.abort("blockedbyclient");
    return istek.continue();
  });
  const bulgular = [];
  const ekle = (kural, seviye, mesaj, ornekler = []) => bulgular.push({ kural, seviye, mesaj, ornekler: ornekler.slice(0, 5) });
  const p = await ctx.newPage();
  try {
    await p.goto(url, { waitUntil: "networkidle", timeout: 30000 }).catch(() => p.goto(url, { waitUntil: "load", timeout: 30000 }));
    await p.waitForTimeout(800);
    const sayi = await p.evaluate(formlariIsaretle);
    for (let i = 0; i < Math.min(sayi, 3); i++) {
      // 1 · Boş gönderim: hata çıkıyor mu, nerede, ne kadar hızlı
      await p.goto(url, { waitUntil: "load", timeout: 30000 }).catch(() => {});
      await p.waitForTimeout(600);
      if ((await p.evaluate(formlariIsaretle)) <= i) break;
      const bos = await gonder(p, i, false);
      if (bos) {
        const ad = bos.ad;
        if (bos.beklenenHata && !bos.yeniMetin.length && !bos.gecersizAlan && !bos.yerelGecersiz)
          ekle("B08", "uyari", "Zorunlu alanları boş form gönderildi, hiçbir hata mesajı görünmedi: kullanıcı neyin eksik olduğunu bilemez", [ad]);
        else if (bos.yerelGecersiz && !bos.yeniMetin.length)
          ekle("B08", "bilgi", "Boş gönderimde yalnız tarayıcının kendi doğrulama balonu çıkıyor: birkaç saniyede kayboluyor, alanın yanında kalıcı mesaj yok", [ad]);
        else if (bos.yeniMetin.length && !bos.yakinda)
          ekle("B08", "bilgi", "Hata mesajı alanın yanında değil (sayfanın başka yerinde): kullanıcı hangi alanın sorunlu olduğunu aramak zorunda", [`${ad} → "${bos.yeniMetin[0].slice(0, 60)}"`]);
        if (!bos.tepkiMs && !bos.yerelGecersiz && !bos.gitti)
          ekle("S04", "uyari", "Formu gönderince 1 sn içinde ekranda hiçbir şey değişmedi: kullanıcı bastı mı basmadı mı bilemez, tekrar basar", [ad]);
      }
      // 2 · Dolu gönderim (ağ hatası taklidi): veri korunuyor mu
      await p.goto(url, { waitUntil: "load", timeout: 30000 }).catch(() => {});
      await p.waitForTimeout(600);
      if ((await p.evaluate(formlariIsaretle)) <= i) break;
      const dolu = await gonder(p, i, true);
      if (dolu && !dolu.gitti && dolu.silinen.length)
        ekle("B08", "uyari", `Gönderim başarısız olunca (ağ hatası taklidi) girilen veri silindi (${dolu.silinen.length} alan): kullanıcı hepsini yeniden yazmak zorunda`, [`${dolu.ad}: ${dolu.silinen.join(", ")}`]);
    }
  } catch (h) {
    return { url, mod: "etkilesim", hata: String(h.message || h).split("\n")[0], bulgular: [], linkler: [] };
  } finally {
    await ctx.close();
  }
  return { url, mod: "etkilesim", bulgular, linkler: [] };
}

// Sayfada sınanacak formları işaretler, sayısını döndürür (tarayıcıda çalışır).
function formlariIsaretle() {
  const gorunur = (e) => { const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 && getComputedStyle(e).visibility !== "hidden"; };
  const formlar = [...document.querySelectorAll("form")].filter((f) => {
    // Arama formu sınanmaz: boş arama da geçerli bir istektir.
    if (!gorunur(f) || f.closest("[role=search], search") || f.querySelector("input[type=search]")) return false;
    const alanlar = [...f.querySelectorAll("input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]), textarea")].filter(gorunur);
    return alanlar.length > 0;
  });
  document.querySelectorAll("[data-erisim-form]").forEach((f) => f.removeAttribute("data-erisim-form"));
  formlar.forEach((f, i) => f.setAttribute("data-erisim-form", String(i)));
  return formlar.length;
}

async function gonder(p, i, doldur) {
  const once = await p.evaluate(({ i, doldur, ORNEK }) => {
    const f = document.querySelector(`[data-erisim-form="${i}"]`);
    if (!f) return null;
    const gorunur = (e) => { const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 && getComputedStyle(e).visibility !== "hidden"; };
    const metinler = () => new Set([...document.querySelectorAll("body *")].filter((e) => e.children.length === 0 && gorunur(e))
      .map((e) => (e.innerText || "").trim()).filter((t) => t.length > 2));
    window.__erisimOnce = metinler();
    const alanlar = [...f.querySelectorAll("input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]):not([type=file]), textarea")].filter(gorunur);
    const doldurulan = [];
    if (doldur) for (const g of alanlar) {
      if (g.type === "password" || g.readOnly || g.disabled) continue;
      const deger = ORNEK[g.type] || "Deneme";
      // React gibi kütüphaneler değeri kendi tutar: yerel ayarlayıcı + input olayı ile ver.
      const ayarla = Object.getOwnPropertyDescriptor(g.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, "value").set;
      ayarla.call(g, deger);
      g.dispatchEvent(new Event("input", { bubbles: true }));
      g.dispatchEvent(new Event("change", { bubbles: true }));
      g.setAttribute("data-erisim-alan", String(doldurulan.length));
      doldurulan.push({ ad: g.name || g.id || g.getAttribute("aria-label") || g.type, deger: g.value });
    }
    const beklenenHata = !doldur && alanlar.some((g) => g.required || g.getAttribute("aria-required") === "true");
    const yerelGecersiz = !doldur && !f.noValidate && !f.checkValidity();
    // Yalnız gönderimden (__erisimTik) sonraki değişiklik tepki sayılır; öncekiler süreyi NaN yapıyordu.
    window.__erisimTepki = null;
    window.__erisimTik = null;
    const gozcu = new MutationObserver(() => {
      if (window.__erisimTik != null && window.__erisimTepki == null) window.__erisimTepki = performance.now() - window.__erisimTik;
    });
    gozcu.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
    window.__erisimGozcu = gozcu;
    const baslik = f.querySelector("h1,h2,h3,legend")?.innerText || f.getAttribute("aria-label") || f.id || f.getAttribute("action") || `form ${i + 1}`;
    return { ad: `form "${baslik.trim().slice(0, 40)}"`, doldurulan, beklenenHata, yerelGecersiz, adres: location.href };
  }, { i, doldur, ORNEK });
  if (!once) return null;
  await p.evaluate((i) => {
    window.__erisimTik = performance.now();
    const f = document.querySelector(`[data-erisim-form="${i}"]`);
    try { f.requestSubmit(); } catch { f.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); }
  }, i).catch(() => {});
  await p.waitForTimeout(1500);
  const sonra = await p.evaluate(({ doldurulan, adres }) => {
    if (location.href !== adres) return { gitti: true };
    window.__erisimGozcu?.disconnect();
    const gorunur = (e) => { const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 && getComputedStyle(e).visibility !== "hidden"; };
    const yeni = [...document.querySelectorAll("body *")].filter((e) => e.children.length === 0 && gorunur(e))
      .map((e) => ({ e, t: (e.innerText || "").trim() })).filter(({ t }) => t.length > 2 && !window.__erisimOnce.has(t));
    const alanlar = [...document.querySelectorAll("input, textarea, select")].filter(gorunur);
    const yakinda = yeni.some(({ e }) => {
      const r = e.getBoundingClientRect();
      return alanlar.some((g) => { const a = g.getBoundingClientRect(); return Math.abs(r.top - a.bottom) < 120 || Math.abs(a.top - r.bottom) < 60; });
    });
    const silinen = doldurulan.filter((d, k) => {
      const g = document.querySelector(`[data-erisim-alan="${k}"]`);
      return !g || (g.value || "") === "";
    }).map((d) => d.ad);
    return { gitti: false, yeniMetin: yeni.map(({ t }) => t), yakinda, silinen,
      gecersizAlan: !!document.querySelector("[aria-invalid=true]"), tepkiMs: window.__erisimTepki != null && window.__erisimTepki <= 1000 ? Math.round(window.__erisimTepki) : null };
  }, { doldurulan: once.doldurulan, adres: once.adres }).catch(() => ({ gitti: true }));
  return { ...once, ...sonra };
}
