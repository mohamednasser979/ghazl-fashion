import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function Products(){

const [products,setProducts] = useState([]);

const API = "https://ghazl-fashion-production.up.railway.app";

useEffect(()=>{

const fetchProducts = async()=>{

  try{

    const res = await axios.get(
      `${API}/api/products`
    );

    setProducts(res.data);

  }catch(err){
    console.error("Error fetching products:",err);
  }

};

fetchProducts();

},[]);

return(

<div className="container mt-5">

  <h2 className="mb-4">Our Collection</h2>

  <div className="row">

    {products.map(product=>(

      <div className="col-md-3 mb-4" key={product._id}>

        <ProductCard product={product} />

      </div>

    ))}

  </div>

</div>

);

}