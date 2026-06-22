import React, { useState } from "react";
import "./LoginScreen.css";
import SignupScreen from "./SignupScreen";

function LoginScreen() {
  const [mode, setMode] = useState(null); // null = landing, "signin", "signup"

  return (
    <div className="loginScreen">
      <div className="loginScreen__background">
        <img
          className="loginScreen__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
          alt="Netflix Logo"
        />
        <button className="signIn__button" onClick={() => setMode("signin")}>
          Sign In
        </button>
        <div className="loginScreen__gradient" />
      </div>

      <div className="loginScreen__body">
        {mode ? (
          <SignupScreen mode={mode} setMode={setMode} />
        ) : (
          <>
            <h1>Unlimited films, TV programmes and more.</h1>
            <h2>Watch anywhere, Cancel at any time.</h2>
            <h3>
              Ready to watch? Enter your email to create or restart your
              membership.
            </h3>

            <div className="loginScreen__input">
              <form>
                <input type="email" placeholder="Email Address" />
                <button
                  onClick={() => setMode("signup")}
                  className="loginScreen__getStarted"
                >
                  GET STARTED
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;
