import axios from "axios";
const api_url= import.meta.env.VITE_API_URL
export const userMessages= async (token)=>
{
try {
    const user= await axios.get(`${api_url}/messages/myMessages`,token);
    console.log(user);
} catch (error) {
    console.log(error.response);
}
}