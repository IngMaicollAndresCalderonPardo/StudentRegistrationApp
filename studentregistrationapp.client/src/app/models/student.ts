export interface Student {
  studentId?: number;
  name: string;
  lastname: string;
  documentType: string;
  documentNumber: string;
  email: string;
  password: string;
  cellphone?: string;
  address: string;
  birthdate: string; // por ejemplo "YYYY-MM-DD"
}
