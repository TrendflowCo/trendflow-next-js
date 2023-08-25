import { CardMedia } from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const CarouselComp = ({images}) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 9999, min: 1024 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 768 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 768, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    },  
  };
  return (
    <section className="h-full w-full">
      <Carousel
        swipeable={true}
        draggable={false}
        responsive={responsive}
        ssr={true} // means to render carousel on server-side.
        infinite={true}
        keyBoardControl={true}
        transitionDuration={200}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["mobile"]}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-10-px"
        centerMode={true}
      >
        {images?.map((item , index) => 
            <CardMedia 
                key={item}
                component="img"
                image={item}
                alt={`image ${index}`}
                sx={{ maxHeight:'100vh', width:'100%', objectFit:'scale-down' }}
            />
        )}
      </Carousel>
    </section>
  )
}

export default CarouselComp
