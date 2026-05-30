export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: 'student' | 'admin';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail_url: string;
  price: number;
  is_free: boolean;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration_minutes: number;
  category_id?: string;
  category_slug?: string;
  instructor_name: string;
  instructor_avatar: string;
  rating: number;
  total_students: number;
  is_published: boolean;
  created_at: string;
}

export interface Payment {
  id: string;
  student_id: string;
  course_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  payment_method: 'zaad' | 'edahab' | 'evc_plus' | 'golis';
  transaction_reference: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  subject?: string;
  message: string;
  created_at: string;
}
