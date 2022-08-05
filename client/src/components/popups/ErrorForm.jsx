import React from 'react';
import './layout.scss';

export default function ErrorForm({ className, message, errorRef }) {
    return (
        <div ref={errorRef} className={`error-form ${className}`}>
            {message}
        </div>
    );
}
