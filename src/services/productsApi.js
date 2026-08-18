import axios from "axios"

const BASE_URL = "https://api.escuelajs.co/api/v1"

const getAllProducts = async()=>{
    const response = await axios.get(`${BASE_URL}/products`)
    return response.data;
}

const getProductLimit = async(limit) =>{
    const response = await axios.get(`${BASE_URL}/products?offset=0&limit=${limit}`)
    return response.data;
}

const getCategories = async() =>{
    const response = await axios.get(`${BASE_URL}/categories`)
    return response.data;
}

const getProductsByCategory = async(category) => {
    const response = await axios.get(`${BASE_URL}/products/category/${category}`)
    return response.data;
}

export default {getAllProducts,getProductLimit,getCategories,getProductsByCategory}