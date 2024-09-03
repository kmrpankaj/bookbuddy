import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ url }) => {
  useEffect(() => {
    // Redirect to the external URL
    window.location.href = url;
}, [url]);

return null; // Render nothing
}

export default Home