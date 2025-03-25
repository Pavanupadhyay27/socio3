import { RouteObject } from 'react-router-dom';
import App from './App';
import { Home } from './pages/Home';
import { CreatePost } from './pages/CreatePost';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'create',
        element: <CreatePost />
      }
    ]
  }
];
