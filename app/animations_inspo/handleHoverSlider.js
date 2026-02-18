const handleHoverSlider = () => {
  const allImages = document.querySelectorAll(".filter-normal");
  const mainTitle = document.querySelector(".content__title-active");
  const activeTitle = document.querySelectorAll(".content__title-data");
  if (!allImages) return;

  let isHovering = false;


  gsap.set(mainTitle, { opacity: 1 });
  gsap.set([activeTitle], { x: "-50%", y: "105%" });
  allImages.forEach((item, i) => {
    function hoverSlide() {
      isHovering = true;
      gsap.killTweensOf(activeTitle[i]);
      gsap.killTweensOf(mainTitle);
      gsap.to(mainTitle, { autoAlpha: 0, y: "-120%", ease: Power1.easeInOut });
      gsap.fromTo(
        [activeTitle[i]],
        { autoAlpha: 0, y: "105%" },
        { duration: 0.6, autoAlpha: 1, y: "-50%", ease: Power1.easeInOut }
      );
    }
    function onLeave() {
      isHovering = true;
      gsap.killTweensOf(activeTitle[i]);
      gsap.to(activeTitle[i], {
        duration: 0.6,
        y: "-200%",
        autoAlpha: 0,
        ease: Power1.easeInOut,
      });
    }
    item.addEventListener("mouseenter", hoverSlide);
    item.addEventListener("mouseleave", onLeave);
    document.querySelector(".slider").addEventListener("mouseleave", () => {
      if(!isHovering) return;
      if(isHovering) isHovering = false;
      gsap.killTweensOf(mainTitle);
      gsap.fromTo(
        mainTitle,
        { autoAlpha: 0, y: "120%" },
        { duration: 0.6, autoAlpha: 1, y: "0%", ease: Power1.easeInOut }
      );
    });
  });
};

export default handleHoverSlider;
