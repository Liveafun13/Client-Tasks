import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
  FormControl,
  Input,
  Button,
  Text,
  Box,
  Flex,
  Heading,
  Stack,
  FormErrorMessage,
} from '@chakra-ui/react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../util.js'; 
import { useUser } from '../context/UserContext.jsx'; 

export default function SignIn() {
  const navigate = useNavigate();  
  const { updateUser } = useUser();  
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm(); 

  const doSubmit = async (values) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  
        body: JSON.stringify(values),  
      });
      const data = await res.json();

      if (res.status === 200) {
        toast.success('Sign In Successful');  
        updateUser(data);  
        navigate('/profile');  
      } else {
        toast.error(data.message); 
      }
    } catch (error) {
      console.log("Ошибка при в ходе" + error);
      toast.error('Что то пошло не так');  
    }
  };

  return (
    <Box p='3' maxW='lg' mx='auto'>
      <Heading
        as='h1'
        textAlign='center'
        fontSize='3xl'
        fontWeight='semibold'
        my='7'
      >
        Введите ваши учетные данные
      </Heading>

      <form onSubmit={handleSubmit(doSubmit)}>
        <Stack gap='4'>
          {/* Поле для ввода email */}
          <FormControl isInvalid={errors.email}>
            <Input
              id='email'
              type='email'
              placeholder='Email'
              {...register('email', { required: 'Email is required' })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          {/* Поле для ввода пароля */}
          <FormControl isInvalid={errors.password}>
            <Input
              id='password'
              type='password'
              placeholder='Password'
              {...register('password', { required: 'Password is required' })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          {/* Кнопка для входа */}
          <Button
            type='submit'
            isLoading={isSubmitting}
            colorScheme='teal'
            textTransform='uppercase'
          >
           Войти
          </Button>
        </Stack>
      </form>

      {/* Ссылка для регистрации */}
      <Flex gap='2' mt='5'>
        <Text>У вас еще нет аккаунта?</Text>
        <Link to='/signup'>
          <Text as='span' color='blue.400'>
            Зарегистрироватья
          </Text>
        </Link>
      </Flex>
    </Box>
  );
}
