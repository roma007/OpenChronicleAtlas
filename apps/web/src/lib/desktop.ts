import { openUrl } from '@tauri-apps/plugin-opener';

/**
 * 桌面端外链交给系统浏览器，避免 Tauri WebView 直接跳走。
 * 仅拦截 `target="_blank"` 的 http(s) 链接，站内路由不受影响。
 */
export function installDesktopLinkHandler(): void {
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;

    const target = event.target;
    if (!(target instanceof Element)) return;

    const anchor = target.closest('a');
    if (!anchor || anchor.target !== '_blank') return;

    const href = anchor.getAttribute('href');
    if (!href || !/^https?:\/\//i.test(href)) return;

    event.preventDefault();
    void openUrl(href);
  });
}
