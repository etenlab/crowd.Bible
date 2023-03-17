import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import {
  Button,
  MuiMaterial,
  Typography,
  Input,
  PasswordInput,
} from '@eten-lab/ui-kit';
import { useFormik } from 'formik';
import { useAppContext } from '../hooks/useAppContext';
import * as Yup from 'yup';

// import axios from "axios";

const { Box } = MuiMaterial;

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
  const history = useHistory();
  const {
    actions: { setUser },
  } = useAppContext();
  const formik = useFormik<{
    email: string | null;
    password: string | null;
  }>({
    initialValues: {
      email: null,
      password: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      // const url = `${process.env.REACT_APP_DATABASE_API_URL}/users/login`;
      // const queryParams = { realm: process.env.REACT_APP_REALM_NAME };
      // const headers = { "Content-Type": "application/json" };
      // const requestBody = {
      //   email: values.email,
      //   password: values.password,
      // };

      // try {
      //   const result = await axios.post(url, requestBody, {
      //     params: queryParams,
      //     headers: headers,
      //   });

      // } catch (err) {
      //   console.log(err);
      // }

      setUser({
        userId: 1,
        userEmail: values.email!,
        role: 'translator',
      });
      history.push('/home');
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

        <Input
          id="email"
          name="email"
          type="text"
          label="Email"
          onChange={formik.handleChange}
          value={formik.values.email}
          valid={
            formik.values.email !== null ? !formik.errors.email : undefined
          }
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
            formik.values.password !== null
              ? !formik.errors.password
              : undefined
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
          onClick={handleGoRegister}
        >
          {"Don't you have an account?"}
        </Button>
      </Box>
    </IonContent>
  );
}
