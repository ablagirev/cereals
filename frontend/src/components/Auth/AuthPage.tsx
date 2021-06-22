import React, { useContext, useEffect, useState } from "react";
import "react-app-polyfill/ie11";
import { Formik, Form } from "formik";
import { AuthContext } from "../../context";

import { EMPTY_CHAR } from "../../utils/consts";
import { useLogin } from "../../hooks/useAuth";
import { Button, Flex, Input, Spacer, Typography } from "../../uikit";
import styled from "styled-components";

interface ILoginValues {
  username: string;
  password: string;
}

export const AuthPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const [userCredentials, setUserCredentials] = useState<ILoginValues>();
  const { data, isError, refetch: fetchUserData } = useLogin(userCredentials);

  const { token, type } = data || {};

  const handleLogin = (values: ILoginValues) => {
    setUserCredentials(values);
  };

  useEffect(() => {
    if (token && type) {
      auth.login(token, type);
    }
  }, [token, type, auth]);

  useEffect(() => {
    if (isError) {
      console.log("Something went wrong, try again");
    }
  }, [isError]);

  useEffect(() => {
    const { username, password } = userCredentials || {};
    const hasData = !!username && !!password;
    hasData && fetchUserData();
  }, [userCredentials]);

  return (
    <>
      <Spacer space={180} />
      <Flex hAlignContent="center">
        <AuthInnerWrapper>
          <Flex column hAlignContent="center">
            <Typography bold size="xl">
              Daylesford
            </Typography>
            <Spacer />
            <Typography align="center">
              Закупка зерновых по всей России покупка и продажа аграрной
              продукции
            </Typography>
            <Spacer space={32} />
            <Formik
              initialValues={{
                username: EMPTY_CHAR,
                password: EMPTY_CHAR,
              }}
              onSubmit={handleLogin}
            >
              <Form>
                <Flex column>
                  <Input
                    type="username"
                    name="username"
                    label="Имя пользователя"
                  />
                  <Spacer />
                  <Input type="password" name="password" label="Пароль" />
                  <Spacer space={44} />
                  <Button variant="action" type="submit">
                    Отправить
                  </Button>
                  <Spacer />
                </Flex>
              </Form>
            </Formik>
          </Flex>
        </AuthInnerWrapper>
      </Flex>
    </>
  );
};

const AuthInnerWrapper = styled.div`
  width: 345px;
`;
