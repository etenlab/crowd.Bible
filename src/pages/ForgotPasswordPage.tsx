/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';
import { useAppContext } from '@/hooks/useAppContext';

import { Button, MuiMaterial, Typography, Input } from '@eten-lab/ui-kit';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useApolloClient } from '@apollo/client';

const { Box } = MuiMaterial;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const FORGET_PASSWORD_MUTATION = gql`
  mutation ForgotPasswordMutation($email: String!) {
    forgotPassword(email: $email) {
      createdAt
      token
      user
    }
  }
`;

export function ForgotPasswordPage() {
  // const [show, setShow] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const apolloClient = useApolloClient();
  const history = useHistory();
  const {
    actions: { setLoadingState },
    logger,
  } = useAppContext();

  const formik = useFormik<{
    email: string;
  }>({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoadingState(true);
      setErrorMessage('');
      setSuccessMessage('');
      apolloClient
        .mutate({
          mutation: FORGET_PASSWORD_MUTATION,
          variables: {
            email: values.email,
          },
        })
        .then((res) => {
          setSuccessMessage('Reset password link sent to your email');
          setLoadingState(false);
          logger.error(res);
        })
        .catch((error: any) => {
          setErrorMessage(error.message);
          setLoadingState(false);
        });
    },
  });

  const handleGoRegister = () => {
    history.push('/register');
  };

  const handleLogin = () => {
    if (!formik.isValid) {
      return;
    }

    formik.submitForm();
  };

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

        {errorMessage && (
          <Typography sx={{ marginBottom: '18px', color: '#ff0000' }}>
            {errorMessage}{' '}
          </Typography>
        )}

        {successMessage && (
          <Typography sx={{ marginBottom: '18px', color: '#008000' }}>
            {successMessage}{' '}
          </Typography>
        )}

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
