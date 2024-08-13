import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ResultCard from '../ResultCard';
import { useAppSelector } from "../../../redux/hooks";
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { logos } from '../../Utils/logos';
import { enhanceText } from '../../Utils/enhanceText';

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
          <ResultCard productItem={product} layoutType="default" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ExploreCarousel;