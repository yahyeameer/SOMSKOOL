'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'so';

interface Translations {
  [key: string]: {
    en: string;
    so: string;
  };
}

const translations: Translations = {
  // ===== NAVBAR =====
  home: { en: 'Home', so: 'Hoyga' },
  courses: { en: 'Courses', so: 'Koorsooyinka' },
  contact: { en: 'Contact', so: 'Xiriirka' },
  login: { en: 'Login', so: 'Gala' },
  register: { en: 'Register', so: 'Is-diiwangali' },
  logout: { en: 'Logout', so: 'Kabax' },
  admin: { en: 'Admin', so: 'Maamulka' },
  language: { en: 'Language', so: 'Luqadda' },
  english: { en: 'English', so: 'English' },
  somali: { en: 'Somali', so: 'Soomaali' },
  search: { en: 'Search', so: 'Raadi' },
  leaderboard: { en: 'Leaderboard', so: 'Tartanka' },
  profile: { en: 'Profile', so: 'Xogta' },
  points: { en: 'Points', so: 'Dhibcaha' },

  // ===== HOMEPAGE =====
  hero_badge: { en: '#1 Learning Platform in Somalia', so: '#1 Barta Waxbarasho ee Soomaaliya' },
  hero_title_1: { en: 'Learn Without', so: 'Baro Xaddid' },
  hero_title_2: { en: 'Limits.', so: 'La\'aanteed.' },
  hero_subtitle: { en: 'Build your future with professional courses created by world-class experts, in your native Somali language. Learn Web Dev, UI/UX, and more.', so: 'Ku dhis mustaqbalkaaga koorsooyin xirfadeed oo ay diyaariyeen khubaro caalami ah, kuna baxaya luuqadaada hooyo ee Soomaaliga. Baro Web Dev, UI/UX, iyo waxyaabo kale.' },
  start_learning: { en: 'Start Learning', so: 'Bilow Waxbarashada' },
  explore_courses: { en: 'Explore Courses', so: 'Baadhkoorsooyin' },
  join_students: { en: 'active Somali students!', so: 'arday Soomaali ah oo firfircoon!' },
  watch_intro: { en: 'Watch Intro', so: 'Daawo Hordhac' },
  expert_instructors: { en: 'Expert Instructors', so: 'Macalimiinta Khibradda' },
  premium_courses: { en: 'Premium Courses', so: 'Koorsooyinka Tayo' },
  active_students: { en: 'Active Students', so: 'Ardayda Firfircoon' },
  average_rating: { en: 'Average Rating', so: 'Qiimaynta Celceliska' },
  recent_courses: { en: 'Recent Premium Courses', so: 'Koorsooyinka Cusub ee Tayo' },
  new_courses_label: { en: 'New Courses', so: 'Koorsooyinka Cusub' },
  view_all: { en: 'View All', so: 'Muuqi Dhamaan' },
  student_success: { en: 'Student Success', so: 'Guusha Barteyaasha' },
  what_students_say: { en: 'What Our Students Say', so: 'Waxay Dhahaan Ardaydayadu' },
  testimonials_subtitle: { en: 'Read the success stories and reviews from our past SomSkool students.', so: 'Akhri sheekooyinka guusha iyo faallooyinka ay ardaydii hore ee SomSkool ka baxiyeen casharadeena.' },
  completed: { en: 'Completed', so: 'Dhamaystiray' },
  certificate_awarded: { en: 'Certificate Awarded', so: 'Sertifiko la siiyey' },

  // ===== COURSES PAGE =====
  courses_title: { en: 'SomSkool Courses', so: 'Koorsooyinka SomSkool' },
  courses_subtitle: { en: 'Choose from premium courses that build your professional skills or launch a new business.', so: 'Kala dooro koorsooyin heersare ah oo ku dhisaya xirfadaada xirfadle ama bilow ganacsi cusub.' },
  showing: { en: 'Showing', so: 'Muuqalka' },
  course_count: { en: 'Courses', so: 'Koorso' },
  no_courses_found: { en: 'No courses found', so: 'Wax koorso ah oo la helay ma jiraan' },
  no_courses_hint: { en: 'Please change your filters or search to find other courses.', so: 'Fadlan bedel filtarkaaga ama baaritaankaaga si aad u hesho koorsooyin kale.' },

  // ===== FILTER SIDEBAR =====
  search_course: { en: 'Search Course', so: 'Raadi Koorsada' },
  search_placeholder: { en: 'Type a course...', so: 'Koorso qor...' },
  categories: { en: 'Categories', so: 'Qeybaha' },
  all_categories: { en: 'All Categories', so: 'Dhammaan Qeybaha' },
  computer_science: { en: 'Computer Science', so: 'Cilmiga Kumbuyuutarka' },
  english_category: { en: 'English', so: 'Ingiriisiga' },
  course_level: { en: 'Course Level', so: 'Heerka Koorsada' },
  all_levels: { en: 'All Levels', so: 'Dhammaan Heerarka' },
  beginner: { en: 'Beginner', so: 'Bilowga' },
  intermediate: { en: 'Intermediate', so: 'Dhexdhexaad' },
  advanced: { en: 'Advanced', so: 'Horumarsan' },
  price_type: { en: 'Price Type', so: 'Nooca Qiimaha' },
  all_prices: { en: 'All Prices', so: 'Dhammaan Qiimaha' },
  free: { en: 'Free', so: 'Bilaash' },
  paid: { en: 'Paid', so: 'Lacag' },

  // ===== COURSE CARD =====
  hours: { en: 'hours', so: 'saacadood' },
  minutes: { en: 'minutes', so: 'daqiiqo' },
  students_label: { en: 'students', so: 'barte' },
  instructor: { en: 'Instructor', so: 'Bare' },
  enroll_now: { en: 'Enroll Now', so: 'Isdiiwaangali' },

  // ===== CONTACT PAGE =====
  contact_title: { en: 'Contact Us', so: 'Nala Soo Xiriir' },
  contact_subtitle: { en: 'Questions, advice, or support? Our team is ready to help you.', so: "Su'aal, talo, ama taageero? Kooxdayda ayaa diyaar ah inay ku caawiso." },
  contact_heading: { en: 'We are here to help you', so: 'Waxaan halkan u joognaa inaan ku caawino' },
  contact_description: { en: 'Questions about courses, payment, or classroom support? Contact us through the most convenient method.', so: "Su'aalo ku saabsan koorsooyin, lacag-bixin, ama taageero fasalka? Nala soo xiriir habka kugu habboon." },
  location: { en: 'Location', so: 'Goobta' },
  email_label: { en: 'Email', so: 'Iimaylka' },
  whatsapp: { en: 'WhatsApp', so: 'WhatsApp' },
  follow_social: { en: 'Follow us on social media', so: 'Naga raac baraha bulshada' },
  working_hours: { en: 'Working Hours', so: 'Saacadaha Shaqada' },
  mon_fri: { en: 'Monday – Friday', so: 'Isniin – Jimce' },
  saturday: { en: 'Saturday', so: 'Sabti' },
  sunday: { en: 'Sunday', so: 'Axad' },
  closed: { en: 'Closed', so: 'Xidhan' },
  send_message: { en: 'Send Us a Message', so: 'Noo soo Dir Fariin' },
  form_instructions: { en: 'Fill the form below and our support team will get back to you.', so: 'Buuxi foomka hoose, waxaana kuu jawaabi doonaa kooxdayda taageerada.' },
  full_name: { en: 'Full Name', so: 'Magacaaga oo Buuxa' },
  your_email: { en: 'Your Email', so: 'Iimaylkaaga' },
  subject: { en: 'Subject', so: 'Mowduuca' },
  your_message: { en: 'Your Message', so: 'Fariintaada' },
  send_message_btn: { en: 'Send Message', so: 'Dir Fariinta' },
  sending: { en: 'Sending...', so: 'Dirayaa...' },
  message_received: { en: 'Your message has been received!', so: 'Fariintaada waa la helay!' },
  message_thanks: { en: 'Thank you for contacting us. Our support team will respond within 24 hours.', so: 'Waad ku mahadsantahay in aad nala soo xiriirisay. Kooxdayda taageerada waxay kugu jawaabi doonaan muddo 24 saacadood gudahood.' },

  // ===== LOGIN PAGE =====
  welcome_back: { en: 'Welcome Back!', so: 'Ku soo Dhowow!' },
  login_subtitle: { en: 'Please enter your credentials below to access your courses.', so: 'Fadlan geli macluumaadkaaga hoose si aad u gasho koorsadaada.' },
  email_or_phone_label: { en: 'Email or Phone Number', so: 'Email ama Numberka Telefoonka' },
  email_or_phone_placeholder: { en: 'email@somskool.com or +252...', so: 'email@somskool.com ama +252...' },
  password_field: { en: 'Your Password (Password)', so: 'Furehaaga (Password)' },
  forgot_password: { en: 'Forgot password?', so: 'Furaagii ma ilowday?' },
  signing_in: { en: 'Signing in...', so: 'Galayaa...' },
  sign_in: { en: 'Sign In', so: 'Soo gal (Sign In)' },
  new_student: { en: 'New student?', so: 'Arday cusub ma tahay?' },
  register_now: { en: 'Register now →', so: 'Is-diiwangali hadda →' },
  quality_education: { en: 'Quality Education', so: 'Waxbarasho Tayo Sare Leh' },

  // ===== REGISTER PAGE =====
  create_account: { en: 'Create an Account', so: 'Samayso Koonto' },
  register_subtitle: { en: 'Just fill in the information below to start your journey.', so: 'Kaliya buuxi macluumaadka hoose si aad u bilowdo safarkaaga.' },
  password_label: { en: 'Password', so: 'Fure (Password)' },
  confirm_password: { en: 'Confirm Password', so: 'Hubi Furaha' },
  creating_account: { en: 'Creating...', so: 'Samaynayaa...' },
  create_account_btn: { en: 'Create Account (Register)', so: 'Abuur Koonto (Register)' },
  already_registered: { en: 'Already registered?', so: 'Horay ma isu diiwangalisay?' },
  role_label: { en: 'Account Type', so: 'Nooca Akoonka' },
  student_role: { en: 'Student', so: 'Arday' },
  teacher_role: { en: 'Teacher', so: 'Macalin' },
  login_now: { en: 'Login now →', so: 'Soo gal (Login) hadda →' },
  terms_clause: { en: 'By creating an account, you agree to SomSkool\'s Terms of Service.', so: 'Markaad samaysato koonto, waxaad ogolaatay in SomSkool ay ku habayn karto waxbarashadaada xeerarka Shuruucda iyo Terms of Service.' },
  build_future_1: { en: 'Build Your', so: 'Dhis' },
  build_future_2: { en: 'Future.', so: 'Mustaqbalkaaga.' },
  register_hero_text: { en: 'Create your identity today. Learn technology, marketing, and design to become one of our leading Somali professionals.', so: 'Abuuro aqoonsigaaga maanta. Baro tignoolajiyada, suuqgeynta, iyo naqshadeynta si aad u noqoto xirfadle ka mid ah hormoodka bulshadeena Soomaaliyeed.' },

  // ===== PAYMENT PAGE =====
  enter_details: { en: 'Enter Details', so: 'Geli Faahfaahinta' },
  payment_instructions: { en: 'Please enter the receipt details after sending the payment.', so: 'Fadlan ku qor faahfaahintii rasiidhka lagugu siiyey markaad lacagta dirtay.' },
  your_name: { en: 'Your Name', so: 'Magacaaga' },
  choose_method: { en: 'Choose Method', so: 'Dooro Habka' },
  sender_phone: { en: 'Sender Phone Number', so: 'Nambarka Lacagta laga diray' },
  payment_method: { en: 'Payment Method', so: 'Habka Lacag-bixinta' },
  transaction_ref: { en: 'Transaction Reference ID', so: 'Lamberka Aqoonsiga (Transaction Ref/ID)' },
  enter_ref_placeholder: { en: 'Enter the receipt reference number', so: 'Geli lambarka aqoonsiga ee risiidhka' },
  confirm_payment: { en: 'I confirm the payment details are correct.', so: 'Waxaan xaqiijinayaa inaan lacagta u diray lambarka saxda ah, faahfaahinta kor ku xusanna ay tahay mid sax ah.' },
  submit_details: { en: 'Submit Details', so: 'Gudbi Faahfaahinta' },
  submitting: { en: 'Submitting...', so: 'Gudbinayaa...' },
  payment_received: { en: 'Details received!', so: 'Faahfaahinta waa la helay!' },
  payment_thanks: { en: 'Thank you for your enrollment! Our admin will verify your payment within 24 hours. You will receive a confirmation email.', so: 'Waad ku mahadsantahay is-diiwangalintaada! Maamulkeena wuxuu xaqiijin doonaa lacag-bixintaada muddo 24 saacadood gudahood ah. Waxaad heli doontaa iimayl xaqiijin ah.' },
  my_courses: { en: 'My Courses', so: 'Koorsadayda' },
  send_to: { en: 'Send to', so: 'U dir' },

  // ===== ADMIN PANEL =====
  payments_tab: { en: 'Payments', so: 'Lacagaha (Payments)' },
  docs_tab: { en: 'Documents', so: 'Dukumentiyada (Docs)' },
  video_tab: { en: 'Video Channel', so: 'Kanaalka Muuqaalka' },
  staff_tab: { en: 'Staff', so: 'Shaqaalaha (Staff)' },
  student_payments: { en: 'Student Payments', so: 'Lacagaha Ardayda (Student Payments)' },
  payments_desc: { en: 'Manage student payment receipts and approve enrollments here.', so: 'Ku maamul halkan rasiidhada lacag-bixinta, una fasax casharada ardayda ansaxday.' },
  no_payments: { en: 'No payment submissions found yet.', so: 'Wax lacag-bixin ah oo la gudbiyey wali lama helin.' },
  processing: { en: 'Processing...', so: 'Gudbinayaa...' },
  approve: { en: 'Approve', so: 'Ansixiso' },
  reject: { en: 'Reject', so: 'Diid' },
  approved: { en: 'Approved', so: 'Ansixiyey' },
  rejected: { en: 'Rejected', so: 'Diiday' },
  pending: { en: 'Pending', so: 'Sugaya (Pending)' },
  verified: { en: 'Verified', so: 'Xaqiijiyey' },
  upload_doc: { en: 'Upload New Document', so: 'Geli Dukumenti Cusub (Upload Resource)' },
  upload_doc_desc: { en: 'Add course materials like PDF syllabi or code slides.', so: 'U kordhi casharada ardayda lifaaqyo kala duwan sida PDF Syllabus ama slide code-ka koorsada.' },
  doc_name: { en: 'Document Name', so: 'Magaca Dokumentiga' },
  choose_course: { en: 'Choose Course', so: 'Dooro Koorsada' },
  file_type: { en: 'File Type', so: 'Nooca Faylka (File Type)' },
  file_link: { en: 'File Link / URL', so: 'File Link / URL' },
  add_document: { en: 'Add Document', so: 'Geli Dukumentiga' },
  doc_success: { en: 'Document added successfully!', so: 'Dukumentiga waa la galiyey si guul ah!' },
  uploaded_materials: { en: 'Uploaded Materials', so: 'Kaydka Dukumentiyada (Uploaded Materials)' },
  uploaded_materials_desc: { en: 'List of all documents previously added to the platform.', so: 'Liiska dhamaan dukumentiyada aad horey ugu soo dartay barmaamijka.' },
  no_docs: { en: 'No documents have been added yet.', so: 'Wali ma jiro wax dukumenti ah oo lagu daray.' },
  view_file: { en: 'View File', so: 'Muuqi Faylka' },
  video_settings: { en: 'YouTube Channel Settings (Promotional Video)', so: 'Habaynta Kanaalka YouTube (Promotional Video settings)' },
  video_settings_desc: { en: 'Configure the promotional video displayed on the homepage and your YouTube channel info.', so: 'Habeey muuqaalka soo jiidashada ah ee lagu soo bandhigayo homepage-ka iyo macluumaadka kanaalkaaga YouTube.' },
  youtube_id: { en: 'YouTube Video ID (11 characters)', so: 'YouTube Video ID (11 xaraf)' },
  channel_name: { en: 'YouTube Channel Name', so: 'Magaca Kanaalka YouTube-ka' },
  channel_url: { en: 'YouTube Channel URL', so: 'URL Kanaalka YouTube-ka' },
  video_title_label: { en: 'Video Title / Caption', so: 'Ciwaanka Muuqaalka' },
  video_thumbnail_label: { en: 'Custom Thumbnail URL', so: 'Sawirka Muuqaalka (URL)' },
  save_video: { en: 'Save Video Settings', so: 'Keydi Dejinta Muuqaalka' },
  video_tip_title: { en: 'Detailed Tip', so: 'Talo bixin faahfaahsan' },
  video_tip_text: { en: 'To get the Video ID, open the YouTube video, copy the 11 characters after', so: 'Si aad u hesho Video ID-ga, u fur muuqaalka aad rabto YouTube-ka, ka koobiyeey 11-ka xaraf ee ku jira URL-ka kadib xariiqda' },
  video_success: { en: 'YouTube channel settings saved successfully!', so: 'Habeynta kanaalka YouTube-ka si guul ah ayaa loo keydiyey!' },
  add_staff: { en: 'Add Staff Account', so: 'Abuur Akoon Cusub (Add Staff)' },
  add_staff_desc: { en: 'Create passwords for new teachers and admins so they can log in directly.', so: 'U samee password macalimiinta iyo maamulayaasha cusub si ay si toos ah ugu soo galaan.' },
  staff_name: { en: 'Full Name', so: 'Magaca Buuxa' },
  staff_email: { en: 'Email (Gmail)', so: 'Email (G-Mail)' },
  staff_password: { en: 'New Password', so: 'Password Cusub' },
  staff_role: { en: 'Role Type', so: 'Nooca Shaqada (Role)' },
  teacher: { en: 'Teacher', so: 'Macalin (Teacher)' },
  admin_role: { en: 'Admin', so: 'Maamule (Admin)' },
  create_staff: { en: 'Create Account', so: 'Samee Akoonka' },
  staff_success: { en: 'New account created successfully!', so: 'Akoonka cusub waa la sameeyay si guul ah!' },
  staff_list: { en: 'Staff List', so: 'Liiska Shaqaalaha (Staff List)' },
  no_staff: { en: 'No staff members registered yet.', so: 'Wali ma jiraan shaqaale diiwaangashan.' },
  name_col: { en: 'Name', so: 'Magaca' },
  email_col: { en: 'Email', so: 'Email' },
  type_col: { en: 'Type', so: 'Nooca' },
  date_col: { en: 'Date', so: 'Taariikhda' },

  // ===== LEADERBOARD =====
  leaderboard_title: { en: 'Student Leaderboard', so: 'Tartanka Ardayda' },
  leaderboard_subtitle: { en: 'Top students ranked by enrollment points and achievements.', so: 'Ardayda ugu sarraysa ee ku kala tartamaya dhibcaha iyo guusha.' },
  rank: { en: 'Rank', so: 'Tartanka' },
  student: { en: 'Student', so: 'Ardayga' },
  enrolled_courses: { en: 'Enrolled Courses', so: 'Koorsada la qaatay' },
  rank_gold: { en: 'Gold', so: 'Dahab' },
  rank_silver: { en: 'Silver', so: 'Lacag' },
  rank_bronze: { en: 'Bronze', so: 'Naxaas' },
  rank_member: { en: 'Member', so: 'Xubin' },

  // ===== MISC / SHARED =====
  fill_required: { en: 'Please fill in all required fields.', so: 'Fadlan wada buuxi dhamaan meelaha lagama maarmaanka ah.' },
  error_occurred: { en: 'An error occurred.', so: 'Khalad ayaa dhacay.' },
  passwords_mismatch: { en: 'The passwords do not match!', so: 'Furayaasha aad qortay isku mid ma aha!' },
  admin_required: { en: 'You must be an admin to perform this action.', so: 'Fadlan hubi inaad tahay maamule (admin) si aad u sameyso ficilkan.' },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Try to load language preference from localStorage on mount
    const savedLang = localStorage.getItem('somskool-language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'so')) {
      setLanguageState(savedLang);
    } else {
      // Default to Somali since the site is SOMSKOOL
      setLanguageState('so');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('somskool-language', lang);
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'so' : 'en';
    setLanguage(newLang);
  };

  const t = (key: string): string => {
    if (!translations[key]) {
      // Fallback if key missing
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
