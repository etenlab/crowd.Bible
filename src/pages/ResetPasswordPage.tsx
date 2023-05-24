/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';
import { useHistory, useParams } from 'react-router';
import { IonContent } from '@ionic/react';
import { gql, useApolloClient } from '@apollo/client';
import {
  Button,
  MuiMaterial,
  Typography,
  PasswordInput,
} from '@eten-lab/ui-kit';
import { useFormik } from 'formik';

import * as Yup from 'yup';
import { useAppContext } from '../hooks/useAppContext';

const { Box, Alert } = MuiMaterial;

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
});

const IS_TOKEN_VALID_QUERY = gql`
  query isTokenValidMutation($token: String!) {
    isTokenValid(token: $token) {
      createdAt
      token
      user
    }
  }
`;

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPasswordMutation($token: String!, $password: String!) {
    resetUserPassword(token: $token, password: $password)
  }
`;

export function ResetPasswordPage() {
  const { logger } = useAppContext();
  const [tokenValid, setTokenValid] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const history = useHistory();
  const { token } = useParams<{ token: string }>();
  const apolloClient = useApolloClient();

  const formik = useFormik<{
    password: string;
    passwordConfirm: string;
  }>({
    initialValues: {
      password: '',
      passwordConfirm: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (values.password === values.passwordConfirm) {
        apolloClient
          .mutate({
            mutation: RESET_PASSWORD_MUTATION,
            variables: {
              token: token,
              password: values.password,
            },
          })
          .then((res) => {
            setSuccessMessage('Password reset successfully');
            logger.error(res);
          })
          .catch((error: any) => {
            setErrorMessage(error.message);
          });
      } else {
        setErrorMessage('Passwords reset error!');
      }
    },
  });

  const handleToggleShow = () => {
    setShow((show) => !show);
  };

  const handleGoLoginPage = () => {
    history.push('/login');
  };

  const handleRegister = () => {
    if (!formik.isValid) {
      return;
    }

    formik.submitForm();
  };

  useEffect(() => {
    apolloClient
      .query({
        query: IS_TOKEN_VALID_QUERY,
        variables: {
          token: token,
        },
      })
      .then((res) => {
        setTokenValid(true);
        logger.info(res);
      })
      .catch((error: any) => {
        setTokenValid(false);
      });
  }, [apolloClient, token, logger]);

  if (!tokenValid) {
    return (
      <IonContent>
        <Typography
          variant="h1"
          color="text.dark"
          sx={{ marginBottom: '18px' }}
        >
          Reset Token Invalid / Expired
        </Typography>
      </IonContent>
    );
  }

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
          Reset Password
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          onChange={formik.handleChange}
          onClickShowIcon={handleToggleShow}
          show={show}
          value={formik.values.password}
          valid={
            formik.values.password !== '' ? !formik.errors.password : undefined
          }
          helperText={formik.errors.password}
          fullWidth
        />

        <PasswordInput
          id="passwordConfirm"
          name="passwordConfirm"
          label="Repeat Password"
          onChange={formik.handleChange}
          onClickShowIcon={handleToggleShow}
          show={show}
          value={formik.values.passwordConfirm}
          valid={
            formik.values.passwordConfirm !== ''
              ? !formik.errors.passwordConfirm
              : undefined
          }
          helperText={formik.errors.passwordConfirm}
          fullWidth
        />

        <Button
          variant="contained"
          endIcon
          fullWidth
          onClick={handleRegister}
          disabled={!formik.isValid}
        >
          Reset Password
        </Button>

        <Button
          variant="text"
          endIcon
          fullWidth
          color="gray"
          onClick={handleGoLoginPage}
        >
          Do you have an account?
        </Button>
      </Box>
    </IonContent>
  );
}
