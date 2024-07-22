import React from "react";
import {
  Box,
  Typography,
  FormGroup,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/hooks/ValidationSchemas";
import { api_cuentas } from "@/hooks/Api";
import { useSnackbar } from "notistack";

import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data: any) => {
    try {
      const response = await api_cuentas.inicio_sesion(data);
      console.log(response);
      
      if (response.status === 200) {
        enqueueSnackbar("Inicio de sesión exitoso", { variant: "success" });
      } else {
        enqueueSnackbar("Error al iniciar sesión", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Error al iniciar sesión", { variant: "error" });
    }
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="correo"
              mb="5px"
            >
              Correo Electronico
            </Typography>
            <Controller
              name="correo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  type="text"
                  variant="outlined"
                  fullWidth
                  error={errors.correo ? true : false}
                  helperText={errors.correo ? errors.correo.message : ""}
                />
              )}
            />
          </Box>
          <Box mt="25px">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="clave"
              mb="5px"
            >
              Contraseña
            </Typography>
            <Controller
              name="clave"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  type="password"
                  variant="outlined"
                  fullWidth
                  error={errors.clave ? true : false}
                  helperText={errors.clave ? errors.clave.message : ""}
                />
              )}
            />
          </Box>
          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            my={2}
          ></Stack>
        </Stack>
        <Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
          >
            Iniciar Sesión
          </Button>
        </Box>
      </form>
    </>
  );
};

export default AuthLogin;
