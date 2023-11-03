import React, { useState , useEffect } from "react";
import { useAppSelector } from '../../redux/hooks'
import { useAuthState } from 'react-firebase-hooks/auth';
import { swalMissingInputs , swalWarning , swalConfigOnlySuccess } from '../Utils/swalConfig';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { getAuth } from "firebase/auth";
import { Box, CircularProgress } from "@mui/material";
import Head from "next/head";
import PositiveButton from '../Common/PositiveButton';
import NegativeButton from "../Common/NegativeButton";
import CreatePostForm from "./CreatePostForm";
import { addDoc, collection, doc, getDoc,  getFirestore,  updateDoc } from "firebase/firestore";
import { app } from "../../services/firebase";

const AddPost = () => {
  const {language} = useAppSelector(state => state.region)
  const db = getFirestore(app);
  const router = useRouter()  
  const auth = getAuth(app); // instance of auth method
  const [user, loading] = useAuthState(auth); // user data
  const [post,setPost] = useState({
    author: '', // ok
    cover_img: [],
    sub_title: '', // ok
    tags: [],
    text: '', // ok
    title: '', // ok
  });
  const [loadingSubmit , setLoadingSubmit] = useState(false);
  const [loadingData , setLoadingData] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  useEffect(() => {
    if (user) {
        if(user?.email !== 'artuknees@gmail.com' && user?.email !== 'julianlopezba@gmail.com' && user?.email !=='leolucianna@gmail.com') {
          router.push('/')
          Swal.fire({
            ...swalWarning,
            text: "You're not allowed to enter this section. You will be redirected to 'home' page"
            }
          );    
        } else {
          if (router.pathname.includes('/updatePost/')) {
            setLoadingData(true)
            setUpdateMode(true);
            fetchForUpdate();
          }
        }
    }
  },[user]); // eslint-disable-line

  const fetchForUpdate = async () => {
    try {
      const docRef = doc(db, "blog", router.query.id);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()) {
        const response = docSnap.data();
        delete response.date
        setPost(response)
      }
      setLoadingData(false);
    } catch(err) {
      console.error(err)
      setLoadingData(false)
    }
  };

  const handleSubmit = async (action) => {
    const result = Object.keys(post).every((item) => {
        return post[item].length > 0
    });
    if(result) {
      try {
        setLoadingSubmit(true);
        if(action === 'add') {
          const payload = {...post,date: Date.now()}
          await addDoc(collection(db, "blog"), payload)
        } else if (action === 'update') {
          const docRef = doc(db, "blog", router.query.id);
          const data = {...post,date: Date.now()}
          updateDoc(docRef, data)
        }
        setLoadingSubmit(false);
        if(action === 'add'){
          setPost({
            author: '', // ok
            cover_img: [],
            sub_title: '', // ok
            tags: [],
            text: '', // ok
            title: '' // ok
          });
        }
        Swal.fire({
          ...swalConfigOnlySuccess,
          text: `${action === 'add' ? 'Submit' : 'Update'} was successfull`
        })
      } catch (error) {
        setLoadingSubmit(false);
        console.error(error);
        Swal.fire({
          ...swalMissingInputs,
          text:`Failed ${action === 'add' ? 'adding' : 'updating'} product`
        })    
      }
    } else {
      Swal.fire({
          ...swalWarning,
          text: 'Post fields are not fully completed'
      })
    }
  };

  return (
    <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column' , py: '24px' }}>
        { loadingData ? 
            <Box sx={{ display: 'flex' , width: '100%' , height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={72} thickness={4} />
            </Box>
        :
            <section className="pb-8">
                <Head>
                    <title>{`Dokusō - ${updateMode ? 'Update' : 'Add'} post`}</title>
                    <meta name="description" content='Blog'/>
                </Head>
                <div className='flex flex-col lg:flex-row lg:justify-between mt-25 mx-5'>
                    <h6 className='text-black text-3xl md:text-4xl leading-10 font-semibold'>{`${updateMode ? 'Update' : 'Add'} post`}</h6>
                </div>
                <section className="flex flex-col flex-auto w-full mt-4">
                  <CreatePostForm post={post} setPost={setPost}/>
                </section>
                <section className="flex flex-row items-center justify-center mt-8">
                  {!updateMode && <PositiveButton widths={'xl:w-[335px] w-full'} text={'Submit post'} handleClick={() => {handleSubmit('add')}} loading={loadingSubmit}/>}
                  {updateMode && <PositiveButton widths={'xl:w-[335px] w-full'} text={'Update post'} handleClick={() => {handleSubmit('update')}} loading={loadingSubmit}/>}
                  <NegativeButton text={'Go back'} widths={'xl:w-[335px] w-full'} handleClick={() => {router.push(`/${language}/blog`)}}/>
                </section>
            </section>
        }
    </Box>
  )
};

export default AddPost;