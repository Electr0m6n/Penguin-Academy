'use client'

import React from 'react';

interface TypingInputProps {
  text: string;
  handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  endTime: number | null;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const TypingInput: React.FC<TypingInputProps> = ({
  text,
  handleInput,
  endTime,
  inputRef
}) => {
  return (
    <textarea
      ref={inputRef}
      value={text}
      onChange={handleInput}
      disabled={endTime !== null}
      className="sr-only"
      autoFocus
    />
  );
}; 