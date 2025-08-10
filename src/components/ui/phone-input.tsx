'use client';

import React from 'react';
import PhoneInput from 'react-phone-number-input';
import { useFormContext, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface PhoneInputFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

interface PhoneObject {
  countryCode: number;
  number: string;
}

export function PhoneInputField({ 
  name, 
  label, 
  placeholder = "Telefon numarası girin",
  required = false,
  className 
}: PhoneInputFieldProps) {
  const { control, formState: { errors }, setValue, watch } = useFormContext();
  const error = errors[name];
  const currentValue = watch(name);

  console.log('PhoneInputField currentValue:', currentValue);

  // Convert phone object to E.164 string for PhoneInput
  const phoneToString = (phoneObj: PhoneObject | string | null | undefined): string => {
    if (!phoneObj) return '';
    if (typeof phoneObj === 'string') return phoneObj;
    if (phoneObj.countryCode && phoneObj.number) {
      return `+${phoneObj.countryCode}${phoneObj.number}`;
    }
    return '';
  };

  // Convert E.164 string back to phone object
  const stringToPhone = (phoneString: string): PhoneObject => {
    console.log('Converting phone string:', phoneString);
    
    if (!phoneString) return { countryCode: 90, number: '' };
    
    try {
      // Parse phone number
      const parsed = parsePhoneNumber(phoneString);
      if (parsed) {
        const result = {
          countryCode: parseInt(parsed.countryCallingCode),
          number: parsed.nationalNumber
        };
        console.log('Parsed result:', result);
        return result;
      }
    } catch {
      console.warn('Failed to parse phone number:', phoneString);
    }
    
    // Fallback parsing
    if (phoneString.startsWith('+')) {
      const match = phoneString.match(/^\+(\d{1,4})(.+)$/);
      if (match) {
        const fallbackResult = {
          countryCode: parseInt(match[1]),
          number: match[2]
        };
        console.log('Fallback result:', fallbackResult);
        return fallbackResult;
      }
    }
    
    return { countryCode: 90, number: '' };
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <Controller
        name={name}
        control={control}
        render={({ field: { onBlur } }) => (
          <PhoneInput
            placeholder={placeholder}
            value={phoneToString(currentValue)}
            onChange={(value) => {
              console.log('PhoneInput onChange:', value);
              const phoneObj = stringToPhone(value || '');
              console.log('Setting phone object:', phoneObj);
              setValue(name, phoneObj, { shouldValidate: true });
            }}
            onBlur={onBlur}
            defaultCountry="TR"
            countries={['TR', 'US', 'GB', 'DE', 'FR']}
            className={cn(
              "phone-input",
              error && "phone-input-error"
            )}
          />
        )}
      />
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error.message as string}
        </p>
      )}
      
      <style jsx>{`
        :global(.phone-input) {
          --PhoneInputCountryFlag-borderColor: transparent;
          --PhoneInputCountrySelectArrow-color: #6b7280;
        }
        
        :global(.PhoneInput) {
          display: flex;
          align-items: center;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: white;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        :global(.PhoneInput:focus-within) {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }
        
        :global(.phone-input-error .PhoneInput) {
          border-color: #ef4444;
        }
        
        :global(.PhoneInputCountrySelect) {
          border: none;
          background: transparent;
          margin-right: 0.5rem;
          cursor: pointer;
        }
        
        :global(.PhoneInputInput) {
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.875rem;
          flex: 1;
        }
        
        :global(.PhoneInputInput::placeholder) {
          color: #9ca3af;
        }
        
        /* Dark mode styles */
        :global(.dark .PhoneInput) {
          border-color: #4b5563;
          background: #374151;
          color: #f9fafb;
        }
        
        :global(.dark .PhoneInput:focus-within) {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        
        :global(.dark .PhoneInputInput) {
          color: #f9fafb;
        }
        
        :global(.dark .PhoneInputInput::placeholder) {
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}
