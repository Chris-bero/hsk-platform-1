import { Student } from '../types';

/**
 * قائمة الطلاب المسموح لهم بالدخول (يديرها المعلم).
 * لإضافة طالب جديد، أضف كائناً جديداً يحتوي على id و name و code.
 */
export const ALLOWED_STUDENTS: Student[] = [
  {
    id: 'ST01',
    name: 'أحمد محمد',
    code: '1234',
  },
  {
    id: 'ST02',
    name: 'سارة علي',
    code: '5678',
  },
];

export function authenticateStudent(nameOrId: string, code: string): Student | null {
  const cleanedIdentity = nameOrId.trim();
  const cleanedCode = code.trim();

  if (!cleanedIdentity || !cleanedCode) {
    return null;
  }

  return (
    ALLOWED_STUDENTS.find(
      (student) =>
        (student.name.trim() === cleanedIdentity ||
          student.id.toLowerCase() === cleanedIdentity.toLowerCase()) &&
        student.code.trim() === cleanedCode
    ) ?? null
  );
}
