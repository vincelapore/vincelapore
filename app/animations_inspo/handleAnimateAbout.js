import { scroll } from "./locomotive.js";
const handleAnimateAbout = () => {
  const scrollContainer = document.querySelector("[data-scroll-container]");
  scroll.on("scroll", ScrollTrigger.update);
  ScrollTrigger.scrollerProxy(scrollContainer, {
    scrollTop(value) {
      return arguments.length
        ? scroll.scrollTo(value, 0, 0)
        : scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },

    pinType: scrollContainer.style.transform ? "transform" : "fixed",
  });

  const isUpdate = () => {
    if (scroll) {
      scroll.update();
    }
  };
  ScrollTrigger.addEventListener("refresh", isUpdate);

  ScrollTrigger.refresh(true);

  ScrollTrigger.defaults({ scroller: scrollContainer });
  //reuse function
  ScrollTrigger.matchMedia({
    "(min-width: 1025px)": function () {
      // Init Animate - Hero section
      const textSplitting = Splitting({
        target: [
          ".about-title",
          ".process-title",
          ".award-title h3",
          ".clients-title",
        ],
        by: "words",
        key: null,
      });
      Object.keys(textSplitting).forEach((key) => {
        textSplitting[key].words.forEach((char) => {
          const core = char.cloneNode(true);
          char.innerHTML = "";
          char.classList.add("is-parrent");
          core.classList.add("is-children");
          char.append(core);
        });
      });
      const heroTimeline = gsap.timeline({
        defaults: { ease: Power1.easeInOut, duration: 1.2 },
        delay: 0.85,
      });
      gsap.utils.toArray(".sec-animate").forEach((section, i) => {
        //Get DOM
        const numbers = document.querySelector(".about-footer");
        const el1 = numbers.querySelector(`span.about-footer__${i}`);
        const el2 = numbers.querySelector(`span.about-text__${i}`);

        //function animate
        const onAnimateEnter = () => {
          gsap.set(".about-attr", { autoAlpha: 0 });
          gsap.set([el1, el2], { autoAlpha: 1 });
        };
        const onAnimateLeaveBack = () => {
          gsap.set(".about-attr", { autoAlpha: 0 });
          gsap.set([el1, el2], { autoAlpha: 1 });
        };
        const tlEnter = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 100%",
            end: "top top",
            scrub: true,
            onEnter: onAnimateEnter,
          },
        });

        const tlLeaveBack = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            scrub: true,
            onLeaveBack: onAnimateLeaveBack,
          },
        });
      });
      ScrollTrigger.create({
        trigger: ".about",
        start: "bottom bottom",
        end: "+=100%",
        pin: true,
        pinSpacing: false,
        scrub: 1,
        pinType: "transform",
      });
      gsap.set([".about-full__inner"], { yPercent: -80 });

      const parallaxSections = gsap.utils.toArray(".parallax-section");
      const innerSec = gsap.utils.toArray(".about-full__inner");
      parallaxSections.forEach((parallaxSection, i) => {
        const parallax = gsap.timeline({ paused: true });
        parallax.to(innerSec[i], { yPercent: 0, ease: "none" });

        ScrollTrigger.create({
          trigger: parallaxSection,
          start: "bottom bottom",
          end: "+=100%",
          animation: parallax,
          scrub: true,
        });
      });

      const tlEmail = gsap.timeline({
        scrollTrigger: {
          trigger: ".email",
          start: "top 10%",
          end: "top 10%",
          toggleActions: "play none none none",
          onEnter: () => {
            tlEmail.to(".menu", { autoAlpha: 1 });
          },
          onLeave: () => {
            tlEmail.set(".menu", { autoAlpha: 1, immediateRender: false });
          },
        },
      });
      function triggerHeading(element) {
        return gsap.from(element, {
          yPercent: 105,
          ease: Power1.easeInOut,
          duration: 0.8,
          stagger: { amount: 0.25 },
          scrollTrigger: {
            trigger: element,
            start: "100% 100%",
          },
        });
      }
      heroTimeline.from(
        [".about-title .is-children"],
        0.8,
        { yPercent: 100, stagger: { amount: 0.25 }, ease: Power1.easeInOut },
        "start"
      );
      //Init Animate - Process section
      const processTitle = document.querySelectorAll(
        ".process-title span.is-children"
      );
      triggerHeading(processTitle);
      //Init Animate - Awards section
      const awardTitle = document.querySelectorAll(
        ".award-title h3 span.is-children"
      );
      triggerHeading(awardTitle);
      //Init Animate - Clients section
      const clientsTitle = document.querySelectorAll(
        ".clients-title span.is-children"
      );
      triggerHeading(clientsTitle);
    },
  });

  const clientItems = document.querySelectorAll(".clients-item");
  clientItems.forEach((item) => {
    gsap.to(item, {
      backgroundPositionX: "0%",
      stagger: 1,
      scrollTrigger: {
        trigger: item,
        scrub: 1,
        start: "top 90%",
        end: "bottom top",
      },
    });
  });

  gsap.set(".about-mask", {
    zIndex: (i, target, targets) => targets.length - i,
  });
  let masks = gsap.utils.toArray(".about-mask");
  let allIMGsNotLast = masks.slice(0, -1);
  var action = gsap
    .timeline({ defaults: { ease: "none", stagger: 1 } })
    .to(allIMGsNotLast, { autoAlpha: 0, duration: 0 }, 1);
  ScrollTrigger.create({
    trigger: ".about-image",
    start: "top 100%",
    end: "bottom 110%",
    animation: action,
    scrub: 0.1,
  });

  //** Handle Hover Hobbies **//
  const hobbyHovers = document.querySelectorAll(".hobby-hover");
  const hobbyImages = document.querySelectorAll(".hobby-image__item");
  const hobbyOuter = document.querySelector(".hobby-image");
  gsap.set(hobbyImages[0], { x: "0", y: "0", rotation: 0, scale: 1 });

  hobbyHovers.forEach((item, i) => {
    function removeElement(element) {
      element.parentNode.removeChild(element);
      hobbyImages.forEach((el) => {
        if (el !== hobbyImages[i]) {
          gsap.set(el, { clearProps: "all" });
        }
      });
    }

    function handleEnter(e) {
      const newItem = hobbyImages[i].cloneNode(true);
      hobbyOuter.append(newItem);
      gsap.set(newItem, {
        x: "100%",
        y: "100%",
        rotation: "-35deg",
        scale: 1.1,
      });
      gsap.killTweensOf(newItem);
      gsap.killTweensOf(hobbyImages[i]);
      gsap.to([newItem, hobbyImages[i]], 1.2, {
        x: "0",
        rotation: 0,
        y: "0",
        ease: Power1.easeInOut,
        onComplete: removeElement,
        onCompleteParams: [newItem],
      });
      gsap.to([newItem, hobbyImages[i]], 1.2, {
        scale: 1,
        ease: Power1.easeInOut,
        delay: 0.35,
      });
      hobbyHovers.forEach((hobbyHover) => {
        hobbyHover.classList.remove("active");
      });
      hobbyHovers[i].classList.add("active");
    }
    item.addEventListener("mouseenter", handleEnter);
  });
};

export default handleAnimateAbout;
