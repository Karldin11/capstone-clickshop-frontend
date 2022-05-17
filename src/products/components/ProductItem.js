import React, { useState, useContext } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext, AdminContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./ProductItem.css";

const ProductItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const administrator = useContext(AdminContext);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  const cancelDeleteHandler = async () => {
    setShowConfirmModal(false);
  };
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `products/${props.id}`,
        "DELETE"
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  const onAddingHandler = async () => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL +
          `checkout/cart/${auth.userId}/${props.id}`,
        "POST"
      );
      console.log("element added to cart");
      auth.modifyQuantity(1);
      console.log("element added to context");
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="product-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this product? Please note that it
          can't be undone thereafter
        </p>
      </Modal>

      <li className="product-item">
        <Card className="product-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="product-item__image">
            <img src={props.imageUrl} alt={props.title} />
          </div>
          <div className="product-item__info">
            <h2>{props.title}</h2>
            <h3>$ {props.price} dlls</h3>
            <p>{props.description}</p>
          </div>

          <div className="product-item__actions">
            {auth.isLoggedIn && administrator.isAdmin && (
              <Button to={`/products/${props.id}`}>EDIT</Button>
            )}
            {auth.isLoggedIn && administrator.isAdmin && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
            {auth.isLoggedIn && !administrator.isAdmin && (
              <Button onClick={() => onAddingHandler()}>
                ADD TO SHOPPING CAR
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default ProductItem;
