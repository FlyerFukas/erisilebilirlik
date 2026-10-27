// Tarayıcı içinde çalışır (page.evaluate). Tek sayfanın bulgularını döndürür.
// Kural kimlikleri skill/erisilebilirlik/references/katalog.md ile aynıdır.
// Eşikler "başlangıç eşiği"dir; pilot projelerle kalibre edilecek (YOL-HARITASI Faz 4).
// anaYol: kök adresin yönlendiği yol (ör. "/" → "/burslar"); oraya giden bağlantı da ana sayfa bağlantısıdır.
export function olc({ mod, sozluk, esik, anaYol = "/" }) {
  const bulgular = [];
  const ekle = (kural, seviye, mesaj, ornekler = []) =>
    bulgular.push({ kural, seviye, mesaj, ornekler: ornekler.slice(0, 5) });

  const vw = innerWidth, vh = innerHeight;
  const kucuk = (s) => (s || "").toLocaleLowerCase("tr").replace(/\s+/g, " ").trim();
  const gorunur = (el) => {
    const r = el.getBoundingClientRect();
    // 1×1 px ve altı: ekran okuyucuya özel (sr-only) ya da gizli öğe, gözle görülmez. (Pilot kalibrasyonu)
    if (r.width < 2 || r.height < 2) return false;
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
  // Hesaplanmış renk her biçimde gelebilir: rgb(), oklab(), lab(), color(display-p3 ...) (Tailwind v4 oklab/oklch üretir).
  // rgb() hızlı yoldan; diğerleri tek piksellik tuvale boyanıp sRGB değeri okunur. (Pilot kalibrasyonu: ornekproje)
  const renkOnbellek = new Map();
  const tuval = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const rgb = (c) => {
    if (!c) return null;
    const m = c.match(/^rgba?\(([^)]+)\)$/);
    if (m) {
      const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
      return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 };
    }
    if (renkOnbellek.has(c)) return renkOnbellek.get(c);
    let sonuc = null;
    if (tuval && CSS.supports("color", c)) {
      tuval.clearRect(0, 0, 1, 1);
      tuval.fillStyle = c;
      tuval.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = tuval.getImageData(0, 0, 1, 1).data;
      sonuc = { r, g, b, a: a / 255 };
    }
    renkOnbellek.set(c, sonuc);
    return sonuc;
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
    try { const u = new URL(a.href); return u.origin === location.origin && (u.pathname === "/" || u.pathname === "" || u.pathname === anaYol) && r.top < 200 && gorunur(a); }
    catch { return false; }
  });
  if (!anaSayfaLinki && location.pathname !== "/" && location.pathname !== anaYol)
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
  navlar.forEach((n, i) => {
    const ust = [...n.querySelectorAll("a[href], button")].filter((e) => gorunur(e) && ilkEkranda(e));
    if (ust.length > 7) ekle("B02", "uyari", `Bir menüde aynı anda ${ust.length} seçenek görünüyor (öneri ≤ 7, gerisi aşamalı açılsın)`, [tanim(n)]);
    // Ana menü (ilk görünen nav) 6-7 öğede sınırda: 5'e inebilir mi diye bak.
    else if (i === 0 && ust.length >= 6) ekle("B02", "bilgi", `Ana menüde ${ust.length} seçenek: sınırda, en az kullanılanı 'Diğer'e taşımayı düşün`, [tanim(n)]);
  });
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
    // Tıklamayı geçiren, metinsiz süs katmanı (konfeti tuvali, ışık efekti) kullanıcıyı kesmez. (Pilot kalibrasyonu)
    if (s.pointerEvents === "none" && !el.innerText?.trim()) return false;
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

  // ================= Katalog v0.2 ile gelen denetimler =================
  // Renk yardımcıları: göreli parlaklık ve kontrast (WCAG formülü yalnız ölçü aracı), ton açısı.
  const isik = ({ r, g, b }) => {
    const k = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * k(r) + 0.7152 * k(g) + 0.0722 * k(b);
  };
  const kontrast = (a, b) => { const [x, y] = [isik(a), isik(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const karistir = (on, arka) => ({ r: on.r * on.a + arka.r * (1 - on.a), g: on.g * on.a + arka.g * (1 - on.a), b: on.b * on.a + arka.b * (1 - on.a), a: 1 });
  const ton = ({ r, g, b }) => {
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    if (!d) return null;
    const h = 60 * (mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4);
    return h < 0 ? h + 360 : h;
  };
  // Yazının gerçekten üstünde durduğu zemin rengi; yolda görsel zemin varsa null.
  const zeminBul = (el) => {
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.backgroundImage.includes("url(")) return null;
      const z = rgb(s.backgroundColor);
      if (z && z.a >= 0.5) return z;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const cerceveli = (e) => {
    const s = getComputedStyle(e);
    const kenar = ["Top", "Right", "Bottom", "Left"].some((y) => parseFloat(s[`border${y}Width`]) > 0 &&
      s[`border${y}Style`] !== "none" && (rgb(s[`border${y}Color`])?.a ?? 0) > 0.05);
    return kenar || (s.boxShadow && s.boxShadow !== "none");
  };
  const listede = (liste, m) => liste.some((k) => m === k || m.startsWith(k + " "));
  const butonlar = etkilesimli.filter((e) => e.matches("button, [role=button], input[type=submit], input[type=button], a[href]"));
  const metinOgeleri = [...new Set(yaprakMetin.filter((x) => !x.el.closest("code, pre, kbd, svg")).map((x) => x.el))];

  // ---------- B03: Karşılama paragrafı ----------
  const karsilama = yaprakMetin.filter((x) => /^(hoş ?geldin(iz)?|welcome)\b/iu.test(x.t) && x.t.split(/\s+/).length > 6);
  if (karsilama.length) ekle("B03", "uyari", "Karşılama paragrafı var: kimse okumaz, yalnız ilk ekranı doldurur. Sil ya da tek satırlık değer önermesine çevir", karsilama.map((x) => tanim(x.el)));

  // ---------- B04: Sade dil, ek denetimler ----------
  if (dil === "tr") {
    const ascii = new Map();
    for (const { t, el } of yaprakMetin) {
      if (el.closest("code, pre, kbd")) continue;
      // Adres, e-posta, dosya adı içindeki ASCII yazım doğaldır; ayıkla.
      for (const w of kucuk(t.replace(/\S*[@/]\S*|\S+\.\S+/g, " ")).split(/[^\p{L}]+/u))
        if (sozluk.ascii_turkce.includes(w) && !ascii.has(w)) ascii.set(w, tanim(el));
    }
    if (ascii.size) ekle("B04", "uyari", `Türkçe karakteri bozulmuş kelime: ${[...ascii.keys()].join(", ")} (ş, ç, ğ, ı, ö, ü kullan)`, [...ascii].map(([k, v]) => `${k} → ${v}`));
    const pasif = [...new Set(paragraf.flatMap((x) => x.t.match(/\p{L}{2,}(ıl|il|ul|ül)(malı|meli)(dır|dir|sınız|siniz)?(?!\p{L})/gu) || []))];
    if (pasif.length) ekle("B04", "bilgi", `Edilgen "-ılmalı" kalıbı (${pasif.length}): kim yapacak belli değil. "Formu doldurun" gibi etken yaz`, pasif);
  }
  const abbrMetin = new Set([...document.querySelectorAll("abbr[title]")].map((a) => a.textContent.trim()));
  const kisaltma = new Set();
  for (const { t } of paragraf) {
    const harf = t.replace(/[^\p{L}]/gu, "");
    if (harf === harf.toLocaleUpperCase(dil)) continue; // tamamı büyük harf: ayrı denetim
    for (const k of t.match(/(?<![\p{L}\d])\p{Lu}{2,6}(?![\p{L}\d])/gu) || []) {
      if (sozluk.yaygin_kisaltma.includes(k) || abbrMetin.has(k) || tumMetin.includes(`${k} (`) || tumMetin.includes(`(${k})`)) continue;
      kisaltma.add(k);
    }
  }
  if (kisaltma.size) ekle("B04", "bilgi", `Açıklanmamış kısaltma: ${[...kisaltma].slice(0, 8).join(", ")}. İlk geçtiği yerde açık yaz ya da <abbr title> kullan`);
  const uzunParagraf = paragraf.filter((x) => kelimeSay(x.t) > 50);
  if (uzunParagraf.length) ekle("B04", "bilgi", `${uzunParagraf.length} paragraf 50 kelimeden uzun: böl, madde imine çevir`, uzunParagraf.map((x) => tanim(x.el)));
  const buyukHarf = yaprakMetin.filter((x) => {
    if (kelimeSay(x.t) < 5 || x.el.closest("code, pre")) return false;
    const harf = x.t.replace(/[^\p{L}]/gu, "");
    return harf.length >= 10 && (getComputedStyle(x.el).textTransform === "uppercase" || harf === harf.toLocaleUpperCase(dil));
  });
  if (buyukHarf.length) ekle("B04", "bilgi", `Tamamı büyük harf metin (${buyukHarf.length}): kelime şekli kaybolur, okuma yavaşlar ve bağırıyor gibi durur`, buyukHarf.map((x) => tanim(x.el)));
  const roma = yaprakMetin.filter((x) => !x.el.closest("code, pre") && x.t !== x.t.toLocaleUpperCase(dil) &&
    /(?<![\p{L}\d])(II|III|IV|VI|VII|VIII|IX|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX|XXI)(?![\p{L}\d])/u.test(x.t));
  if (roma.length) ekle("B04", "bilgi", "Roma rakamı kullanılmış: çözmek düşündürür, rakamla yaz (14. yüzyıl, 2. aşama)", roma.map((x) => tanim(x.el)));

  // ---------- B05: Şifre ve doğrulama ezberletmesin, zorlamasın ----------
  const sifreler = alanlar.filter((g) => g.type === "password");
  const yapistirmaYok = sifreler.filter((g) => {
    try {
      const o = new ClipboardEvent("paste", { bubbles: true, cancelable: true, clipboardData: new DataTransfer() });
      g.dispatchEvent(o);
      return o.defaultPrevented;
    } catch { return false; }
  });
  if (yapistirmaYok.length) ekle("B05", "uyari", "Şifre alanına yapıştırma engellenmiş: şifre yöneticisi kullanan kişi elle yazmak zorunda kalıyor", yapistirmaYok.map(tanim));
  const otoKapali = alanlar.filter((g) => (g.type === "password" || g.type === "email" || /e-?posta|email/i.test(`${g.name} ${g.id}`)) &&
    /^(off|false)$/i.test(g.getAttribute("autocomplete") || ""));
  if (otoKapali.length) ekle("B05", "uyari", `Şifre/e-posta alanında otomatik doldurma kapatılmış (autocomplete="off") (${otoKapali.length})`, otoKapali.map(tanim));
  const captcha = [...document.querySelectorAll("iframe[src*='recaptcha'], iframe[src*='hcaptcha'], iframe[src*='challenges.cloudflare.com'], .g-recaptcha, .h-captcha, .cf-turnstile")]
    .filter((e) => gorunur(e) && !e.closest(".grecaptcha-badge") && e.getBoundingClientRect().height >= 40);
  if (captcha.length) ekle("B05", "uyari", "Görünür CAPTCHA bulmacası var: insanı makine sanıp sınava sokuyor. Görünmez doğrulama ya da e-posta bağlantısı dene", [tanim(captcha[0])]);

  // ---------- B07: Telefon alanı farklı yazımı kabul etsin ----------
  const telBenzer = (g) => g.type === "tel" || /^tel/i.test(g.getAttribute("autocomplete") || "") ||
    /phone|telefon|(^|[_-])tel($|[_-])|gsm|(^|[_-])cep($|[_-])/i.test(`${g.name} ${g.id}`) ||
    [...(g.labels || [])].some((l) => /telefon|phone|gsm|cep tel/i.test(l.innerText));
  const telSayi = alanlar.filter((g) => g.type === "number" && telBenzer(g));
  if (telSayi.length) ekle("B07", "uyari", "Telefon alanı sayı alanı (type=number): boşluk ve + kabul etmez, mobilde ok tuşları çıkar. type=\"tel\" kullan", telSayi.map(tanim));
  const telDesen = alanlar.filter((g) => {
    if (!telBenzer(g) || !g.getAttribute("pattern")) return false;
    try {
      const d = new RegExp(`^(?:${g.getAttribute("pattern")})$`, "v");
      return !["0532 000 00 00", "+90 532 000 00 00"].every((o) => d.test(o));
    } catch { return false; }
  });
  if (telDesen.length) ekle("B07", "uyari", "Telefon deseni yaygın yazımı reddediyor (\"0532 000 00 00\" ya da \"+90 532 000 00 00\"): boşluğu ve ülke kodunu kendin temizle", telDesen.map((g) => `${tanim(g)} pattern="${g.getAttribute("pattern")}"`));

  // ---------- B08: Hata mesajında kod ----------
  const kodDeseni = /(hata|error|kod|code)\s*(kodu)?\s*[:#]?\s*[A-Z]?\d{3,}|#\d{3,}|(?<![\p{L}\d])E\d{3,}(?![\p{L}\d])/iu;
  const kodlu = new Set([...hataKutulari.filter((e) => kodDeseni.test(e.innerText)).map(tanim),
    ...yaprakMetin.filter((x) => /(?<![\p{L}])(error|hata)\s*(kodu|code)?\s*[:#]?\s*\d{3,}/iu.test(x.t)).map((x) => tanim(x.el))]);
  if (kodlu.size) ekle("B08", "uyari", "Hata mesajı kullanıcıya kod gösteriyor (ör. \"Error 401\"): ne olduğunu ve ne yapacağını insan diliyle yaz", [...kodlu]);

  // ---------- B09: Kendiliğinden yenileme ve uyarı kalabalığı ----------
  if (document.querySelector("meta[http-equiv='refresh' i]"))
    ekle("B09", "uyari", "Sayfa kendiliğinden yenileniyor ya da yönleniyor (meta refresh): okuyan ya da form dolduran kişi işini kaybeder");
  const uyariKutulari = [...document.querySelectorAll("[role=alert], .alert, [class*='alert-'], [class*=warning], [class*=uyari], [class*=notice]")]
    .filter((e) => gorunur(e) && e.innerText.trim()).filter((e, _, l) => !l.some((o) => o !== e && o.contains(e)));
  if (uyariKutulari.length > 2) ekle("B09", "bilgi", `Aynı anda ${uyariKutulari.length} uyarı kutusu görünüyor: hepsi önemliyse hiçbiri önemli değildir`, uyariKutulari.map(tanim));

  // ---------- B11: Önceden işaretli pazarlama izni ----------
  const izinler = [...document.querySelectorAll("input[type=checkbox], [role=checkbox], [role=switch]")].filter((c) => {
    const isaretli = c.matches("input") ? c.checked : c.getAttribute("aria-checked") === "true";
    if (!isaretli) return false;
    const etiketler = [...(c.labels || [])];
    if (!gorunur(c) && !etiketler.some(gorunur)) return false;
    const metin = kucuk(etiketler.map((l) => l.innerText).join(" ") || c.getAttribute("aria-label") || c.parentElement?.innerText || "");
    return sozluk.pazarlama_onay.some((k) => metin.includes(k));
  });
  if (izinler.length) ekle("B11", "kritik", "Pazarlama/bülten/veri paylaşımı izni önceden işaretli: kullanıcı fark etmeden onay vermiş oluyor, güveni bitirir (ve KVKK'ya aykırı)", izinler.map((c) => tanim(c.labels?.[0] || c)));

  // ---------- B13: Dil etiketi ve eğik çizgili tarih ----------
  if (!document.documentElement.getAttribute("lang"))
    ekle("B13", "uyari", "Sayfanın dili belirtilmemiş (<html lang=\"tr\">): tarayıcı gereksiz çeviri önerir, sesli okuma yanlış telaffuz eder");
  if (dil === "tr") {
    const egik = tumMetin.match(/(?<![\d/])\d{1,2}\/\d{1,2}\/\d{2,4}(?![\d/])/g);
    if (egik) ekle("B13", "bilgi", `Tarih eğik çizgiyle yazılmış (${egik[0]}): gün/ay mı ay/gün mü belirsiz. "18 Ekim 2026" yaz`);
  }

  // ---------- B14: Yıkıcı buton olağan butonla aynı görünümde yan yana ----------
  const yanyana = [];
  for (const y of butonlar.filter((b) => listede(sozluk.yikici, ad(b)))) {
    let kap = y.parentElement;
    for (let i = 0; i < 2 && kap && kap.querySelectorAll("button, [role=button], input[type=submit], a[href]").length < 2; i++) kap = kap.parentElement;
    const komsu = kap && butonlar.find((b) => b !== y && kap.contains(b) && listede(sozluk.olagan, ad(b)));
    if (!komsu) continue;
    const s1 = getComputedStyle(y), s2 = getComputedStyle(komsu);
    if (s1.backgroundColor === s2.backgroundColor && s1.color === s2.color && s1.borderTopColor === s2.borderTopColor)
      yanyana.push(`${tanim(y)} ↔ ${tanim(komsu)}`);
  }
  if (yanyana.length) ekle("B14", "uyari", "Yıkıcı buton olağan butonla aynı görünümde yan yana: kazara tıklanır. Rengi, biçimi ve yeri ayır", yanyana);

  // ---------- B16: Sistemin bilebileceği bilgiye otomatik doldurma ----------
  const kisiselEtiket = /^(ad|adı|adınız|isim|isminiz|ad soyad|ad-soyad|adı soyadı|adınız soyadınız|soyad|soyadı|soyadınız|e-posta|e-posta adresi|e-posta adresiniz|eposta|e-mail|email|telefon|telefon numarası|telefon numaranız|cep telefonu|adres|açık adres|teslimat adresi|fatura adresi|şehir|ilçe|posta kodu|name|full name|first name|last name|email address|phone|phone number|address|city|zip code|postal code)$/;
  const otoEksik = alanlar.filter((g) => {
    if (g.hasAttribute("autocomplete") || g.tagName === "SELECT" || /^(password|search|checkbox|radio|file|number|date|range|color)$/.test(g.type)) return false;
    const etiket = kucuk([...(g.labels || [])].map((l) => l.innerText).join(" ") || g.getAttribute("aria-label") || g.getAttribute("placeholder") || "")
      .replace(/[*:()]|zorunlu|isteğe bağlı|optional|required/g, "").trim();
    return g.type === "email" || g.type === "tel" || kisiselEtiket.test(etiket) ||
      /^(name|first_?name|last_?name|full_?name|email|e_?posta|phone|tel|telefon|address|adres|city|sehir|zip|postal_?code)$/i.test(g.name || g.id || "");
  });
  if (otoEksik.length) ekle("B16", "bilgi", `Kişisel bilgi alanında autocomplete yok (${otoEksik.length}): tarayıcı dolduramıyor, kullanıcı her seferinde yeniden yazıyor`, otoEksik.map(tanim));

  // ---------- B18: Okunur yazı ----------
  const kucukSoluk = [], gorselZemin = [], aileler = new Set();
  for (const el of metinOgeleri) {
    const s = getComputedStyle(el), px = parseFloat(s.fontSize);
    const aile = s.fontFamily.split(",")[0].replace(/["']/g, "").trim().toLowerCase();
    if (aile && !/icon|awesome|material|symbol|glyph|emoji/.test(aile)) aileler.add(aile);
    if (el.closest(":disabled, [aria-disabled=true]")) continue;
    const zemin = zeminBul(el);
    if (!zemin) { if (kelimeSay(el.innerText || "") >= 3) gorselZemin.push(tanim(el)); continue; }
    const renk = rgb(s.color);
    if (!renk) continue;
    const k = kontrast(renk.a < 1 ? karistir(renk, zemin) : renk, zemin);
    if (px < 14 && k < 4.5) kucukSoluk.push(`${tanim(el)} ${Math.round(px)}px, ${k.toFixed(1)}:1`);
  }
  if (kucukSoluk.length) ekle("B18", "uyari", `Küçük ve soluk yazı (${kucukSoluk.length}): 14px altı ve kontrastı 4,5:1 altı. Okumak için göz kısılıyor`, kucukSoluk);
  if (gorselZemin.length) ekle("B18", "bilgi", `Görsel zemin üzerinde metin (${gorselZemin.length}): görselin açık-koyu yerlerinde okunmaz, düz zemin ya da koyu katman kullan`, gorselZemin);
  if (aileler.size > 3) ekle("B18", "bilgi", `${aileler.size} farklı yazı tipi ailesi: ${[...aileler].join(", ")}. Bir ya da iki aile yeter`);
  const darSatir = [], uzunSatir = [], kucukGovde = [];
  for (const el of new Set(paragraf.map((x) => x.el))) {
    const s = getComputedStyle(el), px = parseFloat(s.fontSize);
    if (s.display === "inline") continue;
    const lh = s.lineHeight === "normal" ? px * 1.2 : parseFloat(s.lineHeight);
    const satir = Math.round(el.getBoundingClientRect().height / lh);
    if (mod === "mobil" && px < 16 && kelimeSay(el.innerText) >= 8) kucukGovde.push(`${tanim(el)} ${Math.round(px)}px`);
    if (satir < 2) continue;
    if (lh / px < 1.3) darSatir.push(`${tanim(el)} satır aralığı ${(lh / px).toFixed(2)}`);
    if (mod === "masaustu" && el.innerText.length / satir > 100) uzunSatir.push(`${tanim(el)} ~${Math.round(el.innerText.length / satir)} karakter`);
  }
  if (kucukGovde.length) ekle("B18", "bilgi", `Mobilde gövde metni 16px'ten küçük (${kucukGovde.length}): telefonda yakınlaştırmadan okunmuyor`, kucukGovde);
  if (darSatir.length) ekle("B18", "bilgi", `Satır aralığı dar (${darSatir.length}): 1,4-1,5 göz yorgunluğunu azaltır`, darSatir);
  if (uzunSatir.length) ekle("B18", "bilgi", `Satır çok uzun (${uzunSatir.length}): göz satır başını kaçırır, metin kabına max-width: 70ch ver`, uzunSatir);
  const unlem = yaprakMetin.filter((x) => ilkEkranda(x.el)).reduce((n, x) => n + (x.t.match(/!/g) || []).length, 0);
  if (unlem > 3) ekle("B18", "bilgi", `İlk ekranda ${unlem} ünlem: sayfa bağırıyor, hiçbir şey öne çıkmıyor`);

  // ---------- S02: Tıklanamayan tıklanabilir, giriş alanı alan gibi görünmüyor ----------
  const cercevesiz = alanlar.filter((g) => {
    if (!g.matches("input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]):not([type=file]), textarea")) return false;
    if (cerceveli(g)) return false;
    const gh = g.getBoundingClientRect().height;
    for (let a = g.parentElement, i = 0; a && i < 3; a = a.parentElement, i++) {
      if (a.getBoundingClientRect().height > gh * 2.5) break;
      // Yarı saydam zemin de kutuyu belli eder: üstteki zemine karıştırıp farkına bak.
      const za = rgb(getComputedStyle(a).backgroundColor), zu = zeminBul(a.parentElement || document.body);
      const zk = za && zu && za.a > 0.05 ? karistir(za, zu) : null;
      if (cerceveli(a) || (zk && Math.abs(zk.r - zu.r) + Math.abs(zk.g - zu.g) + Math.abs(zk.b - zu.b) >= 12)) return false;
    }
    const z = rgb(getComputedStyle(g).backgroundColor), ust = zeminBul(g.parentElement || document.body);
    if (!z || z.a < 0.1 || !ust) return true;
    return Math.abs(z.r - ust.r) + Math.abs(z.g - ust.g) + Math.abs(z.b - ust.b) < 15;
  });
  if (cercevesiz.length) ekle("S02", "uyari", `Çerçevesiz ve zeminsiz giriş alanı (${cercevesiz.length}): yazı yazılacak bir yer olduğu görünmüyor`, cercevesiz.map(tanim));
  const metinLinkleri = [...document.querySelectorAll("p a[href], li a[href]")].filter((a) => gorunur(a) && !a.closest("nav, header, footer"));
  const renkSay = new Map();
  for (const a of metinLinkleri) { const c = getComputedStyle(a).color; renkSay.set(c, (renkSay.get(c) || 0) + 1); }
  const linkRengi = [...renkSay].sort((x, y) => y[1] - x[1])[0]?.[0];
  if (linkRengi && linkRengi !== getComputedStyle(document.body).color && doygunluk(rgb(linkRengi)) > 0.3) {
    const sahteBaslik = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")]
      .filter((h) => gorunur(h) && !h.closest("a, button") && !h.querySelector("a, button") && getComputedStyle(h).color === linkRengi);
    if (sahteBaslik.length) ekle("S02", "uyari", `Bağlantı olmayan başlık bağlantı renginde (${sahteBaslik.length}): kullanıcı tıklar, bir şey olmaz`, sahteBaslik.map(tanim));
  }

  // ---------- S03: İç içe kaydırma alanı ----------
  const kaydirmalar = [...document.querySelectorAll("body *")].filter((e) => {
    if (/^(TEXTAREA|SELECT)$/.test(e.tagName) || !/(auto|scroll)/.test(getComputedStyle(e).overflowY)) return false;
    return e.scrollHeight > e.clientHeight + 4 && e.clientHeight > 40 && gorunur(e);
  });
  // Ekranı neredeyse kaplayan kaydırma kabı fiilen sayfanın kendisidir; onu dış katman sayma.
  const sayfaGibi = (e) => { const r = e.getBoundingClientRect(); return r.width * r.height >= vw * vh * 0.9; };
  const icIce = kaydirmalar.filter((e) => kaydirmalar.some((o) => o !== e && o.contains(e) && !sayfaGibi(o)));
  if (icIce.length) ekle("S03", "uyari", `İç içe kaydırma alanı (${icIce.length}): tekerlek hangi alanı kaydıracağı belli değil, içerik kaybolur`, icIce.map(tanim));

  // ---------- S08: Başlık düzeni ----------
  const basliklar = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")].filter(gorunur);
  const atlama = [];
  for (let i = 1; i < basliklar.length; i++) {
    const a = +basliklar[i - 1].tagName[1], b = +basliklar[i].tagName[1];
    if (b > a + 1) atlama.push(`h${a} → h${b} ${tanim(basliklar[i])}`);
  }
  if (atlama.length) ekle("S08", "bilgi", `Başlık düzeyi atlıyor (${atlama.length}): görsel büyüklük için değil, yapı için başlık seç`, atlama);
  const yuzen = basliklar.filter((h) => {
    if (h.tagName === "H1") return false;
    const once = h.previousElementSibling, sonra = h.nextElementSibling;
    if (!once || !sonra || !gorunur(once) || !gorunur(sonra)) return false;
    const r = h.getBoundingClientRect(), ro = once.getBoundingClientRect(), rs = sonra.getBoundingClientRect();
    if (ro.bottom > r.top + 1 || rs.top < r.bottom - 1) return false; // yan yana dizilim, dikey akış değil
    const ust = r.top - ro.bottom, alt = rs.top - r.bottom;
    return alt >= 8 && ust <= alt + 1;
  });
  if (yuzen.length) ekle("S08", "uyari", `Başlık iki paragraf arasında yüzüyor (${yuzen.length}): üstündeki boşluk altındakinden büyük olmalı ki hangi metne ait olduğu görülsün`, yuzen.map(tanim));
  if (h1ler.length) {
    const h1px = parseFloat(getComputedStyle(h1ler[0]).fontSize);
    // Yalnız emoji/bayrak olan öğe metin değil süstür. (Pilot kalibrasyonu)
    const buyuk = metinOgeleri.filter((el) => !el.closest("h1") && /[\p{L}\p{N}]/u.test(el.innerText) && parseFloat(getComputedStyle(el).fontSize) > h1px * 1.2);
    if (buyuk.length) ekle("S08", "bilgi", `Sayfa adından (h1, ${Math.round(h1px)}px) belirgin büyük metin var (${buyuk.length}): göz önce ona gidiyor`, buyuk.map(tanim));
  }

  // ---------- S10: Bulunulan yer işareti yeterince belirgin mi, içerik yolu ----------
  const suanki = navLinkleri.find((a) => a.getAttribute("aria-current") && a.getAttribute("aria-current") !== "false");
  const kardes = suanki && navLinkleri.find((a) => a !== suanki && !a.getAttribute("aria-current") &&
    a.closest("nav, [role=navigation]") === suanki.closest("nav, [role=navigation]"));
  if (kardes) {
    // Kenar rengi varsayılanda yazı rengini izler; kalınlığı 0 olan kenarın rengi fark sayılmaz.
    const kenar = (s, y) => parseFloat(s[`border${y}Width`]) > 0 && s[`border${y}Style`] !== "none" ? `${s[`border${y}Width`]} ${s[`border${y}Color`]}` : "";
    const stil = (e) => { const s = getComputedStyle(e); return { renk: s.color, zemin: s.backgroundColor, kalinlik: s.fontWeight, alt: s.textDecorationLine,
      kenar: `${kenar(s, "Bottom")}|${kenar(s, "Left")}`, golge: s.boxShadow }; };
    const farklar = [];
    for (const [e1, e2] of [[suanki, kardes], [suanki.parentElement, kardes.parentElement]]) {
      if (!e1 || !e2 || e1 === e2) continue;
      const a = stil(e1), b = stil(e2);
      for (const k of Object.keys(a)) if (a[k] !== b[k] && !farklar.includes(k)) farklar.push(k);
    }
    if (!farklar.length) ekle("S10", "uyari", "Menüde bulunulan sayfa aria-current ile işaretli ama görünüşü diğerlerinden farksız", [tanim(suanki)]);
    // Mobil alt sekme çubuğunda yalnız renk farkı platform alışkanlığıdır (iOS/Android); orada bilgi düzeyinde kalır. (Pilot kalibrasyonu)
    const cubuk = suanki.closest("nav, [role=navigation]");
    const altCubuk = cubuk && getComputedStyle(cubuk).position === "fixed" && cubuk.getBoundingClientRect().bottom >= vh - 2;
    if (farklar.length === 1 && ["renk", "kalinlik"].includes(farklar[0]))
      ekle("S10", altCubuk ? "bilgi" : "uyari", `Bulunulan sayfa işareti zayıf: yalnız ${farklar[0] === "renk" ? "renk" : "yazı kalınlığı"} farklı. Zemin, alt çizgi ya da çubukla güçlendir`, [tanim(suanki)]);
  }
  const ekmek = [...document.querySelectorAll("nav[aria-label*='breadcrumb' i], nav[aria-label*='konum' i], nav[aria-label*='sayfa yolu' i], [class*=breadcrumb]")].find(gorunur);
  if (ekmek) {
    const son = yaprakMetin.filter((x) => ekmek.contains(x.el) && /\p{L}/u.test(x.t)).at(-1);
    const sonLink = son?.el.closest("a[href]");
    if (sonLink && !sonLink.getAttribute("aria-current")) ekle("S10", "bilgi", "İçerik yolunun (breadcrumb) son öğesi bağlantı: bulunulan sayfa düz ve kalın metin olmalı", [tanim(sonLink)]);
  }

  // ---------- K07: Boş durum yol gösteriyor mu ----------
  // Giriş arkasındaki asıl boş durumlar için yeni hesapla --oturum gerekir; bu, görünen her sayfada çalışır.
  const ciplakBos = yaprakMetin.filter((x) => /^(veri yok|kayıt yok|kayıt bulunamadı|sonuç yok|sonuç bulunamadı|bulunamadı|liste boş|boş|içerik yok|no data|no results( found)?|nothing (here|found)|empty|no items)[.!]?$/iu.test(x.t));
  if (ciplakBos.length) ekle("K07", "uyari", `Boş durum yalnız "${ciplakBos[0].t}" diyor: ne olduğunu ve ilk adımı söylemiyor`, ciplakBos.map((x) => tanim(x.el)));
  const adimsiz = yaprakMetin.filter((x) => {
    // Yalnız boş durum kalıbı: "Henüz burs eklemedin", "Henüz kayıt yok". "Henüz gözlenmemiş ilişkiler" açıklamadır. (Pilot kalibrasyonu)
    if (!/(^|\s)henüz\s.{0,60}?(yok|eklemedin|eklenmedi|eklenmemiş|bulunmuyor|oluşturmadın|kaydetmedin|seçmedin|girmedin)(?!\p{L})|no .{1,30} yet|nothing yet/iu.test(x.t) ||
      kelimeSay(x.t) > 25 || x.el.closest("a, button, summary")) return false;
    let kap = x.el;
    for (let i = 0; i < 3 && kap.parentElement && kap.parentElement.getBoundingClientRect().height < 400; i++) kap = kap.parentElement;
    return ![...kap.querySelectorAll("a[href], button, [role=button]")].some(gorunur);
  });
  if (adimsiz.length) ekle("K07", "bilgi", `Boş durum ilk adımı göstermiyor (${adimsiz.length}): yanına tek bir "İlk ... ekle" butonu koy`, adimsiz.map((x) => `${tanim(x.el)}`));
  const bosTablo = [...document.querySelectorAll("table")].filter((t) => gorunur(t) && t.querySelector("th") &&
    ![...t.querySelectorAll("tbody tr, tr")].some((tr) => tr.querySelector("td")));
  if (bosTablo.length) ekle("K07", "uyari", `Yalnız başlıkları olan boş tablo (${bosTablo.length}): tablo yerine ne olduğunu ve ilk adımı söyleyen boş durum göster`, bosTablo.map(tanim));

  // ---------- S13: Acil çıkış ----------
  const kapatmaDeseni = /(^|\s)(kapat|close|vazgeç|iptal|cancel|tamam|ok|anladım|hayır|reddet|kabul|dismiss|got it|geri)(\s|$)|^[×✕✖x]$/u;
  const diyaloglar = [...document.querySelectorAll("dialog[open], [role=dialog], [role=alertdialog], [aria-modal=true]")]
    .filter(gorunur).filter((d, _, l) => !l.some((o) => o !== d && o.contains(d)));
  const cikissiz = diyaloglar.filter((d) => ![...d.querySelectorAll("button, a[href], [role=button], input[type=button], input[type=submit]")]
    .some((b) => gorunur(b) && (kapatmaDeseni.test(ad(b)) || kapatmaDeseni.test(erisimAdi(b)) || /close|kapat|dismiss/i.test(String(b.className)))));
  if (cikissiz.length) ekle("S13", "uyari", "Açık pencerede görünür kapatma ya da vazgeç düğmesi yok: kullanıcı kapana kısılıyor", cikissiz.map(tanim));

  // ---------- S14 / S18: Bekleme ve kararlı yerleşim (denetle.mjs'in sayfaya eklediği gözcüden) ----------
  const perf = window.__erisimPerf;
  if (perf) {
    const cls = Math.round(perf.cls * 1000) / 1000;
    if (cls > 0.25) ekle("S18", "kritik", `Sayfa yüklenirken içerik ciddi biçimde kayıyor (CLS ${cls}): kullanıcı yanlış şeye dokunur`);
    else if (cls > 0.1) ekle("S18", "uyari", `Sayfa yüklenirken içerik kayıyor (CLS ${cls}, hedef ≤ 0,1): görsellere boyut ver, içeriği sonradan üste ekleme`);
    if (mod === "mobil" && perf.lcp > 4000) ekle("S14", "uyari", `Mobilde ana içerik ${(perf.lcp / 1000).toFixed(1)} sn'de görünüyor (hedef ≤ 2,5 sn): kullanıcı beklerken vazgeçer`);
    else if (mod === "mobil" && perf.lcp > 2500) ekle("S14", "bilgi", `Mobilde ana içerik ${(perf.lcp / 1000).toFixed(1)} sn'de görünüyor (hedef ≤ 2,5 sn)`);
  }
  const agirlik = [...performance.getEntriesByType("navigation"), ...performance.getEntriesByType("resource")].reduce((n, e) => n + (e.transferSize || 0), 0);
  if (mod === "mobil" && agirlik > 3 * 1024 * 1024) ekle("S14", "bilgi", `Sayfa ${(agirlik / 1048576).toFixed(1)} MB indiriyor: mobil veride yavaş ve pahalı. Görselleri sıkıştır, gereksiz betiği at`);

  // ---------- S17: Renk anlamı ters ----------
  const dolgu = (e) => { const z = rgb(getComputedStyle(e).backgroundColor); return z && z.a >= 0.6 && doygunluk(z) > 0.3 ? z : null; };
  const renkCeliski = [];
  for (const b of butonlar) {
    const m = ad(b), z = dolgu(b), h = z && ton(z);
    if (h == null || !m) continue;
    if (h >= 85 && h <= 165 && listede(sozluk.iptal, m)) renkCeliski.push(`${tanim(b)} yeşil`);
    else if ((h <= 15 || h >= 345) && listede(sozluk.onay, m)) renkCeliski.push(`${tanim(b)} kırmızı`);
  }
  if (renkCeliski.length) ekle("S17", "uyari", "Buton rengi anlamıyla çelişiyor (yeşil iptal/sil ya da kırmızı onay/kaydet): kullanıcı renge bakıp yanlış seçer", renkCeliski);

  // ---------- S19: Kayıt numarası ad yerine ----------
  const kayitNo = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6, a[href]")].filter((e) => gorunur(e) && /(^|\s)#\d{3,}(\s|$)/.test(e.innerText));
  if (kayitNo.length) ekle("S19", "bilgi", `Başlıkta ya da bağlantıda kayıt numarası (${kayitNo.length}): numara yerine kaydın adını göster`, kayitNo.map(tanim));

  // ---------- S05: Projenin terim sözlüğü (erisim/terimler.json → kullanma) ----------
  const yasakTerim = Object.entries(sozluk.terimler?.kullanma || {});
  const bulunanTerim = [];
  for (const [yanlis, dogru] of yasakTerim) {
    const d = new RegExp(`(^|[^\\p{L}])${yanlis.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\p{L}]|$)`, "iu");
    const yer = yaprakMetin.find((x) => !x.el.closest("code, pre") && d.test(x.t));
    if (yer) bulunanTerim.push(`"${yanlis}" yerine "${dogru}" → ${tanim(yer.el)}`);
  }
  if (bulunanTerim.length) ekle("S05", "uyari", `Projenin terim sözlüğünde kullanılmaması istenen kelime geçiyor (${bulunanTerim.length})`, bulunanTerim);

  // ---------- K06: Arama kutusunun adı "arama" olsun ----------
  const aramaAlani = alanlar.filter((g) => g.type === "search" || g.closest("[role=search], search") || /^(q|s|search|ara|arama|query)$/i.test(g.name || ""));
  const susluArama = [];
  for (const g of aramaAlani) {
    const kap = g.closest("form, [role=search], search") || g.parentElement;
    const metinler = [g.getAttribute("placeholder"), g.getAttribute("aria-label"), ...[...(g.labels || [])].map((l) => l.innerText),
      ...[...(kap?.querySelectorAll("button, input[type=submit]") || [])].map((b) => b.innerText || b.value)].map(kucuk).filter(Boolean);
    const s = metinler.find((m) => sozluk.arama_suslu.some((k) => m.includes(k)));
    if (s) susluArama.push(`"${s}" → ${tanim(g)}`);
  }
  if (susluArama.length) ekle("K06", "bilgi", "Arama kutusu süslü adla anılıyor: kullanıcı \"Ara\" kelimesini ve büyüteci arar", susluArama);

  // ---------- K10: Yardıma ulaşma (sayfalar arası kıyas için işaret + iletişim formu yükü) ----------
  const yardimVar = [...document.querySelectorAll("a[href], button")].some((a) => {
    if (/^(mailto|tel):/i.test(a.getAttribute("href") || "")) return true;
    const m = kucuk(`${a.innerText || ""} ${a.getAttribute("aria-label") || ""}`);
    let yol = "";
    try { yol = a.href ? decodeURIComponent(new URL(a.href).pathname).toLowerCase() : ""; } catch { /* geçersiz adres */ }
    return sozluk.yardim.some((k) => m.includes(k)) || sozluk.yardim_yol.some((k) => yol.includes(k));
  }) || !!document.querySelector("iframe[src*='intercom'], iframe[src*='crisp'], iframe[src*='tawk'], iframe[src*='zendesk'], [id*=intercom], [class*=crisp-client]");
  for (const f of document.querySelectorAll("form")) {
    if (!gorunur(f)) continue;
    const baglam = kucuk([f.id, String(f.className), f.getAttribute("action") || "", f.getAttribute("aria-label") || "",
      f.querySelector("h1, h2, h3, legend")?.innerText || "", f.previousElementSibling?.innerText?.slice(0, 80) || "", h1ler[0]?.innerText || ""].join(" "));
    if (!/iletişim|iletisim|contact|geri bildirim|feedback|destek|support|bize (yazın|ulaşın)|mesaj gönder/.test(baglam)) continue;
    const zorunlu = [...f.querySelectorAll("input, select, textarea")].filter((g) => gorunur(g) && (g.required || g.getAttribute("aria-required") === "true"));
    if (zorunlu.length > 3) ekle("K10", "uyari", `İletişim/geri bildirim formunda ${zorunlu.length} zorunlu alan: takılan kişiden önce bilgi istiyorsun. En çok 3 (ör. e-posta ve mesaj)`, [tanim(f)]);
  }

  // ---------- Sayfalar arası kıyas için ham veri ----------
  const linkler = etkilesimli.filter((e) => e.matches("a[href]")).map((a) => ({
    href: a.href.split("#")[0], metin: ad(a) || erisimAdi(a), navda: !!a.closest("nav, header, [role=navigation]"),
  })).filter((l) => l.metin && l.href.startsWith(location.origin));

  return {
    url: location.href, baslik, dil, h1: h1ler.map((h) => h.innerText.trim()), linkler, bulgular,
    metrik: { ilkEkranEtkilesim: ilkEtk.length, ilkEkranKelime: ilkKelime, okunabilirlik, cumle: cumleler.length, birincilButon: dolgulu.length,
      yardim: yardimVar, cls: perf ? Math.round(perf.cls * 1000) / 1000 : null, lcp: perf?.lcp ? Math.round(perf.lcp) : null, agirlikKB: Math.round(agirlik / 1024) },
  };
}
