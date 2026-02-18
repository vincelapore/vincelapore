const handleAnimateWorks = () => {
  const tl = gsap.timeline({
    defaults: { ease: Power1.easeInOut, duration: 0.9 },
    delay: 0.85,
  });
  const mainTitle = document.querySelectorAll(
    ".content__title-active span.char"
  );
  const subTitle = document.querySelectorAll(".content__item span.char");
  const masks = gsap.utils.toArray(".slide__mask");
  const masks2 = gsap.utils.toArray(".slide__mask2");
  const images = gsap.utils.toArray(".slide__bg img");
  ScrollTrigger.matchMedia({
    // desktop
    "(min-width: 1025px)": function () {
      tl.from([mainTitle], 0.8, { yPercent: 120, stagger: { amount: 0.2 } })
        .from(
          [subTitle],
          0.8,
          { yPercent: 105, stagger: { amount: 0.2 } },
          "<="
        )
        .to(masks, { height: "0%", stagger: { each: 0.13 } }, "-=1")
        .to(masks2, { height: "0%", stagger: { each: 0.13 } }, "<=30%")
        .from(
          [images],
          1.2,
          { scale: 1.1, rotate: "2deg", stagger: { each: 0.1 } },
          "<="
        );
    },
  });
};

export default handleAnimateWorks;
