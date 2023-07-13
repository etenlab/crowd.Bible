import { useState, useEffect, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useFormik } from 'formik';

import { Button, Input, MuiMaterial, Typography } from '@eten-lab/ui-kit';

import { useAppContext } from '@/hooks/useAppContext';
import { useTr } from '@/hooks/useTr';

import { PageLayout } from '@/components/Layout';

import { FeedbackTypes } from '@/constants/common.constant';

import { UPDATE_USER } from '@/graphql/userQuery';

import { RouteConst } from '@/constants/route.constant';
import { AvatarUploader } from '../components/UploadAvatar';

const { Box, Stack } = MuiMaterial;

export function ProfilePage() {
  const { tr } = useTr();
  const history = useHistory();
  const {
    states: {
      global: { user },
    },
    actions: { setUser, alertFeedback, createLoadingStack },
  } = useAppContext();

  const [
    updateUser,
    { data: userData, loading: userLoading, error: userError },
  ] = useMutation<UpdatedUser>(UPDATE_USER);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const { startLoading, stopLoading } = useMemo(
    () => createLoadingStack('Updating User...'),
    [createLoadingStack],
  );

  const { handleChange, setValues, errors, isValid, submitForm, values } =
    useFormik<{
      email: string;
      username: string;
      first_name: string;
      last_name: string;
    }>({
      initialValues: {
        email: '',
        username: '',
        first_name: '',
        last_name: '',
      },
      onSubmit: async (values) => {
        if (!user) {
          alertFeedback(FeedbackTypes.ERROR, 'You should login or regist!');
          return;
        }

        updateUser({
          variables: {
            id: user.user_id,
            newUserData: {
              ...values,
              kid: user.kid,
              avatar_url: avatarUrl,
            },
          },
        });

        startLoading();
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

      setUser({
        ...userData.updateUser,
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
    stopLoading,
  ]);

  useEffect(() => {
    if (user) {
      setValues({
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
      });
      if (user.avatar_url) {
        setAvatarUrl(user.avatar_url);
      }
    } else {
      alertFeedback(FeedbackTypes.ERROR, 'You should login or regist!');
      history.push(RouteConst.HOME);
    }
  }, [user, setValues, history, alertFeedback]);

  const handleAvatarUrl = useCallback((avatar: string) => {
    setAvatarUrl(avatar);
  }, []);

  const handleSave = () => {
    if (!isValid) {
      return;
    }
    submitForm();
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
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Typography variant="h1" color="text.dark">
            {tr('My Profile')}
          </Typography>

          <AvatarUploader url={avatarUrl || ''} onAvatarUrl={handleAvatarUrl} />
        </Stack>

        <Input
          id="email"
          name="email"
          type="text"
          label={tr('Email')}
          onChange={handleChange}
          value={values.email}
          valid={values.email !== '' ? !errors.email : undefined}
          helperText={errors.email}
          fullWidth
          disabled
        />

        <Input
          id="username"
          name="username"
          type="text"
          label={tr('Username')}
          onChange={handleChange}
          value={values.username}
          valid={values.username !== '' ? !errors.username : undefined}
          helperText={errors.username}
          fullWidth
          disabled
        />

        <Input
          id="first_name"
          name="first_name"
          type="text"
          label={tr('First name')}
          onChange={handleChange}
          value={values.first_name}
          valid={values.first_name !== '' ? !errors.first_name : undefined}
          helperText={errors.first_name}
          fullWidth
        />

        <Input
          id="last_name"
          name="last_name"
          type="text"
          label={tr('Last name')}
          onChange={handleChange}
          value={values.last_name}
          valid={values.last_name !== '' ? !errors.last_name : undefined}
          helperText={errors.last_name}
          fullWidth
        />

        <Button
          variant="contained"
          endIcon
          fullWidth
          onClick={handleSave}
          disabled={!isValid}
        >
          {tr('Save')}
        </Button>
      </Box>
    </PageLayout>
  );
}
