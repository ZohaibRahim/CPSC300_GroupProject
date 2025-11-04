export interface Application {
  id: number;
  user_id: number;
  job_id: number;
  status: string;
  date_applied?: Date | null;
  resume_version?: string | null;
  cover_letter_version?: string | null;
  notes?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateApplicationInput {
  user_id: number;
  job_id: number;
  status?: string;
  date_applied?: Date | string;
  resume_version?: string;
  cover_letter_version?: string;
  notes?: string;
}

export interface UpdateApplicationInput {
  status?: string;
  date_applied?: Date | string;
  resume_version?: string;
  cover_letter_version?: string;
  notes?: string;
}

