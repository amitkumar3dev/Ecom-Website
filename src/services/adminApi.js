import axios from "axios"

const BASE_URL = "https://api.escuelajs.co/api/v1"

const getUsers = async() => {
    const response = await axios.get(`${BASE_URL}/users`)
    return response.data;
}

const createProduct = async(productData) => {
    const response = await axios.post(`${BASE_URL}/products`,productData)
    return response.data;
}

const updateProduct = async(productId,productData) => {
    const response = await axios.put(`${BASE_URL}/products/${productId}`,productData)
    return response.data;
}

const deleteProduct = async(productId) => {
    const response = await axios.delete(`${BASE_URL}/products/${productId}`)
    return response.data;
}

const uploadFile = async(file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${BASE_URL}/files/upload`, formData);
    return response.data;
}

export default {getUsers,createProduct,updateProduct,deleteProduct,uploadFile}