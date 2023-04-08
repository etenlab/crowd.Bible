/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';
// import axios from 'axios';

import { Button, MuiMaterial, Typography, Input } from '@eten-lab/ui-kit';
import { useFormik } from 'formik';
// import { useAppContext } from '@/hooks/useAppContext';
import * as Yup from 'yup';

// import * as querystring from 'qs';
// import { decodeToken } from '@/utils/AuthUtils';

// import axios from "axios";

const { Box } = MuiMaterial;
// const querystring = await import('qs');

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

export function ForgotPasswordPage() {
  // const [show, setShow] = useState<boolean>(false);
  // const [userToken, setUserToken] = useState('');

  const history = useHistory();
  // const {
  //   actions: { setUser },
  // } = useAppContext();
  const formik = useFormik<{
    email: string;
  }>({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values.email);

      // const keycloakUrl = `${process.env.REACT_APP_KEYCLOAK_URL}/realms/showcase/protocol/openid-connect`;
      // const url = `${process.env.REACT_APP_CPG_SERVER_URL}`;

      // axios
      //   .post(process.env.REACT_APP_GRAPHQL_URL!, {
      //     query: buildNodeQuery(nodeId),
      //   })
      //   .then((response) => setNode(response.data.data.node))
      //   .finally(() => setIsLoading(false));

      // history.push('/home');
    },
  });

  // const handleToggleShow = () => {
  //   setShow((show) => !show);
  // };

  const handleGoRegister = () => {
    history.push('/register');
  };

  const handleLogin = () => {
    if (!formik.isValid) {
      return;
    }

    formik.submitForm();
  };

  // useEffect(() => {
  //   localStorage.setItem('userToken', userToken);
  // }, [userToken]);

  return (
    <IonContent>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '123px 20px 20px 20px',
          gap: '12px',
        }}
        noValidate
        autoComplete="off"
      >
        <Typography
          variant="h1"
          color="text.dark"
          sx={{ marginBottom: '18px' }}
        >
          Forgot Password
        </Typography>

        <Input
          id="email"
          name="email"
          type="text"
          label="Email"
          onChange={formik.handleChange}
          value={formik.values.email}
          valid={formik.values.email !== '' ? !formik.errors.email : undefined}
          helperText={formik.errors.email}
          fullWidth
        />

        <Button
          variant="contained"
          endIcon
          fullWidth
          onClick={handleLogin}
          disabled={!formik.isValid}
        >
          Send recovery email
        </Button>

        <Button
          variant="text"
          endIcon
          fullWidth
          color="gray"
          onClick={handleGoRegister}
        >
          {"Don't you have an account?"}
        </Button>
      </Box>
    </IonContent>
  );
}
