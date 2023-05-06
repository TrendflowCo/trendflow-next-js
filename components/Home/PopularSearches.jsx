import React from "react";

const PopularSearches = () => {
    // Basic searches - This should be a get from most frequented searches
    const prompts = [
        "Merlina",
        "Barbie Y2K",
        "Preppy Girl",
        "Boho chic",
        "Parisian chic",
        "Floral Dresses",
        "Men's Shirts in pastel colors",
        "Denim",
        "Wes Anderson",
        "Safari Glam",
        "Capsule",
        "Bold prints",
        "Office attire",
    ]
    
    return (
        <div className="flex flex-col items-center w-full pt-8">
            <div className="flex flex-col max-w-xl w-full items-start">
                <h1 className="text-dokuso-black text-2xl sm:text-3xl font-bold mb-3">
                    Popular searches
                </h1>
                <div className="flex-wrap">
                    {prompts.map((prompt) => (
                        <button 
                            key={prompt}
                            type="button"  
                            // onClick={handleButtonSearch} 
                            value={prompt} 
                            className="px-6 py-2 border-2 border-purple-600 mr-1 mb-1 text-purple-600 font-medium text-sm leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                        >
                            {prompt}
                        </button>
                        )
                        )
                    }
                </div>
            </div>
        </div>
    )
};

export default PopularSearches;