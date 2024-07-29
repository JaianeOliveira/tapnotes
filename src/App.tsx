import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { routes } from './routes';

import { PrimeReactProvider } from 'primereact/api';

import 'primereact/resources/themes/viva-light/theme.css';

export default function App() {
  return (
    <PrimeReactProvider>
      <RouterProvider router={routes} />
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </PrimeReactProvider>
  );
}
