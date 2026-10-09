import IconBase from './IconBase';

export default function CalendarIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="4" y="6" width="16" height="15" rx="3" />
      <path d="M8 3v6m8-6v6M4 11h16" />
    </IconBase>
  );
}
