import axios from "axios"
import React, {useEffect,useState} from 'react';
import { Grid, Container, Typography , Box , Stack} from '@mui/material';



const Home = () => {
    const [products, setProducts] = useState([]);
    const [events, setEvents] = useState(0)
    useEffect(() => {
      const fetchData = async () => {
      console.log('hola de nuevo')
      try {
        const url = 'http://10.1.1.68/stamm-analytics/backend/production/data';
        const rsp = (await axios.get(url)).data
        console.log(rsp)
        const productsTest = [];
        setEvents(rsp.length)
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
      <Container>
        <Stack direction={'row'} spacing={2} sx={{
          marginTop: 8,
        }}>
          <Box sx={{
            width: 300,
            height: 300,
            border: '1px solid #272727',
            backgroundColor: '#F9F9F9',
            borderRadius: '16px',
            padding: '16px',
            '&:hover': {
              backgroundColor: '#272727',
              boxShadow: 5,
              color:'#FFFFFF'
            }
          }}>
            <span>{`Total events: ${events}`}</span>
          </Box>
          <Box sx={{
            width: 300,
            height: 300,
            border: '1px solid #272727',
            backgroundColor: '#F9F9F9',
            borderRadius: '16px',
            padding: '16px',
            '&:hover': {
              backgroundColor: '#272727',
              boxShadow: 5,
              color:'#FFFFFF'
            }
          }}>Products</Box>
            <Box sx={{
            width: 300,
            height: 300,
            border: '1px solid #272727',
            backgroundColor: '#F9F9F9',
            borderRadius: '16px',
            padding: '16px',
            '&:hover': {
              backgroundColor: '#272727',
              boxShadow: 5,
              color:'#FFFFFF'
            }
          }}>Interactions</Box>
          <Box sx={{
            width: 300,
            height: 300,
            border: '1px solid #272727',
            backgroundColor: '#F9F9F9',
            borderRadius: '16px',
            padding: '16px',
            '&:hover': {
              backgroundColor: '#272727',
              boxShadow: 5,
              color:'#FFFFFF'
            }
          }}>Numbers</Box>



              {/* {products.length > 0 && 
                  <div>
                  {products.map((item,index) => {
                      return(
                      <div key={index}>{item}</div>
                      )
                  })}
                  </div>
              } */}
        </Stack>
      </Container>
    )
};

export default Home;