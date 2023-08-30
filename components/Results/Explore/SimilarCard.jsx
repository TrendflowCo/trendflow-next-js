import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Image from 'next/image';
import { enhanceText } from '../../Utils/enhanceText';
import { useRouter } from 'next/router';
import { logos } from '../../Utils/logos';
import { CardMedia } from '@mui/material';
import { useAppSelector } from '../../../redux/hooks';
import { analytics} from "../../../services/firebase";
import { logEvent } from "firebase/analytics";

const SimilarCard = ({productItem}) => {
  const router = useRouter();
  const { translations } = useAppSelector(state => state.language);
  const handleShowSingleCard = () => {
    const firstEdition = productItem.name.toLowerCase().split(' ').join('-');
    const secondEdition = firstEdition.split('/').join('_');
    const thirdEdition = secondEdition.split('%20').join('-');
    logEvent(analytics, 'clickSingleCard', {
      img_id: productItem.id
    });
    router.push(`/${router.query.lan}/results/explore/${thirdEdition}%20${productItem.id}`);
  }

  return (
    <section className='mt-4 mb-10'>
      <Card 
        sx={{ height: '100%' , width: {xs: 160 , sm: 170 , md: 200 , lg: 280 , xl: 350}  , borderRadius: 4 , display: 'flex' , flexDirection: 'column' , mx: 1 }}
        className='shadow-lg flex-none hover:shadow-2xl transition-shadow	duration-500 ease-in-out'
      >
        <section className='flex flex-col w-full h-full relative'>
          <CardMedia
              component="img"
              image={productItem.img_url}
              alt={productItem.name}
              sx={{ height: {xs: 167 , sm: 209 , md: 245 , lg: 344 , xl: 430 } ,  borderRadius: 2 ,   objectFit: 'cover' , cursor: 'pointer'  }}
              onClick={() => {handleShowSingleCard()}}
            />
          {productItem.old_price !== productItem.price && 
            <div className='flex flex-col items-center justify-center absolute shadow-xl border border-dokuso-white top-2 right-2 w-fit h-fit p-1 md:p-2 rounded-xl bg-gradient-to-r from-dokuso-pink to-dokuso-orange text-center'>
              <span className='text-xs md:text-sm lg:text-base font-semibold text-dokuso-white leading-full'>{translations?.results?.on_sale.toUpperCase()}</span>
            </div>
          }
        </section>
        <section className='flex flex-row p-3 mt-1 w-full'>

            <div className={`flex flex-col w-2/3 text-xs md:text-sm xl:text-base`}>
              <span className='pr-2 truncate'>{`${enhanceText(productItem.name)}`}</span>
              {
                productItem.old_price !== productItem.price ? 
                <div className='flex flex-row w-full'>
                  <span className='font-semibold text-dokuso-pink mr-1'>{`$${""+productItem.price}`}</span> 
                  <span className='font-semibold line-through'>{`$${""+productItem.old_price}`}</span> 
                </div>
              : 
                <span className='font-semibold'>{productItem.price !== 0 ? `$${""+productItem.price}` : `${enhanceText(translations?.results?.no_price)}`}</span> 
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
    </section>
  );
}

export default SimilarCard;