const express = require('express'), http = require('http'), path = require('path'), { Server } = require('socket.io');
const app = express(), srv = http.createServer(app), io = new Server(srv, { cors: { origin: '*' } });
app.use(express.static(path.join(__dirname, 'public')));
const ADMINS = (process.env.ADMINS || 'tarek,bucket_birb11').toLowerCase().split(',').map(s => s.trim());
const KEY = process.env.ADMIN_PASSWORD || '';
const players = {}, cars = Array.from({ length: 15 }, () => ({ dv: null, col: null, s: null }));
const n = v => (Number.isFinite(v) ? v : 0);
const free = id => cars.forEach((c, i) => { if (c.dv === id) { c.dv = null; io.emit('drv', { i, id: null }); } });

io.on('connection', s => {
  const me = () => players[s.id];
  const admin = fn => (...a) => { if (s.data.admin) fn(...a); };   // every admin action is checked here, on the server
  s.on('join', ({ name, key } = {}, ack) => {
    if (typeof ack !== 'function' || me()) return;
    name = String(name || '').trim();
    if (!/^\w{2,16}$/.test(name)) return ack({ err: 'Use 2-16 letters, numbers or _' });
    const low = name.toLowerCase();
    if (Object.values(players).some(p => p.name.toLowerCase() === low)) return ack({ err: 'That name is already online' });
    const isAdmin = ADMINS.includes(low);
    if (isAdmin && KEY && key !== KEY) return ack({ err: 'Wrong admin password' });
    s.data.admin = isAdmin;
    players[s.id] = { id: s.id, name, admin: isAdmin, x: 0, y: 0, z: 6, f: Math.PI, a: 'idle', c: -1 };
    ack({ id: s.id, admin: isAdmin, players: Object.values(players).filter(p => p.id !== s.id), cars });
    s.broadcast.emit('pj', players[s.id]);
  });
  s.on('ps', d => {
    const p = me(); if (!p || !d) return;
    Object.assign(p, { x: n(d.x), y: n(d.y), z: n(d.z), f: n(d.f), a: String(d.a || 'idle').slice(0, 30), c: Math.trunc(n(d.c)) });
    s.volatile.broadcast.emit('ps', { id: s.id, x: p.x, y: p.y, z: p.z, f: p.f, a: p.a, c: p.c });
  });
  s.on('cs', d => { const c = d && cars[d.i]; if (c && c.dv === s.id) { c.s = d; s.volatile.broadcast.emit('cs', d); } });
  s.on('enter', (i, ack) => {
    const c = cars[i], ok = !!(me() && c && !c.dv);
    if (ok) { free(s.id); c.dv = s.id; io.emit('drv', { i, id: s.id }); }
    if (typeof ack === 'function') ack(ok);
  });
  s.on('exit', d => {
    const i = cars.findIndex(c => c.dv === s.id); if (i < 0) return;
    if (d && d.i === i) { cars[i].s = d; s.broadcast.emit('cs', d); }
    free(s.id);
  });
  s.on('paint', ({ i, col } = {}) => {
    if (!me() || !Number.isInteger(col) || col < 0 || col > 0xffffff) return;
    if (i === -1) { if (!s.data.admin) return; cars.forEach(c => (c.col = col)); }
    else if (cars[i]) cars[i].col = col; else return;
    s.broadcast.emit('paint', { i, col });
  });
  s.on('cr', d => { if (me() && d && Number.isFinite(d.e)) s.broadcast.emit('cr', d); });
  s.on('rep', i => { if (me() && Number.isInteger(i)) s.broadcast.emit('rep', i); });
  s.on('a:kick', admin(id => { const t = io.sockets.sockets.get(id); if (t && t.id !== s.id) { t.emit('kicked'); t.disconnect(true); } }));
  s.on('a:tp', admin(({ id, x, z } = {}) => { const t = io.sockets.sockets.get(id); if (t) t.emit('tp', { x: n(x), z: n(z) }); }));
  s.on('a:say', admin(t => io.emit('say', String(t).slice(0, 140))));
  s.on('a:reset', admin(() => { cars.forEach(c => { c.dv = null; c.s = null; }); io.emit('resetcars'); }));
  s.on('disconnect', () => { free(s.id); if (me()) { delete players[s.id]; io.emit('pq', s.id); } });
});
srv.listen(process.env.PORT || 3000, '0.0.0.0', () => console.log('testphysics running on port ' + (process.env.PORT || 3000)));
