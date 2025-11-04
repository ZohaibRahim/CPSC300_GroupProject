export interface Job {
  id: number;
  user_id: number;
  job_title: string;
  description?: string | null;
  company: string;
  location?: string | null;
  status: string;
  last_date?: Date | null;
  priority: string;
  requirements?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateJobInput {
  user_id: number;
  job_title: string;
  description?: string;
  company: string;
  location?: string;
  status?: string;
  last_date?: Date | string;
  priority?: string;
  requirements?: string;
}

export interface UpdateJobInput {
  job_title?: string;
  description?: string;
  company?: string;
  location?: string;
  status?: string;
  last_date?: Date | string;
  priority?: string;
  requirements?: string;
}

