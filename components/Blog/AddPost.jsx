import React, { useState , useEffect } from "react";
import { useAppSelector } from '../../redux/hooks'
import { useAuthState } from 'react-firebase-hooks/auth';
import { swalWarning } from "../Utils/swalConfig";
// import { swalMissingInputs , swalWarning , swalConfigOnlySuccess } from '../../components/utils/swalConfig';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { app } from "../../services/firebase";
import { getAuth } from "firebase/auth";
import { Box, CircularProgress } from "@mui/material";
import Head from "next/head";
import PositiveButton from '../Common/PositiveButton';
import NegativeButton from "../Common/NegativeButton";
import CreatePostForm from "./CreatePostForm";


// import CreateApp from "./CreateAppForm";
// import NegativeButton from "../Common/NegativeButton";
// import PositiveButton from "../Common/PositiveButton";
// import { endpoints, headers } from "../../config/endpoints";
// import axios from "axios";
// import { CircularProgress } from "@mui/material";

const AddPost = () => {
  const router = useRouter()  
  const auth = getAuth(app); // instance of auth method
  const [user, loading] = useAuthState(auth); // user data
  const [post,setPost] = useState({
    author: '', // ok
    cover_img: [],
    sub_title: '',
    tags: [],
    text: '',
    title: '' // ok
  });
  console.log('post',post);
  const [loadingSubmit , setLoadingSubmit] = useState(false);
  const [loadingData , setLoadingData] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  useEffect(() => {
    if (user) {
        if(user?.email !== 'artuknees@gmail.com' && user?.email !== 'julianlopezba@gmail.com') {
          router.push('/')
          Swal.fire({
            ...swalWarning,
            text: "You're not allowed to enter this section. You will be redirected to 'home' page"
            }
          );    
        } else {
        //   if (router.pathname.includes('/updateApp/')) {
        //     setLoadingData(true)
        //     setUpdateMode(true);
        //     fetchForUpdate();
        //   }
        }
    }
  },[user]); // eslint-disable-line

//   const fetchForUpdate = async () => {
//     try {
//       const queryWebapp = (await axios.get(`${endpoints('web_apps')}/${router.query.id}?filter={"include":[{"relation":"product"}]}`,headers())).data
//       setWebapp({
//         name: queryWebapp.name,
//         type:queryWebapp.type,
//         version: queryWebapp.version,
//         description: queryWebapp.description,
//         image: queryWebapp.image,
//         filename: 'sourceImage',  
//         products: queryWebapp.product.map(item => {return item.id}),
//         url: queryWebapp.url,
//       })
//       setLoadingData(false)  
//     } catch(err) {
//       console.error(err)
//       setLoadingData(false)
//     }
//   };

  const handleSubmit = async (action) => {
    const result = Object.keys(webapp).every((item) => {
        return webapp[item].length > 0
    });
    if(result) {
      try {
        setLoadingSubmit(true);
        const payload = {
          webapp: {
            name: webapp.name,
            type: webapp.type,
            version: webapp.version,
            description: webapp.description,
            image: webapp.image,
            url: webapp.url,

          },
          relatedProduct: webapp.products,
        };
        const payloadUpdate = {
          name: webapp.name,
          type: webapp.type,
          version: webapp.version,
          description: webapp.description,
          image: webapp.image,
          url: webapp.url,
        };
        if(action === 'add') {
          console.log('to add: ', payload)
          await axios.post(endpoints('web_apps'),payload,headers())
        } else if (action === 'update') {
          await axios.patch(`${endpoints('web_apps')}/${router.query.id}`,payloadUpdate,headers())
          const products = {
            products: webapp.products.map(item => {return {
              id: item,
              name: allProducts[allProducts.findIndex(prod => prod.id === item)].name
            }})
          };
          console.log('products for sending: ', products);
          await axios.patch(`${endpoints('web_apps')}/${router.query.id}/products`,products,headers());
        }
        setLoadingSubmit(false);
        if(action === 'add'){
          setWebapp({
            name: '',
            description: '',
            version: '',
            products: [],
            url: [],
            image: '',
            filename: '',
            type:'',      
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
          text: 'App fields are not fully completed'
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
            <>
                <Head>
                    <title>{`Dokusō - Add post`}</title>
                    <meta name="description" content='Blog'/>
                </Head>
                <div className='flex flex-col lg:flex-row lg:justify-between mt-25 mx-5'>
                    <h6 className='text-black text-3xl md:text-4xl leading-10 font-semibold'>Add post</h6>
                </div>
                <section className="flex flex-col flex-auto w-full mt-4">
                  <CreatePostForm post={post} setPost={setPost}/>
                </section>
                <section className="flex flex-row items-center justify-center">
                  {!updateMode && <PositiveButton widths={'xl:w-[335px] w-full'} text={'Submit app'} handleClick={() => {handleSubmit('add')}} loading={loadingSubmit}/>}
                  {updateMode && <PositiveButton widths={'xl:w-[335px] w-full'} text={'Update app'} handleClick={() => {handleSubmit('update')}} loading={loadingSubmit}/>}
                  <NegativeButton text={'Go back'} widths={'xl:w-[335px] w-full'} handleClick={() => {router.back()}}/>
                </section>
            </>
        }
    </Box>
  )
};

export default AddPost;