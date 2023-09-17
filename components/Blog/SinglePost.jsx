import { CardMedia } from "@mui/material";
import Image from "next/image";
import React from "react";

const SinglePost = ({post}) => {
    console.log('post: ', post)
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString).toLocaleDateString('en-US', options);
        return date;
      };
    return (
        <div className="bg-dokuso-white text-dokuso-black rounded-lg overflow-hidden shadow-lg w-[95%] mx-auto mt-8">
            {/* <div className="relative w-full h-56">
                <CardMedia
                    component="img"
                    image={post.cover_img}
                    alt={'postImage'}
                /> 
            </div> */}
            <div className="p-4">
                <div className="text-dokuso-pink font-semibold text-sm mb-2">
                    {formatDate(post.date.seconds)}
                </div>
                <h1 className="text-2xl font-semibold mb-2">{post.title}</h1>
                <h3 className="text-lg font-normal mb-2">{post.subTitle}</h3>
                <p className="text-sm text-dokuso-black mb-4">{post.text}</p>
                <div className="text-dokuso-black font-medium text-sm">
                By {post.author}
                </div>
                <div className="mt-2">
                    {post?.tags?.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-dokuso-blue text-dokuso-white text-xs px-2 py-1 rounded-full mr-2"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>    
    )
};

export default SinglePost;