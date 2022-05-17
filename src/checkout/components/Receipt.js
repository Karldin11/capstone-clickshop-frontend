import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import "./Receipt.css";

const Receipt = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();

  const [checkoutState, setCheckoutState] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  let totalPrice = 0;
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [totalAmount, setTotalAmount] = useState();

  const [formState, inputHandler] = useForm(
    //form info needed for receipt
    {
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const receiptSubmitHandler = async (event) => {
    event.preventDefault();
    setCheckoutState(false);

    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `checkout/receipts/${auth.userId}/`,
        "POST",
        JSON.stringify({
          address: formState.inputs.address.value,
          total: totalPrice,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      let numSeen = auth.quantity;
      auth.modifyQuantity(-numSeen);
    } catch (err) {}

    let responseData;
    try {
      responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `checkout/receipts/${auth.userId}/`,
        "GET"
      );

      console.log(responseData.userReceipts);
    } catch (err) {
      console.log("getting receipts unsuccessful");
    }

    try {
      let index = responseData.userReceipts.length - 1;
      setName(responseData.userReceipts[index].name);
      setAddress(responseData.userReceipts[index].address);
      setTotalAmount(responseData.userReceipts[index].total);
    } catch (err) {
      console.log("could NOT pass receipt elements");
    }
    setShowReceipt(true);
  };

  const cancelHandler = async () => {
    setCheckoutState(false);
  };

  const okHandler = async () => {
    history.push("/");
  };

  const calcTotalPrice = () => {
    if (props.items.length === 0) {
      totalPrice = 0.0;
    }

    props.items.map((product) => (totalPrice += parseFloat(product.price)));

    return totalPrice;
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <Card>
        <hr />
        {props.items.map((product) => (
          <p>
            {product.title}:{product.price}
          </p>
        ))}
        <h1>Total Amount: ${calcTotalPrice()}dlls</h1>
        {auth.isLoggedIn && !checkoutState && (
          <Button
            disabled={props.items.length === 0}
            onClick={() => setCheckoutState(true)}
          >
            CHECKOUT
          </Button>
        )}
      </Card>

      <Modal
        show={checkoutState}
        onCancel={cancelHandler}
        header="Delivery information"
        footerClass=""
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelHandler}>
              CANCEL
            </Button>
            <Button
              disabled={!formState.isValid}
              onClick={receiptSubmitHandler}
            >
              SEND
            </Button>
          </React.Fragment>
        }
      >
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
      </Modal>

      <Modal
        show={showReceipt}
        onCancel={okHandler}
        header="Receipt"
        footerClass=""
        footer={
          <React.Fragment>
            <Button to="/">Shop More</Button>
          </React.Fragment>
        }
      >
        <div className="scrollable-div">
          <h4>Costumer:{name}</h4>
          <p> Address:{address} </p>

          <h3>Products bought:</h3>
          <p>
            {props.items.map((product) => (
              <i>
                {product.title}:{product.price}, <br />
              </i>
            ))}
          </p>
          <hr />

          <h4>Total:{totalAmount}</h4>
        </div>
      </Modal>

      {/* {checkoutState && <NewReceipt total={calcTotalPrice()} />} */}
    </>
  );
};

export default Receipt;
