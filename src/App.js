import React, { useEffect, useState } from "react";
import "./App.css";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import dp, { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./features/userSlice";
import {
  setSubscription,
  clearSubscription,
  selectSubscription,
} from "./features/subscriptionSlice";
import ProfileScreen from "./screens/ProfileScreen";

function App() {
  const user = useSelector(selectUser);
  const subscription = useSelector(selectSubscription);
  const dispatch = useDispatch();
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        dispatch(login({ uid: userAuth.uid, email: userAuth.email }));
      } else {
        dispatch(logout());
        dispatch(clearSubscription());
        setLoadingSubscription(false);
      }
    });
    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;

    setLoadingSubscription(true);
    const unsubscribe = dp
      .collection("customers")
      .doc(user.uid)
      .collection("subscriptions")
      .where("status", "in", ["trialing", "active"])
      .onSnapshot((querySnapshot) => {
        if (querySnapshot.empty) {
          dispatch(clearSubscription());
        } else {
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
        }
        setLoadingSubscription(false);
      });

    return () => unsubscribe();
  }, [user, dispatch]);

  return (
    <div className="app">
      <Router>
        {!user ? (
          <LoginScreen />
        ) : loadingSubscription ? null : (
          <Routes>
            <Route path="/profile" element={<ProfileScreen />} />
            <Route
              path="/"
              element={
                subscription ? <HomeScreen /> : <Navigate to="/profile" replace />
              }
            />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
