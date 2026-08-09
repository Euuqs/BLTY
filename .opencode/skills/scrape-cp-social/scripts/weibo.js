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

  const uid = process.argv[2];
  const api = `https://m.weibo.cn/api/container/getIndex?type=uid&value=${uid}&containerid=107603${uid}`;
  await send('Page.navigate', { url: api });
  await sleep(5000);
  const body = await evaljs('document.body.innerText');
  try {
    const j = JSON.parse(body);
    const cards = (j.data && j.data.cards || []).filter(c => c.card_type === 9);
    const out = cards.map(c => {
      const m = c.mblog;
      const raw = (m.text || '').replace(/<br[^>]*>/g, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();
      return {
        id: m.id,
        bid: m.bid,
        created: m.created_at,
        text: raw.slice(0, 300),
        hasPics: (m.pics || []).length,
        retweeted: m.retweeted_status ? true : false,
        link: m.scheme ? m.scheme.split('?')[0] : ''
      };
    });
    console.log(JSON.stringify(out, null, 1));
  } catch (e) {
    console.log('PARSE ERROR', e.message, body.slice(0, 500));
  }
  ws.close();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
