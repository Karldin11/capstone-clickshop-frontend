import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const CheckoutItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const auth = useContext(AuthContext);

  const [showConfirmModal, setShowConfirmModal] = useState(false); //
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  const cancelDeleteHandler = async () => {
    setShowConfirmModal(false);
  };
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      console.log("user id : " + auth.userId + " product:" + props.id);
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL +
          `checkout/cart/${auth.userId}/${props.id}`,
        "DELETE"
      );
      console.log("element eliminated from orders");
      auth.modifyQuantity(-1);
      console.log(auth.quantity);
      console.log("element substracted from context");
    } catch (err) {}

    history.push("/");
    history.replace("checkout");
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
          Do you want to proceed and delete this product from your shopping
          cart?
        </p>
      </Modal>

      <li className="checkout-item">
        <div className="checkout-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <img src={props.imageUrl} alt={props.title} width={50} height={50} />
          <div className="checkout-item__info">
            <h4>{props.title}</h4>
            <h4>$ {props.price} dlls</h4>
            <p>{props.description}</p>
          </div>
          <div className="checkout-item__actions">
            <Button danger onClick={showDeleteWarningHandler}>
              DELETE FROM CART
            </Button>
          </div>
        </div>
      </li>
    </>
  );
};

export default CheckoutItem;
