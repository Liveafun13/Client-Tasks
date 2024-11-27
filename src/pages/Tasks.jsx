import { useState, useEffect } from 'react'; // Выполненные задания: 1, 4, 5, 6, 15, 18, 20
import { useUser } from '../context/UserContext';
import { API_BASE_URL } from '../util';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  useDisclosure,
  Input,
  Text,
  Card,  // Используется для задания №5
  Stat, // Используется для задания №5
  StatLabel,  // Используется для задания №5
  StatNumber,  // Используется для задания №5
  useToast,
} from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import DeleteConfirmation from '../components/DeleteConfirmation'; // Для №18, форма удаления
import TasksSkeleton from '../_skeletons/TasksSkeleton';
import Pagination from '../components/pagination';
import { BsArrowUp, BsArrowDown } from 'react-icons/bs'; // Добавлен BsArrowDown для сортировки по убыванию
import { formatDistanceToNow, parseISO } from 'date-fns'; // Для задания №4
import { ru } from 'date-fns/locale';

export default function Tasks() {
  const { user } = useUser();
  const [tasks, setTasks] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [itemCount, setItemCount] = useState(0);
  const [taskToDelete, setTaskToDelete] = useState(null); // Для №18, хранит идентификатор задачи, которую пользователь хочет удалить
  const { isOpen, onOpen, onClose } = useDisclosure();
  const page = parseInt(searchParams.get('page')) || 1;
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const handleStatusFilter = (e) => {
    const value = e.target.value;
    if (value) {
      searchParams.set('status', value);
    } else {
      searchParams.delete('status');
    }
    setSearchParams(searchParams);
  };

  const handleOrderBy = (field) => { // Для задания №1, сортировка
    const currentOrderBy = searchParams.get('orderBy');
    const [currentField, currentDirection] = currentOrderBy ? currentOrderBy.split(':') : [];

    let direction = 'asc';
    if (currentField === field) {
      direction = currentDirection === 'asc' ? 'desc' : 'asc';
    }

    searchParams.set('orderBy', `${field}:${direction}`);
    setSearchParams(searchParams);
  };

  const handleDeleteTask = (taskId) => { // Устанавливает идентификатор задачи для удаления и открывает диалоговое окно подтверждения
    setTaskToDelete(taskId);
    onOpen();
  };

  const confirmDeleteTask = async () => { // Выполняет удаление задачи на сервере и обновляет список задач
    const res = await fetch(`${API_BASE_URL}/tasks/${taskToDelete}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.status === 200) {
      const updatedTasks = tasks.filter(task => task._id !== taskToDelete);
      setTasks(updatedTasks);
    }
    onClose();
  };

  const sortTasks = (tasks, orderBy) => {
    if (!orderBy) return tasks;

    const [field, direction] = orderBy.split(':');
    return tasks.sort((a, b) => {
      if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const query = searchParams.size ? '?' + searchParams.toString() : '';
      const res = await fetch(`${API_BASE_URL}/tasks/user/${user._id}${query}`, {
        credentials: 'include',
      });
      const { tasks, taskCount } = await res.json();

      // Сортировка задач
      const sortedTasks = sortTasks(tasks, searchParams.get('orderBy'));

      setTasks(sortedTasks);
      setItemCount(taskCount);
    };

    fetchTasks();
  }, [searchParams, user._id]);

  if (!tasks) {
    return <TasksSkeleton />;
  }

  const isTaskOverdue = (task) => { // Подсветка красным если задача просрочена. №20 в списке задач
    return task.status === 'open' && new Date(task.due) < new Date();
  };

  const countOpenTasks = () => {
    return tasks.filter(task => task.status === 'open').length;
  };

  const countOverdueTasks = () => {
    return tasks.filter(task => isTaskOverdue(task)).length;
  };

  const filteredTasks = tasks.filter(task => // Для задания №6, поиск задач
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTask = () => { // Для задания №13, ограничения задач при привышении лимита в 5 просроченных
    if (countOpenTasks() >= 5) {
      toast({
        title: 'Ошибка',
        description: 'Невозможно создать новую задачу. Для ввода закройте предыдущие.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      window.location.href = '/create-task';
    }
  };

  return (
    <Box p='5' maxW='3lg' mx='auto'>
      <Heading
        as='h1'
        fontSize='3xl'
        fontWeight='semibold'
        textAlign='center'
        my='7'
      >
        Список задач
      </Heading>
      <Flex justify='space-between' mb='3'>
        <Box w='100px'>
          <Select placeholder='Все' onChange={handleStatusFilter}>
            <option value='open'>Открытые</option>
            <option value='done'>Закрытые</option>
          </Select>
        </Box>
        <Button
          colorScheme='green'
          textTransform='uppercase'
          fontWeight='semibold'
          onClick={handleCreateTask}
        >
          Создать новую задачу
        </Button>
      </Flex>
      <Input
        placeholder='Поиск по наименованию'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb='3'
      />
      <TableContainer>
        <Table px='3' border='2px solid' borderColor='gray.100'>
          <Thead backgroundColor='gray.100'>
            <Tr>
              <Th>
                <Flex
                  onClick={() => handleOrderBy('name')}
                  cursor='pointer'
                  alignItems='center'
                >
                  Задачи
                  {searchParams.get('orderBy')?.startsWith('name') && (
                    searchParams.get('orderBy')?.endsWith('asc') ? <BsArrowUp /> : <BsArrowDown />
                  )}
                </Flex>
              </Th>
              <Th>
                <Flex
                  onClick={() => handleOrderBy('priority')}
                  cursor='pointer'
                  alignItems='center'
                >
                  Приоритет
                  {searchParams.get('orderBy')?.startsWith('priority') && (
                    searchParams.get('orderBy')?.endsWith('asc') ? <BsArrowUp /> : <BsArrowDown />
                  )}
                </Flex>
              </Th>
              <Th>
                <Flex
                  onClick={() => handleOrderBy('status')}
                  cursor='pointer'
                  alignItems='center'
                >
                  Статус
                  {searchParams.get('orderBy')?.startsWith('status') && (
                    searchParams.get('orderBy')?.endsWith('asc') ? <BsArrowUp /> : <BsArrowDown />
                  )}
                </Flex>
              </Th>
              <Th>
                <Flex
                  onClick={() => handleOrderBy('due')}
                  cursor='pointer'
                  alignItems='center'
                >
                  Крайний срок
                  {searchParams.get('orderBy')?.startsWith('due') && (
                    searchParams.get('orderBy')?.endsWith('asc') ? <BsArrowUp /> : <BsArrowDown />
                  )}
                </Flex>
              </Th>
              <Th>Ред лайн</Th> {/* Новая колонка */}
              <Th>Действия</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredTasks.map((task) => (
              <Tr key={task._id} bg={isTaskOverdue(task) ? 'red.100' : 'white'}>
                <Td>
                  <Link to={`/tasks/${task._id}`}>{task.name}</Link>
                </Td>
                <Td>
                  <Badge
                    colorScheme={task.priority === 'urgent' ? 'red' : 'gray'}
                  >
                    {task.priority === 'urgent' ? 'Срочный' : 'Обычный'}
                  </Badge>
                </Td>
                <Td>
                  <Badge
                    colorScheme={task.status === 'open' ? 'orange' : 'green'}
                  >
                    {task.status === 'open' ? 'Открыт' : 'Закрыт'}
                  </Badge>
                </Td>
                <Td>
                  {task.due
                    ? new Date(task.due).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        weekday: 'long',
                      })
                    : ''}
                </Td>
                <Td>
                  {task.due ? (
                    formatDistanceToNow(parseISO(task.due), { addSuffix: true, locale: ru })
                  ) : (
                    'Не указан'
                  )}
                </Td>
                <Td>
                  <IconButton
                    icon={<FiTrash2 />}
                    colorScheme='red'
                    variant='outline'
                    onClick={() => handleDeleteTask(task._id)}
                    aria-label='Удалить задачу'
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Pagination itemCount={itemCount} pageSize={10} currentPage={page} />
      <DeleteConfirmation
        alertTitle='Подтверждение удаления'
        handleClick={confirmDeleteTask}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Card mt='5' p='5'>
        <Flex justifyContent='center' textAlign='center'>
          <Stat>
            <StatLabel>Незавершенные задачи</StatLabel>
            <StatNumber>{countOpenTasks()}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Просроченные задачи</StatLabel>
            <StatNumber>{countOverdueTasks()}</StatNumber>
          </Stat>
        </Flex>
      </Card>
    </Box>
  );
}
