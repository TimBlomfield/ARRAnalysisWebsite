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
