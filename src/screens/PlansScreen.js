import React, { use, useEffect, useState } from "react";
import "./PlansScreen.css";
import dp from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import {
  setSubscription,
  selectSubscription,
} from "../features/subscriptionSlice";

function PlansScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const subscription = useSelector(selectSubscription);
  const dispatch = useDispatch();

  useEffect(() => {
    dp.collection("customers")
      .doc(user.uid)
      .collection("subscriptions")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (subscriptionDoc) => {
          dispatch(
            setSubscription({
              role: subscriptionDoc.data().role,
              current_period_end:
                subscriptionDoc.data().current_period_end.seconds,
              current_period_start:
                subscriptionDoc.data().current_period_start.seconds,
            })
          );
        });
      });
  }, [user.uid, dispatch]);

  useEffect(() => {
    dp.collection("products")
      .where("active", "==", true)
      .get()
      .then((querySnapshot) => {
        const products = {};
        querySnapshot.forEach(async (productDoc) => {
          products[productDoc.id] = productDoc.data();
          const priceSnap = await productDoc.ref.collection("prices").get();
          priceSnap.docs.forEach((price) => {
            products[productDoc.id].prices = {
              priceId: price.id,
              priceData: price.data(),
            };
          });
        });
        setProducts(products);
      });
  }, []);

  console.log(products);
  console.log(subscription);

  const loadCheckout = async (priceId) => {
    const docRef = await dp
      .collection("customers")
      .doc(user.uid)
      .collection("checkout_sessions")
      .add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });
    docRef.onSnapshot(async (snap) => {
      const { error, url } = snap.data();

      if (error) {
        alert(`An error occurred: ${error.message}`);
      }

      if (url) {
        window.location.href = url;
      }
    });
  };

  return (
    <div className="plansScreen">
      {subscription && (
        <p className="plansScreen__renewaldate">
          Renewal date:{" "}
          {new Date(
            subscription?.current_period_end * 1000
          ).toLocaleDateString()}
        </p>
      )}
      {Object.entries(products).map(([productId, productData]) => {
        const isCurrentPackage = productData.name
          .split(" ")[0]
          ?.toLowerCase()
          .includes(subscription?.role);

        return (
          <div
            key={productId}
            className={`${
              isCurrentPackage && "plansScreen__plan--disabled"
            } plansScreen__plan `}
          >
            <div className="plansScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button
              onClick={() =>
                !isCurrentPackage && loadCheckout(productData.prices.priceId)
              }
            >
              {isCurrentPackage ? "Current Package" : "Subscribe"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlansScreen;
