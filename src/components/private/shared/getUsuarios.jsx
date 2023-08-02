import axios from "axios";
import { Global } from "../../../helper/Global";
let token = localStorage.getItem("token");

export const getUsuarios = async ({ setUsuarios}) => {
  const oneClinica = await axios.get(`${Global.url}/getUsuarios`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  setUsuarios(oneClinica);
};
