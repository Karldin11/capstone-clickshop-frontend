import React, { useEffect, useState, useContext } from "react";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import CheckoutList from "../components/CheckoutList";
import { AuthContext } from "../../shared/context/auth-context";
import Receipt from "../components/Receipt";

const Checkout = () => {
  const [loadedProducts, setLoadedProducts] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `checkout/cart/${auth.userId}`
        );
        console.log("past request" + responseData.orders);
        setLoadedProducts(responseData.orders);
      } catch (err) {}
    };

    fetchProducts();
  }, [sendRequest, auth.userId]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedProducts && (
        <div>
          <CheckoutList items={loadedProducts} />
          <Receipt items={loadedProducts} />
        </div>
      )}
    </React.Fragment>
  );
};

export default Checkout;
