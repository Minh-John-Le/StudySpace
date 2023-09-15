import React, { useContext } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";
import useInput from "../../hooks/use-input";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const authCtx = useContext(AuthContext);
  const nagivate = useNavigate();

  const {
    value: enteredUsername,
    isValid: enteredUsernameIsValid,
    hasError: usernameInputHasError,
    valueChangeHandler: usernameChangedHandler,
    inputBlurHandler: usernameBlurHandler,
    reset: resetUsernameInput,
  } = useInput((value) => value.trim().length > 8);

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: passowordInputHasError,
    valueChangeHandler: passwordChangedHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput((value) => value.trim().length > 8);

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(enteredUsername, enteredPassword);
    nagivate("/");
  };

  const formIsValid = enteredUsernameIsValid && enteredPasswordIsValid;
  return (
    <React.Fragment>
      <Card className={classes.header}>
        <h2>Login</h2>
      </Card>
      <Card className={classes.login}>
        <form onSubmit={submitHandler}>
          <Input
            id="username"
            label="Username"
            type="text"
            isValid={!usernameInputHasError}
            value={enteredUsername}
            onChange={usernameChangedHandler}
            onBlur={usernameBlurHandler}
            errorMessage={"Username must be length 8 or more"}
          ></Input>
          {
            <Input
              id="password"
              label="Password"
              type="password"
              isValid={!passowordInputHasError}
              value={enteredPassword}
              onChange={passwordChangedHandler}
              onBlur={passwordBlurHandler}
              errorMessage={"Password must be length 6 or more"}
            ></Input>
          }
          <div className={classes.actions}>
            <Button
              type="submit"
              className={classes.btn}
              disabled={!formIsValid}
            >
              <div>Login</div>
            </Button>
          </div>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default Login;
