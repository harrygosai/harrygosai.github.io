Main.js

// ---------- Gallery scrolling behavior ----------
    (function () {
      const strip = document.getElementById('galleryStrip');
      const prevBtn = document.getElementById('galleryPrev');
      const nextBtn = document.getElementById('galleryNext');

      // Determine scroll step = width of one column + gap
      function getScrollStep() {
        const firstCol = strip.querySelector('.gallery-column');
        if (!firstCol) return 300;
        const style = window.getComputedStyle(firstCol);
        const gap = parseInt(getComputedStyle(strip).gap || 18, 10) || 18;
        return Math.ceil(firstCol.getBoundingClientRect().width + gap);
      }

      prevBtn.addEventListener('click', () => {
        strip.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
      });

      nextBtn.addEventListener('click', () => {
        strip.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
      });

      // Enable drag to scroll (desktop + touch)
      let isDown = false;
      let startX;
      let scrollLeft;

      strip.addEventListener('mousedown', (e) => {
        isDown = true;
        strip.classList.add('active-drag');
        startX = e.pageX - strip.offsetLeft;
        scrollLeft = strip.scrollLeft;
        e.preventDefault();
      });

      strip.addEventListener('mouseleave', () => {
        isDown = false;
        strip.classList.remove('active-drag');
      });

      strip.addEventListener('mouseup', () => {
        isDown = false;
        strip.classList.remove('active-drag');
      });

      strip.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const x = e.pageX - strip.offsetLeft;
        const walk = (x - startX) * 1.4; // scroll-fast factor
        strip.scrollLeft = scrollLeft - walk;
      });

      // touch support
      let touchStartX = 0;
      let touchStartScroll = 0;
      strip.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].pageX;
          touchStartScroll = strip.scrollLeft;
        }
      }, { passive: true });

      strip.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
          const diff = e.touches[0].pageX - touchStartX;
          strip.scrollLeft = touchStartScroll - diff;
        }
      }, { passive: true });

      // keyboard support - left/right arrows when focused
      strip.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          strip.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
        } else if (e.key === 'ArrowRight') {
          strip.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
        }
      });

      // Optional: auto-play scroll (uncomment if wanted)
      /*
      let autoplayInterval = setInterval(() => {
        strip.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
      }, 4000);

      strip.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
      strip.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(() => {
          strip.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
        }, 4000);
      });
      */
    })();