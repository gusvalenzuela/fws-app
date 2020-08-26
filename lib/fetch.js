export async function fetcher(url) {
  const r = await fetch(url);
  return await r.json();
}
