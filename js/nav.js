// Custom Navigation for Python CP Slides
document.addEventListener('DOMContentLoaded', function() {
  const nav = document.createElement('div');
  nav.className = 'custom-nav';
  nav.innerHTML = `
    <a href="index.html" class="nav-btn nav-home" title="Về trang chủ khoá học">🏠</a>
    <div class="nav-group">
      <button class="nav-btn nav-first" title="Slide đầu tiên">«</button>
      <button class="nav-btn nav-prev" title="Slide trước">‹</button>
      <span class="nav-counter"></span>
      <button class="nav-btn nav-next" title="Slide tiếp">›</button>
      <button class="nav-btn nav-last" title="Slide cuối">»</button>
    </div>
  `;
  document.body.appendChild(nav);

  const counter = nav.querySelector('.nav-counter');
  function updateCounter() {
    const indices = Reveal.getIndices();
    const total = Reveal.getTotalSlides();
    const current = Array.from(document.querySelectorAll('.slides section:not([data-visibility="hidden"])')).indexOf(Reveal.getCurrentSlide()) + 1;
    counter.textContent = current + ' / ' + total;
  }

  nav.querySelector('.nav-first').addEventListener('click', () => Reveal.slide(0));
  nav.querySelector('.nav-prev').addEventListener('click', () => Reveal.prev());
  nav.querySelector('.nav-next').addEventListener('click', () => Reveal.next());
  nav.querySelector('.nav-last').addEventListener('click', () => {
    const total = Reveal.getTotalSlides();
    Reveal.slide(total - 1);
  });

  Reveal.on('slidechanged', updateCounter);
  Reveal.on('ready', updateCounter);
});
