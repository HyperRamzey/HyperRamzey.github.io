/** Splits .dancing-text elements into per-character spans with random drift offsets. */
export function applyDancingText(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.dancing-text').forEach((el) => {
    if (el.dataset.danced === '1') return;
    el.dataset.danced = '1';
    const text = el.textContent ?? '';
    el.textContent = '';
    for (const ch of text) {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? ' ' : ch;
      for (let i = 1; i <= 3; i++) {
        span.style.setProperty(`--dx${i}`, `${((Math.random() - 0.5) * 4).toFixed(2)}px`);
        span.style.setProperty(`--dy${i}`, `${((Math.random() - 0.5) * 4).toFixed(2)}px`);
      }
      span.style.animationDelay = `${(Math.random() * 2).toFixed(2)}s`;
      el.appendChild(span);
    }
  });
}
