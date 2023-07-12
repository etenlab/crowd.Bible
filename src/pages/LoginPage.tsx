import { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { IonToolbar } from '@ionic/react';
import { useLazyQuery } from '@apollo/client';
import { useKeycloakClient } from '@eten-lab/sso';

import {
  DiUser,
  Button,
  MuiMaterial,
  Typography,
  Input,
  PasswordInput,
  useColorModeContext,
} from '@eten-lab/ui-kit';

import { useFormik } from 'formik';
import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import * as Yup from 'yup';

import { decodeToken } from '@/utils/AuthUtils';
import { RouteConst } from '@/constants/route.constant';
import { USER_TOKEN_KEY } from '@/constants/common.constant';

import { GET_USER } from '@/graphql/userQuery';

import { PageLayout } from '@/components/Layout';

import { FeedbackTypes } from '@/constants/common.constant';

const { Box, Stack } = MuiMaterial;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export function LoginPage() {
  const history = useHistory();
  const kcClient = useKeycloakClient();
  const { getColor } = useColorModeContext();
  const { tr } = useTr();
  const {
    actions: { setUser, createLoadingStack, alertFeedback },
    logger,
  } = useAppContext();

  const [show, setShow] = useState<boolean>(false);
  const [userToken, setUserToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [
    getUser,
    {
      data: userData,
      loading: userLoading,
      error: userError,
      called: userCalled,
    },
  ] = useLazyQuery<GetUser>(GET_USER);

  const [token, setToken] = useState<string | null>('');

  const { startLoading, stopLoading } = useMemo(
    () => createLoadingStack('Loading User...'),
    [createLoadingStack],
  );

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

      const { startLoading: startLoginLoading, stopLoading: stopLoginLoading } =
        createLoadingStack('Login...');

      startLoginLoading();

      await kcClient
        .login({
          username: values.email,
          password: values.password,
        })
        .then((res) => {
          stopLoginLoading();

          if (res.name !== 'AxiosError') {
            setUserToken(res.access_token);
            localStorage.setItem(USER_TOKEN_KEY, res.access_token);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const token: any = decodeToken(res.access_token);

            setToken(res.access_token);

            getUser({
              variables: {
                email: token.email,
              },
            });

            startLoading();
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

  useEffect(() => {
    if (userLoading) {
      return;
    }

    if (userCalled && !!userError) {
      alertFeedback(FeedbackTypes.ERROR, 'Cannot get user from the server!');
      stopLoading();
      return;
    }

    if (userData) {
      stopLoading();

      if (!userData.getUser) {
        alertFeedback(FeedbackTypes.ERROR, 'Cannot get user from the server!');
        return;
      }

      if (!token) {
        alertFeedback(FeedbackTypes.ERROR, 'Cannot find user access token!');
        return;
      }

      localStorage.setItem(USER_TOKEN_KEY, token);

      setUser({
        ...userData.getUser,
        roles: [],
      });

      history.push(RouteConst.HOME);
    }
  }, [
    history,
    userData,
    userLoading,
    userCalled,
    userError,
    alertFeedback,
    setUser,
    token,
    stopLoading,
  ]);

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

  const handleGoHome = () => {
    history.push(RouteConst.HOME);
  };

  const handleForgotPassword = () => {
    history.push(RouteConst.FORGET_PASSWORD);
  };

  useEffect(() => {
    localStorage.setItem(USER_TOKEN_KEY, userToken);
  }, [userToken]);

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
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          gap="16px"
        >
          <Box
            sx={{
              background: getColor('bg-second'),
              padding: '10px',
              borderRadius: '10px',
            }}
          >
            <DiUser color="blue-primary" sx={{ fontSize: '30px' }} />
          </Box>
          <Typography variant="h1" color="text.dark">
            {tr('Login')}
          </Typography>
        </Stack>
        {errorMessage && (
          <Typography sx={{ marginBottom: '18px', color: '#ff0000' }}>
            {errorMessage}
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

        <Button
          variant="contained"
          endIcon
          fullWidth
          onClick={handleLogin}
          disabled={!formik.isValid}
        >
          {tr('Login Now')}
        </Button>

        <Button
          variant="text"
          endIcon
          fullWidth
          color="gray"
          onClick={handleForgotPassword}
        >
          {tr('Forgot Password?')}
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
