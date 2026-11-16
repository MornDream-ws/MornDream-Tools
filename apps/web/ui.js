const compact = matchMedia('(max-width: 960px)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let navigationOpen = false;
let previousView = '';

function applyNavigation() {
  const sidebar = document.querySelector('.sidebar');
  const main = document.querySelector('.shell > main, .shell > .recipe-main');
  const trigger = document.querySelector('[data-action="menu"]');
  const opened = compact.matches && navigationOpen;
  document.body.classList.toggle('nav-open', opened);
  sidebar?.classList.toggle('open', opened);
  if (sidebar) {
    sidebar.id = 'workspace-navigation';
    sidebar.inert = compact.matches && !opened;
    sidebar.setAttribute('aria-label', '工具导航');
  }
  if (main) main.inert = opened;
  if (trigger) {
    trigger.setAttribute('aria-expanded', String(opened));
    trigger.setAttribute('aria-controls', 'workspace-navigation');
    trigger.setAttribute('aria-label', opened ? '收起导航' : '展开导航');
  }
}

export function toggleNavigation(force) {
  navigationOpen = typeof force === 'boolean' ? force : !navigationOpen;
  applyNavigation();
  if (navigationOpen) document.querySelector('.sidebar input, .sidebar button')?.focus();
}

export function syncInterface() {
  if (!document.getElementById('navigation-scrim')) {
    const scrim = document.createElement('button');
    scrim.id = 'navigation-scrim';
    scrim.className = 'navigation-scrim';
    scrim.type = 'button';
    scrim.tabIndex = -1;
    scrim.setAttribute('aria-label', '关闭工具导航');
    scrim.onclick = () => toggleNavigation(false);
    document.body.append(scrim);
  }
  applyNavigation();
  for (const button of document.querySelectorAll('.mode-switch button')) {
    button.setAttribute('aria-current', button.classList.contains('active') ? 'page' : 'false');
  }
  const main = document.querySelector('.shell > main, .shell > .recipe-main');
  const view = document.querySelector('.mode-switch .active')?.textContent + ':' + main?.querySelector('h1')?.textContent;
  if (main && view !== previousView && !reducedMotion.matches) {
    main.animate([{opacity: .55, transform: 'translateY(5px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 170, easing: 'cubic-bezier(.2,.7,.2,1)'});
  }
  previousView = view;
}

document.addEventListener('click', event => {
  const element = event.target instanceof Element ? event.target.closest('[data-action]') : null;
  if (element && navigationOpen && !element.dataset.action.startsWith('menu')) toggleNavigation(false);
}, true);

document.addEventListener('keydown', event => {
  if (!navigationOpen || !compact.matches) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    toggleNavigation(false);
    document.querySelector('[data-action="menu"]')?.focus();
  }
  if (event.key === 'Tab') {
    const controls = [...document.querySelectorAll('.sidebar button, .sidebar input, .sidebar select, .sidebar a[href]')].filter(el => !el.disabled && el.getClientRects().length);
    if (!controls.length) return;
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {event.preventDefault(); last.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first.focus();}
  }
});
compact.addEventListener('change', () => {navigationOpen = false; applyNavigation();});
