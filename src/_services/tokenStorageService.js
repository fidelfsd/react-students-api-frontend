import { global } from "../_global/global";
const TOKEN_KEY = global.TOKEN_KEY;

const tokenStorageService = {};

tokenStorageService.save = (token) => {
   sessionStorage.removeItem(TOKEN_KEY);
   sessionStorage.setItem(TOKEN_KEY, token);
};

tokenStorageService.get = () => sessionStorage.getItem(TOKEN_KEY);

tokenStorageService.logout = () => sessionStorage.clear();

export default tokenStorageService;
