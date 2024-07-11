import React, { useState } from "react";
// import Image from "next/image";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Swal from "sweetalert2";
import { swalWarning } from "../Utils/swalConfig";
import BasicInput from '../Common/BasicInput';
import BasicTextArea from '../Common/BasicTextArea';

const CreatePostForm = ({ post , setPost }) => {
    const [imgUri,setImgUri] = useState('');
    const [tagString,setTagString] = useState('');
    const handleAdd = (method , payload , setMethod) => {
        if(!post[method].includes(payload) && payload !== '') {
            let included = [...post[method]];
            included.push(payload);
            setPost({...post, [method]: included})
            setMethod('')
        } else {
            Swal.fire({
                ...swalWarning,
                text: 'Impossible to add'
            })
        }
    }
    const handleRemove = (method , itemToRemove) => {
        let included = [...post[method]];
        const index = included.findIndex(item => item === itemToRemove);
        if (index !== -1) {
            included.splice(index,1);
            setPost({...post, [method]: included})
        }
    }
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
                        value={post.sub_title} 
                        onChange={(e) => {setPost({...post,sub_title:e.target.value})}} 
                        placeholder="Type your post subtitle here"
                    />
                </div>
                <div className="w-full flex flex-col xl:flex-row items-bottom justify-end">
                    <BasicTextArea
                        labelText={'Text'} 
                        widths={'w-full'} 
                        value={post.text} 
                        onChange={(e) => {setPost({...post,text:e.target.value})}} 
                        placeholder="Type your post text here"
                    />
                </div>
                <div className="w-full flex flex-col xl:flex-row items-bottom justify-end">
                    <BasicInput 
                        labelText={'Image Url'} 
                        widths={'xl:w-[40%] w-full'} 
                        type='text' 
                        value={imgUri} 
                        onChange={(e) => {setImgUri(e.target.value)}} 
                        placeholder="Type your image url here"
                    />
                    <div className={`flex flex-col first:ml-0 last:mr-0 mx-2 w-[10%] justify-end items-start`}>
                        <label className="font-semibold mb-2">{'Add img url'}</label>
                        <div className="bg-trendflow-pink w-10 h-10 rounded-full">
                            <IconButton onClick={() => {handleAdd('cover_img',imgUri , setImgUri)}}>
                                <AddIcon/>
                            </IconButton>
                        </div>
                    </div>
                    <BasicInput 
                        labelText={'Tags'} 
                        widths={'xl:w-[40%] w-full'} 
                        type='text' 
                        value={tagString} 
                        onChange={(e) => {setTagString(e.target.value)}} 
                        placeholder="Type your tag here"
                    />
                    <div className={`flex flex-col first:ml-0 last:mr-0 mx-2 w-[10%] justify-end items-start`}>
                        <label className="font-semibold mb-2">{'Add tag'}</label>
                        <div className="bg-trendflow-pink w-10 h-10 rounded-full">
                            <IconButton onClick={() => {handleAdd('tags',tagString , setTagString)}}>
                                <AddIcon/>
                            </IconButton>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col xl:flex-row mt-4 text-trendflow-white">
                    <div className="flex flex-col w-1/2 overflow-hidden mr-2">
                        <label className="font-semibold mb-2">{'Added images'}</label>
                        <div className="flex flex-col w-full">
                            {post.cover_img.length > 0 && post.cover_img.map((itemImg , indexImg) => {
                                return (
                                    <div key={indexImg} className="w-full rounded-lg bg-trendflow-blue mb-2 p-1">
                                        <span className="text-xs">{itemImg}</span>
                                        <IconButton onClick={() => {handleRemove('cover_img',itemImg)}}>
                                            <CloseIcon sx={{color: '#FAFAFA'}}/>
                                        </IconButton>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="flex flex-col w-1/2 overflow-hidden ml-2">
                        <label className="font-semibold mb-2">{'Added images'}</label>
                        <div className="flex flex-row w-full">
                            {post.tags.length > 0 && post.tags.map((itemTag , indexTag) => {
                                return (
                                    <div key={indexTag} className="w-fit rounded-lg bg-trendflow-blue mb-2 py-1 pl-3 mx-1 first:ml-0 last:mr-0">
                                        <span className="text-xs">{itemTag}</span>
                                        <IconButton onClick={() => {handleRemove('tags',itemTag)}}>
                                            <CloseIcon sx={{color: '#FAFAFA'}}/>
                                        </IconButton>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </section> 
    )
};

export default CreatePostForm;