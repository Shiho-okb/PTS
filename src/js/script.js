
jQuery(function ($) {

  /* ===== ページトップボタン ===== */
  var topBtn = $('.js-pagetop');
  topBtn.hide();

  // ページトップボタンの表示設定
  $(window).scroll(function () {
    if ($(this).scrollTop() > 70) {
      // 指定px以上のスクロールでボタンを表示
      topBtn.fadeIn();
    } else {
      // 画面が指定pxより上ならボタンを非表示
      topBtn.fadeOut();
    }
  });

  // ページトップボタンをクリックしたらスクロールして上に戻る
  topBtn.click(function () {
    $('body,html').animate({
      scrollTop: 0
    }, 300, 'swing');
    return false;
  });


  /* ===== スムーススクロール (絶対パスのリンク先が現在のページであった場合でも作動。ヘッダーの高さ考慮。) ===== */
  $(document).on('click', 'a[href*="#"]', function () {
    let time = 400;
    let header = $('header').innerHeight();
    let target = $(this.hash);
    if (!target.length) return;
    let targetY = target.offset().top - header;
    $('html,body').animate({ scrollTop: targetY }, time, 'swing');
    return false;
  });


  /* ===== ハンバーガーメニュー ===== */
  $('.js-hamburger').on('click', function (e) {
    e.stopPropagation();
    $(this).toggleClass('is-active');
    $("body").toggleClass("active");
    $('.js-drawer').fadeToggle();
  });

  // ハンバーガーメニュー内リンク
  let isSp = window.matchMedia('(max-width: 767px)').matches;

  $('.p-header-nav-item__link[href], .p-header-dropmenu__link').on('click', function () {
    // pc時は処理をしせず終了
    if (!isSp) return;

    $('.js-hamburger').toggleClass('is-active');
    $('body').toggleClass('active');
    $('.js-drawer').fadeToggle();
  });

  // リサイズした際に、isSpを更新する
  window.addEventListener('resize', function () {
    isSp = window.matchMedia('(max-width: 767px)').matches;
  });


  /* ===== アコーディオン ===== */
  $(function () {
    // ヘッダーアコーディオン
    $(".js-accordion").on("click", function () {
      const $target = $(this).closest(".p-header-nav-item").find(".p-header-dropmenu");
      $target.stop(true, true).slideToggle(300).toggleClass("is-open");
      $(this).toggleClass("open");
    });

    // フッターアコーディオン
    $(".js-footer-accordion").on("click", function () {
      const $target = $(this).closest(".p-footer-nav-item").find(".p-footer-dropmenu");
      $target.stop(true, true).slideToggle(300).toggleClass("is-open");
      $(this).toggleClass("open");
    });
  });


  /* ===== フェードイン ===== */
  $(function () {
    function checkFadeIn() {
      const wHeight = $(window).height();
      const wScroll = $(window).scrollTop();

      // 通常フェードイン
      const targets = [
        ".js-title"
      ].join(", ");
      $(targets).each(function () {
        const bPosition = $(this).offset().top;

        if (wScroll > bPosition - wHeight + 200) {
          if ($(this).hasClass("js-mainvisual__title")) {
            $(this).addClass("u-fadeIn--title");
          } else {
            $(this).addClass("u-fadeIn");
          }
        }
      });

      // 追従ボタン用
      const fixedBtn = $(".js-fixed");
      const footer = $(".js-footer");

      if (!footer.length) return;
      const footerTop = footer.offset().top;
      const fixedBtnHeight = fixedBtn.outerHeight();
      const windowBottom = wScroll + wHeight;

      // 表示条件
      if (wScroll > 100 && windowBottom < footerTop + fixedBtnHeight) {
        fixedBtn.addClass("is-show");
      } else {
        fixedBtn.removeClass("is-show");
      }
    }

    // 初期表示
    $(window).on("scroll", checkFadeIn);
    checkFadeIn();
  });


  /* ===== スワイパー ===== */
  const swiper = new Swiper(".swiper", {
    loop: true,
    slidesPerView: "1.7",
    speed: 6000,
    spaceBetween: 20,
    allowTouchMove: false,
    // autoplay: {
    //   delay: 0,
    //   disableOnInteraction: false,
    // },

    // レスポンシブ設定
    breakpoints: {
      768: {
        slidesPerView: 5.69,
        spaceBetween: 28,
      },
    },
  });

});
