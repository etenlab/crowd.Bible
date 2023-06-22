import { useState } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { decodeToken, isTokenValid } from '@/utils/AuthUtils';
import {
  Button,
  Input,
  MuiMaterial,
  PasswordInput,
  Typography,
} from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { USER_TOKEN_KEY } from '@/constants/common.constant';

import { PageLayout } from '@/components/Layout';

import { FeedbackTypes } from '@/constants/common.constant';
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
  const {
    logger,
    actions: { alertFeedback },
  } = useAppContext();
  const { tr } = useTr();
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
          alertFeedback(FeedbackTypes.SUCCESS, 'Password reset successfully');
          logger.info(res);
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((error: any) => {
          alertFeedback(FeedbackTypes.ERROR, error.message);
        });
    },
  });

  const [show, setShow] = useState<boolean>(false);
  const userToken = localStorage.getItem(USER_TOKEN_KEY);
  const apolloClient = useApolloClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token: any = decodeToken(userToken!);

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
      <PageLayout>
        <h3>{tr('Token not valid')}</h3>
      </PageLayout>
    );
  }

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
          {tr('My Profile')}
        </Typography>
        <Typography variant="h6" sx={{ color: '#5C6673', marginBottom: '5px' }}>
          {tr('EMAIL')}
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
          {tr('PASSWORD')}
        </Typography>
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
          onClick={handleSave}
          disabled={!formik.isValid}
        >
          {tr('Save')}
        </Button>
      </Box>
    </PageLayout>
  );
}
