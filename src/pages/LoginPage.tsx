/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';
import axios from 'axios';

import {
  Button,
  MuiMaterial,
  Typography,
  Input,
  PasswordInput,
} from '@eten-lab/ui-kit';
import { useFormik } from 'formik';
import { useAppContext } from '@/hooks/useAppContext';
import * as Yup from 'yup';

import * as querystring from 'qs';
import { decodeToken } from '@/utils/AuthUtils';

const { Box } = MuiMaterial;
// const querystring = await import('qs');

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export function LoginPage() {
  const [show, setShow] = useState<boolean>(false);
  const [userToken, setUserToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const {
    actions: { setUser },
  } = useAppContext();
  const formik = useFormik<{
    email: string;
    password: string;
  }>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values.email);
      console.log(values.password);

      const keycloakUrl = `${process.env.REACT_APP_KEYCLOAK_URL}/realms/${process.env.REACT_APP_KEYCLOAK_REALM}/protocol/openid-connect`;
      try {
        await axios
          .post(
            `${keycloakUrl}/token`,
            querystring.stringify({
              client_id: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
              // client_secret: process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET,
              username: values.email,
              password: values.password,
              grant_type: 'password', //'client_credentials'
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          )
          .then(async (response) => {
            console.log('response.data.access_token');
            setUserToken(response.data.access_token);
            localStorage.setItem('userToken', response.data.access_token);
            const token: any = decodeToken(response.data.access_token);
            console.log(token.email);
            setUser({
              userId: 1,
              userEmail: token.email,
              role: 'translator',
            });
            history.push('/profile');
          })
          .catch((error) => {
            setErrorMessage(error.response.data.error_description);
            console.log(error);
          });
      } catch (error: any) {
        setErrorMessage(error.message);
      }

      // history.push('/home');
    },
  });

  const handleToggleShow = () => {
    setShow((show) => !show);
  };

  const handleGoRegister = () => {
    history.push('/register');
  };

  const handleLogin = () => {
    if (!formik.isValid) {
      return;
    }
    formik.submitForm();
  };

  const handleForgotPassword = () => {
    history.push('/forgot-password');
  };

  useEffect(() => {
    localStorage.setItem('userToken', userToken);
  }, [userToken]);

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
          Login
        </Typography>
        {errorMessage && (
          <Typography sx={{ marginBottom: '18px', color: '#ff0000' }}>
            {errorMessage}{' '}
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

        <Button
          variant="contained"
          endIcon
          fullWidth
          onClick={handleLogin}
          disabled={!formik.isValid}
        >
          Login Now
        </Button>

        <Button
          variant="text"
          endIcon
          fullWidth
          color="gray"
          onClick={handleForgotPassword}
        >
          {'Forgot Password?'}
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
