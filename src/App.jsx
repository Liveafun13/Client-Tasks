import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';  
import PrivateRoute from './components/PrivateRoute';  
import NavBar from './components/NavBar';  
import { UserProvider } from './context/UserContext';  
import CreateTask from './pages/CreateTask';
import UpdateTask from './pages/UpdateTask';
import Tasks from './pages/Tasks';
import SingleTask from './pages/SingleTask';

export default function App() {
  return (
    <UserProvider> {/* Оборачиваем приложение в контекст */}
      <ChakraProvider>
        <BrowserRouter>
          <Toaster position='bottom-right' />
          <NavBar />  {/* Панель навигации */}
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/signin' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} />

            {/* Защищенные маршруты */}
            <Route element={<PrivateRoute />}>
              <Route path='/profile' element={<Profile />} />
              <Route path='/create-task' element={<CreateTask />} />
              <Route path='/update-task/:taskId' element={<UpdateTask />} />
              <Route path='/tasks' element={<Tasks />} />
              <Route path='/tasks/:taskId' element={<SingleTask />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </UserProvider>
  );
}
