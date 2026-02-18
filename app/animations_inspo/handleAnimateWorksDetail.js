const handleAnimateWorksDetail = () => {
  const contactLinksInner = document.querySelectorAll(
    ".info-text_animate span"
  );
  ScrollTrigger.matchMedia({
    // desktop
    "(min-width: 1025px)": function () {
      const initTL = gsap.timeline({
        defaults: { ease: Power1.easeInOut },
      });
      initTL
        .from([".project-one-line .char", ".project-two-line .char"], {
          yPercent: 150,
          ease: Power1.easeInOut,
          duration: 0.8,
          stagger: { amount: 0.25 },
        })
        .from(
          [contactLinksInner],
          0.8,
          { yPercent: 110, stagger: { each: 0.025 } },
          "<=20%"
        )
        .from(
          [".info-visit", ".project-cta__leave"],
          {
            autoAlpha: 0,
          },
          "<=100%"
        );
    },
  });
};

export default handleAnimateWorksDetail;
