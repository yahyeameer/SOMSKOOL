export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: 'student' | 'admin';
  points: number;
  created_at: string;
}

export interface VideoSettings {
  youtube_id: string;
  channel_name: string;
  channel_url: string;
  video_title: string;
  video_thumbnail_url: string;
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
  // NOTE: there are no category columns on `courses` in the database. Do not
  // add category_id/category_slug here until a migration actually creates them,
  // otherwise inserts fail with "Could not find the column in the schema cache".
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

export interface CourseVideo {
  id: string;
  course_id: string;
  title: string;
  youtube_id: string;
  points_awarded: number;
  order_index: number;
  created_at: string;
}

export interface StudentProgress {
  id: string;
  student_id: string;
  video_id: string;
  course_id: string;
  completed_at: string;
}
