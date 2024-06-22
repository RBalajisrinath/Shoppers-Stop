/*import React, {useEffect, useRef, useState} from 'react'
import { apiConnector } from '../api calls/apiConnector';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const AddProduct = () => {

  const Categories = [
    {
      name : "APPAREL",
    },
    {
      name : "ELECTRONICS",
    },
    {
      name : "FOOTWEAR"
    },
    {
      name : "PERSONAL CARE"
    }
  ]

  const user = useSelector((state) => state.user);
  console.log(user);
  const navigate = useNavigate();
  const params = useParams();
  console.log(params);
  
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const imgInput = useRef(null);

  const [product, setProduct] = useState({
    productName: "",
    description: "",
    sellingPrice: "",
    Mrp: "",
    quantity: ""
  });
  
  const handleSelect = () => {
    imgInput.current.click();
  }

  const handleImgChange = (event) => {
    const file = event.target.files[0]
    if(file){
      setImageFile(file);
      imagePreviewHandler(file);
    }
  }

  const imagePreviewHandler = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Add logic to submit the product data
    // combine data
    const formData = new FormData();
    formData.append("productName",product.productName);
    formData.append("description",product.description);
    formData.append("sellingPrice",product.sellingPrice);
    formData.append("Mrp",product.Mrp);
    formData.append("quantity",product.quantity);
    formData.append("category",category);
    if(params?.productId){
      await editProductCall(formData,params?.productId);
    }
    else{
      formData.append("productImg",imageFile);
      // const data = {...product,category:category,productImg:imageFile}
      await addProductCall(formData);
    }
  };
  
  const addProductCall = async(data)=>{
    setLoading(true);
    try {
        const response = await apiConnector("POST","http://127.0.0.1:4000/api/v1/product/addProduct",data,
        {
          "Content-Type": "multipart/form-data",
        }
        );
        if(! response.data.success){
            throw new Error(response.data.message);
        }
        else{
            console.log(response);
            navigate("/");
        }
    } catch (error) {
        console.log("ADD PRODUCT API ERROR............", error);
        console.log(error.response.data.message);
    }    
    setLoading(false);
  }
  
  const editProductCall = async(data,productId)=>{
    setLoading(true);
    try {
        const response = await apiConnector("PUT",`http://127.0.0.1:4000/api/v1/product/editProduct/${productId}`,data,
        {
          "Content-Type": "multipart/form-data",
        });
        if(! response.data.success){
            throw new Error(response.data.message);
          }
          else{
            console.log(response);
            navigate("/");
        }
    } catch (error) {
        console.log("EDIT PRODUCT API ERROR............", error);
        console.log(error.response.data.message);
    }    
    setLoading(false);
  }

  const findProduct = async(productId)=>{
    try {
        const response = await apiConnector("POST",`http://127.0.0.1:4000/api/v1/product/getProduct/${productId}`);
        if(! response.data.success){
            throw new Error(response?.data?.message);
        }
        else{
          console.log(response);
          const productDetail = response.data.product;
          setCategory(productDetail.category);
          setPreview(productDetail.image)
          setProduct({
            productName:productDetail.productName,
            description:productDetail.description,
            sellingPrice:productDetail.sellingPrice,
            Mrp:productDetail.Mrp,
            quantity:productDetail.quantity,
          });
        }
    } catch (error) {
        console.log("ONE PRODUCT API ERROR............", error);
        console.log(error?.response?.data?.message);
    }    
  }

  const oneProduct = async() =>{
    if(params?.productId){
      await findProduct(params?.productId);
    }
  }
  useEffect(()=>{
    oneProduct();
  },[]);

  useEffect(()=>{
    if(user?.account !== "Admin"){
      //navigate("/");
    }
  },[])

  return (
    <div className="bg-gray-50">
      <h1 className="text-3xl text-start font-semibold mb-6 p-5">Add New Product</h1>
      <form onSubmit={handleSubmit} className="p-8 flex gap-16 max-w-[90%] mx-auto mt-8">
        <div className='border-2 w-2/3 flex flex-col bg-white shadow-lg gap-10 rounded-lg p-5 pb-8'>
          <p className='text-lg text-start'>General Information</p>
          <div className='flex flex-col gap-3'>
            <div>
            <label htmlFor="productName" className="block text-lg text-start mb-1 text-gray-700">Name</label>
            <input required={true} placeholder={"Enter Product Name"} type="text" id="productName" name="productName" value={product.productName} onChange={handleChange} className="w-full rounded px-4 py-[6px] border-2 border-gray-400 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
            <label htmlFor="description" className="block text-lg text-start mb-1 text-gray-700">Description</label>
            <input required={true} type='text' id="description" placeholder={"Enter Product Description"}  name="description" value={product.description} onChange={handleChange} className="w-full rounded px-4 py-[6px] border-2 border-gray-400 focus:outline-none focus:border-blue-500"></input>
            </div>
            <div className='w-full flex gap-10'>
              <div className='w-full'>
                <label htmlFor="sellingPrice" className="block text-lg text-start mb-1 text-gray-700">Selling Price</label>
                <input required={true} placeholder={"Enter Product SellingPrice"} type="number" min={1} id="sellingPrice" name="sellingPrice" value={product.sellingPrice} onChange={handleChange} className="w-full rounded px-4 py-[6px] border-2 border-gray-400 focus:outline-none focus:border-blue-500" />
              </div>
              <div className='w-full'>
                <label htmlFor="Mrp" className="block text-lg text-start mb-1 text-gray-700">MRP</label>
                <input required={true} placeholder={"Enter Product Mrp"} type="number" min={1} id="Mrp" name="Mrp" value={product.Mrp} onChange={handleChange} className="w-full rounded px-4 py-[6px] border-2 border-gray-400 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div>            
            <label htmlFor="category" className="block text-lg text-start mb-1 text-gray-700">Category</label>
            <select
              value={category}
              id="category"
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded px-4 py-[6px] border-2 border-gray-400 focus:outline-none focus:border-blue-500"
              disabled={false}
            >
              <option value="" disabled>
                Choose a Category
              </option>
              {Categories?.map((category, indx) => (
                <option key={indx} value={category?.name}>
                  {category?.name}
                </option>
              ))}
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">{params?.productId ? "Edit Product" : "Add Product"}</button>
        </div>
        
        <div className='border-2 w-2/6 flex flex-col items-center bg-white shadow-lg gap-8 rounded-lg p-5 '>
          <div className='border-2 border-gray-400 mx-auto w-[250px] mt-5 h-[250px] rounded-md'>
            {preview ? <img src={preview} alt={"product"} className='w-[250px] h-[250px] rounded-md object-cover'/> : <div className='mt-5 text-center w-[250px] h-[250px] rounded-md'>Product Image</div>}
          </div>
          <div>
            <label htmlFor="image" className="block text-lg text-start mb-1 text-gray-700">
            <input required={!(params?.productId)} type="file" ref={imgInput} accept='image/png, image/gif, image/jpeg' id="image" name="image" value={product.image} onChange={handleImgChange} className='hidden'/></label>
            <button 
              type='button'
              disabled={false}
              className='rounded-md bg-blue-100 px-5 py-1'
              onClick={() => {handleSelect()}}>
                Select Image
            </button>
          </div>       
          <div>
            <label htmlFor="quantity" className="block text-lg text-start mb-1 text-gray-700">Quantity</label>
            <input required={true} placeholder={"Enter Product Quantity"} type="number" min={1} id="quantity" name="quantity" value={product.quantity} onChange={handleChange} className="w-full rounded px-4 py-[6px] border-2 border-gray-400 focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        
      </form>
    </div>
  )
}*/
import * as React from 'react';
import { Link as Anchor, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
const Logo = () => {
  return (
    <React.Fragment>
      <span className="logo-icon">🛒</span>
      <span className="logo-text">ShopSpot</span>
    </React.Fragment>
  );
};

const SearchBar = (props) => {
  return props.isLoggedIn ? (
    <div className="search">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder="Search…"
        onInput={(e) => {
          props.dispatch({ type: 'setSearch', payload: e.currentTarget.value });
        }}
      />
    </div>
  ) : null;
};

const Menu = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = props.isLoggedIn;
  const isAdmin = props.isAdmin;

  return (
    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
      <li className="nav-item">
        {isLoggedIn && <Anchor className="nav-link" to="/">Home</Anchor>}
      </li>
      {isAdmin && (
        <li className="nav-item">
          <Anchor className="nav-link" to="/addproduct">Add-Product</Anchor>
        </li>
      )}
      <li className="nav-item">
        {isLoggedIn && <Anchor className="nav-link" to="/cart">🛒</Anchor>}
      </li>
      <li className="nav-item">
        {isLoggedIn ? (
          <button className="nav-link" onClick={() => {
            dispatch({ type: 'logout' });
            navigate('/');
          }}>Logout</button>
        ) : (
          <Anchor className="nav-link" to="/login">Login</Anchor>
        )}
      </li>
    </ul>
  );
};
export default function NavigationBar() {
  const user = useSelector((state) => state.user);
  const isLoggedIn = Object.keys(user).length !== 0;
  const isAdmin = isLoggedIn && user?.account === "Admin";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <span className="navbar-brand" onClick={() => navigate("/")}>
          <Logo />
        </span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <Menu isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
          <SearchBar isLoggedIn={isLoggedIn} dispatch={dispatch} />
        </div>
      </div>
    </nav>
  );
}
