import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';

const theme = extendTheme({
  colors: {
    'primary': "#ecc94b",
    'primary-50': "#fff9e6",
    'primary-100': "#ffecb3",
    'primary-200': "#ffe180",
    'primary-300': "#ffd64d",
    'primary-400': "#ffcb1a",
    'primary-600': "#d9b42d",
    'primary-700': "#b79e0f",
    'primary-800': "#948700",
    'primary-900': "#706000",
  },
  fonts: {
    heading: 'Poppins, sans-serif',
    body: 'Roboto, sans-serif',
  },

});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
