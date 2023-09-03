import React from "react";
import { useRouter } from "next/router";
import { Box, Stack } from '@chakra-ui/react';
import { Button } from "@mui/material";
import { ThemeProvider} from '@mui/material/styles';
import { muiColors } from '../Utils/muiTheme';
import { useAppDispatch , useAppSelector } from "../../redux/hooks";
import { setCurrentSearch } from "../../redux/features/actions/search";
import Swal from "sweetalert2";
import { swalNoInputs } from "../Utils/swalConfig";
import { handleSearchQuery } from "../functions/handleSearchQuery";

const Searcher = () => {
    const dispatch = useAppDispatch();
    const { currentSearch } = useAppSelector(state => state.search);
    const { translations , language } = useAppSelector(state => state.language);
    const router = useRouter();
    // const Arrow = createIcon({
    //     displayName: 'Arrow',
    //     viewBox: '0 0 72 24',
    //     path: (
    //       <path
    //         fillRule="evenodd"
    //         clipRule="evenodd"
    //         d="M0.600904 7.08166C0.764293 6.8879 1.01492 6.79004 1.26654 6.82177C2.83216 7.01918 5.20326 7.24581 7.54543 7.23964C9.92491 7.23338 12.1351 6.98464 13.4704 6.32142C13.84 6.13785 14.2885 6.28805 14.4722 6.65692C14.6559 7.02578 14.5052 7.47362 14.1356 7.6572C12.4625 8.48822 9.94063 8.72541 7.54852 8.7317C5.67514 8.73663 3.79547 8.5985 2.29921 8.44247C2.80955 9.59638 3.50943 10.6396 4.24665 11.7384C4.39435 11.9585 4.54354 12.1809 4.69301 12.4068C5.79543 14.0733 6.88128 15.8995 7.1179 18.2636C7.15893 18.6735 6.85928 19.0393 6.4486 19.0805C6.03792 19.1217 5.67174 18.8227 5.6307 18.4128C5.43271 16.4346 4.52957 14.868 3.4457 13.2296C3.3058 13.0181 3.16221 12.8046 3.01684 12.5885C2.05899 11.1646 1.02372 9.62564 0.457909 7.78069C0.383671 7.53862 0.437515 7.27541 0.600904 7.08166ZM5.52039 10.2248C5.77662 9.90161 6.24663 9.84687 6.57018 10.1025C16.4834 17.9344 29.9158 22.4064 42.0781 21.4773C54.1988 20.5514 65.0339 14.2748 69.9746 0.584299C70.1145 0.196597 70.5427 -0.0046455 70.931 0.134813C71.3193 0.274276 71.5206 0.70162 71.3807 1.08932C66.2105 15.4159 54.8056 22.0014 42.1913 22.965C29.6185 23.9254 15.8207 19.3142 5.64226 11.2727C5.31871 11.0171 5.26415 10.5479 5.52039 10.2248Z"
    //         fill="#262626"
    //       />
    //     ),
    // });
    const handleSearchPhrase = (e) => { // function for setting the phrase. Stores into global state
        dispatch(setCurrentSearch(e.target.value));
    };
    const handleButtonSearch = () => { // click into SHOP NOW button
        event.preventDefault();
        handleSearchQuery(language , currentSearch , 'search' , router)
        // if (currentSearch !== '') {
        // } else {
        //     Swal.fire({
        //         ...swalNoInputs
        //     })
        // }
    };
    const handleEnterSearch = (e) => { // click ENTER into form -> redirects to SHOP NOW
        if (e.key === 'Enter') {
            handleButtonSearch();
        }
    };
    const handleQuickSearch = (val) => {
        dispatch(setCurrentSearch(val))
        handleSearchQuery(language , val , 'clickOnPopularSearches' , router)
    };
    const handleSearchRandom = () => {
        const values = Object.values(translations?.prompts);
        const currentLength = values.length - 1;
        const random = Math.random();
        const finalValue = parseInt(random*(currentLength));
        handleQuickSearch(values[finalValue])
    };

    return (
        // <div className="flex flex-col flex-auto items-center w-full mt-4">
        //     <div className="flex flex-row items-center justify-center flex-wrap items-center w-full max-w-xl py-4">
        //         <section className="flex-auto w-full lg:w-fit px-4 md:px-0">
        //             <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>
        //             <input 
        //                 className="bg-dokuso-black bg-opacity-5 border-none rounded-[5px] text-base tracking-[2px] outline-none py-4 pr-10 pl-5 relative flex-auto w-full items-center text-dokuso-black"
        //                 type="text"
        //                 placeholder={translations?.search?.placeholder}
        //                 style={{'fontFamily':"Arial, FontAwesome"}}
        //                 onChange={(e) => {handleSearchPhrase(e)}}
        //                 onKeyDown={handleEnterSearch}
        //             />
        //         </section>
        //         <section className="px-2 lg:mt-0 mt-6">
        //             <Stack direction={'column'} spacing={3} align={'center'} alignSelf={'center'} position={'relative'}>
        //                 <Box>
        //                     <Icon as={Arrow} w={71} position={'absolute'} right={-71} top={'20px'}/>
        //                     <Text fontSize={'lg'} fontFamily={'Caveat'} position={'absolute'} right={'-125px'} top={'-24px'} transform={'rotate(10deg)'}>
        //                         {translations?.try_me}
        //                     </Text>
        //                 </Box>
        //             </Stack>
        //             <ThemeProvider theme={muiColors}>
        //                 <Button 
        //                     className="hover:text-dokuso-white bg-gradient-to-r from-dokuso-green to-dokuso-blue hover:from-dokuso-pink hover:to-dokuso-orange" 
        //                     variant="contained" 
        //                     onClick={() => handleButtonSearch()} 
        //                     onKeyDown={(e) => {handleEnterSearch(e)}}
        //                     sx={{fontWeight: 'bold'}}
        //                     color="dokusoBlack"
        //                     style={{width:'92px'}}
        //                 >
        //                     {translations?.shop_now}
        //                 </Button>
        //             </ThemeProvider>
        //         </section>
        //     </div>
        // </div>
        <div className="flex flex-col flex-auto items-center w-full mt-4">
            <div className="flex flex-row items-center justify-center flex-wrap items-center w-full lg:max-w-[50%] py-4">
                <section className="flex-auto w-full lg:w-fit px-4 md:px-0">
                    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"/>
                    <input 
                        className="bg-dokuso-black bg-opacity-5 border-none rounded-[5px] text-base tracking-[2px] outline-none py-4 pr-10 pl-5 relative flex-auto w-full items-center text-dokuso-black"
                        type="text"
                        placeholder={translations?.search?.placeholder}
                        style={{'fontFamily':"Arial, FontAwesome"}}
                        onChange={(e) => {handleSearchPhrase(e)}}
                        onKeyDown={handleEnterSearch}
                    />
                </section>
                <section className="px-2 lg:mt-0 mt-6">
                    <Stack direction={'column'} spacing={3} align={'center'} alignSelf={'center'} position={'relative'}>
                        <Box>
                            {/* <Icon as={Arrow} w={71} position={'absolute'} right={-71} top={'20px'}/> */}
                            {/* <Text fontSize={'lg'} fontFamily={'Caveat'} position={'absolute'} right={'-125px'} top={'-24px'} transform={'rotate(10deg)'}>
                                {translations?.try_me}
                            </Text> */}
                        </Box>
                    </Stack>
                    <ThemeProvider theme={muiColors}>
                        <Button 
                            className="text-dokuso-white hover:text-dokuso-black bg-gradient-to-r from-dokuso-pink to-dokuso-blue hover:from-dokuso-blue hover:to-dokuso-green" 
                            variant="contained" 
                            onClick={() => handleButtonSearch()} 
                            onKeyDown={(e) => {handleEnterSearch(e)}}
                            sx={{fontWeight: 'bold', height: '56px'}}
                            color="dokusoWhite"
                            style={{width:'92px'}}
                        >
                            Search
                        </Button>
                    </ThemeProvider>
                </section>
                <section className="w-full h-[280px] overflow-y-hidden mt-2 hover:overflow-y-auto hover:scrollbar">
                    <div className="flex-wrap flex flex-col justify-start">
                        <p className="px-6 py-3 text-dokuso-black font-semibold text-base leading-tight hover:bg-dokuso-orange hover:bg-opacity-30 transition duration-300 ease-in-out cursor-pointer" 
                        onClick={() => handleSearchRandom()}>
                            {`Don't know what to search? Let the random start!`}
                        </p>
                        {translations?.prompts && Object.values(translations?.prompts).sort().map((prompt) => (
                            <p 
                                key={prompt}
                                type="button"  
                                onClick={() => {handleQuickSearch(prompt)}} 
                                value={prompt} 
                                className="px-6 py-3 text-dokuso-blue font-semibold text-base leading-tight hover:bg-dokuso-pink hover:bg-opacity-30 transition duration-300 ease-in-out cursor-pointer"
                            >
                                {prompt}
                            </p>
                            ))
                        }
                    </div>
                </section>
            </div>
        </div>
    
    )
};

export default Searcher;