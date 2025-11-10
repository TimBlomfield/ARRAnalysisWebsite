'use client';

import { useEffect, useState } from 'react';


const CookiebotManager = ({ domainGroupId }) => {
  const [cookieBotScriptLoaded, setCookieBotScriptLoaded] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (typeof window !== 'undefined' && domainGroupId && document) {
      const scriptCB = document.head.querySelector('script#CookieBot');

      if (scriptCB == null) {
        timeoutId = setTimeout(() => {
          const script = document.createElement('script');
          script.setAttribute('id', 'CookieBot');
          script.setAttribute('src', 'https://consent.cookiebot.com/uc.js');
          script.setAttribute('data-cbid', domainGroupId);
          // script.setAttribute('data-blockingmode', 'auto');
          script.setAttribute('type', 'text/javascript');

          const head = document.querySelector('html > head');
          head.insertBefore(script, head.firstChild);

          setCookieBotScriptLoaded(true);
        }, 200);
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);

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

  useEffect(() => {
    if (!cookieBotScriptLoaded) return;

    const manageGoogleAnalytics = () => {
      const consent = window?.Cookiebot?.consent?.statistics;

      if (!consent) {
        window[`ga-disable-${process.env.NEXT_PUBLIC_GA_ID}`] = true;
      } else {
        window[`ga-disable-${process.env.NEXT_PUBLIC_GA_ID}`] = false;

        if (!window.__gaLoaded_kxLwo0zLhj3CJq) {
          window.__gaLoaded_kxLwo0zLhj3CJq = true;

          const scriptGA = document.createElement('script');
          scriptGA.async = true;
          scriptGA.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
          document.head.appendChild(scriptGA);

          window.dataLayer = window.dataLayer || [];
          function gtag(){ window.dataLayer.push(arguments); }
          window.gtag = gtag;

          gtag('js', new Date());
          gtag('config', process.env.NEXT_PUBLIC_GA_ID);
        }
      }
    };

    window.addEventListener('CookiebotOnAccept', manageGoogleAnalytics);
    window.addEventListener('CookiebotOnDecline', manageGoogleAnalytics);
    window.addEventListener('CookiebotOnConsentReady', manageGoogleAnalytics);
    window.addEventListener('CookiebotOnLoad', manageGoogleAnalytics);

    // run once immediately if Cookiebot already initialized
    manageGoogleAnalytics();

    return () => {
      window.removeEventListener('CookiebotOnAccept', manageGoogleAnalytics);
      window.removeEventListener('CookiebotOnDecline', manageGoogleAnalytics);
      window.removeEventListener('CookiebotOnConsentReady', manageGoogleAnalytics);
      window.removeEventListener('CookiebotOnLoad', manageGoogleAnalytics);
    };
  }, [cookieBotScriptLoaded]);

  return null;
};


export default CookiebotManager;
