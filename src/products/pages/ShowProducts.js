import React, { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ProductList from "../components/ProductList";

const ShowProducts = () => {
  const [loadedProducts, setLoadedProducts] = useState(); //
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "products"
        );
        setLoadedProducts(responseData.products);
      } catch (err) {}
    };

    fetchProducts();
  }, [sendRequest]);

  const productDeletedHandler = (deletedProductId) => {
    setLoadedProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== deletedProductId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedProducts && (
        <ProductList
          items={loadedProducts}
          onDeleteProduct={productDeletedHandler}
        />
      )}
    </React.Fragment>
  );
};

export default ShowProducts;
