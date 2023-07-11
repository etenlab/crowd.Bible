import { useState, useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { IonToolbar } from '@ionic/react';
import { useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useKeycloakClient } from '@eten-lab/sso';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { CREATE_USER } from '@/graphql/userQuery';

import {
  DiAdd,
  Button,
  MuiMaterial,
  Typography,
  Input,
  PasswordInput,
  useColorModeContext,
} from '@eten-lab/ui-kit';

import { PageLayout } from '@/components/Layout';
import { AvatarUploader } from '@/components/UploadAvatar';

import { decodeToken } from '@/utils/AuthUtils';
import { RouteConst } from '@/constants/route.constant';
import { FeedbackTypes, USER_TOKEN_KEY } from '@/constants/common.constant';

const { Box, Alert, Stack } = MuiMaterial;

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
  const { getColor } = useColorModeContext();

  const [
    createUser,
    { data: userData, loading: userLoading, error: userError },
  ] = useMutation<CreatedUser>(CREATE_USER);

  const {
    actions: { setUser, alertFeedback, createLoadingStack },
  } = useAppContext();

  const [show, setShow] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>('');

  const { startLoading, stopLoading } = useMemo(
    () => createLoadingStack('Saving User...'),
    [createLoadingStack],
  );

  const formik = useFormik<{
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    passwordConfirm: string;
  }>({
    initialValues: {
      email: '',
      username: '',
      first_name: '',
      last_name: '',
      password: '',
      passwordConfirm: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      logger.info(values.email);
      setErrorMessage('');
      setSuccessMessage('');

      const {
        startLoading: startRegisterLoading,
        stopLoading: stopRegisterLoading,
      } = createLoadingStack('Registering...');

      startRegisterLoading();

      await kcClient
        .register({
          email: values.email,
          username: values.email,
          password: values.password,
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(async (response: any) => {
          stopRegisterLoading();

          if (response.name !== 'AxiosError') {
            setSuccessMessage('User registration successfull');
            await kcClient
              .login({
                username: values.email,
                password: values.password,
              })
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .then((res: any) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const token: any = decodeToken(res.access_token);

                setToken(res.access_token);

                createUser({
                  variables: {
                    newUserData: {
                      kid: token.sub,
                      email: token.email,
                      first_name: values.first_name,
                      last_name: values.last_name,
                      username: values.username,
                      avatar_url: avatarUrl,
                    },
                  },
                });

                startLoading();
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

  useEffect(() => {
    if (userLoading) {
      return;
    }

    if (userData) {
      stopLoading();

      if (!!userError) {
        alertFeedback(FeedbackTypes.ERROR, 'Cannot save user to the server!');
        stopLoading();
        return;
      }

      if (!token) {
        alertFeedback(FeedbackTypes.ERROR, 'Cannot find user access token!');
        return;
      }

      localStorage.setItem(USER_TOKEN_KEY, token);

      setUser({
        ...userData.createUser,
        roles: [],
      });

      history.push(RouteConst.HOME);
    }
  }, [
    history,
    userData,
    userLoading,
    userError,
    alertFeedback,
    setUser,
    token,
    stopLoading,
  ]);

  const handleAvatarUrl = useCallback((avatar: string) => {
    setAvatarUrl(avatar);
  }, []);

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
          padding: '50px 20px 20px 20px',
          gap: '12px',
        }}
        noValidate
        autoComplete="off"
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
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
              <DiAdd color="blue-primary" sx={{ fontSize: '30px' }} />
            </Box>
            <Typography variant="h1" color="text.dark">
              {tr('Register')}
            </Typography>
          </Stack>
          <AvatarUploader url={avatarUrl || ''} onAvatarUrl={handleAvatarUrl} />
        </Stack>
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

        <Input
          id="first_name"
          name="first_name"
          type="text"
          label={tr('First name')}
          onChange={formik.handleChange}
          value={formik.values.first_name}
          valid={
            formik.values.first_name !== ''
              ? !formik.errors.first_name
              : undefined
          }
          helperText={formik.errors.first_name}
          fullWidth
        />

        <Input
          id="last_name"
          name="last_name"
          type="text"
          label={tr('Last name')}
          onChange={formik.handleChange}
          value={formik.values.last_name}
          valid={
            formik.values.last_name !== ''
              ? !formik.errors.last_name
              : undefined
          }
          helperText={formik.errors.last_name}
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
