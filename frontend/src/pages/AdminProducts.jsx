import { useEffect, useState } from "react";
import axios from "axios";

function AdminProducts() {
  // eslint-disable-next-line no-unused-vars
  const [products,setProducts] = useState([]);
  const [filteredProducts,setFilteredProducts] = useState([]);

  const [editingId,setEditingId] = useState(null);

  const [form,setForm] = useState({
    name:"",
    price:"",
    description:"",
    images:[],
    sizes:[],
    colors:[]
  });

  const token = localStorage.getItem("token");

  const AVAILABLE_SIZES = ["S","M","L","XL","XXL","One Size"];

  const AVAILABLE_COLORS = [
    "Black","White","Beige","Yellow","Red","Burgundy",
    "Gray","Dark Gray","Mint Green","Brown","Navy",
    "Orange","Olive","Baby Blue","Powder Pink","GARNET","Bronze","Sage"
  ];

  const fetchProducts = async ()=>{

    const res = await axios.get(
      "http://localhost:5000/api/products"
    );

    setProducts(res.data);
    setFilteredProducts(res.data);

  };

  useEffect(()=>{
    fetchProducts();
  },[]);


  const handleSubmit = async (e)=>{

    e.preventDefault();

    const formData = new FormData();

    formData.append("name",form.name);
    formData.append("price",form.price);
    formData.append("description",form.description);

    formData.append("sizes",JSON.stringify(form.sizes));
    formData.append("colors",JSON.stringify(form.colors));

    for(let i=0;i<form.images.length;i++){
      formData.append("images",form.images[i]);
    }

    if(editingId){

      await axios.put(
        `http://localhost:5000/api/products/${editingId}`,
        formData,
        {headers:{Authorization:`Bearer ${token}`}}
      );

    }else{

      await axios.post(
        "http://localhost:5000/api/products",
        formData,
        {headers:{Authorization:`Bearer ${token}`}}
      );

    }

    setEditingId(null);

    setForm({
      name:"",
      price:"",
      description:"",
      images:[],
      sizes:[],
      colors:[]
    });

    fetchProducts();

  };


  const deleteProduct = async(id)=>{

    if(!window.confirm("Delete product?")) return;

    await axios.delete(
      `http://localhost:5000/api/products/${id}`,
      {headers:{Authorization:`Bearer ${token}`}}
    );

    fetchProducts();

  };


  const editProduct = (product)=>{

    setEditingId(product._id);

    setForm({
      name:product.name,
      price:product.price,
      description:product.description,
      images:[],
      sizes:product.sizes || [],
      colors:product.colors || []
    });

    window.scrollTo({top:0,behavior:"smooth"});

  };


  return(

    <div className="container mt-4">

      <h2 className="mb-4 fw-bold">

        {editingId ? "Edit Product" : "Add Product"}

      </h2>


      <form onSubmit={handleSubmit} className="card p-4 mb-4">

        <div className="row g-2">

          <div className="col-md-4">
            <input
              type="text"
              placeholder="Product Name"
              className="form-control"
              value={form.name}
              onChange={e=>setForm({...form,name:e.target.value})}
              required
            />
          </div>

          <div className="col-md-2">
            <input
              type="number"
              placeholder="Price"
              className="form-control"
              value={form.price}
              onChange={e=>setForm({...form,price:e.target.value})}
              required
            />
          </div>

          <div className="col-md-4">
            <input
              type="text"
              placeholder="Description"
              className="form-control"
              value={form.description}
              onChange={e=>setForm({...form,description:e.target.value})}
            />
          </div>

          <div className="col-md-2">
            <input
              type="file"
              multiple
              className="form-control"
              onChange={e=>setForm({...form,images:e.target.files})}
            />
          </div>

        </div>


        <div className="mt-3">

          <strong>Sizes:</strong>

          {AVAILABLE_SIZES.map(size=>(
            <label key={size} className="me-2">

              <input
                type="checkbox"
                checked={form.sizes.includes(size)}
                onChange={(e)=>{
                  if(e.target.checked)
                    setForm({...form,sizes:[...form.sizes,size]});
                  else
                    setForm({...form,sizes:form.sizes.filter(s=>s!==size)});
                }}
              />

              {size}

            </label>
          ))}

        </div>


        <div className="mt-3">

          <strong>Colors:</strong>

          {AVAILABLE_COLORS.map(color=>(
            <label key={color} className="me-2">

              <input
                type="checkbox"
                checked={form.colors.includes(color)}
                onChange={(e)=>{
                  if(e.target.checked)
                    setForm({...form,colors:[...form.colors,color]});
                  else
                    setForm({...form,colors:form.colors.filter(c=>c!==color)});
                }}
              />

              {color}

            </label>
          ))}

        </div>


        <button className="btn btn-dark mt-3">

          {editingId ? "Update Product" : "Add Product"}

        </button>

      </form>


      <table className="table table-striped">

        <thead className="table-dark">

          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Sizes</th>
            <th>Colors</th>
            <th>Action</th>
          </tr>

        </thead>


        <tbody>

          {filteredProducts.map(product=>(

            <tr key={product._id}>

              <td>

                {product.images?.length > 0 && (

                  <img
                    src={`http://localhost:5000/uploads/${product.images[0]}`}
                    width="60"
                    alt=""
                  />

                )}

              </td>

              <td>{product.name}</td>

              <td>${product.price}</td>

              <td>{product.description}</td>

              <td>{product.sizes?.join(", ")}</td>

              <td>{product.colors?.join(", ")}</td>

              <td>

                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={()=>editProduct(product)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={()=>deleteProduct(product._id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default AdminProducts;