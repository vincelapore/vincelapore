const handleAnimateHome = () => {
  const lottieHomeClone = document.getElementById('lottie-home__clone')
  let renderHome = bodymovin.loadAnimation({
    container: lottieHomeClone,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: "/Images/Animate/HomeLoop.json"
  });
  gsap.set(lottieHomeClone, { autoAlpha: 1 })
  gsap.set('.footer-clone', { autoAlpha: 1 })
  const chars = document.querySelectorAll('.hello-title span.char')
  const tl = gsap.timeline({
    defaults: { ease: Power1.easeInOut },
    delay: 0.7,
  })
  tl.from([chars], 1, { yPercent: 110, stagger: { amount: 0.38, from: 'center', } })
    .from('.hello-sub span', { yPercent: 100 }, '<=80%')
    .from('.person-col2', { opacity: 0 }, '<=10%')
}

export default handleAnimateHome;