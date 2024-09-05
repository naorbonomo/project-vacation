import axios from "axios";
import  appConfig  from "../utils/appconfig";
import { parseJwt } from "../utils/helpers";


export async function register(first_name: string, last_name: string, email: string, password: string) {
    const url = appConfig.API_BASE_URL + "/register";

    const data = {
        first_name,
        last_name,
        email,
        password,
    }
    const res = await axios.post(url, data)

    const token = res.data

    localStorage.setItem("token", token)
    return token;
}

export async function login(email: string, password: string) {
    const url = appConfig.API_BASE_URL + "/api/login";
    const res = await axios.post(url, { email, password })

    const token = res.data;
    const parsedToken = parseJwt(token);

    localStorage.setItem("token", token)
    console.log(parsedToken);
    

    return parsedToken;
}