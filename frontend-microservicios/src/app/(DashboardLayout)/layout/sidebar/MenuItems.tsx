import {
  IconAperture,
  IconCopy,
  IconCpu2,
  IconDeviceHeartMonitor,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
  IconUsersGroup,
  IconTags
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
    href: "/inicio",
  },

  {
    navlabel: true,
    subheader: "  Control",
  },
  {
    id: uniqueId(),
    title: "Sensores",
    icon: IconCpu2,
    href: "/control/sensores",
  },
  {
    id: uniqueId(),
    title: "Cuentas",
    icon: IconUsersGroup,
    href: "/control/cuentas",
  },
  {
    id: uniqueId(),
    title: "Roles",
    icon: IconTags,
    href: "/control/roles",
  }
  

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
  // {
  //   navlabel: true,
  //   subheader: "Autentificación",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Iniciar Sesión",
  //   icon: IconLogin,
  //   href: "/authentication/login",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Registro",
  //   icon: IconUserPlus,
  //   href: "/authentication/register",
  // },
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
