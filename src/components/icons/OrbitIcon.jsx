import IconBase from './IconBase';

export default function OrbitIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="4" />
      <ellipse cx="12" cy="12" rx="11" ry="4.5" transform="rotate(-35 12 12)" />
    </IconBase>
  );
}
