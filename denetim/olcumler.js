// Tarayıcı içinde çalışır (page.evaluate). Tek sayfanın bulgularını döndürür.
// Kural kimlikleri skill/erisilebilirlik/references/katalog.md ile aynıdır.
// Eşikler "başlangıç eşiği"dir; pilot projelerle kalibre edilecek (YOL-HARITASI Faz 4).
export function olc({ mod, sozluk, esik }) {
  const bulgular = [];
  const ekle = (kural, seviye, mesaj, ornekler = []) =>
    bulgular.push({ kural, seviye, mesaj, ornekler: ornekler.slice(0, 5) });

  const vw = innerWidth, vh = innerHeight;
  const kucuk = (s) => (s || "").toLocaleLowerCase("tr").replace(/\s+/g, " ").trim();
  const gorunur = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const s = getComputedStyle(el);
    return s.visibility !== "hidden" && s.display !== "none" && parseFloat(s.opacity) > 0.05;
  };
  const ilkEkranda = (el) => {
    const r = el.getBoundingClientRect();
    return r.top < vh && r.bottom > 0 && r.left < vw && r.right > 0;
  };
  const tanim = (el) => {
    const metin = (el.innerText || el.value || el.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ");
    const id = el.id ? `#${el.id}` : "";
    const sinif = typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/)[0] : "";
    return `${el.tagName.toLowerCase()}${id}${sinif}${metin ? ` "${metin.slice(0, 60)}"` : ""}`;
  };
  const rgb = (c) => {
    const m = (c || "").match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 };
  };
  const doygunluk = ({ r, g, b }) => {
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    return mx === 0 ? 0 : (mx - mn) / mx;
  };

  const dil = kucuk(document.documentElement.lang).slice(0, 2) ||
    (/[çğıöşüİ]/.test(document.body?.innerText || "") ? "tr" : "en");
  const ETKILESIMLI = "a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=link], [role=tab], [role=menuitem], [role=checkbox], [role=switch], [tabindex]:not([tabindex='-1'])";
  const etkilesimli = [...document.querySelectorAll(ETKILESIMLI)].filter(gorunur);
  const ad = (el) => kucuk(el.innerText || el.value || "");
  const erisimAdi = (el) => kucuk(el.getAttribute("aria-label") || el.getAttribute("title") ||
    [...el.querySelectorAll("img[alt]")].map((i) => i.alt).join(" ") || "");

  // ---------- K03 / S08: Neredeyim? (Krug gövde testi) ----------
  const baslik = document.title.trim();
  if (!baslik || sozluk.genel_baslik.includes(kucuk(baslik)) || kucuk(baslik) === kucuk(location.hostname))
    ekle("K03", "kritik", `Sekme başlığı bilgi vermiyor: "${baslik || "(boş)"}"`);
  const h1ler = [...document.querySelectorAll("h1")].filter(gorunur);
  if (h1ler.length === 0) ekle("K03", "kritik", "Görünür sayfa adı (h1) yok: kullanıcı nerede olduğunu okuyamıyor");
  else if (h1ler.length > 1) ekle("S08", "uyari", `${h1ler.length} adet h1 var: sayfanın tek bir adı olmalı`, h1ler.map(tanim));
  const anaSayfaLinki = [...document.querySelectorAll("a[href]")].some((a) => {
    const r = a.getBoundingClientRect();
    try { const u = new URL(a.href); return u.origin === location.origin && (u.pathname === "/" || u.pathname === "") && r.top < 200 && gorunur(a); }
    catch { return false; }
  });
  if (!anaSayfaLinki && location.pathname !== "/")
    ekle("K03", "uyari", "Üst bölümde ana sayfaya dönen logo/site adı bağlantısı yok");

  // ---------- S10: Navigasyonda bulunulan yer işaretli mi ----------
  const navlar = [...document.querySelectorAll("nav, [role=navigation]")].filter(gorunur);
  const navLinkleri = navlar.flatMap((n) => [...n.querySelectorAll("a[href]")].filter(gorunur));
  if (navLinkleri.length > 1) {
    const isaretli = navLinkleri.some((a) => a.getAttribute("aria-current") ||
      /(^|[\s_-])(active|current|selected|aktif|secili)([\s_-]|$)/i.test(a.className + " " + (a.parentElement?.className || "")));
    if (!isaretli) ekle("S10", "uyari", "Menüde şu an bulunulan sayfa işaretli değil (aria-current ya da belirgin seçili stil yok)");
  }

  // ---------- B02: Seçenek sayısı ----------
  for (const n of navlar) {
    const ust = [...n.querySelectorAll("a[href], button")].filter((e) => gorunur(e) && ilkEkranda(e));
    if (ust.length > 7) ekle("B02", "uyari", `Bir menüde aynı anda ${ust.length} seçenek görünüyor (öneri ≤ 7, gerisi aşamalı açılsın)`, [tanim(n)]);
  }
  const ilkEtk = etkilesimli.filter(ilkEkranda);
  if (ilkEtk.length > esik.ilkEkranEtkilesim)
    ekle("B02", "uyari", `İlk ekranda ${ilkEtk.length} tıklanabilir öğe var (başlangıç eşiği ${esik.ilkEkranEtkilesim})`);
  for (const s of document.querySelectorAll("select")) {
    if (gorunur(s) && s.options.length > 15) ekle("B02", "bilgi", `${s.options.length} seçenekli açılır liste: arama veya gruplama düşün`, [tanim(s)]);
  }

  // ---------- B01: Tek birincil eylem ----------
  const sayfaZemin = rgb(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
  const dolgulu = ilkEtk.filter((el) => {
    if (!el.matches("button, a, [role=button], input[type=submit], input[type=button]")) return false;
    const s = getComputedStyle(el), z = rgb(s.backgroundColor), r = el.getBoundingClientRect();
    if (!z || z.a < 0.6 || r.height < 28 || r.width < 60) return false;
    const fark = Math.abs(z.r - sayfaZemin.r) + Math.abs(z.g - sayfaZemin.g) + Math.abs(z.b - sayfaZemin.b);
    return doygunluk(z) > 0.3 && fark > 120;
  });
  if (dolgulu.length > 1) {
    const renkler = new Set(dolgulu.map((e) => getComputedStyle(e).backgroundColor));
    ekle("B01", dolgulu.length > 3 ? "uyari" : "bilgi",
      `İlk ekranda ${dolgulu.length} birincil görünümlü buton var (${renkler.size} renk): gözün kilitleneceği tek eylem belirsiz`, dolgulu.map(tanim));
  }

  // ---------- Metin toplama ----------
  const yaprakMetin = [];
  const gezgin = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (gezgin.nextNode()) {
    const d = gezgin.currentNode, ebeveyn = d.parentElement;
    if (!ebeveyn || /^(SCRIPT|STYLE|NOSCRIPT|CODE|PRE|TEMPLATE)$/.test(ebeveyn.tagName)) continue;
    const t = d.textContent.replace(/\s+/g, " ").trim();
    if (t && gorunur(ebeveyn)) yaprakMetin.push({ t, el: ebeveyn });
  }
  const tumMetin = yaprakMetin.map((x) => x.t).join(" \n ");

  // ---------- B12: Ham sistem çıktısı sızıntısı ----------
  const sizanlar = [];
  for (const { t, el } of yaprakMetin) {
    for (const k of sozluk.ham_cikti) {
      const desen = /^[\w]+$/.test(k) ? new RegExp(`(^|[^\\p{L}\\d_])${k}([^\\p{L}\\d_]|$)`, "u") : null;
      if (desen ? desen.test(t) : t.includes(k)) { sizanlar.push(`"${k}" → ${tanim(el)}`); break; }
    }
  }
  if (sizanlar.length) ekle("B12", "kritik", `Kullanıcıya ham sistem çıktısı görünüyor (${sizanlar.length} yer)`, sizanlar);

  // ---------- B03: İlk ekranda kelime yoğunluğu ----------
  const ilkKelime = yaprakMetin.filter((x) => ilkEkranda(x.el)).reduce((n, x) => n + x.t.split(/\s+/).length, 0);
  if (mod === "masaustu" && ilkKelime > esik.ilkEkranKelime)
    ekle("B03", "uyari", `İlk ekranda ${ilkKelime} kelime var (başlangıç eşiği ${esik.ilkEkranKelime}): kullanıcı okumaz, tarar`);

  // ---------- B04: Sade dil (cümle uzunluğu, okunabilirlik, jargon) ----------
  const paragraf = yaprakMetin.filter((x) => x.t.length >= 40 && !x.el.closest("nav, footer, a, button, label"));
  const cumleler = paragraf.flatMap((x) => x.t.split(/(?<=[.!?…])\s+/)).map((c) => c.trim()).filter((c) => c.split(/\s+/).length >= 3);
  const kelimeSay = (c) => c.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;
  const uzun = cumleler.filter((c) => kelimeSay(c) > esik.cumleKelime);
  if (uzun.length) ekle("B04", "uyari", `${uzun.length} cümle ${esik.cumleKelime} kelimeden uzun`, uzun.map((c) => c.slice(0, 120) + (c.length > 120 ? "…" : "")));
  let okunabilirlik = null;
  if (cumleler.length >= 3) {
    const kelimeler = cumleler.join(" ").split(/\s+/).filter((w) => /\p{L}/u.test(w));
    const hece = (w) => dil === "tr"
      ? Math.max(1, (w.match(/[aeıioöuüâîû]/giu) || []).length)
      : Math.max(1, (w.toLowerCase().replace(/e$/, "").match(/[aeiouy]+/g) || []).length);
    const hpk = kelimeler.reduce((n, w) => n + hece(w), 0) / kelimeler.length;
    const kpc = kelimeler.length / cumleler.length;
    // Ateşman (1997) Türkçe okunabilirlik formülü; İngilizce için Flesch Reading Ease.
    okunabilirlik = dil === "tr" ? 198.825 - 40.175 * hpk - 2.61 * kpc : 206.835 - 84.6 * hpk - 1.015 * kpc;
    okunabilirlik = Math.round(okunabilirlik);
    if (okunabilirlik < esik.okunabilirlik)
      ekle("B04", "uyari", `Metin okunabilirliği düşük: ${okunabilirlik}/100 (${dil === "tr" ? "Ateşman" : "Flesch"}; hedef ≥ ${esik.okunabilirlik})`);
  }
  if (dil === "tr") {
    const bulunan = new Map();
    for (const { t, el } of yaprakMetin) {
      if (el.closest("code, pre, kbd")) continue;
      for (const j of sozluk.jargon) {
        if (new RegExp(`(^|[^\\p{L}])${j}([^\\p{L}]|$)`, "iu").test(t) && !bulunan.has(j)) bulunan.set(j, tanim(el));
      }
    }
    if (bulunan.size) ekle("B04", "uyari", `Teknik/yabancı terim kullanıcıya görünüyor: ${[...bulunan.keys()].join(", ")}`, [...bulunan].map(([k, v]) => `${k} → ${v}`));
    const iso = tumMetin.match(/\b\d{4}-\d{2}-\d{2}(T[\d:.]+Z?)?\b/g);
    if (iso) ekle("B13", "uyari", `Tarih makine biçiminde gösteriliyor (${iso.length} yer), ör. ${iso[0]}: "18 Ekim 2026" gibi yaz`);
    const enSayi = tumMetin.match(/\b\d{1,3}(,\d{3})+(\.\d+)?\b/g);
    if (enSayi) ekle("B13", "uyari", `Sayı İngilizce biçimde (${enSayi[0]}): Türkçede binlik ayırıcı nokta, ondalık virgül`);
  }

  // ---------- K01: Belirsiz bağlantı/buton metni (bilgi kokusu) ----------
  const kritikB = [], uyariB = [];
  for (const el of etkilesimli) {
    if (!el.matches("a, button, [role=button], [role=link], input[type=submit], input[type=button]")) continue;
    const m = ad(el).replace(/[»›→>.!…:]+$/u, "").trim();
    if (!m) continue;
    if (sozluk.belirsiz_kritik.includes(m)) kritikB.push(tanim(el));
    else if (sozluk.belirsiz_uyari.includes(m)) uyariB.push(tanim(el));
  }
  if (kritikB.length) ekle("K01", "kritik", `Bağlantı metni hedefini söylemiyor (${kritikB.length})`, kritikB);
  if (uyariB.length) ekle("K01", "uyari", `Belirsiz eylem etiketi (${uyariB.length}): sonucu söyleyen fiil kullan ("Raporu indir", "Başvuruyu gönder")`, uyariB);
  const ayniMetin = new Map();
  for (const a of etkilesimli.filter((e) => e.matches("a[href]"))) {
    const m = ad(a); if (!m) continue;
    // Akıştaki her kartın "Yanıtla"sı kartın bağlamıyla anlaşılır (pilot K-03).
    if (a.closest("article, li, [role=article], [role=listitem]")) continue;
    if (!ayniMetin.has(m)) ayniMetin.set(m, new Set());
    ayniMetin.get(m).add(a.href.split("#")[0]);
  }
  const cokHedef = [...ayniMetin].filter(([, h]) => h.size >= 3);
  if (cokHedef.length) ekle("K01", "uyari", "Aynı metin farklı yerlere gidiyor: bağlam olmadan ayırt edilemez",
    cokHedef.map(([m, h]) => `"${m}" → ${h.size} farklı hedef`));

  // ---------- K09: Dosya bağlantısı önceden haber veriyor mu ----------
  const dosyaLink = [...document.querySelectorAll("a[href]")].filter((a) => gorunur(a) &&
    /\.(pdf|docx?|xlsx?|pptx?|zip|csv)(\?|#|$)/i.test(a.getAttribute("href") || "") &&
    !/(pdf|word|excel|zip|csv|indir|download|\bkb\b|\bmb\b)/i.test(a.innerText + " " + (a.getAttribute("aria-label") || "")));
  if (dosyaLink.length) ekle("K09", "uyari", "Dosya açan bağlantı bunu söylemiyor (biçim/boyut yok)", dosyaLink.map(tanim));

  // ---------- S06: Yalnız ikonlu kontrol ----------
  const ikonlu = [], adsiz = [];
  for (const el of etkilesimli) {
    if (!el.matches("a, button, [role=button]")) continue;
    if (ad(el).replace(/[^\p{L}\p{N}]/gu, "").length > 0) continue;
    if (!el.querySelector("svg, img, i, [class*=icon]") && !/^[^\p{L}\p{N}]+$/u.test((el.innerText || "").trim())) continue;
    const ea = erisimAdi(el);
    // ‹ › ← → gibi yön okları bağlamıyla (ör. ay adının iki yanında) görsel olarak anlaşılır;
    // yine de adı olmalı (ekran okuyucu). Bu yüzden kritik değil uyarı. (Pilot kalibrasyonu, K-03)
    const yonOku = /^[‹›«»<>←→↑↓⟨⟩❮❯]+$/u.test((el.innerText || "").trim());
    if (!ea && yonOku) ikonlu.push(`${tanim(el)} [ad yok: aria-label ekle]`);
    else if (!ea) adsiz.push(tanim(el));
    else if (!sozluk.evrensel_ikon.some((k) => ea.includes(k))) ikonlu.push(`${tanim(el)} [${ea}]`);
  }
  if (adsiz.length) ekle("S06", "kritik", `Adı olmayan ikon buton (${adsiz.length}): ne yaptığını kimse bilemez`, adsiz);
  if (ikonlu.length) ekle("S06", "uyari", `Yazısız ikon buton (${ikonlu.length}): evrensel olmayan ikonların yanına kısa etiket yaz`, ikonlu);

  // ---------- S02: Tıklanabilen tıklanabilir görünüyor mu ----------
  const sahte = [...document.querySelectorAll("div, span, li, img, td, p")].filter((el) =>
    gorunur(el) && getComputedStyle(el).cursor === "pointer" && !el.closest(ETKILESIMLI + ", label") &&
    !el.querySelector(ETKILESIMLI) && !el.getAttribute("role"));
  if (sahte.length) ekle("S02", "uyari", `Tıklanabilir ama buton/bağlantı olmayan öğe (${sahte.length}): klavyeyle ulaşılamaz, ne olduğu belirsiz`, sahte.map(tanim));
  const gizliLink = [...document.querySelectorAll("p a[href], li > a[href]")].filter((a) => {
    if (!gorunur(a) || a.closest("nav, header, footer")) return false;
    const ebeveyn = a.parentElement; if (!ebeveyn || ebeveyn.innerText.trim() === a.innerText.trim()) return false;
    const sa = getComputedStyle(a), se = getComputedStyle(ebeveyn);
    return !sa.textDecorationLine.includes("underline") && sa.color === se.color && sa.fontWeight === se.fontWeight;
  });
  if (gizliLink.length) ekle("S02", "uyari", `Metin içindeki bağlantı çevresinden ayırt edilmiyor (${gizliLink.length})`, gizliLink.map(tanim));

  // ---------- B06: Form etiketleri ve alan sayısı ----------
  const alanlar = [...document.querySelectorAll("input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=reset]):not([type=image]), select, textarea")].filter(gorunur);
  const etiketsiz = [], yalnizPlaceholder = [], aramaEtiketsiz = [];
  for (const g of alanlar) {
    const etiketler = [...(g.labels || [])].filter((l) => gorunur(l) && l.innerText.trim());
    const ariaBy = (g.getAttribute("aria-labelledby") || "").split(/\s+/).map((i) => document.getElementById(i)).filter((e) => e && gorunur(e));
    if (etiketler.length || ariaBy.length) continue;
    const aramaKutusu = g.type === "search" || g.closest("[role=search], search") ||
      /(^|\s)ara(\s|$)|search|arama/i.test((g.getAttribute("aria-label") || "") + " " + (g.getAttribute("placeholder") || ""));
    if (aramaKutusu && (g.getAttribute("aria-label") || g.getAttribute("placeholder"))) { aramaEtiketsiz.push(tanim(g)); continue; }
    if (g.getAttribute("placeholder")) yalnizPlaceholder.push(`${tanim(g)} placeholder="${g.getAttribute("placeholder")}"`);
    else etiketsiz.push(tanim(g));
  }
  if (yalnizPlaceholder.length) ekle("B06", "kritik", `Etiket yerine placeholder kullanılmış (${yalnizPlaceholder.length}): yazmaya başlayınca soru kayboluyor`, yalnizPlaceholder);
  if (etiketsiz.length) ekle("B06", "kritik", `Görünür etiketi olmayan alan (${etiketsiz.length})`, etiketsiz);
  if (aramaEtiketsiz.length) ekle("B06", "bilgi", "Arama kutusunun görünür etiketi yok: büyüteç ikonu ya da 'Ara' butonu yanında olmalı", aramaEtiketsiz);
  for (const f of document.querySelectorAll("form")) {
    const n = [...f.querySelectorAll("input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea")].filter(gorunur).length;
    if (n > esik.formAlan) ekle("B10", "uyari", `Tek formda ${n} alan (başlangıç eşiği ${esik.formAlan}): adımlara böl ya da isteğe bağlıları kaldır`, [tanim(f)]);
  }

  // ---------- B08: Genel hata mesajı ----------
  const hataKutulari = [...document.querySelectorAll("[role=alert], [aria-live=assertive], .error, .hata, [class*=error], [class*=Error]")].filter((e) => gorunur(e) && e.innerText.trim());
  const genel = hataKutulari.filter((e) => {
    const t = kucuk(e.innerText).replace(/[.!]+$/, "");
    return sozluk.genel_hata.includes(t) || t.split(/\s+/).length < 3;
  });
  if (genel.length) ekle("B08", "uyari", "Hata mesajı ne olduğunu ve nasıl düzeleceğini söylemiyor", genel.map(tanim));

  // ---------- B09: Kesinti ve dikkat dağıtıcılar ----------
  const kaplayan = [...document.querySelectorAll("body *")].filter((el) => {
    const s = getComputedStyle(el);
    if (!(s.position === "fixed" || el.matches("dialog[open], [role=dialog], [aria-modal=true]")) || !gorunur(el)) return false;
    const r = el.getBoundingClientRect();
    return (r.width * r.height) / (vw * vh) > 0.3;
  }).filter((el, _, d) => !d.some((o) => o !== el && o.contains(el)));
  for (const el of kaplayan) {
    const cerez = /çerez|cookie|kvkk|gizlilik/i.test(el.innerText);
    ekle("B09", cerez ? "bilgi" : "uyari", cerez ? "Açılışta çerez penceresi ekranın %30'undan fazlasını kaplıyor: küçük bir şerit yeterli"
      : "Sayfa açılır açılmaz ekranı kaplayan pencere var: kullanıcı amacına ulaşmadan kesiliyor", [tanim(el)]);
  }
  const otomatikVideo = [...document.querySelectorAll("video[autoplay]")].filter(gorunur);
  if (otomatikVideo.length) ekle("B09", "uyari", `Kendiliğinden oynayan video (${otomatikVideo.length}): durdurma düğmesi görünür olmalı`);
  const sonsuz = (document.getAnimations?.() || []).filter((a) => a.effect?.getTiming?.().iterations === Infinity &&
    a.effect?.target && gorunur(a.effect.target) && !a.effect.target.closest("[aria-busy=true], [role=progressbar], [class*=spin], [class*=load]"));
  if (sonsuz.length > 2) ekle("B09", "bilgi", `${sonsuz.length} sonsuz döngüde animasyon: dikkat dağıtır`);

  // ---------- S07 / S12: Mobil ----------
  if (mod === "mobil") {
    const vp = document.querySelector("meta[name=viewport]")?.content || "";
    if (!/width=device-width/.test(vp))
      ekle("S12", "kritik", "Mobil görünüm etiketi yok (<meta name=viewport content=\"width=device-width, initial-scale=1\">): telefonda küçültülmüş masaüstü açılıyor");
    if (/user-scalable=no|maximum-scale=1(\.0)?(,|;|\s|$)/.test(vp))
      ekle("S12", "uyari", "Yakınlaştırma kapatılmış: küçük metni okuyamayan kullanıcı büyütemez");
    const tasma = document.scrollingElement.scrollWidth - vw;
    if (tasma > 4) ekle("S12", "kritik", `Mobilde sayfa ${tasma}px yana taşıyor: yatay kaydırma oluşuyor`);
    const boyut = (el) => { const r = el.getBoundingClientRect(); return Math.min(r.width, r.height); };
    const adaylar = etkilesimli.filter((el) => !(el.closest("p") && el.matches("a")));
    const yaz = (e) => { const r = e.getBoundingClientRect(); return `${tanim(e)} ${Math.round(r.width)}×${Math.round(r.height)}`; };
    const cokKucuk = adaylar.filter((el) => boyut(el) < esik.dokunmaAlt);
    const kucuk = adaylar.filter((el) => boyut(el) >= esik.dokunmaAlt && boyut(el) < esik.dokunmaHedef);
    if (cokKucuk.length) ekle("S07", "uyari", `${cokKucuk.length} dokunma hedefi ${esik.dokunmaAlt}px'ten küçük: parmakla ıskalanır`, cokKucuk.map(yaz));
    if (kucuk.length) ekle("S07", "bilgi", `${kucuk.length} dokunma hedefi ${esik.dokunmaAlt}-${esik.dokunmaHedef}px arası: rahat dokunma için ${esik.dokunmaHedef}px önerilir`, kucuk.map(yaz));
  }

  // ---------- Sayfalar arası kıyas için ham veri ----------
  const linkler = etkilesimli.filter((e) => e.matches("a[href]")).map((a) => ({
    href: a.href.split("#")[0], metin: ad(a) || erisimAdi(a), navda: !!a.closest("nav, header, [role=navigation]"),
  })).filter((l) => l.metin && l.href.startsWith(location.origin));

  return {
    url: location.href, baslik, dil, h1: h1ler.map((h) => h.innerText.trim()), linkler, bulgular,
    metrik: { ilkEkranEtkilesim: ilkEtk.length, ilkEkranKelime: ilkKelime, okunabilirlik, cumle: cumleler.length, birincilButon: dolgulu.length },
  };
}
