import { BackspaceIcon } from '@heroicons/react/24/outline';
import React from 'react';

const Keypad = ({ onKeypadClick, disabled }: { onKeypadClick?: (value: string) => void; disabled?: boolean }) => {
  return (
    <div className="__keypad">
      {Array.from({ length: 10 }).map((_, idx) => {
        if (idx === 0) {
          return;
        }

        return (
          <button
            key={idx}
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault();
              onKeypadClick && onKeypadClick(idx.toString());
            }}
            className="__keypad-button">
            {idx}
          </button>
        );
      })}
      <div></div>
      <button
        className="__keypad-button"
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          onKeypadClick && onKeypadClick('0');
        }}>
        0
      </button>
      <button
        className="__keypad-button"
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          onKeypadClick && onKeypadClick('backspace');
        }}>
        <BackspaceIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Keypad;
