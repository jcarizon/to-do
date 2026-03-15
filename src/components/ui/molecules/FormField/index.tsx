import { Label, Input, ErrorText } from '@/components/ui/atoms';
import { FormFieldProps } from './types';
import { useFormField } from './useFormField';

export function FormField({ label, error, required, id: idProp, ...inputProps }: FormFieldProps) {
  const { id, errorId } = useFormField(idProp);
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <Input
        id={id}
        hasError={!!error}
        aria-describedby={error ? errorId : undefined}
        required={required}
        {...inputProps}
      />
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  );
}