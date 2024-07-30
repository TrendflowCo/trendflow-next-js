import React from "react";
import { useAppSelector } from "../../redux/hooks";
import Image from "next/image";

const FashionForward = () => {
    const { translations } = useAppSelector(state => state.region);
    return (
        <div className="bg-gradient-to-r from-trendflow-pink to-trendflow-blue py-16">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-white text-center mb-12">
                    {translations?.features?.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                            <Image src={`/feature-${index}.svg`} alt={`Feature ${index}`} width={64} height={64} className="mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{translations?.features[`feature${index}`]?.title}</h3>
                            <p className="text-gray-600">{translations?.features[`feature${index}`]?.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FashionForward;