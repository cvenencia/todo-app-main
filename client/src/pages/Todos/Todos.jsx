import React, {
    useContext,
    useState,
    useEffect,
    useRef,
    useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import {
    getTodos as getTodosApi,
    tryRequest,
    updateTodo as updateTodoApi,
    deleteTodo as deleteTodoApi,
    createTodo,
} from '../../services/api';
import Todo from '../../components/Todo';
import TextInput from '../../components/input/TextInput';
import Button from '../../components/buttons/Button';
import ToggleThemeButton from '../../components/buttons/ToggleTheme';
import check from '../../assets/images/icon-check.svg';
import './layout.scss';

export default function Todos() {
    const { login, setLogin, isDesktop } = useContext(AppContext);
    const [todos, setTodos] = useState();
    const [filter, setFilter] = useState(null);
    const newTodoRef = useRef();
    const [newTodoActive, setNewTodoActive] = useState(true);
    const navigate = useNavigate();
    const [itemsLeft, setItemsLeft] = useState();

    const getTodos = useCallback(async () => {
        const response = await tryRequest(getTodosApi, filter);
        setTodos(response);
    }, [filter]);

    const updateTodo = async todo => {
        await tryRequest(updateTodoApi, todo);
        await getTodos();
    };

    const deleteTodo = async todo => {
        await tryRequest(deleteTodoApi, todo);
        await getTodos();
    };

    const handleKeyPressNewTodo = e => {
        if (e.key !== 'Enter') return;
        if (newTodoRef.current.value.length <= 0) return;
        handleNewTodo();
    };

    const handleNewTodo = async () => {
        const newTodo = {
            content: newTodoRef.current.value,
            active: newTodoActive,
        };

        await tryRequest(createTodo, newTodo);
        await getTodos();
        setNewTodoActive(true);
        newTodoRef.current.value = '';
    };

    const handleFilter = async e => {
        const value = e.target.value;
        if (value === '') {
            return setFilter(null);
        }

        setFilter({
            active: value === 'true' ? true : false,
        });
    };

    const handleActiveNewTodo = () => {
        setNewTodoActive(newTodoActive => !newTodoActive);
    };

    const handleClearCompleted = async () => {
        await tryRequest(deleteTodoApi, { active: false });
        await getTodos();
    };

    const handleLogout = () => {
        setLogin('FAIL');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    useEffect(() => {
        if (login === 'FAIL') return navigate('/register');

        (async () => {
            return await getTodos();
        })();
    }, [login, filter, navigate, getTodos]);

    useEffect(() => {
        if (!todos) return;
        const activeTodos = todos.filter(todo => todo.active);
        setItemsLeft(
            activeTodos.length === 1
                ? activeTodos.length + ' item left'
                : activeTodos.length + ' items left'
        );
    }, [todos]);

    if (login === 'WAITING' || login === 'FAIL') return <h1>Loading</h1>;

    const FilterSelector = ({ className = '' }) => (
        <div
            onChange={handleFilter}
            className={`todos__filter-selector ${className}`}
        >
            <input
                type='radio'
                name='todo-filter'
                id='todo-filter-all'
                defaultChecked={filter === null}
                value={''}
            />
            <label htmlFor='todo-filter-all'>All</label>
            <input
                type='radio'
                name='todo-filter'
                id='todo-filter-active'
                defaultChecked={filter && filter.active}
                value={true}
            />
            <label htmlFor='todo-filter-active'>Active</label>
            <input
                type='radio'
                name='todo-filter'
                id='todo-filter-completed'
                defaultChecked={filter && !filter.active}
                value={false}
            />
            <label htmlFor='todo-filter-completed'>Completed</label>
        </div>
    );

    return (
        <div className='todos-page-container'>
            <Button
                children='Logout'
                onClick={handleLogout}
                className='todos__logout-btn'
            />
            <div className='todos__title-container'>
                <h1>TODO</h1>
                <ToggleThemeButton />
            </div>
            <div className='todos__new-todo-container box-shadow'>
                <input
                    onChange={handleActiveNewTodo}
                    type='checkbox'
                    checked={!newTodoActive}
                    id='new-todo'
                />
                <label htmlFor='new-todo' className='todo__label'>
                    {!newTodoActive && <img src={check} alt='Checked todo' />}
                </label>
                <TextInput
                    textInputRef={newTodoRef}
                    placeholder={'Create a new todo...'}
                    handleKeyPress={handleKeyPressNewTodo}
                />
            </div>
            <main className='todos__container box-shadow'>
                {todos &&
                    todos.map(todo => (
                        <Todo
                            updateTodo={updateTodo}
                            key={todo._id}
                            todo={todo}
                            deleteTodo={deleteTodo}
                        />
                    ))}
                <div className='todos__interaction'>
                    <div>{itemsLeft}</div>
                    {isDesktop && <FilterSelector />}
                    <Button
                        children={'Clear completed'}
                        onClick={handleClearCompleted}
                        className='todos__clear-btn'
                    />
                </div>
            </main>
            {!isDesktop && (
                <FilterSelector
                    className={`todos__filter-selector--mobile box-shadow`}
                />
            )}
        </div>
    );
}
