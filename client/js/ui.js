/* Utilidades de interfaz sin dependencias. */

export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

export function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }

export function mount(node, ...children) {
  clear(node);
  for (const c of children.flat()) if (c != null && c !== false) node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  return node;
}

/* ---- markdown ligero (negrita, codigo, listas, parrafos) ---- */
export function mdLite(src) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lines = String(src || '').split('\n');
  let out = '';
  let inList = false;
  const inline = (s) => esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^\s*[-*]\s+/.test(line)) {
      if (!inList) { out += '<ul>'; inList = true; }
      out += `<li>${inline(line.replace(/^\s*[-*]\s+/, ''))}</li>`;
    } else {
      if (inList) { out += '</ul>'; inList = false; }
      if (line.trim()) out += `<p>${inline(line)}</p>`;
    }
  }
  if (inList) out += '</ul>';
  return out;
}

/* ---- toast ---- */
let toastHost;
export function toast(msg, kind = '') {
  if (!toastHost) {
    toastHost = h('div', { class: 'toast-host' });
    document.body.append(toastHost);
  }
  const t = h('div', { class: `toast ${kind}` }, msg);
  toastHost.append(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; }, 2200);
  setTimeout(() => t.remove(), 2600);
}

/* ---- anillo de progreso (SVG) ---- */
export function ring(pct, label, sublabel) {
  const p = Math.max(0, Math.min(1, pct || 0));
  const r = 42, c = 2 * Math.PI * r;
  const wrap = h('div', { class: 'ring' });
  wrap.innerHTML = `
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r="${r}" fill="none" stroke="var(--bg-elev-2)" stroke-width="8"/>
      <circle cx="48" cy="48" r="${r}" fill="none" stroke="var(--accent)" stroke-width="8"
        stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}"/>
    </svg>
    <div class="val"><b>${label}</b><span>${sublabel || ''}</span></div>`;
  return wrap;
}

/* ---- barra ---- */
export function bar(pct, cls = '') {
  const b = h('div', { class: `bar ${cls}` });
  b.append(h('i', { style: { width: `${Math.max(0, Math.min(1, pct || 0)) * 100}%` } }));
  return b;
}

/* ---- dialogo de confirmacion ---- */
export function confirmDialog({ title, message, confirmText = 'Aceptar', danger = false }) {
  return new Promise((resolve) => {
    const back = h('div', { class: 'drawer-back', style: { justifyContent: 'center', alignItems: 'center' } });
    const box = h('div', { class: 'card', style: { maxWidth: '360px', margin: '0 16px' } },
      h('h3', {}, title),
      message ? h('p', { class: 'muted small' }, message) : null,
      h('div', { class: 'row', style: { marginTop: '16px', justifyContent: 'flex-end' } },
        h('button', { class: 'btn ghost', onclick: () => { back.remove(); resolve(false); } }, 'Cancelar'),
        h('button', { class: `btn ${danger ? 'danger' : 'primary'}`, onclick: () => { back.remove(); resolve(true); } }, confirmText),
      ),
    );
    back.append(box);
    back.addEventListener('click', (e) => { if (e.target === back) { back.remove(); resolve(false); } });
    document.body.append(back);
  });
}

export function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso.replace(' ', 'T') + (iso.includes('Z') ? '' : 'Z'));
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

export function relTime(iso) {
  if (!iso) return '';
  const then = new Date(iso.replace(' ', 'T') + 'Z').getTime();
  const diff = then - Date.now();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'ahora';
  if (min < 60) return `en ${min} min`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `en ${hr} h`;
  const d = Math.round(hr / 24);
  return `en ${d} d`;
}

export const DIFF_LABEL = ['', 'muy accesible', 'accesible', 'exigente', 'dificil', 'muy dificil'];
