export interface TestQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface TestFormData {
  subject: number;
  totalQuestions: number;
  passingPercentage: number;
  scheduleDate: string;
  expirationDate: string;
  type: string;
  questions?: TestQuestion[];
}

export interface Step4ContentProps {
  formData: TestFormData;
  onSubmit: (data: TestFormData) => void;
}

export interface CreateTestModalProps {
  open: boolean;
  handleClose: () => void;
}
