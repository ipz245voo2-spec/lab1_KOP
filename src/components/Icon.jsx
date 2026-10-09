import OrbitIcon from './icons/OrbitIcon';
import ArrowIcon from './icons/ArrowIcon';
import RocketIcon from './icons/RocketIcon';
import CalendarIcon from './icons/CalendarIcon';
import GlobeIcon from './icons/GlobeIcon';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';
import ResetIcon from './icons/ResetIcon';
import MoonIcon from './icons/MoonIcon';
import SunIcon from './icons/SunIcon';

const icons = {
  orbit: OrbitIcon,
  arrow: ArrowIcon,
  rocket: RocketIcon,
  calendar: CalendarIcon,
  globe: GlobeIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  reset: ResetIcon,
  moon: MoonIcon,
  sun: SunIcon,
};

export default function Icon({ name, size = 20, className = '', ...props }) {
  const IconComponent = icons[name];
  if (!IconComponent) {
    return null;
  }
  return <IconComponent size={size} className={className} {...props} />;
}

export {
  OrbitIcon,
  ArrowIcon,
  RocketIcon,
  CalendarIcon,
  GlobeIcon,
  PlusIcon,
  MinusIcon,
  ResetIcon,
  MoonIcon,
  SunIcon,
};
