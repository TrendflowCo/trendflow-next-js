import axios from "axios"
import React, {useEffect,useState} from 'react';
// import { Grid, Container, Typography , Stack} from '@mui/material';
// import Box from '@mui/material/Box';
import SpecificProduct from "../containers/SpecificProduct";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [response, setResponse] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
      try {
        const url = 'http://10.1.1.68/stamm-analytics/backend/production/data';
        const rsp = (await axios.get(url)).data
        setResponse(rsp)
        const productsTest = [];
        rsp.forEach(item => {
          if (!productsTest.includes(item.app)){
            productsTest.push(item.app)
          }
        })
        setProducts(productsTest)
      } catch(err) {
        console.error(err)
      }
      };
      fetchData();
    },[])
  
    return (
      <section className="px-10 py-10 flex flex-col h-full min-h-screen">
        {response.length > 0 &&
          <>
            <h1 className="text-4xl font-semibold p-0 m-0">Welcome to Stämm Analytics</h1>
            <h2 className="text-2xl mt-2.5 pl-2.5">{`Total interaction: ${response?.length}`}</h2>
            <h4 className="text-sm mt-1 pl-2.5">{`From ${(new Date(response[0].timestamp)).toLocaleDateString()} to ${(new Date(response[response.length - 1].timestamp)).toLocaleDateString()}`}</h4>
            <div className="flex flex-row flex-wrap w-full justify-between mt-5">
              {products.map((item,index) => {return (
                <SpecificProduct item={item} index={index} key={item} response={response}/>
              )})}
            </div>
          </>
        }
      </section>
      // <Container>
      //   <Stack direction={'row'} spacing={2} sx={{
      //     marginTop: 8,
      //   }}>
      //     <Box sx={{
      //       width: 300,
      //       height: 300,
      //       border: '1px solid #272727',
      //       backgroundColor: '#F9F9F9',
      //       borderRadius: '16px',
      //       padding: '16px',
      //       '&:hover': {
      //         backgroundColor: '#272727',
      //         boxShadow: 5,
      //         color:'#FFFFFF'
      //       }
      //     }}>
      //       <span>{`Total events: ${events}`}</span>
      //     </Box>
      //     <Box sx={{
      //       width: 300,
      //       height: 300,
      //       border: '1px solid #272727',
      //       backgroundColor: '#F9F9F9',
      //       borderRadius: '16px',
      //       padding: '16px',
      //       '&:hover': {
      //         backgroundColor: '#272727',
      //         boxShadow: 5,
      //         color:'#FFFFFF'
      //       }
      //     }}>Products</Box>
      //       <Box sx={{
      //       width: 300,
      //       height: 300,
      //       border: '1px solid #272727',
      //       backgroundColor: '#F9F9F9',
      //       borderRadius: '16px',
      //       padding: '16px',
      //       '&:hover': {
      //         backgroundColor: '#272727',
      //         boxShadow: 5,
      //         color:'#FFFFFF'
      //       }
      //     }}>Interactions</Box>
      //     <Box sx={{
      //       width: 300,
      //       height: 300,
      //       border: '1px solid #272727',
      //       backgroundColor: '#F9F9F9',
      //       borderRadius: '16px',
      //       padding: '16px',
      //       '&:hover': {
      //         backgroundColor: '#272727',
      //         boxShadow: 5,
      //         color:'#FFFFFF'
      //       }
      //     }}>Numbers</Box>



              // {products.length > 0 && 
              //     <div>
              //     {products.map((item,index) => {
              //         return(
              //         <div key={index}>{item}</div>
              //         )
              //     })}
              //     </div>
              // } 
      //   </Stack>
      // </Container>
    )
};

export default Home;