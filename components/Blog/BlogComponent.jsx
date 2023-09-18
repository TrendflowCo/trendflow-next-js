import { Box, CircularProgress } from "@mui/material";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch } from "../../redux/hooks";
import { setLanguage } from "../../redux/features/actions/language";
import { collection , getDocs, query as queryfb , where , getFirestore } from "firebase/firestore";
import { app } from "../../services/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from "firebase/auth";
import SinglePost from "./SinglePost";

const BlogComponent = () => {
    const db = getFirestore(app);
    const auth = getAuth(app); // instance of auth method
    const [user, loading] = useAuthState(auth); // user data
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [loadingFlag, setLoadingFlag] = useState(false);
    const [allPosts , setAllPosts] = useState([]);
    useEffect(() =>{
        const fetchData = async () => {
            try {
                setLoadingFlag(true);
                const queryLanguage = router.query.lan;
                dispatch(setLanguage(queryLanguage)); // write redux variable - avoid refresh
                const q = queryfb(collection(db, "blog"));
                const querySnapshot = await getDocs(q);
                const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                console.log('new data: ', newData);

                setAllPosts(newData)
                setLoadingFlag(false);
            } catch (err) {
                console.error(err);
                setLoadingFlag(false);
            }
        };
    fetchData();
    },[router.query.lan , user]); // eslint-disable-line
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
                    <div className='flex flex-col lg:flex-row lg:justify-between mt-25'>
                        <div className='mx-5'>
                            <h6 className='text-black text-3xl md:text-4xl leading-10 font-semibold'>Blog</h6>
                        </div>
                    </div>
                    <section>
                        {allPosts?.length > 0 && allPosts.map((post,indexPost) => {return (
                            <SinglePost post={post} key={indexPost}/>
                        )})}
                    </section>
                </>
            }
        </Box>
    )
};

export default BlogComponent;