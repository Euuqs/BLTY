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

  const vid = process.argv[2];
  await send('Page.navigate', { url: `https://www.douyin.com/video/${vid}` });
  await sleep(9000);
  const info = await evaljs(`(() => {
    const body = document.body.innerText.replace(/\\n+/g, ' ');
    const pm = body.match(/发布时间：([0-9-]+ [0-9:]+)/);
    const seg = body.split('连播')[1] || '';
    const m = seg.match(/^\\s*(.*?)\\s*(\\d+(?:\\.\\d+)?万?)\\s+(\\d+)\\s+(\\d+)\\s+(\\d+)\\s*举报/);
    const author = (body.match(/(\\S+)\\s*粉丝[0-9.]+万/) || [])[1] || '';
    return { pubTime: pm ? pm[1] : '', desc: m ? m[1] : '', digg: m ? m[2] : '', author };
  })()`);
  console.log(JSON.stringify({ vid, ...info }));
  ws.close();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
