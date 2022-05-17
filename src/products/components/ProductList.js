import React from "react";

import Card from "../../shared/components/UIElements/Card";
import ProductItem from "./ProductItem";

import "./ProductList.css";

const ProductList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="product-list center">
        <Card>
          <h2>No products found. </h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="product-list">
      {props.items.map((product) => (
        <ProductItem
          Item
          key={product._id}
          id={product._id}
          imageUrl={product.imageUrl}
          title={product.title}
          description={product.description}
          price={product.price}
          onDelete={props.onDeleteProduct}
        />
      ))}
    </ul>
  );
};

export default ProductList;
