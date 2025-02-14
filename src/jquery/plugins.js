/** @format */

$(() => {
  // ! Animation For All Buttons
  $(".default-btn, .default-btn-one, .default-btn-two")
    .on("mouseenter", function (e) {
      var parentOffset = $(this).offset(),
        relX = e.pageX - parentOffset.left,
        relY = e.pageY - parentOffset.top;
      $(this).find("span").css({ top: relY, left: relX });
    })
    .on("mouseout", function (e) {
      var parentOffset = $(this).offset(),
        relX = e.pageX - parentOffset.left,
        relY = e.pageY - parentOffset.top;
      $(this).find("span").css({ top: relY, left: relX });
    });

  // ! For A Portfolio Images
  var portfolioIsotope = $(".protfolio-container").isotope({
    itemSelector: ".data",
  });
  $(".portfolio .buttons button").on("click", function () {
    $(".portfolio .buttons button").removeClass("active");
    $(this).addClass("active");
    portfolioIsotope.isotope({
      filter: $(this).data("filter"),
    });
  });

  // !Start A WOW Plugins
  new WOW().init();

  // !Preloader Area
  $(".preloader").addClass("preloader-deactivate");

  // !Start A VanillaTilt Plugins
  VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
    max: 25,
    speed: 400,
    scale: 1.1,
  });

  // !FAQ Setion Initially hide all answers except the first one
  $(".faq-answer").not(":first").slideUp();
  $(".faq-question").on("click", function () {
    $(".faq-question").removeClass("active");
    $(this).addClass("active");
    $(this).find("svg").toggleClass("fa-plus fa-minus");
    $(this).next(".faq-answer").slideToggle(500);
    $(".faq-answer").not($(this).next()).slideUp(500);
    $(".faq-question")
      .not($(this))
      .find("svg")
      .removeClass("fa-minus")
      .addClass("fa-plus");
  });

  // !Global error handler
  $(window).on("error", () => {
    window.location.href = "error.html";
  });

  // ! An Animation For Landing 3
  if ($("#particles-js").length) {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 100,
          density: {
            enable: true,
            value_area: 600,
          },
        },
        color: {
          value: "#ffffff",
        },
        shape: {
          type: "polygon",
          polygon: {
            sides: 5,
          },
        },
        opacity: {
          value: 0.5,
        },
        size: {
          value: 3,
          random: true,
        },
        move: {
          enable: true,
          speed: 7,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
        line_linked: {
          enable: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: false,
          },
          onclick: {
            enable: false,
          },
          resize: true,
        },
      },
      retina_detect: true,
    });
  }

  // ! A Swiper Function To Landing 4
  var wind = $(window);
  var parallaxSlider;
  var parallaxSliderOptions = {
    speed: 1500,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    parallax: true,
    loop: true,

    on: {
      init: function () {
        var swiper = this;
        for (var i = 0; i < swiper.slides.length; i++) {
          $(swiper.slides[i])
            .find(".bg-img")
            .attr({
              "data-swiper-parallax": 0.75 * swiper.width,
            });
        }
      },
      resize: function () {
        this.update();
      },
    },

    pagination: {
      el: ".slider-prlx .parallax-slider .swiper-pagination",
      dynamicBullets: true,
      clickable: true,
    },

    navigation: {
      nextEl: ".slider-prlx .parallax-slider .next-ctrl",
      prevEl: ".slider-prlx .parallax-slider .prev-ctrl",
    },
  };

  parallaxSlider = new Swiper(
    ".slider-prlx .parallax-slider",
    parallaxSliderOptions
  );
});

// !A Swiper Function To Clients
$(".testimonial-slider").owlCarousel({
  loop: true,
  nav: true,
  dots: true,
  autoplayHoverPause: true,
  autoplay: true,
  smartSpeed: 1000,
  margin: 20,
  navText: [
    "<i class='fa fa-chevron-left'></i>",
    "<i class='fa fa-chevron-right'></i>",
  ],
  responsive: {
    0: {
      items: 1,
    },
    768: {
      items: 2,
    },
    1200: {
      items: 3,
    },
  },
});
