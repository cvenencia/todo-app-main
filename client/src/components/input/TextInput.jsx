import React from 'react';

export default function TextInput({
    children,
    placeholder,
    textInputRef,
    className,
    handleKeyPress,
    type,
    ...rest
}) {
    return (
        <input
            className={className}
            ref={textInputRef}
            placeholder={placeholder}
            onKeyDownCapture={handleKeyPress}
            type={type}
            {...rest}
            autoCorrect='off'
            autoCapitalize='none'
        >
            {children}
        </input>
    );
}
