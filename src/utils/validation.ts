import { z } from 'zod';

// Phone number validation schema for structured format
const phoneSchema = z.object({
  countryCode: z.number().int().positive('Ülke kodu gereklidir'),
  number: z
    .string()
    .min(1, 'Telefon numarası gereklidir')
    .regex(/^\d{10}$/, 'Telefon numarası 10 haneli olmalıdır'),
});

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
  phone: phoneSchema,
});

// USER Personal Info Schema
export const userPersonalInfoSchema = z.object({
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
  phone: phoneSchema,
  cityId: z
    .string({
      message: 'İl seçimi gereklidir',
    })
    .min(1, 'Geçerli bir il seçin'),
  districtId: z
    .string({
      message: 'İlçe seçimi gereklidir',
    })
    .min(1, 'Geçerli bir ilçe seçin'),
});

export const companyInfoSchema = z.object({
  companyName: z
    .string()
    .min(1, 'Şirket adı gereklidir')
    .min(3, 'Şirket adı en az 3 karakter olmalıdır')
    .max(100, 'Şirket adı en fazla 100 karakter olabilir'),
  companyType: z.enum(['INDIVIDUAL', 'CORPORATE'], {
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
    .string({
      message: 'İl seçimi gereklidir',
    })
    .min(1, 'Geçerli bir il seçin'),
  districtId: z
    .string({
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
  clinicPhone: phoneSchema,
  cityId: z
    .string({
      message: 'İl seçimi gereklidir',
    })
    .min(1, 'Geçerli bir il seçin'),
  districtId: z
    .string({
      message: 'İlçe seçimi gereklidir',
    })
    .min(1, 'Geçerli bir ilçe seçin'),
  address: z
    .string()
    .min(1, 'Adres gereklidir')
    .min(10, 'Adres en az 10 karakter olmalıdır')
    .max(200, 'Adres en fazla 200 karakter olabilir'),
});

// Appointment Schemas
export const appointmentSchema = z.object({
  petId: z.string().min(1, 'Pet seçimi gereklidir'),
  type: z.enum(['CHECKUP', 'VACCINATION', 'SURGERY', 'TREATMENT'], {
    message: 'Randevu tipi seçimi gereklidir',
  }),
  title: z
    .string()
    .min(1, 'Başlık gereklidir')
    .min(3, 'Başlık en az 3 karakter olmalıdır')
    .max(100, 'Başlık en fazla 100 karakter olabilir'),
  appointmentDate: z
    .string()
    .min(1, 'Randevu tarihi gereklidir'),
  notes: z
    .string()
    .max(500, 'Notlar en fazla 500 karakter olabilir')
    .optional(),
  vaccineType: z
    .string()
    .max(100, 'Aşı tipi en fazla 100 karakter olabilir')
    .optional(),
  treatmentType: z
    .string()
    .max(100, 'Tedavi tipi en fazla 100 karakter olabilir')
    .optional(),
  surgeryType: z
    .string()
    .max(100, 'Ameliyat tipi en fazla 100 karakter olabilir')
    .optional(),
}).refine((data) => {
  // Vaccination appointments should have vaccineType
  if (data.type === 'VACCINATION' && !data.vaccineType) {
    return false;
  }
  // Surgery appointments should have surgeryType
  if (data.type === 'SURGERY' && !data.surgeryType) {
    return false;
  }
  // Treatment appointments should have treatmentType
  if (data.type === 'TREATMENT' && !data.treatmentType) {
    return false;
  }
  return true;
}, {
  message: 'Seçilen randevu tipine uygun ek bilgiler gereklidir',
  path: ['type']
});

export const updateAppointmentSchema = z.object({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED'], {
    message: 'Geçerli bir durum seçin',
  }).optional(),
  notes: z
    .string()
    .max(500, 'Notlar en fazla 500 karakter olabilir')
    .optional(),
  vaccineType: z
    .string()
    .max(100, 'Aşı tipi en fazla 100 karakter olabilir')
    .optional(),
  treatmentType: z
    .string()
    .max(100, 'Tedavi tipi en fazla 100 karakter olabilir')
    .optional(),
  surgeryType: z
    .string()
    .max(100, 'Ameliyat tipi en fazla 100 karakter olabilir')
    .optional(),
});

// Pet Schemas
export const petSchema = z.object({
  name: z
    .string()
    .min(1, 'Pet adı gereklidir')
    .min(2, 'Pet adı en az 2 karakter olmalıdır')
    .max(50, 'Pet adı en fazla 50 karakter olabilir'),
  type: z.enum(['DOG', 'CAT', 'BIRD', 'OTHER'], {
    message: 'Geçerli bir pet türü seçin',
  }),
  breed: z
    .string()
    .min(1, 'Cins gereklidir')
    .max(50, 'Cins en fazla 50 karakter olabilir'),
  birthDate: z
    .string()
    .min(1, 'Doğum tarihi gereklidir')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 30); // Max 30 years old
      
      return selectedDate <= today && selectedDate >= minDate;
    }, 'Geçerli bir doğum tarihi girin'),
  gender: z.enum(['MALE', 'FEMALE'], {
    message: 'Geçerli bir cinsiyet seçin',
  }),
  color: z
    .string()
    .min(1, 'Renk gereklidir')
    .max(30, 'Renk en fazla 30 karakter olabilir'),
  allergies: z
    .string()
    .max(200, 'Alerjiler en fazla 200 karakter olabilir')
    .optional(),
});

export const updatePetSchema = z.object({
  name: z
    .string()
    .min(2, 'Pet adı en az 2 karakter olmalıdır')
    .max(50, 'Pet adı en fazla 50 karakter olabilir')
    .optional(),
  breed: z
    .string()
    .max(50, 'Cins en fazla 50 karakter olabilir')
    .optional(),
  birthDate: z
    .string()
    .refine((date) => {
      if (!date) return true; // Optional field
      const selectedDate = new Date(date);
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 30);
      
      return selectedDate <= today && selectedDate >= minDate;
    }, 'Geçerli bir doğum tarihi girin')
    .optional(),
  color: z
    .string()
    .max(30, 'Renk en fazla 30 karakter olabilir')
    .optional(),
  allergies: z
    .string()
    .max(200, 'Alerjiler en fazla 200 karakter olabilir')
    .optional(),
});

export const microchipSchema = z.object({
  chipNumber: z
    .string()
    .min(1, 'Chip numarası gereklidir')
    .min(10, 'Chip numarası en az 10 karakter olmalıdır')
    .max(15, 'Chip numarası en fazla 15 karakter olabilir')
    .regex(/^\d+$/, 'Chip numarası sadece rakamlardan oluşmalıdır'),
  chipDate: z
    .string()
    .min(1, 'Chip takma tarihi gereklidir')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 20); // Max 20 years ago
      
      return selectedDate <= today && selectedDate >= minDate;
    }, 'Geçerli bir chip takma tarihi girin'),
});

// Type exports for TypeScript
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type ResendOtpFormData = z.infer<typeof resendOtpSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type UserPersonalInfoFormData = z.infer<typeof userPersonalInfoSchema>;
export type CompanyInfoFormData = z.infer<typeof companyInfoSchema>;
export type ClinicInfoFormData = z.infer<typeof clinicInfoSchema>;
export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export type UpdateAppointmentFormData = z.infer<typeof updateAppointmentSchema>;
export type PetFormData = z.infer<typeof petSchema>;
export type UpdatePetFormData = z.infer<typeof updatePetSchema>;
export type MicrochipFormData = z.infer<typeof microchipSchema>;
