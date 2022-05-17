import React from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import CheckoutItem from "./CheckoutItem";
import "./CheckoutList.css";

const CheckoutList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="checkout-list">
        <Card>
          <h2>Your cart is empty. Keep shopping</h2>
          <Button to="/">Keep shopping</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="checkout-list">
      {props.items.map((product) => (
        <CheckoutItem
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

export default CheckoutList;
