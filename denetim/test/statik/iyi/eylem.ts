export async function hedefleriOku(db: any) {
  const { data, error } = await db.select();
  if (error) throw new Error(`Hedefler okunamadı: ${error.message}`);
  console.error(`ayrıntı: ${error?.message}`);
  return data;
}
