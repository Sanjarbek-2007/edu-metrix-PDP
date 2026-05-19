import { Student } from '../types';

export function calculateGrantEligibility(student: Student) {
  // Rule 1: GPA must be >= 80%
  if (student.scores.akademik.gpa < 80) {
    return {
      eligible: false,
      reason: "GPA 80% dan past: grant to'xtatiladi",
      gpaWarning: true
    };
  }
  
  // Rule 2: Total must be >= 80 (Unicorn) or >= 85 (Golden Mind)
  // For this context we assume Unicorn is 80, Golden Mind is 85
  const threshold = student.grantType === 'Golden Mind' ? 85 : 80;
  if (student.scores.asosiyTotal < threshold) {
    return {
      eligible: false,
      reason: `Ball yetarli emas: ${student.scores.asosiyTotal} / ${threshold} kerak`,
      gpaWarning: false
    };
  }
  
  return { eligible: true, gpaWarning: false };
}
