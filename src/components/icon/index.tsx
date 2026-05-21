import React from 'react';

import ArrowDownIcon from './icons/arrowDown';
import ArrowLeftIcon from './icons/arrowLeft';
import ArrowRightIcon from './icons/arrowRight';
import ArrowUpIcon from './icons/arrowUp';
import BadgeIcon from './icons/badge';
import CalendarIcon from './icons/calendar';
import CheckLargeIcon from './icons/checkLarge';
import CircleAdd from './icons/circleAdd';
import CircleCheckIcon from './icons/circleCheck';
import ClockInIcon from './icons/clock-in';
import CloseIcon from './icons/close';
import DropDownIcon from './icons/dropDown';
import EyeIcon from './icons/eye';
import EyeOffIcon from './icons/eyeOff';
import FilterIcon from './icons/filter';
import ListIcon from './icons/list';
import LoginIcon from './icons/login';
import LogoutIcon from './icons/logout';
import SearchIcon from './icons/search';
import SettingsIcon from './icons/settings';
import ShapesIcon from './icons/shapes';
import SynchronizeIcon from './icons/synchronize';
import TrashCan from './icons/trashCan';
import WarningIcon from './icons/warning';
import WarningLargeIcon from './icons/warningLarge';

export interface SvgProps {
  width?: number;
  height?: number;
  fill?: string;
  fillOpacity?: number;
}

const iconComponents = {
  clockIn: ClockInIcon,
  settings: SettingsIcon,
  close: CloseIcon,
  warning: WarningIcon,
  circleCheck: CircleCheckIcon,
  circleAdd: CircleAdd,
  trashCan: TrashCan,
  arrowDown: ArrowDownIcon,
  arrowLeft: ArrowLeftIcon,
  arrowRight: ArrowRightIcon,
  arrowUp: ArrowUpIcon,
  badge: BadgeIcon,
  calendar: CalendarIcon,
  checkLarge: CheckLargeIcon,
  dropDown: DropDownIcon,
  eye: EyeIcon,
  eyeOff: EyeOffIcon,
  filter: FilterIcon,
  list: ListIcon,
  login: LoginIcon,
  logout: LogoutIcon,
  search: SearchIcon,
  shapes: ShapesIcon,
  synchronize: SynchronizeIcon,
  warningLarge: WarningLargeIcon,
} as const;

export type IconName = keyof typeof iconComponents;

interface IconProps extends SvgProps {
  name: IconName;
}

const Icon = ({
  name,
  fill,
  fillOpacity,
  width = 20,
  height = 20,
}: IconProps) => {
  const SelectedIcon = iconComponents[name];

  return <SelectedIcon {...{fill, width, height, fillOpacity}} />;
};

export default Icon;
