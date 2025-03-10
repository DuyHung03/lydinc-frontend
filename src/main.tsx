import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';
import '../src/component/editor/Editor.scss';
import App from './App.tsx';
import './index.css';
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <MantineProvider>
        <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </MantineProvider>
);
