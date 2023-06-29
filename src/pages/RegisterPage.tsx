import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonToolbar } from '@ionic/react';
import { useKeycloakClient } from '@eten-lab/sso';
import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import {
  Button,
  MuiMaterial,
  Typography,
  Input,
  PasswordInput,
} from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';

import { useFormik } from 'formik';
import { decodeToken } from '@/utils/AuthUtils';
import * as Yup from 'yup';
import { RouteConst } from '@/constants/route.constant';
import { USER_TOKEN_KEY } from '../constants/common.constant';
const { Box, Alert } = MuiMaterial;

const validationSchema = Yup.object().shape({
  username: Yup.string().required('First name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
});

export function RegisterPage() {
  const history = useHistory();
  const kcClient = useKeycloakClient();
  const { logger } = useAppContext();
  const { tr } = useTr();
  const {
    actions: { setUser },
  } = useAppContext();
  const formik = useFormik<{
    email: string;
    username: string;
    password: string;
    passwordConfirm: string;
  }>({
    initialValues: {
      email: '',
      username: '',
      password: '',
      passwordConfirm: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      logger.info(values.email);
      setErrorMessage('');
      setSuccessMessage('');

      await kcClient
        .register({
          email: values.email,
          username: values.email,
          password: values.password,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(async (response: any) => {
          if (response.name !== 'AxiosError') {
            setSuccessMessage('User registration successfull');
            await kcClient
              .login({
                username: values.email,
                password: values.password,
              })
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .then((res: any) => {
                localStorage.setItem(USER_TOKEN_KEY, res.access_token);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const token: any = decodeToken(res.access_token);
                setUser({
                  userId: token.sub,
                  userEmail: token.email,
                  roles: [],
                });
                history.push(RouteConst.HOME);
              })
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .catch((err: any) => {
                setErrorMessage(err.response.data.error_description);
              });
          } else {
            setErrorMessage(response.response.data.errorMessage);
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((error: any) => {
          setErrorMessage(error.message);
        });
    },
  });

  const [show, setShow] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // const [userToken, setUserToken] = useState('');

  const handleToggleShow = () => {
    setShow((show) => !show);
  };

  const handleGoLoginPage = () => {
    history.push(RouteConst.LOGIN);
  };

  const handleGoHome = () => {
    history.push(RouteConst.HOME);
  };

  const handleRegister = () => {
    if (!formik.isValid) {
      return;
    }

    formik.submitForm();
  };

  return (
    <PageLayout>
      <IonToolbar class="ionic-toolbar">
        <Button variant="text" onClick={handleGoHome}>
          <Typography
            variant="h2"
            color="text.dark"
            sx={{ textTransform: 'none', px: '20px' }}
          >
            {tr('crowd.Bible')}
          </Typography>
        </Button>
      </IonToolbar>
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
          {tr('Register')}
        </Typography>
        {errorMessage && (
          <Alert severity="error" id="error-message">
            {errorMessage}
          </Alert>
        )}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
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

        <Input
          id="username"
          name="username"
          type="text"
          label={tr('Username')}
          onChange={formik.handleChange}
          value={formik.values.username}
          valid={
            formik.values.username !== '' ? !formik.errors.username : undefined
          }
          helperText={formik.errors.username}
          fullWidth
        />

        <PasswordInput
          id="password"
          name="password"
          label={tr('Password')}
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
          label={tr('Repeat Password')}
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
          {tr('Register Now')}
        </Button>

        <Button
          variant="text"
          endIcon
          fullWidth
          color="gray"
          onClick={handleGoLoginPage}
        >
          {tr('Do you have an account?')}
        </Button>
      </Box>
    </PageLayout>
  );
}
