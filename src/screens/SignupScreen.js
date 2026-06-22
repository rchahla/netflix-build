import React, { useRef } from "react";
import "./SignupScreen.css";
import { auth } from "../firebase";

function SignupScreen({ mode, setMode }) {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const isSignIn = mode === "signin";

  const registerHandler = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      )
      .then((authUser) => {
        console.log(authUser);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const signInHandler = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      )
      .then((authUser) => {
        console.log(authUser);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="signupScreen">
      <form>
        <h1>{isSignIn ? "Sign In" : "Create Account"}</h1>
        <input ref={emailRef} placeholder="Email" type="email" />
        <input ref={passwordRef} placeholder="Password" type="password" />
        <button
          type="submit"
          onClick={isSignIn ? signInHandler : registerHandler}
        >
          {isSignIn ? "Sign In" : "Create Account"}
        </button>

        <h4>
          {isSignIn ? (
            <>
              <span className="signupScreen__gray">New to Netflix? </span>
              <span className="signupScreen__link" onClick={() => setMode("signup")}>
                Create an account.
              </span>
            </>
          ) : (
            <>
              <span className="signupScreen__gray">Already have an account? </span>
              <span className="signupScreen__link" onClick={() => setMode("signin")}>
                Sign in.
              </span>
            </>
          )}
        </h4>
      </form>
    </div>
  );
}

export default SignupScreen;
