import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  modifyQuantity: () => {},
});

export const AdminContext = createContext({
  isAdmin: false,
  adminProfile: () => {},
  customerProfile: () => {},
});
