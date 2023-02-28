import '../styles/globals.css'
import Layout from '../components/global/LayOut'

export default function App({ Component, pageProps }) {
  return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
  ) 
}
