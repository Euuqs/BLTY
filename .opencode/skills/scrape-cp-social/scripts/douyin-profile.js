const http = require('http');
function get(path) {
  return new Promise((resolve, reject) => {
    http.get({ host: 'localhost', port: 9229, path }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
(async () => {
  const tabs = await get('/json/list');
  const pages = tabs.filter(t => t.type === 'page');
  const ws = new WebSocket(pages[0].webSocketDebuggerUrl);
  let id = 0;
  const pending = {};
  const send = (method, params) => new Promise((res) => {
    const mid = ++id;
    pending[mid] = res;
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending[m.id]) { pending[m.id](m.result); delete pending[m.id]; } };
  await new Promise((r) => (ws.onopen = r));
  await send('Page.enable');
  await send('Runtime.enable');
  const evaljs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;

  const secUid = process.argv[2];
  await send('Page.navigate', { url: `https://www.douyin.com/user/${secUid}` });
  await sleep(10000);
  for (let i = 0; i < 5; i++) {
    await evaljs('window.scrollTo(0, document.body.scrollHeight)');
    await sleep(1500);
  }
  const dom = await evaljs(`(() => {
    const cards = [...document.querySelectorAll('a[href*="/video/"]')].map(a => ({
      href: a.href,
      title: (a.title || a.getAttribute('aria-label') || '').slice(0, 80)
    })).filter((v,i,arr) => arr.findIndex(x => x.href === v.href) === i);
    return cards.slice(0, 30);
  })()`);
  console.log('DOM cards:', JSON.stringify(dom, null, 1).slice(0, 3000));
  ws.close();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
