import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonToolbar } from '@ionic/react';
import { useKeycloakClient } from '@eten-lab/sso';

import {
  Button,
  MuiMaterial,
  Typography,
  Input,
  PasswordInput,
} from '@eten-lab/ui-kit';

import { Link } from '@/components/Link';

import { useFormik } from 'formik';
import { useAppContext } from '@/hooks/useAppContext';
import * as Yup from 'yup';

import { decodeToken } from '@/utils/AuthUtils';
import { RouteConst } from '@/constants/route.constant';
import { USER_TOKEN_KEY } from '@/constants/common.constant';

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
  const kcClient = useKeycloakClient();
  const [show, setShow] = useState<boolean>(false);
  const [userToken, setUserToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const {
    actions: { setUser },
    logger,
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
      logger.info(values.email);
      logger.info(values.password);

      await kcClient
        .login({
          username: values.email,
          password: values.password,
        })
        .then((res) => {
          if (res.name !== 'AxiosError') {
            setUserToken(res.access_token);
            localStorage.setItem(USER_TOKEN_KEY, res.access_token);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const token: any = decodeToken(res.access_token);
            setUser({
              userId: token.sub,
              userEmail: token.email,
              roles: [],
            });
            history.push(RouteConst.HOME);
          } else {
            setErrorMessage(res.response.data.error_description);
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((err: any) => {
          setErrorMessage(err.error_description);
        });
    },
  });

  const handleToggleShow = () => {
    setShow((show) => !show);
  };

  const handleGoRegister = () => {
    history.push(RouteConst.REGISTER);
  };

  const handleLogin = () => {
    if (!formik.isValid) {
      return;
    }
    formik.submitForm();
  };

  const handleForgotPassword = () => {
    history.push(RouteConst.FORGET_PASSWORD);
  };

  useEffect(() => {
    localStorage.setItem(USER_TOKEN_KEY, userToken);
  }, [userToken]);

  return (
    <IonContent>
      <IonToolbar class="ionic-toolbar">
        <Link to="/">
          <Typography
            variant="h2"
            color="text.dark"
            sx={{ textTransform: 'none', px: '20px' }}
          >
            crowd.Bible
          </Typography>
        </Link>
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
          Login
        </Typography>
        {errorMessage && (
          <Typography sx={{ marginBottom: '18px', color: '#ff0000' }}>
            {errorMessage}
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
          Forgot Password?
        </Button>

        <Button
          variant="text"
          endIcon
          fullWidth
          color="gray"
          onClick={handleGoRegister}
        >
          Don&apos;t you have an account?
        </Button>
      </Box>
    </IonContent>
  );
}
