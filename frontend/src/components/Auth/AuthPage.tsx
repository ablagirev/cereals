import React, { useContext, useEffect, useState } from "react";
import "react-app-polyfill/ie11";
import { Formik, Field, Form } from "formik";
import { AuthContext } from "../../context";

import { EMPTY_CHAR } from "../../utils/consts";
import { useUserData } from "../../hooks/useUserData";

interface ILoginValues {
  login: string;
  password: string;
}

export const AuthPage = () => {
  const auth = useContext(AuthContext);
  const [userCredentials, setUserCredentials] = useState<ILoginValues>();
  const {
    data,
    isError,
    refetch: fetchUserData,
  } = useUserData(userCredentials);
  const { token, userId } = data || {};

  const handleLogin = (values: ILoginValues) => {
    const { login, password } = values || {};
    const hasData = !!login && !!password;

    if (hasData) {
      setUserCredentials(values);
      fetchUserData();
    }
  };
  useEffect(() => {
    if (token && userId) {
      auth.login(token, userId);
    }
  }, [token, userId, auth]);

  useEffect(() => {
    if (isError) {
      console.log("Something went wrong, try again");
    }
  }, [isError]);

  return (
    <div>
      <h1>Signup</h1>
      <Formik
        initialValues={{
          login: EMPTY_CHAR,
          password: EMPTY_CHAR,
        }}
        onSubmit={handleLogin}
      >
        <Form>
          <Field id="login" name="login" placeholder={EMPTY_CHAR} />
          <Field id="password" name="password" placeholder={EMPTY_CHAR} />
          <button type="submit">Отправить</button>
        </Form>
      </Formik>
    </div>
  );
};
