import '../styles/globals.css';
import Layout from '../components/global/LayOut';
import { store } from "../redux/store";
import { Provider } from "react-redux";
import Script from 'next/script'

export default function App({ Component, pageProps }) {
  return (
    <>      
    <Script id="google-site-tag"
    strategy='lazyOnload'
    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_TAG_ID}`}
    />
    <Script id="google-analytics" strategy='lazyOnload'>
      {`
      function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${process.env.GOOGLE_TAG_ID}');
      `}
    </Script>
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
    </>
  ) 
}
