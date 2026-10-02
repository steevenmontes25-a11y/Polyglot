import { h, mount, toast } from '../ui.js';
import { api, ApiError } from '../api.js';
import { store } from '../store.js';
import { screen } from '../app.js';
import { navigate } from '../router.js';

export function renderAuth() {
  let mode = 'login'; // 'login' | 'register'
  const wrap = h('div', { class: 'auth-wrap' });

  function build() {
    const errSlot = h('div');
    const email = h('input', { class: 'input', type: 'email', autocomplete: 'email', placeholder: 'tu@correo.com' });
    const pass = h('input', { class: 'input', type: 'password', autocomplete: mode === 'login' ? 'current-password' : 'new-password', placeholder: '········' });
    const name = h('input', { class: 'input', type: 'text', placeholder: 'Como quieres que te llamemos' });

    const submit = h('button', { class: 'btn primary block lg', type: 'submit' },
      mode === 'login' ? 'Entrar' : 'Crear cuenta');

    const form = h('form', {
      onsubmit: async (e) => {
        e.preventDefault();
        mount(errSlot);
        submit.disabled = true;
        submit.textContent = 'Un momento…';
        try {
          const path = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
          const body = mode === 'login'
            ? { email: email.value.trim(), password: pass.value }
            : { email: email.value.trim(), password: pass.value, displayName: name.value.trim() };
          const r = await api.post(path, body);
          store.setSession(r.token, r.user);
          toast(mode === 'login' ? `Hola de nuevo, ${r.user.displayName}` : '¡Cuenta creada!', 'ok');
          navigate('/');
        } catch (err) {
          const msg = err instanceof ApiError ? err.message : 'Algo ha fallado';
          mount(errSlot, h('div', { class: 'err' }, msg));
          submit.disabled = false;
          submit.textContent = mode === 'login' ? 'Entrar' : 'Crear cuenta';
        }
      },
    },
      errSlot,
      mode === 'register' ? h('label', { class: 'field' }, h('span', {}, 'Nombre'), name) : null,
      h('label', { class: 'field' }, h('span', {}, 'Correo electronico'), email),
      h('label', { class: 'field' }, h('span', {}, 'Contrasena'),
        pass,
        mode === 'register' ? h('span', { class: 'tiny faint', style: { marginTop: '4px' } }, 'Minimo 8 caracteres') : null),
      submit,
    );

    mount(wrap,
      h('div', { class: 'logo' }, '🌍'),
      h('h1', {}, 'Polyglot'),
      h('p', { class: 'sub' }, 'Aprende 15 idiomas con repeticion espaciada, de A1 a nivel profesional.'),
      h('div', { class: 'card' },
        form,
        h('div', { class: 'auth-toggle' },
          mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? ',
          h('button', { type: 'button', onclick: () => { mode = mode === 'login' ? 'register' : 'login'; build(); } },
            mode === 'login' ? 'Registrate' : 'Inicia sesion'),
        ),
      ),
      h('p', { class: 'tiny faint center', style: { marginTop: '18px' } },
        'Tus datos se guardan solo en este servidor local.'),
    );
    setTimeout(() => email.focus(), 30);
  }

  build();
  screen(wrap, { chrome: false });
}
