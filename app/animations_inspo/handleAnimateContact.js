const handleAnimateContact = () => {
  const contactTitleWords = document.querySelectorAll(
    ".contact-title span.char"
  );
  const contactLinksInner = document.querySelectorAll(".contact-mask__inner");
  const contactLinksOutter = document.querySelectorAll("a.contact-mask");
  const arrow = document.querySelectorAll(".contact-arrow img");
  const line = document.querySelectorAll(".contact-line");
  ScrollTrigger.matchMedia({
    "(min-width: 1025px)": function () {
      const tl = gsap.timeline({
        defaults: { ease: Power1.easeInOut },
        delay: 0.7,
      });

      tl.from([contactTitleWords], 0.8, {
        yPercent: 105,
        stagger: { amount: 0.7 },
      }).from(
        [contactLinksInner],
        0.8,
        { yPercent: 110, stagger: { each: 0.025 } },
        "<=70%"
      );
      contactLinksOutter.forEach((link, index) => {
        gsap.set(arrow[index], { x: "-102%", y: "200%" });
        gsap.set(line[index], { x: "-102%" });
        link.addEventListener("mouseenter", () => {
          gsap.killTweensOf(arrow[index]);
          gsap.killTweensOf(line[index]);

          gsap.set(arrow[index], { y: "200%", x: "-102%" });
          gsap.set(line[index], { x: "-102%" });

          gsap.to(arrow[index], 0.4, {
            y: "0%",
            x: "0%",
            ease: Power1.easeInOut,
          });
          gsap.to(line[index], 0.4, { x: "0%", ease: Power1.easeInOut });
        });
        link.addEventListener("mouseleave", () => {
          gsap.killTweensOf(arrow[index]);
          gsap.killTweensOf(line[index]);

          gsap.to(arrow[index], 0.4, {
            y: "-100%",
            x: "102%",
            ease: Power1.easeOut,
          });
          gsap.to(line[index], 0.4, { x: "102%", ease: Power1.easeOut });
        });
      });
    },
  });
};

export default handleAnimateContact;
