import React from 'react';
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
import { toast } from 'react-hot-toast';
import { useUser } from '../context/UserContext.jsx'; 
import { API_BASE_URL } from '../util.js';

export default function SignUp() {
  const { updateUser } = useUser(); 
  const navigate = useNavigate(); 
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const doSubmit = async (values) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.status === 200) {
        toast.success('Регистрация прошла успешно. Вы вошли в систему');
        updateUser(data); 
        navigate('/profile'); 
      } else {
        toast.error(data.message || 'Ошибка регистрации');
      }
    } catch (error) {
      toast.error('Что-то пошло не так');
    }
  };

  return (
    <Box p='3' maxW='lg' mx='auto'>
      <Heading as='h1' textAlign='center' fontSize='3xl' fontWeight='semibold' my='7'>
        Создайте аккаунт
      </Heading>

      <form onSubmit={handleSubmit(doSubmit)}>
        <Stack spacing='4'>
          {/* Поле для ввода имени пользователя */}
          <FormControl isInvalid={errors.username}>
            <Input
              id='username'
              type='text'
              placeholder='Имя пользователя'
              {...register('username', { required: 'Имя пользователя обязательно' })}
            />
            <FormErrorMessage>
              {errors.username && errors.username.message}
            </FormErrorMessage>
          </FormControl>

          {/* Поле для ввода email */}
          <FormControl isInvalid={errors.email}>
            <Input
              id='email'
              type='email'
              placeholder='Email'
              {...register('email', { required: 'Email обязателен' })}
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
              placeholder='Пароль'
              {...register('password', { required: 'Пароль обязателен' })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          {/* Кнопка отправки формы */}
          <Button
            type='submit'
            isLoading={isSubmitting}
            colorScheme='teal'
            textTransform='uppercase'
          >
            Зарегистрироваться
          </Button>
        </Stack>
      </form>

      {/* Ссылка для перехода на страницу входа */}
      <Flex gap='2' mt='5' justifyContent='center'>
        <Text>Уже есть аккаунт?</Text>
        <Link to='/signin'>
          <Text as='span' color='blue.400'>
            Войти
          </Text>
        </Link>
      </Flex>
    </Box>
  );
}
