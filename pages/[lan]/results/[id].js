import { useRouter } from "next/router";
import Results from "../../../components/Results/containers/Results";

const ProductResult = () => {
    const router = useRouter();
    const product = router.query.id;
    const lan = router.query.lan;
    console.log('product searched: ', product);
    console.log('language selected: ', lan);
    return <Results product={product}/>
}

export default ProductResult;