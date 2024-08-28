import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { getUserWishlists } from '../../services/firebase';
import { app } from '../../services/firebase';
import Link from 'next/link';

const UserProfile = () => {
  const [wishlists, setWishlists] = useState([]);
  const auth = getAuth(app);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      fetchWishlists();
    }
  }, [user]);

  const fetchWishlists = async () => {
    const userWishlists = await getUserWishlists(user.uid);
    setWishlists(userWishlists);
  };

  return (
    <div>
      <h1>User Profile</h1>
      <h2>Your Wishlists</h2>
      <div>
        {wishlists.map((wishlist) => (
          <div key={wishlist.id}>
            <h3>{wishlist.name}</h3>
            <Link href={`/wishlist/${wishlist.id}`}>
              <a>View Wishlist</a>
            </Link>
            {/* Add a preview of items here */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;