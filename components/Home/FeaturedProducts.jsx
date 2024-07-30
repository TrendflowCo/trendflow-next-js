import React from "react";
import { useAppSelector } from "../../redux/hooks";
import ResultCard from "../Results/ResultCard";

const FeaturedProducts = () => {
    const { translations } = useAppSelector(state => state.region);
    // Fetch featured products from an API or use mock data
    const featuredProducts = [/* Array of featured products */];

    return (
        <section className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">{translations?.featuredProducts?.title || "Featured Products"}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map((product, index) => (
                        <ResultCard key={index} productItem={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
