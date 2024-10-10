import { Link as RouterLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUser } from '../context/UserContext.jsx'; 
import { API_BASE_URL } from '../util.js'; 
import {
  Flex,
  Box,
  Spacer,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
} from '@chakra-ui/react';

export default function NavBar() {
  const { user, updateUser } = useUser(); 
  const navigate = useNavigate(); 

  const handleSignOut = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signout`, {
        credentials: 'include', 
      });
      const { message } = await res.json();
      toast.success(message); 
      updateUser(null); 
      navigate('/'); 
    } catch (error) {
      toast.error('Ошибка при выходе из системы'); 
    }
  };

  return (
    <Box as='nav' bg='red.50'>
      <Flex
        minWidth='max-content'
        alignItems='center'
        p='12px'
        maxW='7xl'
        m='0 auto'
      >
        {/* Логотип и ссылка на главную */}
        <Box p='2'>
          <Link as={RouterLink} fontSize='lg' fontWeight='bold' to='/'>
            Taskly
          </Link>
        </Box>
        <Spacer />
        <Box>
          {user ? (
            <Menu>
              <MenuButton>
                <Image
                  boxSize='40px'
                  borderRadius='full'
                  src={user.avatar} 
                  alt={user.username}
                />
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to='/profile'>
                  Профиль
                </MenuItem>
                <MenuItem as={RouterLink} to='/tasks'>
                  Задачи
                </MenuItem>
                <MenuItem onClick={handleSignOut}>Выход</MenuItem> {/* Кнопка выхода */}
              </MenuList>
            </Menu>
          ) : (
            <Link as={RouterLink} to='/signin'>
              Вход{/* Ссылка на страницу входа */}
            </Link>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
