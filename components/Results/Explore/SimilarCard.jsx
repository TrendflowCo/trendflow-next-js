import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Image from 'next/image';
import { enhanceText } from '../../Utils/enhanceText';
import { useRouter } from 'next/router';
import { logos } from '../../Utils/logos';
import { CardMedia } from '@mui/material';
import { useAppSelector } from '../../../redux/hooks';

const SimilarCard = ({productItem}) => {
  const router = useRouter();
  const { translations } = useAppSelector(state => state.language);
  const handleShowSingleCard = () => {
    router.push(`/${router.query.lan}/results/explore/${productItem.name.split(' ').join('-')}%20${productItem.id}`)
  }
  return (
    <Card 
      sx={{ height: '100%' , width: {xs: 140 , sm: 230 , md: 330}  , borderRadius: 4 , display: 'flex' , flexDirection: 'column' , mx: 0.5, padding: 1.5}}
      className='shadow-lg flex-none hover:shadow-2xl transition-shadow	duration-500 ease-in-out'
    >
        <div className='flex flex-row items-center justify-start w-full h-12 py-2 px-4'>
          <div className='w-full h-full flex flex-col justify-center items-start'>
            <Image 
              src={logos[productItem?.brand?.toLowerCase()]} 
              alt={productItem?.brand} 
              height={0} 
              width={0} 
              sizes="100vw" 
              style={{height: '75%' , width: '35%' , objectFit: 'contain', alignSelf:'start' }}
            />
          </div>
        </div>

      <CardMedia
          component="img"
          image={productItem.img_url}
          alt={productItem.name}
          sx={{ height: {xs: 200 , sm: 300 , md: 400 } ,  borderRadius: 2 ,   objectFit: 'cover' , cursor: 'pointer'  }}
          onClick={() => {handleShowSingleCard()}}
        />
        <div className={`flex flex-col mt-2 mb-1 ${productItem.old_price_float !== productItem.price_float ? 'w-[70%]' : 'w-full'}`}>
          <span className='pr-2 truncate'>{`${enhanceText(productItem.name)}`}</span>
          {
            productItem.old_price_float !== productItem.price_float ? 
            <div className='flex flex-row w-full'>
              <span className='font-semibold text-dokuso-pink mr-1'>{`$${productItem.price_float}`}</span> 
              <span className='font-semibold line-through'>{`$${productItem.old_price_float}`}</span> 
            </div>
          : 
            <span className='font-semibold'>{productItem.price_float !== 0 ? `$${productItem.price_float}` : `${enhanceText(translations?.results?.no_price)}`}</span> 
          }
        </div>

    </Card>
  );
}

export default SimilarCard;