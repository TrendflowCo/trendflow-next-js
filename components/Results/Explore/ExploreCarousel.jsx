import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ResultCard from '../ResultCard';
import { useAppSelector } from "../../../redux/hooks";

const ExploreCarousel = ({ products }) => {
  const { translations } = useAppSelector(state => state.region);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={20}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      breakpoints={{
        640: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
      }}
    >
      {products.map((product, index) => (
        <SwiperSlide key={index}>
          <ResultCard productItem={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ExploreCarousel;