import { BarLoader } from 'react-spinners';

export default function InlineLoader({ 
  loading = true, 
  color = '#667eea',
  width = '100%',
  height = 4 
}) {
  if (!loading) return null;
  
  return (
    <div style={{ width: '100%', margin: '10px 0' }}>
      <BarLoader 
        color={color} 
        width={width}
        height={height}
        speedMultiplier={0.8}
      />
    </div>
  );
}