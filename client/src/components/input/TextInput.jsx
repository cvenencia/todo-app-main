import React from 'react';

export default function TextInput({
    children,
    placeholder,
    textInputRef,
    className,
    handleKeyPress,
    type,
}) {
    return (
        <input
            className={className}
            ref={textInputRef}
            placeholder={placeholder}
            onKeyDownCapture={handleKeyPress}
            type={type}
        >
            {children}
        </input>
    );
}
