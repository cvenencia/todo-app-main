import React from 'react';

export default function Button({ children, onClick, className, type }) {
    return (
        <button className={'btn' + className} onClick={onClick} type={type}>
            {children}
        </button>
    );
}
