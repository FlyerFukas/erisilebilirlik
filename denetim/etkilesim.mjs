// Etkileşim senaryoları (--etkilesim): formu gerçekten gönderip ne olduğuna bakar.
//   B08  boş gönderimde hata mesajı çıkıyor mu, alanın yanında mı
//   B08  gönderim başarısız olunca girilen veri korunuyor mu
//   S04  gönderime 1 sn içinde görünür tepki var mı
//   S04  gönderim sürerken butona ikinci kez basılınca form iki kez gidiyor mu [Norman-DOET s.8]
//   B09  açılır listeden seçim yapınca sayfa kendiliğinden değişiyor mu [COGA 4.9.1]
//   S13  menüden başka sayfaya gidip geri tuşuna basınca aynı sayfaya dönülüyor mu [COGA 4.5.2]
//   B16  o sırada forma yazılan bilgi geri gelince duruyor mu [COGA 4.5.2]
//
// GÜVENLİK: bu bağlamda sayfadan çıkan bütün yazma istekleri (GET/HEAD/OPTIONS dışındaki her yöntem)
// ağ katmanında kesilir ve başka siteye yönlenme engellenir. Canlı sitede kayıt oluşmaz, e-posta gitmez,
// ödeme başlamaz. Bu yüzden "gönderim başarısız" durumu gerçek bir ağ hatasının taklididir.
// Şifre alanı hiç doldurulmaz; arama formları (GET, role=search) atlanır.

const ORNEK = { email: "ornek@posta.test", tel: "0532 000 00 00", number: "5", url: "https://ornek.test", date: "2027-01-15" };

