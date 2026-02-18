const handleAnimatePlayground = () => {
  const mansonryContainer = document.querySelector(".playground-list");
  if (typeof mansonryContainer != "undefined" && mansonryContainer != null) {
    const msnry = new Masonry(mansonryContainer, {
      itemSelector: ".playground-item",
      columnWidth: ".playground-item",
      percentPosition: true,
    });

    imagesLoaded(mansonryContainer).on("progress", function () {
      // layout Masonry after each image loads
      msnry.layout();
    });
  }
  ScrollTrigger.matchMedia({
    // desktop
    "(min-width: 1025px)": function () {
      const tl = gsap.timeline({
        delay: 0.85,
        defaults: { ease: Power1.easeInOut, duration: 0.8 },
      });

      tl.from(".playground-title span.char", {
        yPercent: 110,
        stagger: { amount: 0.4 },
      })
        .from(
          ".playground-sub span.char",
          { yPercent: 110, stagger: { amount: 0.23 } },
          "<=60%"
        )
        .from(".playground-desc", { opacity: 0 }, "<=50%");
      const getAllItems = gsap.utils.toArray(".playground-item");
      getAllItems.forEach((item) => {
        const mask = item.querySelector(".playground-mask");
        const text = item.querySelectorAll(".playground-info__animate > span");
        const img = item.querySelector(".playground-image img");
        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 100%",
            end: "bottom bottom",
          },
        });
        tl2
          .to(mask, { duration: 1, height: "0%" })
          .from(
            img,
            1.3,
            { scale: 1.1, rotate: "2deg", ease: Power1.easeInOut },
            "<=20%"
          )
          .from(text, 0.6, { yPercent: 110, ease: Power1.easeInOut }, "<=60%");
      });
    },
  });
};

export default handleAnimatePlayground;
