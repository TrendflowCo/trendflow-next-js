import React from "react";
import { useAppSelector } from "../../redux/hooks";

const Testimonials = () => {
    const { translations } = useAppSelector(state => state.region);
    const testimonials = [
        {
            text: "TrendFlow has been a game-changer for my fashion business. I can easily find the latest trends and styles, and the search functionality is so intuitive.",
            name: "Emily Chen",
            title: "Fashion Designer",
            avatar: "/testimonial-emily.jpg"
        },
        {
            text: "I was skeptical at first, but TrendFlow has really helped me stay on top of the latest fashion trends. The featured products section is my favorite feature!",
            name: "David Lee",
            title: "Fashion Influencer",
            avatar: "/testimonial-david.jpg"
        },
        {
            text: "As a busy entrepreneur, I don't have time to scour the internet for fashion inspiration. TrendFlow's curated content and search functionality have been a lifesaver.",
            name: "Sarah Taylor",
            title: "Fashion Blogger",
            avatar: "/testimonial-sarah.jpg"
        }
    ];

    return (
        <section className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">{translations?.testimonials?.title || "What Our Users Say"}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                            <p className="text-gray-600 mb-4">{testimonial.text}</p>
                            <div className="flex items-center">
                                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <h4 className="font-semibold">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
