import React, { useEffect, useCallback, useState, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";

export const CartCount = (id) => {
  const [quantityProducts, setQuantityProducts] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("before request" + id);
        const responseData = await sendRequest(
          `http://localhost:8000/products/checkout/${id}`
        );
        console.log("past request" + responseData.orders);
        setQuantityProducts(responseData.orders);
      } catch (err) {}
    };

    fetchProducts();
  }, [sendRequest, id]);

  return quantityProducts.count();
};

export default CartCount;
