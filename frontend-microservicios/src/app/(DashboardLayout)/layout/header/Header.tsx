import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Badge,
  Button,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
// components
import Profile from "./Profile";
import { IconMenu, IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react";
import { getToken } from "@/hooks/SessionUtils";
import { api_sensores, api_usuarios } from "@/hooks/Api";

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

interface StatusBoxProps {
  isMonitoring: boolean;
}

const StatusBox = styled(Box)<StatusBoxProps>(({ theme, isMonitoring }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1),
  backgroundColor: "#e0e0e0",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  "& .icon": {
    marginRight: theme.spacing(1),
    animation: "glow 1.5s infinite alternate",
  },
  "@keyframes glow": {
    "0%": {
      boxShadow: isMonitoring
        ? `0 0 5px ${theme.palette.success.main}`
        : `0 0 5px ${theme.palette.error.main}`,
    },
    "100%": {
      boxShadow: isMonitoring
        ? `0 0 20px ${theme.palette.success.main}`
        : `0 0 20px ${theme.palette.error.main}`,
    },
  },
  "& .status-text": {
    fontSize: "0.875rem", // adjust font size
    lineHeight: 1.2,
  },
}));

const Header = ({ toggleMobileSidebar }: ItemType) => {
  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const token = getToken();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: "#f5f5f5",
    justifyContent: "center",
    borderBottom: `1px solid ${theme.palette.divider}`,
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    const checkAdminStatus = async () => {

      const response = await api_usuarios.validar_admin(token);

      if (response.data.code === 200) {
        setIsAdmin(response.data.datos);
      }
    }
    checkAdminStatus();
  }, [token]);

  useEffect(() => {
    const fetchMonitoringStatus = async () => {
      try {
        const response = await api_sensores.estado_monitoreo(token);

        setIsMonitoring(response.data.datos);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMonitoringStatus();

    const intervalId = setInterval(fetchMonitoringStatus, 3000); // Intervalo de 3 segundos para volver a hacer la petición
    return () => clearInterval(intervalId);
  }, [token]);

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        {/* <IconButton
          size="large"
          aria-label="show 11 new notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
        >
          <Badge variant="dot" color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>
        </IconButton> */}

        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          {isAdmin && (
            <StatusBox isMonitoring={isMonitoring}>
            <IconButton 
              color={isMonitoring ? "success" : "error"} 
              size="small" 
              disableRipple
              sx={{ 
                "&:hover": { 
                  backgroundColor: "transparent",
                  cursor: "default",
                } 
              }}
            >
              {isMonitoring ? (
                <IconPlayerPlay size={24} className="icon" />
              ) : (
                <IconPlayerStop size={24} className="icon" />
              )}
            </IconButton>
            <Typography variant="body1">
              {isMonitoring ? "Monitoreando Sensores" : "Monitoreo Detenido"}
            </Typography>
          </StatusBox>
          )}
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
