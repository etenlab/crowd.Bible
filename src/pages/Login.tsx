import { useState } from "react";
import { useHistory } from "react-router-dom";

import { IonContent } from "@ionic/react";

import {
  Button,
  MuiMaterial,
  Typography,
  colors,
  Input,
  PasswordInput,
} from "@eten-lab/ui-kit";
import { useFormik } from "formik";
import * as Yup from "yup";

import axios from "axios";

import { PageLayout } from "../components/PageLayout";

const { Box } = MuiMaterial;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export function LoginPage() {
  const [show, setShow] = useState<boolean>(false);
  const history = useHistory();
  const formik = useFormik<{
    email: string | null;
    password: string | null;
  }>({
    initialValues: {
      email: null,
      password: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const url = `${process.env.REACT_APP_DATABASE_API_URL}/users/login`;
      const queryParams = { realm: process.env.REACT_APP_REALM_NAME };
      const headers = { "Content-Type": "application/json" };
      const requestBody = {
        email: values.email,
        password: values.password,
      };

      try {
        const result = await axios.post(url, requestBody, {
          params: queryParams,
          headers: headers,
        });

        console.log(result);
      } catch (err) {
        console.log(err);
      }
    },
  });

  const handleToggleShow = () => {
    setShow((show) => !show);
  };

  const handleGoRegister = () => {
    history.push("/register");
  };

  const handleLogin = () => {
    if (!formik.isValid) {
      return;
    }

    formik.submitForm();
  };

  return (
    <PageLayout
      isHeader={false}
      content={
        <IonContent fullscreen>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "123px 20px 20px 20px",
              gap: "12px",
            }}
            noValidate
            autoComplete="off"
          >
            <Typography
              variant="h1"
              sx={{ color: colors["dark"], marginBottom: "18px" }}
            >
              Register
            </Typography>

            <Input
              id="email"
              name="email"
              type="text"
              label="Email"
              onChange={formik.handleChange}
              value={formik.values.email}
              valid={
                formik.values.email !== null
                  ? !Boolean(formik.errors.email)
                  : undefined
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
                  ? !Boolean(formik.errors.password)
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
              Don't you have an account?
            </Button>
          </Box>
        </IonContent>
      }
    />
  );
}
