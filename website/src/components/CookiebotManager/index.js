'use client';

import { useEffect } from 'react';


const CookiebotManager = ({ domainGroupId }) => {
  console.log('CookiebotManager rendered, domainGroupId:', domainGroupId);
  useEffect(() => {
    console.log('CookiebotManager useEffect running on:', window.location.pathname);
    if (typeof window !== 'undefined' && domainGroupId && document) {
      const scriptCB = document.head.querySelector('script#CookieBot');
      console.log('Existing CookieBot script:', scriptCB);
      if (scriptCB == null) {
        console.log('Adding CookieBot script...');
        const script = document.createElement('script');
        script.setAttribute('id', 'CookieBot');
        script.setAttribute('src', 'https://consent.cookiebot.com/uc.js');
        script.setAttribute('data-cbid', domainGroupId);
        // script.setAttribute('data-blockingmode', 'auto');
        script.setAttribute('type', 'text/javascript');

        const head = document.querySelector('html > head');
        head.insertBefore(script, head.firstChild);
        console.log('CookieBot script added');
      }
    }

    return () => {
      console.log('CookiebotManager cleanup on:', window.location.pathname);
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
