import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ResultCard from "../ResultCard";

const CarouselComp = ({ similarProducts }) => {
  const responsive = {
    xl: {
      breakpoint: { max: 3000, min: 1536 },
      items: Math.min(3, similarProducts.length),
      slidesToSlide: Math.min(3, similarProducts.length)
    },
    lg: {
      breakpoint: { max: 1536, min: 1200 },
      items: Math.min(3, similarProducts.length),
      slidesToSlide: Math.min(3, similarProducts.length)
    },
    md: {
      breakpoint: { max: 1200, min: 900 },
      items: Math.min(3, similarProducts.length),
      slidesToSlide: Math.min(3, similarProducts.length)
    },
    tablet: {
      breakpoint: { max: 900, min: 600 },
      items: Math.min(2, similarProducts.length),
      slidesToSlide: Math.min(2, similarProducts.length)
    },
    mobile: {
      breakpoint: { max: 600, min: 0 },
      items: 1,
      slidesToSlide: 1
    }
  };

  if (!similarProducts || similarProducts.length === 0) {
    return null;
  }

  return (
    <section className="h-full">
      <Carousel
        swipeable={true}
        draggable={false}
        responsive={responsive}
        ssr={true}
        infinite={similarProducts.length > 3}
        keyBoardControl={true}
        transitionDuration={300}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-10-px"
        centerMode={similarProducts.length > 3}
      >
        {similarProducts.map((item, index) => (
          <div key={index} className="px-2">
            <ResultCard 
              productItem={item} 
              layoutType="compact"
            />
          </div>
        ))}
      </Carousel>
    </section>
  )
}

export default CarouselComp