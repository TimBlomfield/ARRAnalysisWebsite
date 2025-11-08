'use client';

import { useEffect } from 'react';


const CookiebotManager = ({ domainGroupId }) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && domainGroupId && document) {
      const scriptCB = document.head.querySelector('script#CookieBot');
      if (scriptCB == null) {
        const script = document.createElement('script');
        script.setAttribute('id', 'CookieBot');
        script.setAttribute('src', 'https://consent.cookiebot.com/uc.js');
        script.setAttribute('data-cbid', domainGroupId);
        // script.setAttribute('data-blockingmode', 'auto');
        script.setAttribute('type', 'text/javascript');

        const head = document.querySelector('html > head');
        head.insertBefore(script, head.firstChild);
      }
    }

    return () => {
      // Remove the CookieBot script from the DOM when the component unmounts
      const scriptCB = document.head.querySelector('script#CookieBot');
      if (scriptCB) scriptCB.remove();

      // Remove all CookieBot related styles from the DOM when the component unmounts
      ['CookieConsentStateDisplayStyles', 'CookiebotDialogStyle', 'CookiebotWidgetStylesheet'].forEach(id => {
        document.querySelector(`style#${id}`)?.remove();
      });

      delete window.Cookiebot;
      delete window.CookieConsent;
    };
  }, [domainGroupId]);
};


export default CookiebotManager;
