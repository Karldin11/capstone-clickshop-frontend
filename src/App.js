import React, { useCallback, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import NewProduct from "./products/pages/NewProduct";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import ShowProducts from "./products/pages/ShowProducts";
import UpdateProduct from "./products/pages/UpdateProduct";
import Auth from "../src/user/pages/Auth";
import { AuthContext, AdminContext } from "./shared/context/auth-context";
import Checkout from "./checkout/pages/Checkout";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [quantity, setQuantity] = useState(0);
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, quantity) => {
    setIsLoggedIn(true);
    setUserId(uid);
    setQuantity(quantity);
  }, []);

  const modifyQuantity = useCallback((amount) => {
    setQuantity((c) => c + amount);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
    setQuantity(0);
  }, []);

  const adminProfile = useCallback(() => {
    setIsAdmin(true);
  }, []);
  const customerProfile = useCallback(() => {
    setIsAdmin(false);
  }, []);

  // const orderQuantity = useCallback((number) => {
  //   setQuantity((amount) => amount + number);
  // }, []);

  let routes;

  if (isLoggedIn) {
    if (isAdmin) {
      routes = (
        <Switch>
          <Route path="/" exact>
            <ShowProducts />
          </Route>
          <Route path="/products/new" exact>
            <NewProduct />
          </Route>
          <Route path="/products/:productId" exact>
            <UpdateProduct />
          </Route>
          <Redirect to="/" />
        </Switch>
      );
    } else {
      routes = (
        <Switch>
          <Route path="/" exact>
            <ShowProducts />
          </Route>
          <Route path="/checkout" exact>
            <Checkout />
          </Route>
          <Redirect to="/" />
        </Switch>
      );
    }
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <ShowProducts />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>

        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        quantity: quantity,
        login: login,
        logout: logout,
        modifyQuantity,
      }}
    >
      <AdminContext.Provider
        value={{
          isAdmin: isAdmin,
          adminProfile: adminProfile,
          customerProfile: customerProfile,
        }}
      >
        <Router>
          <MainNavigation />
          <main>{routes}</main>{" "}
        </Router>{" "}
      </AdminContext.Provider>
    </AuthContext.Provider>
  );
};
//
export default App;
