import axios from "axios";
// import { cookies } from "next/headers";

// const cookieStore = cookies();
// const token = cookieStore.get("token");

const baseURL = "https://vagt-api.onrender.com/api";

export const Axios = axios.create({
  baseURL,
  //   headers: {
  //     Authorization: `${token?.value}`,
  //   },
});
