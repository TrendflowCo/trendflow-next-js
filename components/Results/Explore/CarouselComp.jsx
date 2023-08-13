import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import SimilarCard from "./SimilarCard";

const CarouselComp = ({ similarProducts }) => {
  const responsive = {
    xl: {
      breakpoint: { max: 3000, min: 1536 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    lg: {
      breakpoint: { max: 1536, min: 1200 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    md: {
      breakpoint: { max: 1200, min: 900 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 900, min: 600 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 600, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };
  return (
    <section className="h-full">
      <Carousel
        swipeable={true}
        draggable={false}
        responsive={responsive}
        ssr={true} // means to render carousel on server-side.
        infinite={true}
        keyBoardControl={true}
        transitionDuration={300}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-10-px"
        centerMode={true}
      >
        {similarProducts?.map((item , index) => <SimilarCard key={index} productItem={item}/>)}
      </Carousel>
    </section>
  )
}

export default CarouselComp
