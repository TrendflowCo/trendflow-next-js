import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en-US">
    <Head>
    <Script id="google-site-tag" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-TRS7NDK');`}}></Script>
    </Head>
    <body>
        <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXX"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>`}}></noscript>
      <Script id="google-site-tag" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `var vglnk = {key: '943d03467515b42f0939f466068c6f50'};
        (function(d, t) {var s = d.createElement(t);
          s.type = 'text/javascript';s.async = true;
          s.src = '//clickcdn.sovrn.com/api/sovrncm.js';
          var r = d.getElementsByTagName(t)[0];
          r.parentNode.insertBefore(s, r);
        }(document, 'script'));`}}></Script>
      <Main/>
      <NextScript />
    </body>
  </Html>
  )
}
