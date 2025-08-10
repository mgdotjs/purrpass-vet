'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Form Field wrapper with error handling
interface FormFieldProps {
  name: string;
  label?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ name, label, className, children }: FormFieldProps) {
  const {
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className={error ? 'text-destructive' : ''}>
          {label}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-sm font-medium text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  );
}

// Form Input Component
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

export function FormInput({ 
  name, 
  label, 
  icon, 
  className, 
  wrapperClassName,
  ...props 
}: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <FormField name={name} label={label} className={wrapperClassName}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 h-4 w-4 text-gray-400">
            {icon}
          </div>
        )}
        <Input
          id={name}
          {...register(name)}
          className={cn(
            icon && 'pl-10',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        />
      </div>
    </FormField>
  );
}

// Form Textarea Component
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  wrapperClassName?: string;
}

export function FormTextarea({ 
  name, 
  label, 
  className, 
  wrapperClassName, 
  ...props 
}: FormTextareaProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <FormField name={name} label={label} className={wrapperClassName}>
      <textarea
        id={name}
        {...register(name)}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        {...props}
      />
    </FormField>
  );
}

// Form Select Component
interface FormSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  wrapperClassName?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

export function FormSelect({ 
  name, 
  label, 
  placeholder, 
  options, 
  wrapperClassName,
  icon
}: FormSelectProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(name);
  const error = errors[name];

  return (
    <FormField name={name} label={label} className={wrapperClassName}>
      <Select
        value={value}
        onValueChange={(value) => setValue(name, value, { shouldValidate: true })}
      >
        <SelectTrigger className={cn(error && 'border-destructive')}>
          {icon && <div className="h-4 w-4 mr-2 text-gray-400">{icon}</div>}
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

// Form Number Select Component (for cityId, districtId)
interface FormNumberSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: { value: number; label: string }[];
  wrapperClassName?: string;
}

export function FormNumberSelect({ 
  name, 
  label, 
  placeholder, 
  options, 
  wrapperClassName 
}: FormNumberSelectProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = watch(name);
  const error = errors[name];

  return (
    <FormField name={name} label={label} className={wrapperClassName}>
      <Select
        value={value?.toString()}
        onValueChange={(value) => setValue(name, parseInt(value), { shouldValidate: true })}
      >
        <SelectTrigger className={cn(error && 'border-destructive')}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

// Password Input with toggle visibility
interface FormPasswordProps extends Omit<FormInputProps, 'type'> {
  showPasswordToggle?: boolean;
}

export function FormPassword({ 
  showPasswordToggle = true, 
  ...props 
}: FormPasswordProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <FormInput
        {...props}
        type={showPassword ? 'text' : 'password'}
        className={cn(showPasswordToggle && 'pr-10', props.className)}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[34px] h-4 w-4 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

// Form Searchable Select Component
interface FormSearchableSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  wrapperClassName?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  required?: boolean;
}

export function FormSearchableSelect({ 
  name, 
  label, 
  placeholder = "Seçiniz...", 
  options, 
  wrapperClassName,
  searchPlaceholder = "Ara...",
  emptyMessage = "Sonuç bulunamadı."
}: FormSearchableSelectProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const value = watch(name);
  const error = errors[name];

  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [options, searchValue]);

  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`[data-searchable-select="${name}"]`)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, name]);

  return (
    <FormField name={name} label={label} className={wrapperClassName}>
      <div className="relative" data-searchable-select={name}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive",
            !value && "text-muted-foreground"
          )}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <svg
            className="h-4 w-4 opacity-50"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        
        {open && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-background text-foreground shadow-lg">
            <div className="flex items-center border-b px-3">
              <svg
                className="mr-2 h-4 w-4 shrink-0 opacity-50"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="max-h-48 overflow-auto">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      value === option.value && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => {
                      setValue(name, option.value, { shouldValidate: true });
                      setOpen(false);
                      setSearchValue("");
                    }}
                  >
                    <span>{option.label}</span>
                    {value === option.value && (
                      <svg
                        className="ml-auto h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </FormField>
  );
}
