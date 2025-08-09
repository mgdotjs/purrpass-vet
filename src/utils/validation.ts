import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta adresi gereklidir')
    .email('Geçerli bir e-posta adresi girin'),
  password: z
    .string()
    .min(1, 'Şifre gereklidir')
    .min(8, 'Şifre en az 8 karakter olmalıdır'),
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta adresi gereklidir')
    .email('Geçerli bir e-posta adresi girin'),
  password: z
    .string()
    .min(1, 'Şifre gereklidir')
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'),
  confirmPassword: z.string().min(1, 'Şifre tekrarı gereklidir'),
  role: z.enum(['USER', 'VET'], {
    message: 'Geçerli bir rol seçin',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

export const verifyEmailSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta adresi gereklidir')
    .email('Geçerli bir e-posta adresi girin'),
  otp: z
    .string()
    .min(1, 'Doğrulama kodu gereklidir')
    .length(6, 'Doğrulama kodu 6 haneli olmalıdır')
    .regex(/^\d+$/, 'Doğrulama kodu sadece rakamlardan oluşmalıdır'),
});

export const resendOtpSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta adresi gereklidir')
    .email('Geçerli bir e-posta adresi girin'),
});

// VET Onboarding Schemas
export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Ad gereklidir')
    .min(2, 'Ad en az 2 karakter olmalıdır')
    .max(50, 'Ad en fazla 50 karakter olabilir')
    .regex(/^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s]+$/, 'Ad sadece harflerden oluşmalıdır'),
  lastName: z
    .string()
    .min(1, 'Soyad gereklidir')
    .min(2, 'Soyad en az 2 karakter olmalıdır')
    .max(50, 'Soyad en fazla 50 karakter olabilir')
    .regex(/^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s]+$/, 'Soyad sadece harflerden oluşmalıdır'),
  birthDate: z
    .string()
    .min(1, 'Doğum tarihi gereklidir')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 100;
    }, 'Yaş 18-100 arasında olmalıdır'),
  gender: z.enum(['MALE', 'FEMALE'], {
    message: 'Cinsiyet seçimi gereklidir',
  }),
  tcIdentityNo: z
    .string()
    .min(1, 'TC Kimlik No gereklidir')
    .length(11, 'TC Kimlik No 11 haneli olmalıdır')
    .regex(/^\d+$/, 'TC Kimlik No sadece rakamlardan oluşmalıdır'),
    // .refine((tc) => {
    //   // Basic TC validation algorithm
    //   if (tc[0] === '0') return false;
    //   const digits = tc.split('').map(Number);
    //   const sum1 = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    //   const sum2 = digits[1] + digits[3] + digits[5] + digits[7];
    //   const check1 = (sum1 * 7 - sum2) % 10;
    //   const check2 = (sum1 + sum2 + digits[9]) % 10;
    //   return check1 === digits[9] && check2 === digits[10];
    // }, 'Geçerli bir TC Kimlik No girin'),
  phoneNumber: z
    .string()
    .min(1, 'Telefon numarası gereklidir')
    .regex(/^\+90\d{10}$/, 'Telefon numarası +90XXXXXXXXXX formatında olmalıdır'),
});

export const companyInfoSchema = z.object({
  companyName: z
    .string()
    .min(1, 'Şirket adı gereklidir')
    .min(3, 'Şirket adı en az 3 karakter olmalıdır')
    .max(100, 'Şirket adı en fazla 100 karakter olabilir'),
  companyType: z.enum(['INDIVIDUAL', 'CORPORATION'], {
    message: 'Şirket türü seçimi gereklidir',
  }),
  taxOffice: z
    .string()
    .min(1, 'Vergi dairesi gereklidir')
    .min(2, 'Vergi dairesi en az 2 karakter olmalıdır')
    .max(50, 'Vergi dairesi en fazla 50 karakter olabilir'),
  taxNumber: z
    .string()
    .min(1, 'Vergi numarası gereklidir')
    .length(10, 'Vergi numarası 10 haneli olmalıdır')
    .regex(/^\d+$/, 'Vergi numarası sadece rakamlardan oluşmalıdır'),
  cityId: z
    .number({
      message: 'İl seçimi gereklidir',
    })
    .min(1, 'Geçerli bir il seçin'),
  districtId: z
    .number({
      message: 'İlçe seçimi gereklidir',
    })
    .min(1, 'Geçerli bir ilçe seçin'),
  address: z
    .string()
    .min(1, 'Adres gereklidir')
    .min(10, 'Adres en az 10 karakter olmalıdır')
    .max(200, 'Adres en fazla 200 karakter olabilir'),
});

export const clinicInfoSchema = z.object({
  clinicName: z
    .string()
    .min(1, 'Klinik adı gereklidir')
    .min(3, 'Klinik adı en az 3 karakter olmalıdır')
    .max(100, 'Klinik adı en fazla 100 karakter olabilir'),
  clinicEmail: z
    .string()
    .min(1, 'Klinik e-postası gereklidir')
    .email('Geçerli bir e-posta adresi girin'),
  clinicPhone: z
    .string()
    .min(1, 'Klinik telefonu gereklidir')
    .regex(/^\+90\d{10}$/, 'Telefon numarası +90XXXXXXXXXX formatında olmalıdır'),
  cityId: z
    .number({
      message: 'İl seçimi gereklidir',
    })
    .min(1, 'Geçerli bir il seçin'),
  districtId: z
    .number({
      message: 'İlçe seçimi gereklidir',
    })
    .min(1, 'Geçerli bir ilçe seçin'),
  address: z
    .string()
    .min(1, 'Adres gereklidir')
    .min(10, 'Adres en az 10 karakter olmalıdır')
    .max(200, 'Adres en fazla 200 karakter olabilir'),
});

// Type exports for TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type ResendOtpFormData = z.infer<typeof resendOtpSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type CompanyInfoFormData = z.infer<typeof companyInfoSchema>;
export type ClinicInfoFormData = z.infer<typeof clinicInfoSchema>;
