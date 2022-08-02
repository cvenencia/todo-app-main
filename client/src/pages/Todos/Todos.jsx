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
import sun from '../../assets/images/icon-sun.svg';
// import moon from '../../assets/images/icon-moon.svg';
import './theme.scss';
import './layout.scss';

export default function Todos() {
    const { login, toggleTheme } = useContext(AppContext);
    const [todos, setTodos] = useState();
    const [filter, setFilter] = useState();
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

    useEffect(() => {
        if (login === 'FAIL') return navigate('/login');

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

    if (login === 'WAITING') return <h1>Loading</h1>;

    return (
        <div className='todos-container'>
            <div>
                <h1>TODO</h1>
                <Button
                    children={<img src={sun} alt='Switch theme' />}
                    onClick={toggleTheme}
                />
            </div>
            <div>
                <input
                    onChange={handleActiveNewTodo}
                    type='checkbox'
                    checked={!newTodoActive}
                />
                <TextInput
                    textInputRef={newTodoRef}
                    placeholder={'Create a new todo...'}
                    handleKeyPress={handleKeyPressNewTodo}
                />
            </div>
            <main>
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
                    <div onChange={handleFilter}>
                        <input
                            type='radio'
                            name='todo-filter'
                            id='todo-filter-all'
                            defaultChecked
                            value=''
                        />
                        <label htmlFor='todo-filter-all'>All</label>
                        <input
                            type='radio'
                            name='todo-filter'
                            id='todo-filter-active'
                            value={true}
                        />
                        <label htmlFor='todo-filter-active'>Active</label>
                        <input
                            type='radio'
                            name='todo-filter'
                            id='todo-filter-completed'
                            value={false}
                        />
                        <label htmlFor='todo-filter-completed'>Completed</label>
                    </div>
                    <Button
                        children={'Clear completed'}
                        onClick={handleClearCompleted}
                    />
                </div>
            </main>
        </div>
    );
}
