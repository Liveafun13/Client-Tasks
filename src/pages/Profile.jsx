import { useForm } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import { API_BASE_URL } from '../util.js';
import toast from 'react-hot-toast';
import { Box, Heading, Center, Image, Input, Stack, FormControl, Button, FormErrorMessage, Text, Flex } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import DeleteConfirmation from '../components/DeleteConfirmation.jsx';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { AvatarUploader } from '../components/AvatarUploader.jsx';


export default function Profile() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, updateUser } = useUser();
  const [files, setFiles] = useState(false);

  const { control, register, handleSubmit, resetField, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      avatar: user.avatar,
      username: user.username,
      email: user.email,
    },      
  });

  const doSubmit = async (values) => {
    try {
      if (files.length > 0) {
        const newUrl = await handleFileUpload(files);
        if (newUrl) {
          values.avatar = newUrl;
        }
      }   
      const res = await fetch(`${API_BASE_URL}/users/update/${user._id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.status === 200) {
        resetField('password');
        updateUser(data);
        toast.success('Profile Updated');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Profile Update Error');
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/delete/${user._id}`, { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (res.status === 200) {
        toast.success(data.message);
        updateUser(null);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Delete Error');
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signout`, { credentials: 'include' });
      const data = await res.json();
      toast.success(data.message);
      updateUser(null);
      navigate('/');
    } catch (error) {
      toast.error(error);
    }
  };

  const handleFileUpload = async files => {
    const formData = new FormData();
    formData.append('image', files[0]);
    try {
      const res = await fetch(`${API_BASE_URL}/image/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const response = await res.json();
      return response.imageUrl;
    } catch (error) {
      console.log(error);
      Throw(error);
    }
  };


  return (
    <Box p='3' maxW='lg' mx='auto'>
      <DeleteConfirmation
        alertTitle='Delete Account'
        handleClick={handleDeleteUser}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Heading as='h1' fontSize='3xl' fontWeight='semibold' textAlign='center' my='7'>Ваш профиль</Heading>
      <form onSubmit={handleSubmit(doSubmit)}>
        <Stack gap='4'>
          <Center>
            {/* Используем Controller для AvatarUploader */}
            <Controller
              name="avatar"
              control={control}
              render={({ field }) => (
                <AvatarUploader
                  imageUrl={field.value}
                  onFieldChange={field.onChange}
                  setFiles={setFiles}
                />
              )}
            />
          </Center>
          <FormControl isInvalid={errors.username}>
            <Input id='username' type='text' placeholder='Username' {...register('username', { required: 'Username is required' })} />
            <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.email}>
            <Input id='email' type='email' placeholder='Email' {...register('email', { required: 'Email is required' })} />
            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.password}>
            <Input id='password' type='password' placeholder='New password' {...register('password')} />
          </FormControl>
          <Button type='submit' isLoading={isSubmitting} colorScheme='teal' textTransform='uppercase'>Принять изменения</Button>
        </Stack>
      </form>
      <Flex justify='space-between' mt='5'>
        <Text as='span' color='red.600' cursor='pointer' onClick={onOpen}>Удалить аккаунт</Text>
        <Text as='span' color='red.600' cursor='pointer' onClick={handleSignOut}>Выйти</Text>
      </Flex>
    </Box>
  );
}