import React from 'react';

export default function TextInput({
    children,
    placeholder,
    textInputRef,
    className,
    handleKeyPress,
}) {
    return (
        <input
            className={className}
            ref={textInputRef}
            placeholder={placeholder}
            onKeyDownCapture={handleKeyPress}
        >
            {children}
        </input>
    );
}
