import Card from '../components/Card';
import { useTheme } from '../context/ThemeContext';

function Vision() {
  const { theme } = useTheme();
  return (
    <>
      <h1>Vision</h1>
      <Card theme={theme} />
    </>
  );
}

export default Vision;
