import { PulseLoader } from 'react-spinners';

export default function ButtonLoader({ color = '#ffffff', size = 8 }) {
  return <PulseLoader color={color} size={size} speedMultiplier={0.8} />;
}