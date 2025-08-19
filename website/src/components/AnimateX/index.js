'use client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const AnimateX = ({children}) => {
  useGSAP((context, contextSafe) => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);

          contextSafe(() => {
            const animType = entry.target.getAttribute('data-animated');
            const animDelay = entry.target.getAttribute('data-anim-delay');
            const delay = animDelay != null ? parseFloat(animDelay) : 0;

            switch (animType) {
              case 'text1':
                gsap.to(entry.target, { opacity: 1, y: 0, duration: .75, delay, ease: 'power2.out', startAt: { opacity: 0, y: 20 }});
                break;

              case 'elasticFadeIn':
                {
                  const tl = gsap.timeline({ delay });
                  tl.fromTo(entry.target, { scaleX: 0.75 }, { scaleX: 1, duration: .8, ease: 'elastic.out' });
                  tl.fromTo(entry.target, { opacity: 0 }, { opacity: 1, duration: .2, ease: 'none' }, 0);
                  tl.fromTo(entry.target, { y: 20 }, { y: 0, duration: .4, ease: 'power2.out' }, 0);
                }
                break;
            }
          })();
        }
      });
    }, { threshold: .25 });

    const animElements = document.querySelectorAll('[data-animated]');
    animElements.forEach(elem => observer.observe(elem));

    return () => {
      observer.disconnect();
    };
  });

  return children;
};


export default AnimateX;
