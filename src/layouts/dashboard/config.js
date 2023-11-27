import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import Cog8ToothIcon from "@heroicons/react/24/solid/Cog8ToothIcon";
import HeartIcon from "@heroicons/react/24/solid/HeartIcon";
import { SvgIcon } from "@mui/material";

export const items = [
  {
    title: "Thiết bị y tế",
    path: "/",
    // for: "accountant",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Thiết bị y tế",
    path: "/tools",
    for: "accountant",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Thuốc chữa bệnh",
    path: "/medicines",
    for: "accountant",
    icon: (
      <SvgIcon fontSize="small">
        <HeartIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Quản lý thuốc",
    path: "/config-medicine",
    for: "admin",
    icon: (
      <SvgIcon fontSize="small">
        <Cog8ToothIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Quản lý thiết bị y tế",
    path: "/config-tool",
    for: "admin",
    icon: (
      <SvgIcon fontSize="small">
        <Cog8ToothIcon />
      </SvgIcon>
    ),
  },
];
