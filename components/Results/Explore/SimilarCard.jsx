import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Image from 'next/image';
import { enhanceText } from '../../Utils/enhanceText';
import { useRouter } from 'next/router';
import { logos } from '../../Utils/logos';
import { CardMedia } from '@mui/material';

const SimilarCard = ({productItem}) => {
  const router = useRouter();
  const handleShowSingleCard = () => {
    router.push(`/${router.query.lan}/results/explore/${productItem.id}`)
  }
  return (
    <Card 
      sx={{ height: {xs: 200 , sm: 300 , md: 400 } , width: {xs: 130 , sm: 230 , md: 330}  , borderRadius: 4 , display: 'flex' , flexDirection: 'column' , justifyContent: 'space-between', mx: 1 }} 
      className='shadow-lg flex-none hover:shadow-2xl transition-shadow	duration-500 ease-in-out'
    >
      {productItem.name}
      <CardMedia
          component="img"
          image={productItem.img_url}
          alt={productItem.name}
          sx={{ height: {xs: 200 , sm: 300 , md: 400 } , objectFit: 'cover' , cursor: 'pointer'  }}
          onClick={() => {handleShowSingleCard()}}
        />

    </Card>
  );
}

export default SimilarCard;