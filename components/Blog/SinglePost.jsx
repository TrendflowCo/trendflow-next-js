import { CardMedia } from "@mui/material";
import React, { Fragment } from "react";

const SinglePost = ({post}) => {
    console.log('post: ', post.text.split('\\n'))
    function formatDateFromTimestamp(timestampInMilliseconds, locale = 'en-US', options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) {
        const date = new Date(timestampInMilliseconds);
        return date.toLocaleDateString(locale, options);
      }
    return (
        <div className="bg-dokuso-white text-dokuso-black rounded-[12px] overflow-hidden flex flex-row shadow-lg w-[95%] mx-auto mt-4 mb-4">
            <div className="p-4 w-[60%]">
                <div className="text-dokuso-pink font-semibold text-sm mb-2">
                    {formatDateFromTimestamp(post.date.seconds*1000)}
                </div>
                <h1 className="text-2xl font-semibold mb-2">{post.title}</h1>
                <h3 className="text-lg font-normal mb-2">{post.subTitle}</h3>
                {/* <section className="text-sm text-dokuso-black mb-4 whitespace-pre-wrap">{post.text}</section> */}
                <section className="text-sm text-dokuso-black mb-4">{post.text.split('\\n').map((item,index)=> {
                    return (
                        <Fragment key={index}>
                            {item}<br/>
                        </Fragment>
                    )
                })}</section>


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
            <div className="flex flex-col h-full w-[40%] p-4 rounded-[24px]">
                <CardMedia
                    component="img"
                    image={post.cover_img}
                    alt={'postImage'}
                    sx={{borderRadius: '8px'}}
                /> 
            </div>
        </div>    
    )
};

export default SinglePost;