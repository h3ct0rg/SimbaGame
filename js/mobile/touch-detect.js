export function isMobileLayout() {
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.innerWidth <= 900;
  return hasTouch && (coarsePointer || narrow);
}

export function watchMobileLayout(onChange) {
  const update = () => {
    document.body.classList.toggle('mobile-controls-active', isMobileLayout());
    onChange(isMobileLayout());
  };
  window.addEventListener('resize', update);
  window.addEventListener('orientationchange', update);
  update();
}
