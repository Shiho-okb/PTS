
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


  /* ===== フェードイン ===== */
  $(function () {
    function checkFadeIn() {
      const wHeight = $(window).height();
      const wScroll = $(window).scrollTop();

      // 通常フェードイン
      const targets = [
        ".js-title",
        ".js-head__left",
        ".js-head__right",
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

      // ①メインビジュアルボタン（初期表示 → スクロールで消える + ドロワー時非表示）
      const mvBtn = $(".js-mainvisual-btn");

      if (mvBtn.length) {
        // ハンバーガー開いてたら常に非表示
        if ($("body").hasClass("active")) {
          mvBtn.addClass("is-hide");
        } else {

          if (wScroll > 80) {
            mvBtn.addClass("is-hide");
          } else {
            mvBtn.removeClass("is-hide");
          }
        }
      }

      // ②追従ボタン（スクロールで表示 → フッター前で消える）
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

      // ③ヘッダー制御（メインビジュアル越えたら背景表示 → フッター前で非表示）
      const header = $(".p-header");
      const mv = $(".p-mainvisual");

      if (mv.length) {
        const mvBottom = mv.offset().top + mv.outerHeight();

        // メインビジュアル越えたら白背景表示
        if (wScroll > mvBottom - 80) {
          header.addClass("is-scrolled");
        } else {
          header.removeClass("is-scrolled");
        }

        // フッター手前で非表示
        if (windowBottom > footerTop - 80) {
          header.addClass("is-hide");
        } else {
          header.removeClass("is-hide");
        }
      }
    }

    // 初期表示
    $(window).on("scroll", checkFadeIn);
    checkFadeIn();

    // ハンバーガー押した瞬間にも再判定
    $('.js-hamburger').on('click', checkFadeIn);
  });


  /* ===== スワイパー ===== */
  // 複製用
  var swiperWrapper = $('.swiper .swiper-wrapper');

  // 現在のスライドを取得
  var slideItems = swiperWrapper.children('.swiper-slide');

  // 1回だけ複製して末尾に追加
  slideItems.each(function() {
    var $clone = $(this).clone();
    swiperWrapper.append($clone);
  });

  const swiper = new Swiper(".swiper", {
    loop: true,
    slidesPerView: "auto",
    speed: 8000,
    spaceBetween: 20,
    allowTouchMove: false,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },

    // レスポンシブ設定
    breakpoints: {
      768: {
        spaceBetween: 28,
      },
    },
  });

  const swiperEl = document.querySelector(".swiper");
  let currentTranslate = 0;

  // ==========================
  // hoverで即停止
  // ==========================
  swiperEl.addEventListener("mouseenter", () => {
    currentTranslate = swiper.getTranslate();

    swiper.setTranslate(currentTranslate);
    swiper.setTransition(0);
  });

  // ==========================
  // hover解除で即再開（自然な速度）
  // ==========================
  swiperEl.addEventListener("mouseleave", () => {
    currentTranslate = swiper.getTranslate();

    const activeSlide = swiper.el.querySelector(".swiper-slide-active");

    const slideWidth = activeSlide.offsetWidth;

    const marginLeft = parseFloat(getComputedStyle(activeSlide).marginLeft) || 0;
    const marginRight = parseFloat(getComputedStyle(activeSlide).marginRight) || 0;

    // 1スライド分の全幅（マージン込み）を計算
    const totalSlideWidth = slideWidth + marginLeft + marginRight;

    // 次のスライド境界までの残り距離
    const remainingDistance =
      -totalSlideWidth - (currentTranslate % totalSlideWidth);

    // 距離割合を計算
    const ratio = Math.abs(remainingDistance / totalSlideWidth);

    // 残り距離に応じたtransition時間を設定
    const newDuration = swiper.params.speed * ratio;

    swiper.setTranslate(currentTranslate + remainingDistance);
    swiper.setTransition(newDuration);
  });
});
