
import { Link } from "react-router-dom";
import { useEffect,  } from 'react';
import { useDispatch , useSelector } from "react-redux";
//to get the products and categories from the store
import { getProducts } from "../store/prodectSlice";
import { getCategories } from "../store/categoriesSlice"

import ProductFilter from "../components/ProductFilter";

const Shop = () => {
    const dispatch = useDispatch();
    const { isLoading, categories } = useSelector((state) => state.categories);
    const { products } = useSelector((state) => state.products);
    

  

    useEffect(() => {
        dispatch(getProducts());
        dispatch(getCategories());
    }, [dispatch]);


    if (isLoading) {
        return <div>...</div>;
    }

    // if (!categories || !Array.isArray(categories.data)) {
    //     return <div>Error: Categories not found.</div>;
    // }

 


    return (
        <>
    
        {/* <!-- Start Content --> */}
        <ProductFilter categories={categories} products={products} />
  </>
    );
};

 

export default Shop;