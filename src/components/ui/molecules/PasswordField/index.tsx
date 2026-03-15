'use client';

import { Label, Input, ErrorText } from '@/components/ui/atoms';
import { PasswordFieldProps } from './types';
import { usePasswordField } from './usePasswordField';
import { EyeIcon, EyeOffIcon } from '@/components/icons';

export function PasswordField({
  label,
  value,
  onChange,
  error,
  required,
  autoComplete = 'current-password',
  placeholder,
  disabled,
  id: idProp,
}: PasswordFieldProps) {
  const { id, errorId, visible, setVisible } = usePasswordField(idProp);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>

      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          hasError={!!error}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-describedby={error ? errorId : undefined}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className={[
            'absolute right-3 top-1/2 -translate-y-1/2',
            'text-gray-400 hover:text-gray-600',
            'focus:outline-none focus-visible:text-gray-600',
            'disabled:pointer-events-none',
          ].join(' ')}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  );
}