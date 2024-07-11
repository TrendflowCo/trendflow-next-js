import { CardMedia, CircularProgress } from "@mui/material";
import { useAppSelector } from "../../redux/hooks";
import React, { Fragment, useState } from "react";
import Carousel from "react-multi-carousel";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { swalMissingInputs } from "../Utils/swalConfig";
import { app } from "../../services/firebase";
import { deleteDoc , doc , getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";

import "react-multi-carousel/lib/styles.css";
import Swal from "sweetalert2";

const SinglePost = ({post , reload , setReload , user}) => {
    const { language } = useAppSelector(state => state.region);
    const router = useRouter();
    const db = getFirestore(app);

    const [loading, setLoading] = useState(false);
    const formatDateFromTimestamp =(timestampInMilliseconds, locale = 'en-US', options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }) => {
        const date = new Date(timestampInMilliseconds);
        return date.toLocaleDateString(locale, options);
    }
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 600 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 600, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };
    const actions = [
        { icon: <DeleteIcon />, name: 'Delete' },
        { icon: <EditIcon />, name: 'Edit' },
    ];
    const handleAction = async ( action , id ) => {
        if(action === 'Delete') {
            setLoading(true)
            try {
                await deleteDoc(doc(db, "blog", id));
                setLoading(false);
                setReload(!reload);
            } catch(err) {
                Swal.fire({
                    ...swalMissingInputs,
                    text: 'error deleting'
                })
            }
        } else if (action === 'Edit') {
            router.push(`/${language}/blog/updatePost/${id}`)
        }
    }
    
    return (
        <div className="bg-trendflow-white text-trendflow-black rounded-[12px] overflow-hidden flex flex-row shadow-lg w-[95%] mx-auto mt-4 mb-4 relative">
            {loading && <div className="absolute w-full h-full flex flex-col items-center justify-center">
                <CircularProgress size={64} thickness={3} sx={{color: '#318AFA'}}/>            
            </div>}
            <div className="p-4 w-[75%]">
                <div className="text-trendflow-pink font-semibold text-sm mb-2">
                    {formatDateFromTimestamp(post?.date)}
                </div>
                <h1 className="text-2xl font-semibold mb-2">{post.title}</h1>
                <h3 className="text-lg font-normal mb-2">{post.subTitle}</h3>
                <section className="text-sm text-trendflow-black mb-4">{post.text.split('\n').map((item,index)=> {
                    return (
                        <Fragment key={index}>
                            {item}<br/>
                        </Fragment>
                    )
                })}</section>


                <div className="text-trendflow-black font-medium text-sm">
                By {post.author}
                </div>
                <div className="mt-2">
                    {post?.tags?.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-trendflow-blue text-trendflow-white text-xs px-2 py-1 rounded-full mr-2"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex flex-col h-full w-[25%] p-4 rounded-[24px] relative">
            <Carousel
                swipeable={true}
                draggable={false}
                responsive={responsive}
                ssr={true} // means to render carousel on server-side.
                infinite={true}
                keyBoardControl={true}
                transitionDuration={300}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["mobile"]}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-10-px"
                centerMode={false}
            >
                {post.cover_img?.map((item , index) => <CardMedia key={index} component="img" image={item} alt={`postImage${index}`} sx={{borderRadius: '8px'}}/>)}
            </Carousel>
            
            {user && (user?.email === 'artuknees@gmail.com' || user?.email === 'julianlopezba@gmail.com' || user?.email ==='leolucianna@gmail.com') && 
                <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{ position: 'absolute', bottom: '24px' , right: '24px' }}
                    icon={<SpeedDialIcon sx={{color:'#262626'}}/>}
                >
                    {actions.map((action) => (
                    <SpeedDialAction
                        sx={{color:'#262626'}}
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={() => handleAction(action.name, post.id)}
                    />
                    ))}
                </SpeedDial>
            }
            </div>
        </div>    
    )
};

export default SinglePost;