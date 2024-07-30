import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import { IconUser, IconLogout, IconId } from "@tabler/icons-react";
import { borrarSesion, getToken } from "@/hooks/SessionUtils";
import { useRouter } from "next/navigation";
import { api_usuarios } from "@/hooks/Api";
import { useSnackbar } from "notistack";

const Profile = () => {
  const router = useRouter();
  const token = getToken();
  const { enqueueSnackbar } = useSnackbar();

  const [anchorEl2, setAnchorEl2] = useState(null);
  const [usuario, setUsuario] = useState({
    nombres: "Anónimo",
    apellidos: "Anónimo",
    cedula: "0000000000",
  });

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = () => {
    borrarSesion();
    router.push("/");
  };
  
  useEffect(() => {
    try {
      const fetchUsuario = async () => {
        const response = await api_usuarios.obtener(token);
  
        if (response.data.code === 200) {
          setUsuario(response.data.datos);
        }
        
      };
      fetchUsuario();
    } catch (error) {
      enqueueSnackbar("Error al obtener los datos del usuario", { variant: "error" });
    }

  }, [token, enqueueSnackbar]);

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        {/*<Avatar
          src="/images/profile/user-1.jpg"
          alt="image"
          sx={{
            width: 35,
            height: 35,
          }}
        />*/}
        <Avatar
          sx={{
            width: 40,
            height: 40,
            border: "2px solid #fff",
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        <Box px={2} py={1}>
          <Box display="flex" alignItems="center" mb={1}>
            <IconUser width={20} />
            <Typography variant="body1" ml={1}>
              {usuario.nombres}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <IconId width={20} />
            <Typography variant="body1" ml={1}>
              {usuario.cedula}
            </Typography>
          </Box>
        </Box>
        <Box mt={1} py={1} px={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLogout}
            fullWidth
            startIcon={<IconLogout width={20} />}
          >
            Cerrar Sesión
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
