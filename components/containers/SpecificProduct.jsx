import React,{useEffect , useState} from 'react';

const SpecificProduct = ({name, index , response , visits}) => {
    const [individualVisits, setIndividualVisits] = useState(0)
    useEffect(() => {
        let individual = 0;
        response.forEach(item => {
            if (item.app === name) {
                individual += 1;
            }
        });
        setIndividualVisits(individual);
    },[]);

    return (
        <div className='h-48 w-80 flex flex-col items-center justify-between border border-stamm-black rounded-2xl text-center mb-5 pt-14 pb-5 hover:bg-stamm-black duration-300 text-stamm-black hover:text-stamm-white cursor-pointer'>
            <span className="font-semibold">{name}</span>
            <div className='flex flex-row justify-around w-full'>
                <span>{`${individualVisits} visits`}</span>
                <span>{`${parseInt((individualVisits/visits)*100)} % of total`}</span>
            </div>
        </div>

    )
};

export default SpecificProduct;