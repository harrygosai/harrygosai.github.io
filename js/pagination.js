(function ($) {
  "use strict";

  // ---- PAGINATION & SORTING SCRIPT FOR RESCUE BLOG ----
  document.addEventListener("DOMContentLoaded", function () {
    const storiesContainer = document.querySelector(".container .row.g-4");
    const paginationContainer = document.getElementById("pagination");

    if (!storiesContainer || !paginationContainer) return;

    const perPage = 12;
    let currentPage = 1;
    const stories = Array.from(storiesContainer.children);

    // --- SORT STORIES BY DATE (latest first) ---
    stories.sort((a, b) => {
      const dateA = new Date(a.querySelector("p").textContent.match(/\b\w+ \d{1,2}, \d{4}/)?.[0] || 0);
      const dateB = new Date(b.querySelector("p").textContent.match(/\b\w+ \d{1,2}, \d{4}/)?.[0] || 0);
      return dateB - dateA;
    });

    const totalPages = Math.ceil(stories.length / perPage);

    // --- RENDER PAGE ---
    function renderPage(page) {
      storiesContainer.innerHTML = "";
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const pageStories = stories.slice(start, end);
      pageStories.forEach(story => storiesContainer.appendChild(story));

      // Update pagination active state
      document.querySelectorAll("#pagination .page-item").forEach(li => li.classList.remove("active"));
      const activeItem = paginationContainer.querySelector(`.page-item[data-page="${page}"]`);
      if (activeItem) activeItem.classList.add("active");

      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // --- RENDER PAGINATION (NUMBERS ONLY) ---
    function renderPagination() {
      paginationContainer.innerHTML = "";

      for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.className = "page-item" + (i === 1 ? " active" : "");
        li.dataset.page = i;

        const a = document.createElement("a");
        a.className = "page-link";
        a.href = "#";
        a.textContent = i;

        a.addEventListener("click", e => {
          e.preventDefault();
          currentPage = i;
          renderPage(currentPage);
        });

        li.appendChild(a);
        paginationContainer.appendChild(li);
      }
    }

    // --- INITIALIZE ---
    if (totalPages > 1) {
      renderPagination();
      renderPage(currentPage);
    }
  });



  // Initialize Owl carousel only once per selector
  function initOwlOnce(selector) {
    const $el = $(selector);
    if (!$el.data('owl-initialized')) {
      $el.owlCarousel({
        items: 1,
        loop: true,
        margin: 10,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        nav: true,
        dots: true,
        navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
        responsive: { 0: { items: 1 }, 768: { items: 1 } }
      });
      $el.data('owl-initialized', true);
    }
  }

  // get all cards from DOM so don't have to create list manually
  const ModelList = document.getElementsByClassName('only-for-js-list');

  // Loop through all elements
  for (let ModalJS of ModelList) {
    console.log((ModalJS.id).replace('story', '.owl'));
    $(`#${ModalJS.id}`).on('shown.bs.modal', function () {
      initOwlOnce((ModalJS.id).replace('story', '.owl'));
    });
  }

  // Pause videos / stop playback when modal closed (if iframes/videos are added later)
  $('.modal').on('hidden.bs.modal', function () {
    $(this).find('video').each(function () { this.pause(); });
    $(this).find('iframe').each(function () {
      const $f = $(this);
      const src = $f.attr('src');
      // If the iframe has a src, reset it to stop playback (uncomment to enable)
      // $f.attr('src', src);
    });
  });

})(jQuery);

