import React from 'react';
import Button from '../buttons/Button';
import cross from '../../assets/images/icon-cross.svg';
import check from '../../assets/images/icon-check.svg';
import './theme.scss';
import './layout.scss';

export default function Todo({ updateTodo, todo, deleteTodo }) {
    const handleChange = () => {
        todo.active = !todo.active;
        updateTodo(todo);
    };

    const handleDelete = () => {
        deleteTodo(todo);
    };

    const img = <img src={cross} alt={'Delete todo icon'} />;

    const todoContent = todo.active ? (
        todo.content
    ) : (
        <s className='todo__content--completed'>{todo.content}</s>
    );

    return (
        <div className='todo'>
            <input
                checked={!todo.active}
                onChange={handleChange}
                type='checkbox'
                id={todo._id}
            />
            <label htmlFor={todo._id} className='todo__label'>
                {!todo.active && <img src={check} alt='Checked todo' />}
            </label>
            <div className='todo__content'>{todoContent}</div>
            <Button
                className='todo__delete'
                children={img}
                onClick={handleDelete}
            />
        </div>
    );
}
