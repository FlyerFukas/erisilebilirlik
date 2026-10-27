export function Form({ satirlar }: { satirlar: string[] }) {
  return (
    <form>
      <input type="hidden" name="satirlar" value={JSON.stringify(satirlar)} />
      <input type="search" aria-label="Burslarda ara" autoComplete="off" />
      <button type="button" onClick={() => {}} aria-label="Erasmus+: ayrıntıyı aç">Seç</button>
    </form>
  );
}
