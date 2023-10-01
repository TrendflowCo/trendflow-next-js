import React, { useState } from "react";
import Image from "next/image";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
// import CTA from "../Common/CTA";
import Swal from "sweetalert2";
import { swalWarning } from "../Utils/swalConfig";
// import StammInput from "../Common/StammInput"
// import StammImageInput from "../Common/StammImageInput";
// import StammSelect from "../Common/StammSelect";
// import StammRadioInput from "../Common/StammRadioInput.jsx";
import BasicInput from '../Common/BasicInput'

const CreatePostForm = ({ post , setPost }) => {
    const handleImageUpload = () => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setWebapp({...webapp, image: reader.result , filename: file.name})
        };
        reader.readAsDataURL(file);
    };
    const handleAddProduct = (e) => {
        if(!webapp.products.includes(e)) {
            let includedProducts = [...webapp.products];
            includedProducts.push(e);
            setWebapp({...webapp, products: includedProducts})
        }
    }
    const handleRemoveProduct = (id) => {
        let includedProducts = [...webapp.products];
        const index = includedProducts.findIndex(item => item === id);
        if (index !== -1) {
            includedProducts.splice(index,1);
            setWebapp({...webapp, products: includedProducts})    
        }
    }
    const hadndleAddUrl = () => {
        if(url.type !== '' && url.link !== ''){
            let currentUrls = [...webapp.url];
            const id = currentUrls.findIndex(item => item.link === url.link);
            if (id === -1) {
                currentUrls.push(url);
                setWebapp({...webapp,url: currentUrls})
                setUrl({
                    type:'',
                    link: ''        
                })    
            } else {
                Swal.fire({
                    ...swalWarning,
                    text: 'This url has already been added'
                })
            }
        }
    };
    // const handleRemoveLink = (link) => {
    //     let includedUrls = [...webapp.url];
    //     const index = includedUrls.findIndex(item => item.link === link);
    //     if (index !== -1) {
    //         includedUrls.splice(index,1);
    //         setWebapp({...webapp, url: includedUrls})    
    //     }
    // };
    return (
        <section className="h-full flex flex-col flex-auto xl:w-3/4 w-full h-full items-center mx-auto">
            <section className="h-full flex-auto w-full xl:px-0 px-5 flex flex-col">
                <div className="w-full flex flex-col xl:flex-row items-top justify-center">
                    <BasicInput 
                        labelText={'Title'} 
                        widths={'xl:w-1/2 w-full'} 
                        type='text' 
                        value={post.title} 
                        onChange={(e) => {setPost({...post,title:e.target.value})}} 
                        placeholder="Type your post title here"
                    />
                    <BasicInput 
                        labelText={'Author'} 
                        widths={'xl:w-1/2 w-full'} 
                        type='text' 
                        value={post.author} 
                        onChange={(e) => {setPost({...post,author:e.target.value})}} 
                        placeholder="Type your post author here"
                    />
                </div>
                <div className="w-full flex flex-col xl:flex-row items-top justify-center">
                    <BasicInput 
                        labelText={'Subtitle'} 
                        widths={'w-full'} 
                        type='text' 
                        value={post.subtitle} 
                        onChange={(e) => {setPost({...post,subtitle:e.target.value})}} 
                        placeholder="Type your post subtitle here"
                    />
                </div>
                <div className="w-full flex flex-col xl:flex-row items-bottom justify-end">
                    {/* <StammInput 
                        labelText={'Url'} 
                        widths={'xl:w-[45%] w-full'} 
                        type='text' 
                        value={url.link} 
                        onChange={(e) => {setUrl({...url,link: e.target.value})}} 
                        placeholder="Type your URL here"
                    /> */}
                    {/* <div className={`flex flex-col first:ml-0 last:mr-0 mx-2 w-[10%] justify-end items-start`}>
                        <label className="font-semibold mb-2">{'Add url'}</label>
                        <div className="bg-stamm-primary w-10 h-10 rounded-full">
                            <IconButton onClick={() => {hadndleAddUrl()}}>
                                <AddIcon/>
                            </IconButton>
                        </div>
                    </div> */}
                </div>
                {/* <div className="w-full flex flex-col items-top justify-start mt-4">
                    <label className="font-semibold mb-2">{'Added products'}</label>
                    <div className="flex flex-row w-full">
                        {webapp.products.length > 0 && webapp.products.map((itemProd , indexProd) => {
                            return (
                                <div key={indexProd} className="w-fit pl-4 rounded-full mx-1 first:ml-0 last:mr-0 bg-stamm-primary">
                                    <span className="text-sm">{allProducts[allProducts.findIndex(product => product.id === itemProd)].name}</span>
                                    <IconButton onClick={() => {handleRemoveProduct(itemProd)}}>
                                        <CloseIcon/>
                                    </IconButton>
                                </div>
                            )
                        })}
                    </div>
                </div> */}
                {/* <div className="w-full flex flex-col items-top justify-start mt-4">
                    <label className="font-semibold mb-2">{'Added links'}</label>
                    <div className="flex flex-row w-full">
                        {webapp.url.length > 0 && webapp.url.map((itemLink , indexLink) => {
                            return (
                                <div key={indexLink} className="w-fit pl-4 rounded-full mx-1 first:ml-0 last:mr-0 bg-stamm-primary">
                                    <span className="text-sm">{itemLink.link}</span>
                                    <IconButton onClick={() => {handleRemoveLink(itemLink.link)}}>
                                        <CloseIcon/>
                                    </IconButton>
                                </div>
                            )
                        })}
                    </div>
                </div> */}
            </section>
            {/* <div className="flex flex-col h-full w-full xl:px-0 px-5 mt-8" id='results'>
                <h1 className="text-2xl">App preview</h1>
                <section className='flex flex-row pb-5 pt-5'>
                    <div className="flex flex-row flex-auto">
                    <div className="border-2 border-stamm-primary p-2 flex flexcol items-center justify-center xl:h-[100px] xl:w-[100px] h-[85px] w-[85px] flex-none">
                        { webapp.image !== '' && <Image 
                            alt='Upload an image'
                            src={webapp.image}
                            height={70}
                            width={70}
                            style={{ width: 'auto', height: '100%' }}
                        />}
                    </div>
                    <div className='flex flex-col pl-5 basis-full'>
                        <h1 className='font-semibold text-2xl text-stamm-primary'>{webapp?.name || '-'}</h1>
                        <div className="flex flex-row text-stamm-black">
                        <span className="font-semibold mr-1">
                            Version:
                        </span>
                        <span>
                            {webapp?.version || "-"}
                        </span>
                        </div>
                        <div className='flex flex-row mt-1 flex-wrap'>
                        {webapp?.products?.length > 0 &&
                        webapp?.products?.map((item,index) => {
                            return (
                            <div key={index} className='bg-stamm-primary text-stamm-black rounded-full px-2 my-1 mr-2 first:ml-0 flex-none'>{allProducts[allProducts.findIndex(itemProd => itemProd.id === item)].name}</div>
                            )
                        })
                        }
                        </div>
                        <div className='mt-1 flex-row'>
                            <div className="lg:flex hidden text-stamm-black">{webapp?.description}</div>
                                {webapp.description.length > readLimit + 1 ?
                                    <div className="lg:hidden flex-wrap text-stamm-black">
                                        {readMore ? <span>{webapp.description}</span> : <span>{`${webapp.description.substr(0,readLimit)}...`}</span>}
                                        <span className="ml-2 text-stamm-gray underline cursor-pointer w-fit" onClick={() => setReadMore(!readMore)}>{readMore ? 'Read less' : 'Read more'}</span>
                                    </div>
                                        :
                                    <div className="lg:hidden flex flex-col text-stamm-black">
                                        <span>{webapp.description}</span>
                                    </div>
                                }
                            </div>
                            <section className="w-full flex flex-col">
                            {webapp?.url.map((url , urlIndex) => 
                                <CTA url={url} webAppName={webapp.name} key={urlIndex}/>
                            )}
                            </section>
                        </div>
                    </div>
                </section>
            </div> */}
        </section> 
    )
};

export default CreatePostForm;