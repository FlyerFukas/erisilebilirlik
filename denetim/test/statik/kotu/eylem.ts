export async function kisiEkle(db: any) {
  const { error } = await db.insert({});
  if (error) return { hata: `Eklenemedi: ${error.message}` };
  return { tamam: true };
}
