import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getWishlistItems } from '../../../services/firebase';
import ResultCard from '../../Results/ResultCard';

const WishlistDetail = () => {
  const [items, setItems] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchWishlistItems();
    }
  }, [id]);

  const fetchWishlistItems = async () => {
    const wishlistItems = await getWishlistItems(id);
    setItems(wishlistItems);
  };

  return (
    <div>
      <h1>Wishlist Details</h1>
      <div>
        {items.map((item) => (
          <ResultCard key={item.id} productItem={item} />
        ))}
      </div>
    </div>
  );
};

export default WishlistDetail;