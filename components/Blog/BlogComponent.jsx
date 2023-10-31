import { Box, CircularProgress } from "@mui/material";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch } from "../../redux/hooks";
import { setLanguage } from "../../redux/features/actions/region";
import { collection , getDocs, query as queryfb , getFirestore } from "firebase/firestore";
import { app } from "../../services/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from "firebase/auth";
import SinglePost from "./SinglePost";
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';

const BlogComponent = () => {
    const db = getFirestore(app);
    const auth = getAuth(app); // instance of auth method
    const [user, loading] = useAuthState(auth); // user data
    const router = useRouter();
    const [reload , setReload] = useState(true);
    const dispatch = useAppDispatch();
    const [loadingFlag, setLoadingFlag] = useState(false);
    const [allPosts , setAllPosts] = useState(null);
    useEffect(() =>{
        const fetchData = async () => {
            try {
                setLoadingFlag(true);
                const queryLanguage = router.query.lan;
                dispatch(setLanguage(queryLanguage)); // write redux variable - avoid refresh
                const q = queryfb(collection(db, "blog"));
                const querySnapshot = await getDocs(q);
                const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setAllPosts(newData)
                setLoadingFlag(false);
            } catch (err) {
                console.error(err);
                setLoadingFlag(false);
            }
        };
        fetchData();
    },[router.query.lan , user, reload]); // eslint-disable-line
    return (
        <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column' , py: '24px' }}>
            { loadingFlag ? 
                <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={72} thickness={4} />
                </Box>
            :
                <>
                    <Head>
                        <title>{`Dokusō - Blog`}</title>
                        <meta name="description" content='Blog'/>
                    </Head>
                    <div className='flex flex-col lg:flex-row lg:justify-between mt-25 mx-5'>
                            <h6 className='text-black text-3xl md:text-4xl leading-10 font-semibold'>Blog</h6>
                        {(user?.email === 'artuknees@gmail.com' || user?.email === 'julianlopezba@gmail.com' || user?.email ==='leolucianna@gmail.com') && 
                            <button 
                                className="bg-gradient-to-r from-dokuso-pink to-dokuso-blue text-dokuso-white rounded px-3 font-semibold shadow-lg hover:from-dokuso-blue hover:to-dokuso-green hover:text-dokuso-black"
                                onClick={() => {router.push(`/${router.query.lan}/blog/addPost`)}}
                            >
                                Create post
                            </button>
                        }
                    </div>
                    <section className="w-full flex flex-auto">
                        {(allPosts && allPosts?.length > 0) ? 
                            allPosts.map((post,indexPost) => {return (
                                <SinglePost post={post} key={indexPost} reload={reload} setReload={setReload} user={user}/>
                            )})
                        :
                        <section className="w-full h-full flex flex-col items-center justify-center">
                            <HighlightOffRoundedIcon fontSize="large"/>
                            <span className="text-xl mt-2">Empty section</span>
                        </section>
                        }
                    </section>
                </>
            }
        </Box>
    )
};

export default BlogComponent;