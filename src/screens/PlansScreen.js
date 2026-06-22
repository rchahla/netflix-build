import React, { useEffect, useState } from "react";
import "./PlansScreen.css";
import dp, { functions } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import {
  setSubscription,
  clearSubscription,
  selectSubscription,
} from "../features/subscriptionSlice";

function PlansScreen() {
  const [products, setProducts] = useState([]);
  const [cancelling, setCancelling] = useState(false);
  const user = useSelector(selectUser);
  const subscription = useSelector(selectSubscription);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = dp
      .collection("customers")
      .doc(user.uid)
      .collection("subscriptions")
      .where("status", "in", ["trialing", "active"])
      .onSnapshot((querySnapshot) => {
        if (querySnapshot.empty) {
          dispatch(clearSubscription());
          return;
        }
        querySnapshot.forEach((subscriptionDoc) => {
          const data = subscriptionDoc.data();
          dispatch(
            setSubscription({
              role: data.role,
              current_period_end: data.current_period_end.seconds,
              current_period_start: data.current_period_start.seconds,
              cancel_at_period_end: data.cancel_at_period_end,
              status: data.status,
            })
          );
        });
      });

    return () => unsubscribe();
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

  const cancelMembership = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel your membership? You will continue to have access until the end of your current billing period."
    );
    if (!confirmed) return;

    setCancelling(true);
    try {
      const createPortalLink = functions.httpsCallable(
        "ext-firestore-stripe-payments-createPortalLink"
      );
      const { data } = await createPortalLink({
        returnUrl: window.location.origin,
        locale: "auto",
      });
      window.location.assign(data.url);
    } catch (error) {
      console.error("Portal error:", error);
      alert(
        "Could not open the cancellation portal. Please check the browser console for details.\n\n" +
        "Common causes:\n" +
        "• Stripe Customer Portal 'Save changes' button was not clicked after enabling cancellations\n" +
        "• Firebase extension ID mismatch (check Firebase console for the exact extension name)"
      );
      setCancelling(false);
    }
  };

  return (
    <div className="plansScreen">
      {subscription && (
        <p className={`plansScreen__renewaldate ${subscription.cancel_at_period_end ? "plansScreen__renewaldate--cancelled" : ""}`}>
          {subscription.cancel_at_period_end
            ? `Your membership has been cancelled. Access ends on ${new Date(subscription.current_period_end * 1000).toLocaleDateString()}.`
            : `Renewal date: ${new Date(subscription.current_period_end * 1000).toLocaleDateString()}`}
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
            } plansScreen__plan`}
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
              {isCurrentPackage
                ? subscription?.cancel_at_period_end
                  ? "Cancelled"
                  : "Current Package"
                : "Subscribe"}
            </button>
          </div>
        );
      })}

      {subscription && !subscription.cancel_at_period_end && (
        <div className="plansScreen__cancel">
          <button
            className="plansScreen__cancelBtn"
            onClick={cancelMembership}
            disabled={cancelling}
          >
            {cancelling ? "Opening portal..." : "Cancel Membership"}
          </button>
          <p className="plansScreen__cancelNote">
            You'll keep access until the end of your current billing period.
          </p>
        </div>
      )}
    </div>
  );
}

export default PlansScreen;
