/* eslint-disable @typescript-eslint/no-explicit-any */
import { IonContent } from '@ionic/react';
import { decodeToken, isTokenValid } from '@/utils/AuthUtils';
import { gql, useApolloClient } from '@apollo/client';
import {
  Alert,
  Button,
  Input,
  MuiMaterial,
  PasswordInput,
  Typography,
} from '@eten-lab/ui-kit';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';

const { Box } = MuiMaterial;

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
});

const RESET_UPDATE_PASSWORD = gql`
  mutation UpdatePasswordMutation($token: String!, $password: String!) {
    updatePassword(token: $token, password: $password)
  }
`;

export function ProfilePage() {
  const { logger } = useAppContext();
  const [show, setShow] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const userToken = localStorage.getItem('userToken');
  const apolloClient = useApolloClient();
  const token: any = decodeToken(userToken!);

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
      apolloClient
        .mutate({
          mutation: RESET_UPDATE_PASSWORD,
          variables: {
            token: userToken,
            password: values.password,
          },
        })
        .then((res) => {
          setSuccessMessage('Password reset successfully');
          logger.info(res);
        })
        .catch((error: any) => {
          setErrorMessage(error.message);
        });
    },
  });

  const handleToggleShow = () => {
    setShow((show) => !show);
  };

  const handleSave = () => {
    if (!formik.isValid) {
      return;
    }
    formik.submitForm();
  };

  if (!isTokenValid(token)) {
    return (
      <IonContent>
        <h3>Token not valid</h3>
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
          My Profile
        </Typography>
        {errorMessage && (
          <Alert
            severity="error"
            content={undefined}
            rel={undefined}
            rev={undefined}
          >
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert
            severity="success"
            content={undefined}
            rel={undefined}
            rev={undefined}
          >
            {' '}
            {successMessage}
          </Alert>
        )}
        <Typography variant="h6" sx={{ color: '#5C6673', marginBottom: '5px' }}>
          EMAIL
        </Typography>

        <Input
          id="email"
          name="email"
          type="text"
          value={token.email}
          fullWidth
          disabled
        />
        <Typography variant="h6" sx={{ color: '#5C6673', margin: '5px 0px' }}>
          PASSWORD
        </Typography>
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
          onClick={handleSave}
          disabled={!formik.isValid}
        >
          Save
        </Button>
      </Box>
    </IonContent>
  );
}