export async function etkilesimOlc(tr, url, a) {
  const ctx = await tr.newContext({ viewport: { width: 1366, height: 800 }, locale: "tr-TR", ...(a.oturum ? { storageState: a.oturum } : {}) });
  const koken = new URL(url).origin;
  // Çift gönderim sayacı: aynı kökene giden, ölçüm/analitik olmayan yazma istekleri. geciktir > 0 iken kesme bekletilir
  // ki ilk gönderim "sürüyor" olsun (yavaş ağ taklidi).
  const ag = { yazma: 0, geciktir: 0 };
  await ctx.route("**/*", async (istek) => {
    const r = istek.request();
    if (!["GET", "HEAD", "OPTIONS"].includes(r.method())) {
      const u = new URL(r.url());
      if (u.origin === koken && r.resourceType() !== "ping" && !/(_vercel|insights|vitals|analytics|monitoring|sentry|telemetry|beacon|collect)/i.test(u.pathname)) ag.yazma++;
      if (ag.geciktir) await new Promise((t) => setTimeout(t, ag.geciktir));
      return istek.abort("failed").catch(() => {});
    }
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
      // Gönderim başka adrese gittiyse (klasik form) sayfa değişmiştir, bu da tepkidir; ölçülecek metin yok.
      // Bu koruma yokken yeniMetin tanımsız kalıyor ve sayfanın bütün etkileşim bulguları kayboluyordu.
      if (bos && !bos.gitti) {
        const ad = bos.ad;
        if (bos.beklenenHata && !bos.yeniMetin.length && !bos.gecersizAlan && !bos.yerelGecersiz)
          ekle("B08", "uyari", "Zorunlu alanları boş form gönderildi, hiçbir hata mesajı görünmedi: kullanıcı neyin eksik olduğunu bilemez", [ad]);
        else if (bos.yerelGecersiz && !bos.yeniMetin.length)
          ekle("B08", "bilgi", "Boş gönderimde yalnız tarayıcının kendi doğrulama balonu çıkıyor: birkaç saniyede kayboluyor, alanın yanında kalıcı mesaj yok", [ad]);
        else if (bos.yeniMetin.length && !bos.yakinda)
          ekle("B08", "bilgi", "Hata mesajı alanın yanında değil (sayfanın başka yerinde): kullanıcı hangi alanın sorunlu olduğunu aramak zorunda", [`${ad} → "${bos.yeniMetin[0].slice(0, 60)}"`]);
        // tepkiMs 0 olabilir (aynı karede tepki): "yok" yalnız null'dır.
        if (bos.tepkiMs == null && !bos.yerelGecersiz)
          ekle("S04", "uyari", "Formu gönderince 1 sn içinde ekranda hiçbir şey değişmedi: kullanıcı bastı mı basmadı mı bilemez, tekrar basar", [ad]);
      }
      // 2 · Dolu gönderim (ağ hatası taklidi): veri korunuyor mu
      await p.goto(url, { waitUntil: "load", timeout: 30000 }).catch(() => {});
      await p.waitForTimeout(600);
      if ((await p.evaluate(formlariIsaretle)) <= i) break;
      const dolu = await gonder(p, i, true);
      if (dolu && !dolu.gitti && dolu.silinen.length)
        ekle("B08", "uyari", `Gönderim başarısız olunca (ağ hatası taklidi) girilen veri silindi (${dolu.silinen.length} alan): kullanıcı hepsini yeniden yazmak zorunda`, [`${dolu.ad}: ${dolu.silinen.join(", ")}`]);
      // 3 · Çift gönderim: geri bildirimsiz kullanıcı komutu tekrarlar, işlem iki kez yapılır [Norman-DOET s.8]
      await p.goto(url, { waitUntil: "load", timeout: 30000 }).catch(() => {});
      await p.waitForTimeout(600);
      if ((await p.evaluate(formlariIsaretle)) <= i) break;
      const cift = await gonder(p, i, true, ag);
      if (cift?.istek >= 2)
        ekle("S04", "uyari", `Gönder butonuna art arda iki kez basınca form ${cift.istek} kez gönderildi: gönderim sürerken buton kilitlenmeli ("Gönderiliyor…")`, [cift.ad]);
    }
    // 4 · Açılır listeden seçim sayfayı değiştiriyor mu. Filtre (yalnız sorgu dizgisi değişir) sayılmaz, sayfa yolu değişmeli.
    await p.goto(url, { waitUntil: "load", timeout: 30000 }).catch(() => {});
    await p.waitForTimeout(600);
    const listeSayisi = await p.evaluate(listeleriIsaretle);
    for (let j = 0; j < Math.min(listeSayisi, 3); j++) {
      if (j > 0) {
        await p.goto(url, { waitUntil: "load", timeout: 30000 }).catch(() => {});
        await p.waitForTimeout(600);
        if ((await p.evaluate(listeleriIsaretle)) <= j) break;
      }
      const liste = p.locator(`[data-erisim-liste="${j}"]`);
      const secim = await liste.evaluate((s) => {
        const o = [...s.options].find((o, k) => k !== s.selectedIndex && !o.disabled);
        return o ? { deger: o.value, ad: s.name || s.id || s.getAttribute("aria-label") || "açılır liste" } : null;
      }).catch(() => null);
      if (!secim) continue;
      const yol = new URL(p.url()).pathname;
      await liste.selectOption(secim.deger, { timeout: 2000 }).catch(() => {});
      await p.waitForTimeout(1500);
      const yeni = new URL(p.url()).pathname;
      if (yeni !== yol) ekle("B09", "uyari", "Açılır listeden seçim yapınca sayfa kendiliğinden değişti: seçenekleri gözden geçiren kişi kendini başka sayfada bulur. Seçimi bir butonla onaylat",
        [`liste "${secim.ad}": ${yol} → ${yeni}`]);
    }
    // 5 · Geri tuşu: forma bir şey yazıp menüden başka sayfaya git, geri gel. Aynı sayfa ve yazılan bilgi yerinde mi?
    await p.goto(url, { waitUntil: "load", timeout: 30000 }).catch(() => {});
    await p.waitForTimeout(600);
    const geri = await p.evaluate(geriHazirla).catch(() => null);
    if (geri) {
      const bas = p.url();
      await p.locator("[data-erisim-git]").first().click({ timeout: 3000 }).catch(() => {});
      await p.waitForTimeout(1500);
      // Uygulama "kaydedilmemiş değişiklik" diye sayfada tuttuysa (onay penceresi kapatılır) geri tuşu sınanmaz: bu doğru davranış.
      if (p.url() !== bas) {
        await p.goBack({ waitUntil: "load", timeout: 15000 }).catch(() => {});
        await p.waitForTimeout(1200);
        const son = p.url();
        if (son.split("#")[0] !== bas.split("#")[0])
          ekle("S13", "uyari", "Geri tuşu önceki sayfaya dönmüyor: kullanıcı yanlış tıklamasını düzeltemez", [`${new URL(bas).pathname} → ${geri.hedef} → geri → ${new URL(son).pathname}`]);
        else if (geri.alan && (await p.evaluate((s) => document.querySelector(s)?.value ?? null, geri.alan).catch(() => null)) === "")
          ekle("B16", "bilgi", "Forma yazıp başka sayfaya gidince ve geri gelince yazılan bilgi kayboldu: yarım formu taslak olarak sakla", [geri.alan]);
      }
    }
  } catch (h) {
    // Sonraki adımdaki hata öncekilerin bulgularını silmesin.
    return { url, mod: "etkilesim", hata: String(h.message || h).split("\n")[0], bulgular, linkler: [] };
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

// Sayfadaki seçilebilir açılır listeleri işaretler, sayısını döndürür (tarayıcıda çalışır).
function listeleriIsaretle() {
  const gorunur = (e) => { const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 && getComputedStyle(e).visibility !== "hidden"; };
  document.querySelectorAll("[data-erisim-liste]").forEach((s) => s.removeAttribute("data-erisim-liste"));
  const listeler = [...document.querySelectorAll("select")].filter((s) => gorunur(s) && !s.disabled && s.options.length > 1);
  listeler.forEach((s, i) => s.setAttribute("data-erisim-liste", String(i)));
  return listeler.length;
}

// Geri tuşu senaryosu: ilk metin alanına yazar, menüdeki başka bir sayfaya giden bağlantıyı işaretler (tarayıcıda çalışır).
// Yalnız menü/üst bölüm bağlantısı seçilir; çıkış ve silme adresleri atlanır.
function geriHazirla() {
  const gorunur = (e) => { const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 && getComputedStyle(e).visibility !== "hidden"; };
  const a = [...document.querySelectorAll("nav a[href], header a[href], [role=navigation] a[href]")].find((a) => {
    if (!gorunur(a) || a.target === "_blank" || a.hasAttribute("download")) return false;
    try { const u = new URL(a.href); return u.origin === location.origin && u.pathname !== location.pathname && !/(cikis|logout|signout|sil|delete)/i.test(u.pathname); }
    catch { return false; }
  });
  if (!a) return null;
  a.setAttribute("data-erisim-git", "1");
  const g = [...document.querySelectorAll("form input:not([type]), form input[type=text], form textarea")]
    .find((e) => gorunur(e) && !e.readOnly && !e.disabled && !e.closest("[role=search], search"));
  let alan = null;
  if (g && (g.id || g.name)) {
    const ayarla = Object.getOwnPropertyDescriptor(g.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, "value").set;
    ayarla.call(g, "Geri tuşu denemesi");
    g.dispatchEvent(new Event("input", { bubbles: true }));
    alan = g.id ? `#${CSS.escape(g.id)}` : `[name="${CSS.escape(g.name)}"]`;
  }
  return { alan, hedef: new URL(a.href).pathname };
}

// cift verilirse (ağ sayacı) form bir kez doldurulur, gönder butonuna 150 ms arayla iki kez gerçek tıklama yapılır,
// yazma istekleri 2 sn bekletilir ve kaç istek çıktığı döner.
async function gonder(p, i, doldur, cift = null) {
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
    const dugme = f.querySelector("button:not([type=button]), input[type=submit]");
    const baslik = f.querySelector("h1,h2,h3,legend")?.innerText || f.getAttribute("aria-label") || (dugme && (dugme.innerText || dugme.value)) ||
      f.id || `form ${i + 1}`;
    return { ad: `form "${baslik.trim().slice(0, 40)}"`, doldurulan, beklenenHata, yerelGecersiz, adres: location.href };
  }, { i, doldur, ORNEK });
  if (!once) return null;
  if (cift) {
    await p.waitForTimeout(300); // doldururken çıkan taslak kaydı sayılmasın
    const dugme = p.locator(`[data-erisim-form="${i}"] :is(button:not([type=button]):not([type=reset]), input[type=submit])`).first();
    if (!(await dugme.count())) return null;
    const bas = cift.yazma;
    cift.geciktir = 2000;
    await dugme.click({ timeout: 2000 }).catch(() => {});
    await p.waitForTimeout(150);
    // Kilitlenmiş (disabled) butona tıklama olay üretmez; doğru davranış budur.
    await dugme.click({ timeout: 1000, force: true }).catch(() => {});
    await p.waitForTimeout(2600);
    cift.geciktir = 0;
    return { ad: once.ad, istek: cift.yazma - bas };
  }
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
