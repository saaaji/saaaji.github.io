const content = document.querySelector('.content');
const scrollIndicator = document.querySelector('.scroll-indicator');  
const cards = [...content.children]
  .filter(c => c.classList.contains('card'));

window.requestAnimationFrame(function updateScrollAccessibility() {
  const overflow = content.scrollHeight - content.clientHeight > 0;
  const canScroll = content.scrollTop < 0.95 * (content.scrollHeight - content.clientHeight);

  // console.log(Math.floor)

  if (canScroll) {
    scrollIndicator.classList.remove('hidden');
  } else {
    scrollIndicator.classList.add('hidden');
  }

  const previewCards = [];

  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top > 0.9 * window.innerHeight) {
      previewCards.push(card.children[0].textContent);
    }
  });

  const thresh = 30;
  let previewText = previewCards.join(', ');
  if (previewText.length > thresh) {
    previewText = previewText.substring(0, thresh) + '&#x2026;';
  }

  scrollIndicator.innerHTML = '&#x2193; ' + previewText;
  window.requestAnimationFrame(updateScrollAccessibility);
});