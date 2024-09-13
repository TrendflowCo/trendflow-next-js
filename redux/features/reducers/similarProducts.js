const initialState = {
    similarProducts: [],
};

const similarProductsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SIMILAR_PRODUCTS':
            return {
                ...state,
                similarProducts: action.payload,
            };
        default:
            return state;
    }
};

export default similarProductsReducer;