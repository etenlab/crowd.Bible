/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { Button, MuiMaterial, Typography, Input } from '@eten-lab/ui-kit';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useApolloClient } from '@apollo/client';
import { RouteConst } from '@/constants/route.constant';

import { PageLayout } from '@/components/Layout';

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
  const history = useHistory();
  const apolloClient = useApolloClient();
  const {
    actions: { createLoadingStack },
    logger,
  } = useAppContext();
  const { tr } = useTr();

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const formik = useFormik<{
    email: string;
  }>({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const { startLoading, stopLoading } = createLoadingStack();
      startLoading();
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
          stopLoading();
          logger.error(res);
        })
        .catch((error: any) => {
          setErrorMessage(error.message);
          stopLoading();
        });
    },
  });

  const handleGoRegister = () => {
    history.push(RouteConst.REGISTER);
  };

  const handleLogin = () => {
    if (!formik.isValid) {
      return;
    }

    formik.submitForm();
  };

  return (
    <PageLayout>
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
          {tr('Forgot Password')}
        </Typography>

        {errorMessage && (
          <Typography sx={{ marginBottom: '18px', color: '#ff0000' }}>
            {errorMessage}
          </Typography>
        )}

        {successMessage && (
          <Typography sx={{ marginBottom: '18px', color: '#008000' }}>
            {successMessage}
          </Typography>
        )}

        <Input
          id="email"
          name="email"
          type="text"
          label={tr('Email')}
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
          {tr('Send recovery email')}
        </Button>

        <Button
          variant="text"
          endIcon
          fullWidth
          color="gray"
          onClick={handleGoRegister}
        >
          {tr(`Don't you have an account?`)}
        </Button>
      </Box>
    </PageLayout>
  );
}
