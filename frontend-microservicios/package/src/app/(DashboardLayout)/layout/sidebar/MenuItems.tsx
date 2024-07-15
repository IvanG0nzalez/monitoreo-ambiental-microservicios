import {
  IconAperture,
  IconCopy,
  IconDeviceHeartMonitor,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "  Inicio",
  },
  {
    id: uniqueId(),
    title: "Monitoreo",
    icon: IconDeviceHeartMonitor,
    href: "/",
  },

  {
    navlabel: true,
    subheader: "  Control",
  },
  {
    id: uniqueId(),
    title: "Sensores",
    icon: IconDeviceHeartMonitor,
    href: "/control/sensores",
  },
  {
    id: uniqueId(),
    title: "Cuentas",
    icon: IconDeviceHeartMonitor,
    href: "/control/cuentas",
  },
  

  // {
  //   navlabel: true,
  //   subheader: "Utilidades",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Typography",
  //   icon: IconTypography,
  //   href: "/utilities/typography",
  // },
  
  // {
  //   id: uniqueId(),
  //   title: "Shadow",
  //   icon: IconCopy,
  //   href: "/utilities/shadow",
  // },
  {
    navlabel: true,
    subheader: "Autentificación",
  },
  {
    id: uniqueId(),
    title: "Iniciar Sesión",
    icon: IconLogin,
    href: "/authentication/login",
  },
  {
    id: uniqueId(),
    title: "Registro",
    icon: IconUserPlus,
    href: "/authentication/register",
  },
  // {
  //   navlabel: true,
  //   subheader: "Extra",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Icons",
  //   icon: IconMoodHappy,
  //   href: "/icons",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Sample Page",
  //   icon: IconAperture,
  //   href: "/sample-page",
  // },
];

export default Menuitems;
