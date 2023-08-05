import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import SimilarCard from "./SimilarCard";

const CarouselComp = ({ similarProducts }) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1080 },
      items: 3,
      slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1080, min: 464 },
      items: 2,
      slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
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
        transitionDuration={500}
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
