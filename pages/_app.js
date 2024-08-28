import '../styles/globals.css';
import Layout from '../components/global/LayOut';
import { store } from "../redux/store";
import { Provider } from "react-redux";
// import { Toaster } from 'sonner';

export default function App({ Component, pageProps }) {

  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {/* <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      /> */}
    </Provider>
  ) 
}