import { Course, Profile, Payment, ContactMessage } from '@/types';

// Seed initial course data mirroring real professional courses
const SEED_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Full-Stack Web Development BootCamp (Somali)',
    slug: 'fullstack-web-development-somali',
    description: 'Baro horumarinta shabakadaha min bilaaw ilaa dhamaad. Waxaad ku baran doontaa HTML, CSS, JavaScript, React, Next.js, Node.js, iyo e-commerce projects.',
    thumbnail_url: 'https://images.unsplash.com/photo-1516116211223-4c359a36beec?w=600&auto=format&fit=crop&q=60',
    price: 49.00,
    is_free: false,
    level: 'Beginner',
    duration_minutes: 1800, // 30 hours
    category_slug: 'web-development',
    instructor_name: 'Eng. Yahye Meer',
    instructor_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
    rating: 4.9,
    total_students: 1240,
    is_published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: 'course-2',
    title: 'UI/UX Design Masterclass & Figma Pro',
    slug: 'ui-ux-design-figma-pro',
    description: 'Nakhshadeey barnaamijyada moobaylka iyo shabakadaha adigoo adeegsanaya Figma. Baro mabaadi\'da UX, wireframing, prototyping iyo visual styles.',
    thumbnail_url: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=600&auto=format&fit=crop&q=60',
    price: 35.00,
    is_free: false,
    level: 'Intermediate',
    duration_minutes: 1200, // 20 hours
    category_slug: 'ui-ux',
    instructor_name: 'Eng. Yahye Meer',
    instructor_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
    rating: 4.8,
    total_students: 850,
    is_published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
  {
    id: 'course-3',
    title: 'Digital Marketing & Social Media Somalia',
    slug: 'digital-marketing-somalia',
    description: 'Kobci meheradaada adoo isticmaalaya xayeysiiska Facebook, Instagram, TikTok iyo Google Ads. Baro copywriting iyo SEO ku haboon suuqgeynta dalka.',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60',
    price: 0,
    is_free: true,
    level: 'Beginner',
    duration_minutes: 480, // 8 hours
    category_slug: 'digital-marketing',
    instructor_name: 'Eng. Yahye Meer',
    instructor_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
    rating: 4.7,
    total_students: 3100,
    is_published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: 'course-4',
    title: 'Python for Data Science & AI',
    slug: 'python-data-science-ai',
    description: 'Baro luuqada Python si aad u lafa gurto xogaha aduunka. Baro NumPy, Pandas, Matplotlib, iyo mabaadi\'da Machine Learning ee AI.',
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60',
    price: 55.00,
    is_free: false,
    level: 'Advanced',
    duration_minutes: 1500, // 25 hours
    category_slug: 'data-science',
    instructor_name: 'Eng. Yahye Meer',
    instructor_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
    rating: 4.95,
    total_students: 620,
    is_published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'course-5',
    title: 'Business Strategy & Somali Entrepreneurship',
    slug: 'business-strategy-entrepreneurship',
    description: 'Qorshee, maalgeliy, oo guulayso. Baro nidaamka ganacsi bilowga ah ee dalka Soomaaliya, cashar ku saabsan shuruucda, cashuuraha iyo growth loops.',
    thumbnail_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60',
    price: 0,
    is_free: true,
    level: 'Intermediate',
    duration_minutes: 600, // 10 hours
    category_slug: 'business',
    instructor_name: 'Eng. Yahye Meer',
    instructor_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
    rating: 4.6,
    total_students: 1890,
    is_published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  }
];

// Helper to simulate localstorage persistence in SSR friendly way
class MockStore {
  private inMemoryDb: Record<string, string> = {};

  get(key: string): string | null {
    if (typeof window === 'undefined') {
      return this.inMemoryDb[key] || null;
    }
    return localStorage.getItem(key);
  }

  set(key: string, value: string): void {
    if (typeof window === 'undefined') {
      this.inMemoryDb[key] = value;
      return;
    }
    localStorage.setItem(key, value);
  }
}

const store = new MockStore();

