import React,{useEffect , useState} from 'react';

const SpecificProduct = ({item, index , response}) => {
    const [functionalities, setFunctionalities] = useState([])
    useEffect(() => {
        const events = [];
        const functions = [];
        const amounts = [];
        response.forEach((itemRes, indexRes) => {
            if (itemRes.app === item) {
                events.push(itemRes); // todos los eventos del producto
            }
        })
        events.forEach((itemEvent, indexEvent) => {
            if (!functions.includes(itemEvent.event)){
                functions.push(itemEvent.event);
                amounts.push(0);
            }
            const indexSum = functions.findIndex(nombre => nombre === itemEvent.event);
            if (indexSum != -1) {
                amounts[indexSum] += 1;
            }
        })
        const finalArray = functions.map((itemFunction , indexFunction) => ({
            function: itemFunction,
            amount: amounts[indexFunction]
        }))
        setFunctionalities(finalArray)
    },[]);

    return (
        <div key={item} className='h-48 w-80 flex flex-col items-center border border-stamm-black rounded-2xl text-center mb-5 pt-5 hover:bg-stamm-black duration-300 text-stamm-black hover:text-stamm-white cursor-pointer'>
            <span className="font-semibold">{item.split('-').join(' ')}</span>
            {functionalities?.map((itemFunction, indexFunction) => {
                return (
                    <div key={itemFunction.function}>
                        <span className='text-sm'>{`${itemFunction.function}: `}</span>
                        <span className='text-sm'>{itemFunction.amount}</span>
                    </div>
                )
            })}
            <p className='text-xs'>{`${functionalities?.length} functionalities`}</p>
        </div>

    )
};

export default SpecificProduct;