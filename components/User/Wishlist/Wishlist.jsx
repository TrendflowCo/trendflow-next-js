import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import axios from 'axios';

const Wishlist = () => {
	const [wishlist, setWishlist] = useState(null);
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		if (id) {
			fetchWishlist();
		}
	}, [id]);

	const fetchWishlist = async () => {
		try {
			const wishlistRef = doc(db, 'wishlists', id);
			const wishlistDoc = await getDoc(wishlistRef);
			if (wishlistDoc.exists()) {
				setWishlist({ id: wishlistDoc.id, ...wishlistDoc.data() });
				fetchItemDetails(wishlistDoc.data().items);
			} else {
				setError('Wishlist not found');
			}
		} catch (err) {
			console.error('Error fetching wishlist:', err);
			setError('Failed to fetch wishlist');
		} finally {
			setLoading(false);
		}
	};

	const fetchItemDetails = async (wishlistItems) => {
		if (!wishlistItems || wishlistItems.length === 0) {
			setItems([]);
			return;
		}

		const itemIds = wishlistItems.map(item => item.id_item).filter(Boolean).join(',');
		if (!itemIds) {
			setItems([]);
			return;
		}

		try {
			const response = await axios.get(`https://fashion-clip-search-owkpe6u3xa-uc.a.run.app/api/search?ids=${itemIds}`);
			setItems(response.data);
		} catch (error) {
			console.error("Error fetching item details:", error);
			setError("Failed to fetch item details");
		}
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!wishlist) return <div>Wishlist not found</div>;

	return (
		<div>
			<h1>{wishlist.name}</h1>
			{items.length === 0 ? (
				<p>This wishlist is empty.</p>
			) : (
				<div>
					{items.map((item) => (
						<div key={item.id}>
							<h3>{item.name}</h3>
							<p>Brand: {item.brand}</p>
							<p>Price: {item.price} {item.currency}</p>
							{item.image && <img src={item.image} alt={item.name} style={{maxWidth: '200px'}} />}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Wishlist;