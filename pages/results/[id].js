import { useRouter } from "next/router";
import Results from "../../components/Results/containers/Results";

const ProductResult = () => {
    const router = useRouter();
    const product = router.query.id;
    return <Results product={product}/>
}

export default ProductResult;