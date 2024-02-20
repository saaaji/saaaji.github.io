const content = document.querySelector('.content');
const scrollIndicator = document.querySelector('.scroll-indicator');

window.requestAnimationFrame(function updateScrollAccessibility() {
  const overflow = content.scrollHeight - content.clientHeight > 0;
  const canScroll = Math.floor(content.scrollTop) < (content.scrollHeight - content.clientHeight);

  if (canScroll) {
    scrollIndicator.classList.remove('hidden');
  } else {
    scrollIndicator.classList.add('hidden');
  }

  window.requestAnimationFrame(updateScrollAccessibility);
});