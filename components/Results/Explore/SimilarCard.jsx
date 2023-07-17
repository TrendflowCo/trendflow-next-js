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
      sx={{ height: '100%' , width: {xs: 140 , sm: 230 , md: 330}  , borderRadius: 4 , display: 'flex' , flexDirection: 'column' , mx: 1}}
      className='shadow-lg flex-none hover:shadow-2xl transition-shadow	duration-500 ease-in-out'
    >
      <section className='flex flex-col w-full h-full relative'>
        <CardMedia
            component="img"
            image={productItem.img_url}
            alt={productItem.name}
            sx={{ height: {xs: 200 , sm: 300 , md: 400 } ,  borderRadius: 2 ,   objectFit: 'cover' , cursor: 'pointer'  }}
            onClick={() => {handleShowSingleCard()}}
          />
        {productItem.old_price_float !== productItem.price_float && 
          <div className='flex-none absolute shadow-xl border border-dokuso-white top-2 right-2 w-[25%] h-fit p-2 rounded-xl bg-gradient-to-r from-dokuso-pink to-dokuso-orange text-center'>
            <span className='text-base font-bold text-dokuso-white'>{translations?.results?.on_sale.toUpperCase()}</span>
          </div>
        }
      </section>
      <section className='flex flex-row p-3 mt-1 w-full'>

          <div className={`flex flex-col w-2/3`}>
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
          <div className='flex flex-row items-center justify-start w-1/3'>
            <div className='w-full h-full flex flex-col justify-center items-start'>
              <Image 
                src={logos[productItem?.brand?.toLowerCase()]} 
                alt={productItem?.brand} 
                height={0} 
                width={0} 
                sizes="100vw" 
                style={{height: 'auto' , width: '100%' , objectFit: 'contain', alignSelf:'start' }}
              />
            </div>
          </div>
      </section>
    </Card>
  );
}

export default SimilarCard;