// Entry for the staff admin at /admin/ (admin/index.html). Not pre-rendered, never indexed.
import '@fontsource-variable/sora';
import '@fontsource-variable/figtree';
import './admin.css';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('admin')).render(<App />);