// Dynamic simulated database helper
export const mockDb = {
  getCourses: (): Course[] => {
    const raw = store.get('somskool_courses');
    if (!raw) {
      store.set('somskool_courses', JSON.stringify(SEED_COURSES));
      return SEED_COURSES;
    }
    return JSON.parse(raw);
  },

  getCourseBySlug: (slug: string): Course | undefined => {
    return mockDb.getCourses().find(c => c.slug === slug);
  },

  getCourseById: (id: string): Course | undefined => {
    return mockDb.getCourses().find(c => c.id === id);
  },

  getPayments: (): Payment[] => {
    const raw = store.get('somskool_payments');
    return raw ? JSON.parse(raw) : [];
  },

  addPayment: (payment: Omit<Payment, 'id' | 'created_at'>): Payment => {
    const list = mockDb.getPayments();
    const newPayment: Payment = {
      ...payment,
      id: 'pay-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    list.push(newPayment);
    store.set('somskool_payments', JSON.stringify(list));
    
    // Automatically confirm in-memory after submission has been disabled 
    // to allow real manual admin panel approvals and verification.
    // mockDb.autoConfirmPayment(newPayment.id);
    
    return newPayment;
  },

  autoConfirmPayment: (paymentId: string) => {
    setTimeout(() => {
      const list = mockDb.getPayments();
      const item = list.find(p => p.id === paymentId);
      if (item) {
        item.status = 'confirmed';
        store.set('somskool_payments', JSON.stringify(list));
        
        // Also add course enrollment
        mockDb.addEnrollment(item.student_id, item.course_id);
      }
    }, 5000); // Confirms after 5 seconds for visual testing
  },

  getEnrollments: (): any[] => {
    const raw = store.get('somskool_enrollments');
    return raw ? JSON.parse(raw) : [];
  },

  addEnrollment: (studentId: string, courseId: string) => {
    const list = mockDb.getEnrollments();
    const exists = list.find(e => e.student_id === studentId && e.course_id === courseId);
    if (!exists) {
      list.push({
        id: 'enroll-' + Math.random().toString(36).substring(2, 9),
        student_id: studentId,
        course_id: courseId,
        enrolled_at: new Date().toISOString(),
      });
      store.set('somskool_enrollments', JSON.stringify(list));
    }
  },

  isEnrolled: (studentId: string, courseId: string): boolean => {
    const list = mockDb.getEnrollments();
    return !!list.find(e => e.student_id === studentId && e.course_id === courseId);
  },

  getContactMessages: (): ContactMessage[] => {
    const raw = store.get('somskool_contacts');
    return raw ? JSON.parse(raw) : [];
  },

  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'created_at'>): ContactMessage => {
    const list = mockDb.getContactMessages();
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    list.push(newMsg);
    store.set('somskool_contacts', JSON.stringify(list));
    return newMsg;
  },

  // Auth simulators
  getProfiles: (): Profile[] => {
    const raw = store.get('somskool_profiles');
    return raw ? JSON.parse(raw) : [];
  },

  getCurrentUser: (): Profile | null => {
    const raw = store.get('somskool_current_user');
    return raw ? JSON.parse(raw) : null;
  },

  setCurrentUser: (user: Profile | null): void => {
    if (user) {
      store.set('somskool_current_user', JSON.stringify(user));
      if (typeof window !== 'undefined') {
        document.cookie = `somskool_user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=604800`;
      }
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('somskool_current_user');
        document.cookie = `somskool_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    }
  },

  register: (fullName: string, email: string): { data: any; error: any } => {
    const profiles = mockDb.getProfiles();
    const exists = profiles.find(p => p.full_name.toLowerCase() === fullName.toLowerCase());
    if (exists) {
      return { data: null, error: { message: 'Qofkan mar hore ayaa la diiwangaliyey.' } };
    }

    const newProfile: Profile = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      full_name: fullName,
      role: email.toLowerCase().includes('admin') ? 'admin' : 'student',
      created_at: new Date().toISOString(),
    };

    profiles.push(newProfile);
    store.set('somskool_profiles', JSON.stringify(profiles));
    mockDb.setCurrentUser(newProfile);

    return { data: { user: newProfile }, error: null };
  },

  login: (email: string): { data: any; error: any } => {
    // For mock convenience, any registration/email works!
    // We try to find match or auto-register one if they enter something valid.
    const profiles = mockDb.getProfiles();
    let profile = profiles.find(p => p.full_name.toLowerCase().includes(email.split('@')[0]));
    
    if (!profile) {
      // Create profile on-the-fly for smooth user testing!
      const name = email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      profile = {
        id: 'usr-' + Math.random().toString(36).substring(2, 9),
        full_name: name || 'Barte SomSkool',
        role: email.toLowerCase().includes('admin') ? 'admin' : 'student',
        created_at: new Date().toISOString(),
      };
      profiles.push(profile);
      store.set('somskool_profiles', JSON.stringify(profiles));
    }

    mockDb.setCurrentUser(profile);
    return { data: { user: profile }, error: null };
  },

  logout: (): void => {
    mockDb.setCurrentUser(null);
  },

  updatePaymentStatus: (paymentId: string, status: 'confirmed' | 'failed'): { success: boolean; error: any } => {
    const list = mockDb.getPayments();
    const item = list.find(p => p.id === paymentId);
    if (!item) return { success: false, error: { message: 'Lacag-bixinta lama helin' } };
    
    item.status = status;
    store.set('somskool_payments', JSON.stringify(list));
    
    if (status === 'confirmed') {
      mockDb.addEnrollment(item.student_id, item.course_id);
    }
    return { success: true, error: null };
  },

  getDocuments: (): any[] => {
    const raw = store.get('somskool_documents');
    return raw ? JSON.parse(raw) : [];
  },

  addDocument: (doc: { title: string; course_id: string; type: string; url: string }): any => {
    const list = mockDb.getDocuments();
    const newDoc = {
      ...doc,
      id: 'doc-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString()
    };
    list.push(newDoc);
    store.set('somskool_documents', JSON.stringify(list));
    return newDoc;
  },

  getVideoSettings: (): { youtube_id: string; channel_name: string; channel_url: string } => {
    const raw = store.get('somskool_video_settings');
    return raw ? JSON.parse(raw) : { youtube_id: 'ScMzIvxBSi4', channel_name: 'SomSkool E-Learning', channel_url: 'https://youtube.com' };
  },

  updateVideoSettings: (settings: { youtube_id: string; channel_name: string; channel_url: string }): void => {
    store.set('somskool_video_settings', JSON.stringify(settings));
  }
};
