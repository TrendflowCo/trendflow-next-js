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
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.GOOGLE_TAG_ID}');
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
