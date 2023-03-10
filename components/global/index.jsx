import axios from "axios"
import React, {useEffect,useState} from 'react';
// import { Grid, Container, Typography , Stack} from '@mui/material';
// import Box from '@mui/material/Box';
import SpecificProduct from "../containers/SpecificProduct";

const Home = () => {
    const [response, setResponse] = useState([]);
    const [visits, setVisits] = useState(0);
    const [apps, setApps] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const url = 'http://10.1.1.68/stamm-analytics/backend/production/data';
          const rsp = (await axios.get(url)).data
          setResponse(rsp)
          console.log(rsp);
          let visitsForState = 0;
          rsp.forEach(element => {
            if(element.event === 'Visit') {
              visitsForState += 1;
            }
          })
          setVisits(visitsForState);
          const appsTest = [];
          rsp.forEach(item => {
            if (!appsTest.includes(item.app)){
              appsTest.push(item.app)
            }
          })
          setApps(appsTest)
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
            <h2 className="text-2xl mt-2.5 pl-2.5">{`Total visits: ${visits}`}</h2>
            <h4 className="text-sm mt-1 pl-2.5">{`From ${(new Date(response[0].timestamp)).toLocaleDateString()} to ${(new Date(response[response.length - 1].timestamp)).toLocaleDateString()}`}</h4>
            <div className="flex flex-row flex-wrap w-full justify-between mt-5">
              {apps.map((item,index) => {return (
                <SpecificProduct name={item} index={index} key={item} response={response} visits={visits}/>
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