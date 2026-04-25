require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Resource } = require('./models');

const seed = async () => {
  await sequelize.sync({ force: true });
  console.log('DB synced, seeding...');

  const adminPw = await bcrypt.hash('admin1234', 12);
  const studentPw = await bcrypt.hash('student1234', 12);

  const admin = await User.create({ name: 'Admin User', email: 'admin@trincoll.edu', password: adminPw, role: 'admin', year: 'Staff' });
  const kuany = await User.create({ name: 'Kuany Kuany', email: 'kuany@trincoll.edu', password: studentPw, major: 'Computer Science', year: '2026' });
  const user2 = await User.create({ name: 'Alex Chen', email: 'alex@trincoll.edu', password: studentPw, major: 'Mathematics', year: '2027' });

  const resources = [
    { title: 'Quantitative Center (QRC)', description: 'Free drop-in tutoring for math, statistics, and quantitative courses. TAs and peer tutors available for all levels from intro calc to real analysis.', category: 'tutoring', location: 'Seabury Hall S117', schedule: 'Mon-Fri 10am-9pm, Sat 12pm-5pm', contact: 'qrc@trincoll.edu', tags: ['math', 'stats', 'tutoring', 'free'], createdBy: admin.id },
    { title: 'Writing Center', description: 'One-on-one writing consultations for any assignment — essays, lab reports, personal statements, theses. Walk-ins welcome or book online.', category: 'tutoring', location: 'Raether Library 115', schedule: 'Mon-Thu 10am-8pm, Fri 10am-4pm, Sun 2pm-8pm', contact: 'writingcenter@trincoll.edu', website: 'https://trincoll.edu/writing-center', tags: ['writing', 'essays', 'tutoring', 'free'], createdBy: admin.id },
    { title: 'Computer Science Department Office Hours', description: 'Weekly office hours for all CS faculty. Stop by with questions about coursework, research opportunities, career advice, or graduate school.', category: 'office_hours', location: 'Engineering Building 112', schedule: 'See department website for individual professor hours', contact: 'cs@trincoll.edu', tags: ['cs', 'faculty', 'advising'], createdBy: admin.id },
    { title: 'NESCAC Career Fair', description: 'Annual career fair connecting Trinity students with employers across finance, tech, consulting, healthcare, and nonprofits. 80+ companies attending.', category: 'event', location: 'Ferris Athletic Center', schedule: 'Spring semester — check Career Development for date', contact: 'career@trincoll.edu', tags: ['career', 'jobs', 'internship', 'networking'], createdBy: admin.id },
    { title: 'SPECTRUM (LGBTQ+ Alliance)', description: 'Inclusive student organization providing community, advocacy, and support for LGBTQ+ students and allies at Trinity. Weekly meetings and events throughout the year.', category: 'club', location: 'Multicultural Affairs Office', schedule: 'Wednesdays 7pm', contact: 'spectrum@trincoll.edu', tags: ['lgbtq', 'community', 'social', 'support'], createdBy: admin.id },
    { title: 'Trinity College Student Government Association', description: 'SGA represents the student body to the administration. Allocates funding to student orgs and advocates for student concerns. Apply to join committees.', category: 'club', location: 'Mather Student Center 101', schedule: 'Sundays 7pm general meetings', contact: 'sga@trincoll.edu', tags: ['leadership', 'government', 'funding', 'advocacy'], createdBy: admin.id },
    { title: 'Counseling and Wellness Center', description: 'Confidential mental health counseling, crisis support, and wellness resources. Individual therapy, group sessions, and referral services available to all students.', category: 'service', location: 'Hallden Hall', schedule: 'Mon-Fri 8:30am-5pm; 24/7 crisis line available', contact: '860-297-2415', website: 'https://trincoll.edu/counseling', tags: ['mental health', 'wellness', 'counseling', 'crisis', 'free'], createdBy: admin.id },
    { title: 'Bantam Network (Alumni Mentorship)', description: 'Connect with Trinity alumni in your field for career mentorship, informational interviews, and networking. 8,000+ alumni mentors across all industries.', category: 'service', location: 'Online via Handshake', schedule: 'Self-scheduled through platform', contact: 'alumni@trincoll.edu', website: 'https://bantamnetwork.trincoll.edu', tags: ['alumni', 'mentorship', 'career', 'networking'], createdBy: admin.id },
    { title: 'IDP — International Student Support', description: 'Resources and advising for international students: visa support, cultural adjustment, English language tutoring, and community events throughout the year.', category: 'service', location: 'Admissions Building 2nd Floor', schedule: 'Mon-Fri 9am-5pm', contact: 'idp@trincoll.edu', tags: ['international', 'visa', 'community', 'advising'], createdBy: admin.id },
    { title: 'CS Peer Tutoring — Intro Programming', description: 'Upper-level CS students offering free 1-on-1 tutoring for CPSC 110 and 115. Covers Python basics, debugging, data structures intro, and problem solving techniques.', category: 'tutoring', location: 'Engineering Building study rooms', schedule: 'Tues & Thurs 6pm-9pm', contact: 'cs-tutoring@trincoll.edu', tags: ['cs', 'python', 'programming', 'beginner', 'free'], createdBy: kuany.id },
    { title: 'Bantam Hackers (Hackathon Club)', description: 'Student org that organizes hackathons, coding workshops, and tech talks. Also coordinates travel to external hackathons like HackMIT, YHack, and HackHartford.', category: 'club', location: 'Engineering Building 205', schedule: 'Fridays 6pm general meetings + monthly hackathons', contact: 'bantamhackers@trincoll.edu', tags: ['hackathon', 'coding', 'tech', 'cs'], createdBy: kuany.id },
    { title: 'Statistics Drop-In Tutoring', description: 'Peer tutors for MATH 107, 201, and other stats courses. Covers probability, hypothesis testing, regression, R programming, and SPSS.', category: 'tutoring', location: 'QRC Annex', schedule: 'Mon/Wed/Fri 2pm-6pm', contact: 'qrc@trincoll.edu', tags: ['stats', 'math', 'R', 'data', 'free'], createdBy: user2.id },
    { title: 'Spring Weekend', description: 'Flagship annual spring event with live performances, activities, and community celebration. Student Activities Board organizes with input from all students.', category: 'event', location: 'Main Quad', schedule: 'Late April — check SAB website for exact date', tags: ['social', 'campus life', 'music'], createdBy: admin.id },
    { title: 'Pre-Law Society', description: 'Supports Trinity students interested in law school and legal careers. Events include LSAT prep workshops, mock interviews, law school panels, and attorney speakers.', category: 'club', location: 'McCook Academic Building', schedule: 'Thursdays 6:30pm', contact: 'prelaw@trincoll.edu', tags: ['law', 'pre-law', 'LSAT', 'career'], createdBy: admin.id },
    { title: 'Financial Aid & Student Employment Office', description: 'Advising for financial aid packages, work-study opportunities, emergency grants, and scholarship applications. Walk-ins or appointments available.', category: 'service', location: 'Admissions & Financial Aid Building', schedule: 'Mon-Fri 9am-5pm', contact: 'financialaid@trincoll.edu', tags: ['financial aid', 'money', 'scholarships', 'work-study'], createdBy: admin.id }
  ];

  for (const r of resources) await Resource.create(r);

  console.log(`Seeded: 3 users, ${resources.length} resources`);
  console.log('\nAdmin login:  admin@trincoll.edu / admin1234');
  console.log('Student login: kuany@trincoll.edu / student1234');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
