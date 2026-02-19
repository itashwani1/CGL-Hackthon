const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Role = require('../models/Role');
const Recommendation = require('../models/Recommendation');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillsync';

const roles = [
    {
        name: 'Full Stack Developer',
        category: 'Engineering',
        description: 'Build end-to-end web applications using modern technologies',
        experienceLevel: 'Mid',
        demandIndex: 92,
        salaryRange: { min: 80000, max: 145000, currency: 'USD' },
        topCompanies: ['Google', 'Meta', 'Shopify', 'Airbnb', 'Stripe'],
        requiredSkills: [
            { skill: 'JavaScript', weight: 0.2, minimumProficiency: 8, category: 'Programming' },
            { skill: 'React', weight: 0.18, minimumProficiency: 7, category: 'Frontend' },
            { skill: 'Node.js', weight: 0.16, minimumProficiency: 7, category: 'Backend' },
            { skill: 'MongoDB', weight: 0.12, minimumProficiency: 6, category: 'Database' },
            { skill: 'REST APIs', weight: 0.1, minimumProficiency: 7, category: 'Backend' },
            { skill: 'Git', weight: 0.08, minimumProficiency: 6, category: 'Tools' },
            { skill: 'CSS', weight: 0.09, minimumProficiency: 6, category: 'Frontend' },
            { skill: 'TypeScript', weight: 0.07, minimumProficiency: 6, category: 'Programming' },
        ],
    },
    {
        name: 'Data Scientist',
        category: 'Data',
        description: 'Analyse complex datasets and build predictive models',
        experienceLevel: 'Mid',
        demandIndex: 89,
        salaryRange: { min: 95000, max: 165000, currency: 'USD' },
        topCompanies: ['Netflix', 'Amazon', 'Microsoft', 'IBM', 'OpenAI'],
        requiredSkills: [
            { skill: 'Python', weight: 0.22, minimumProficiency: 9, category: 'Programming' },
            { skill: 'Machine Learning', weight: 0.2, minimumProficiency: 7, category: 'Data Science' },
            { skill: 'Statistics', weight: 0.18, minimumProficiency: 8, category: 'Data Science' },
            { skill: 'SQL', weight: 0.12, minimumProficiency: 7, category: 'Database' },
            { skill: 'TensorFlow', weight: 0.1, minimumProficiency: 6, category: 'AI/ML' },
            { skill: 'Data Visualization', weight: 0.1, minimumProficiency: 6, category: 'Data Science' },
            { skill: 'Pandas', weight: 0.08, minimumProficiency: 7, category: 'Data Science' },
        ],
    },
    {
        name: 'DevOps Engineer',
        category: 'DevOps',
        description: 'Bridge development and operations through automation and CI/CD',
        experienceLevel: 'Mid',
        demandIndex: 87,
        salaryRange: { min: 90000, max: 155000, currency: 'USD' },
        topCompanies: ['HashiCorp', 'AWS', 'Cloudflare', 'GitLab', 'Atlassian'],
        requiredSkills: [
            { skill: 'Docker', weight: 0.2, minimumProficiency: 8, category: 'DevOps' },
            { skill: 'Kubernetes', weight: 0.18, minimumProficiency: 7, category: 'DevOps' },
            { skill: 'CI/CD', weight: 0.15, minimumProficiency: 7, category: 'DevOps' },
            { skill: 'Linux', weight: 0.15, minimumProficiency: 8, category: 'Systems' },
            { skill: 'AWS', weight: 0.12, minimumProficiency: 6, category: 'Cloud' },
            { skill: 'Terraform', weight: 0.1, minimumProficiency: 6, category: 'DevOps' },
            { skill: 'Python', weight: 0.1, minimumProficiency: 5, category: 'Programming' },
        ],
    },
    {
        name: 'Machine Learning Engineer',
        category: 'Data',
        description: 'Design and deploy ML systems at scale in production',
        experienceLevel: 'Senior',
        demandIndex: 95,
        salaryRange: { min: 120000, max: 200000, currency: 'USD' },
        topCompanies: ['OpenAI', 'DeepMind', 'Tesla', 'Apple', 'Nvidia'],
        requiredSkills: [
            { skill: 'Python', weight: 0.2, minimumProficiency: 9, category: 'Programming' },
            { skill: 'TensorFlow', weight: 0.18, minimumProficiency: 8, category: 'AI/ML' },
            { skill: 'Machine Learning', weight: 0.2, minimumProficiency: 9, category: 'Data Science' },
            { skill: 'Deep Learning', weight: 0.15, minimumProficiency: 7, category: 'AI/ML' },
            { skill: 'MLOps', weight: 0.12, minimumProficiency: 6, category: 'DevOps' },
            { skill: 'Statistics', weight: 0.15, minimumProficiency: 8, category: 'Data Science' },
        ],
    },
    {
        name: 'Frontend Developer',
        category: 'Engineering',
        description: 'Create beautiful, performant user interfaces',
        experienceLevel: 'Mid',
        demandIndex: 85,
        salaryRange: { min: 70000, max: 130000, currency: 'USD' },
        topCompanies: ['Figma', 'Vercel', 'Shopify', 'Twitter', 'Spotify'],
        requiredSkills: [
            { skill: 'React', weight: 0.25, minimumProficiency: 8, category: 'Frontend' },
            { skill: 'JavaScript', weight: 0.22, minimumProficiency: 8, category: 'Programming' },
            { skill: 'CSS', weight: 0.18, minimumProficiency: 8, category: 'Frontend' },
            { skill: 'TypeScript', weight: 0.15, minimumProficiency: 7, category: 'Programming' },
            { skill: 'HTML', weight: 0.1, minimumProficiency: 8, category: 'Frontend' },
            { skill: 'Git', weight: 0.1, minimumProficiency: 6, category: 'Tools' },
        ],
    },
    {
        name: 'Backend Developer',
        category: 'Engineering',
        description: 'Build scalable server-side applications and APIs',
        experienceLevel: 'Mid',
        demandIndex: 88,
        salaryRange: { min: 80000, max: 140000, currency: 'USD' },
        topCompanies: ['Stripe', 'Twilio', 'PayPal', 'Uber', 'DoorDash'],
        requiredSkills: [
            { skill: 'Node.js', weight: 0.2, minimumProficiency: 8, category: 'Backend' },
            { skill: 'REST APIs', weight: 0.2, minimumProficiency: 8, category: 'Backend' },
            { skill: 'SQL', weight: 0.15, minimumProficiency: 7, category: 'Database' },
            { skill: 'MongoDB', weight: 0.12, minimumProficiency: 6, category: 'Database' },
            { skill: 'System Design', weight: 0.15, minimumProficiency: 6, category: 'Architecture' },
            { skill: 'Docker', weight: 0.1, minimumProficiency: 6, category: 'DevOps' },
            { skill: 'Git', weight: 0.08, minimumProficiency: 6, category: 'Tools' },
        ],
    },
    {
        name: 'Cloud Architect',
        category: 'DevOps',
        description: 'Design and manage enterprise cloud infrastructure',
        experienceLevel: 'Senior',
        demandIndex: 91,
        salaryRange: { min: 130000, max: 220000, currency: 'USD' },
        topCompanies: ['AWS', 'Microsoft Azure', 'Google Cloud', 'Oracle', 'IBM'],
        requiredSkills: [
            { skill: 'AWS', weight: 0.25, minimumProficiency: 9, category: 'Cloud' },
            { skill: 'Kubernetes', weight: 0.18, minimumProficiency: 8, category: 'DevOps' },
            { skill: 'Terraform', weight: 0.17, minimumProficiency: 8, category: 'DevOps' },
            { skill: 'System Design', weight: 0.15, minimumProficiency: 8, category: 'Architecture' },
            { skill: 'Linux', weight: 0.12, minimumProficiency: 7, category: 'Systems' },
            { skill: 'Networking', weight: 0.13, minimumProficiency: 7, category: 'Systems' },
        ],
    },
    {
        name: 'Cybersecurity Analyst',
        category: 'Security',
        description: 'Protect systems and networks from digital threats',
        experienceLevel: 'Mid',
        demandIndex: 93,
        salaryRange: { min: 85000, max: 150000, currency: 'USD' },
        topCompanies: ['CrowdStrike', 'Palo Alto Networks', 'Fortinet', 'Cisco', 'Microsoft'],
        requiredSkills: [
            { skill: 'Cybersecurity', weight: 0.25, minimumProficiency: 8, category: 'Security' },
            { skill: 'Networking', weight: 0.2, minimumProficiency: 8, category: 'Systems' },
            { skill: 'Linux', weight: 0.15, minimumProficiency: 7, category: 'Systems' },
            { skill: 'Python', weight: 0.15, minimumProficiency: 6, category: 'Programming' },
            { skill: 'Penetration Testing', weight: 0.15, minimumProficiency: 7, category: 'Security' },
            { skill: 'SQL', weight: 0.1, minimumProficiency: 5, category: 'Database' },
        ],
    },
    {
        name: 'Product Manager',
        category: 'Product',
        description: 'Lead product strategy and cross-functional execution',
        experienceLevel: 'Mid',
        demandIndex: 82,
        salaryRange: { min: 95000, max: 175000, currency: 'USD' },
        topCompanies: ['Google', 'Apple', 'Meta', 'LinkedIn', 'Salesforce'],
        requiredSkills: [
            { skill: 'Product Strategy', weight: 0.22, minimumProficiency: 8, category: 'Product' },
            { skill: 'Data Analysis', weight: 0.18, minimumProficiency: 7, category: 'Data Science' },
            { skill: 'User Research', weight: 0.18, minimumProficiency: 7, category: 'Design' },
            { skill: 'Agile', weight: 0.15, minimumProficiency: 7, category: 'Management' },
            { skill: 'Communication', weight: 0.15, minimumProficiency: 8, category: 'Soft Skills' },
            { skill: 'SQL', weight: 0.12, minimumProficiency: 5, category: 'Database' },
        ],
    },
    {
        name: 'UI/UX Designer',
        category: 'Design',
        description: 'Design intuitive and beautiful user experiences',
        experienceLevel: 'Mid',
        demandIndex: 83,
        salaryRange: { min: 70000, max: 130000, currency: 'USD' },
        topCompanies: ['Figma', 'Adobe', 'Apple', 'Airbnb', 'Dropbox'],
        requiredSkills: [
            { skill: 'Figma', weight: 0.25, minimumProficiency: 9, category: 'Design' },
            { skill: 'UI Design', weight: 0.22, minimumProficiency: 8, category: 'Design' },
            { skill: 'User Research', weight: 0.18, minimumProficiency: 7, category: 'Design' },
            { skill: 'Prototyping', weight: 0.15, minimumProficiency: 7, category: 'Design' },
            { skill: 'CSS', weight: 0.1, minimumProficiency: 5, category: 'Frontend' },
            { skill: 'Communication', weight: 0.1, minimumProficiency: 7, category: 'Soft Skills' },
        ],
    },
];

const recommendations = [
    {
        skill: 'javascript',
        displayName: 'JavaScript',
        category: 'Programming',
        courses: [
            { title: 'JavaScript - The Complete Guide 2024', url: 'https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/', platform: 'Udemy', duration: '52 hours', difficulty: 'Beginner', rating: 4.8, isPaid: true },
            { title: 'JavaScript Algorithms and Data Structures', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', platform: 'FreeCodeCamp', duration: 'Self-paced', difficulty: 'Beginner', rating: 4.7, isPaid: false },
            { title: 'The Modern JavaScript Tutorial', url: 'https://javascript.info/', platform: 'YouTube', duration: '40 hours', difficulty: 'Intermediate', rating: 4.9, isPaid: false },
            { title: 'JavaScript: Understanding the Weird Parts', url: 'https://www.udemy.com/course/understand-javascript/', platform: 'Udemy', duration: '11.5 hours', difficulty: 'Intermediate', rating: 4.7, isPaid: true },
        ],
    },
    {
        skill: 'react',
        displayName: 'React',
        category: 'Frontend',
        courses: [
            { title: 'React - The Complete Guide (incl Hooks, React Router, Redux)', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', platform: 'Udemy', duration: '49 hours', difficulty: 'Beginner', rating: 4.8, isPaid: true },
            { title: 'Full Stack Open - Part 1-3', url: 'https://fullstackopen.com/', platform: 'FreeCodeCamp', duration: 'Self-paced', difficulty: 'Intermediate', rating: 4.9, isPaid: false },
            { title: 'React Official Tutorial', url: 'https://react.dev/learn', platform: 'YouTube', duration: '20 hours', difficulty: 'Beginner', rating: 4.8, isPaid: false },
        ],
    },
    {
        skill: 'node.js',
        displayName: 'Node.js',
        category: 'Backend',
        courses: [
            { title: 'The Complete Node.js Developer Course', url: 'https://www.udemy.com/course/the-complete-nodejs-developer-course-2/', platform: 'Udemy', duration: '35 hours', difficulty: 'Beginner', rating: 4.7, isPaid: true },
            { title: 'Node.js Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=TlB_eWDSMt4', platform: 'YouTube', duration: '1.5 hours', difficulty: 'Beginner', rating: 4.6, isPaid: false },
            { title: 'Introduction to Node.js', url: 'https://www.edx.org/learn/node-js', platform: 'edX', duration: '8 hours', difficulty: 'Beginner', rating: 4.5, isPaid: false },
        ],
    },
    {
        skill: 'python',
        displayName: 'Python',
        category: 'Programming',
        courses: [
            { title: '100 Days of Code: The Complete Python Pro Bootcamp', url: 'https://www.udemy.com/course/100-days-of-code/', platform: 'Udemy', duration: '60 hours', difficulty: 'Beginner', rating: 4.8, isPaid: true },
            { title: 'Python for Everybody Specialization', url: 'https://www.coursera.org/specializations/python', platform: 'Coursera', duration: '32 hours', difficulty: 'Beginner', rating: 4.8, isPaid: false },
            { title: 'Introduction to Python Programming', url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/', platform: 'FreeCodeCamp', duration: 'Self-paced', difficulty: 'Beginner', rating: 4.7, isPaid: false },
        ],
    },
    {
        skill: 'machine learning',
        displayName: 'Machine Learning',
        category: 'Data Science',
        courses: [
            { title: 'Machine Learning Specialization', url: 'https://www.coursera.org/specializations/machine-learning-introduction', platform: 'Coursera', duration: '33 hours', difficulty: 'Intermediate', rating: 4.9, isPaid: false },
            { title: 'Machine Learning A-Z', url: 'https://www.udemy.com/course/machinelearning/', platform: 'Udemy', duration: '44 hours', difficulty: 'Intermediate', rating: 4.5, isPaid: true },
            { title: 'Fast.ai - Practical Deep Learning', url: 'https://course.fast.ai/', platform: 'YouTube', duration: '20 hours', difficulty: 'Intermediate', rating: 4.8, isPaid: false },
        ],
    },
    {
        skill: 'docker',
        displayName: 'Docker',
        category: 'DevOps',
        courses: [
            { title: 'Docker & Kubernetes: The Practical Guide', url: 'https://www.udemy.com/course/docker-kubernetes-the-practical-guide/', platform: 'Udemy', duration: '23 hours', difficulty: 'Intermediate', rating: 4.7, isPaid: true },
            { title: 'Docker Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE', platform: 'YouTube', duration: '3 hours', difficulty: 'Beginner', rating: 4.6, isPaid: false },
            { title: 'Docker Mastery with Kubernetes + Swarm', url: 'https://www.udemy.com/course/docker-mastery/', platform: 'Udemy', duration: '19 hours', difficulty: 'Intermediate', rating: 4.8, isPaid: true },
        ],
    },
    {
        skill: 'kubernetes',
        displayName: 'Kubernetes',
        category: 'DevOps',
        courses: [
            { title: 'Kubernetes for the Absolute Beginners', url: 'https://www.udemy.com/course/learn-kubernetes/', platform: 'Udemy', duration: '5 hours', difficulty: 'Beginner', rating: 4.6, isPaid: true },
            { title: 'CKA: Certified Kubernetes Administrator', url: 'https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/', platform: 'Udemy', duration: '17 hours', difficulty: 'Advanced', rating: 4.8, isPaid: true },
            { title: 'Kubernetes Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=X48VuDVv0do', platform: 'YouTube', duration: '4 hours', difficulty: 'Beginner', rating: 4.7, isPaid: false },
        ],
    },
    {
        skill: 'aws',
        displayName: 'AWS',
        category: 'Cloud',
        courses: [
            { title: 'AWS Certified Solutions Architect - Associate', url: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/', platform: 'Udemy', duration: '27 hours', difficulty: 'Intermediate', rating: 4.7, isPaid: true },
            { title: 'AWS Fundamentals Specialization', url: 'https://www.coursera.org/specializations/aws-fundamentals', platform: 'Coursera', duration: '12 hours', difficulty: 'Beginner', rating: 4.6, isPaid: false },
            { title: 'AWS Free Tier Training', url: 'https://aws.amazon.com/training/', platform: 'YouTube', duration: 'Self-paced', difficulty: 'Beginner', rating: 4.5, isPaid: false },
        ],
    },
    {
        skill: 'sql',
        displayName: 'SQL',
        category: 'Database',
        courses: [
            { title: 'The Complete SQL Bootcamp', url: 'https://www.udemy.com/course/the-complete-sql-bootcamp/', platform: 'Udemy', duration: '9 hours', difficulty: 'Beginner', rating: 4.7, isPaid: true },
            { title: 'SQL for Data Science', url: 'https://www.coursera.org/learn/sql-for-data-science', platform: 'Coursera', duration: '12 hours', difficulty: 'Beginner', rating: 4.5, isPaid: false },
            { title: 'Learn SQL - Khan Academy', url: 'https://www.khanacademy.org/computing/computer-programming/sql', platform: 'YouTube', duration: 'Self-paced', difficulty: 'Beginner', rating: 4.6, isPaid: false },
        ],
    },
    {
        skill: 'mongodb',
        displayName: 'MongoDB',
        category: 'Database',
        courses: [
            { title: 'MongoDB - The Complete Developer Guide', url: 'https://www.udemy.com/course/mongodb-the-complete-developers-guide/', platform: 'Udemy', duration: '17 hours', difficulty: 'Beginner', rating: 4.6, isPaid: true },
            { title: 'MongoDB University Free Courses', url: 'https://learn.mongodb.com/', platform: 'YouTube', duration: 'Self-paced', difficulty: 'Beginner', rating: 4.7, isPaid: false },
        ],
    },
    {
        skill: 'tensorflow',
        displayName: 'TensorFlow',
        category: 'AI/ML',
        courses: [
            { title: 'TensorFlow Developer Certificate Exam', url: 'https://www.coursera.org/professional-certificates/tensorflow-in-practice', platform: 'Coursera', duration: '16 hours', difficulty: 'Intermediate', rating: 4.7, isPaid: false },
            { title: 'Deep Learning with TensorFlow 2 and Keras', url: 'https://www.udemy.com/course/complete-tensorflow-2-and-keras-deep-learning-bootcamp/', platform: 'Udemy', duration: '17 hours', difficulty: 'Intermediate', rating: 4.5, isPaid: true },
        ],
    },
    {
        skill: 'typescript',
        displayName: 'TypeScript',
        category: 'Programming',
        courses: [
            { title: 'Understanding TypeScript - 2024 Edition', url: 'https://www.udemy.com/course/understanding-typescript/', platform: 'Udemy', duration: '15 hours', difficulty: 'Intermediate', rating: 4.7, isPaid: true },
            { title: 'TypeScript Full Course for Beginners', url: 'https://www.youtube.com/watch?v=30LWjhZzg50', platform: 'YouTube', duration: '3 hours', difficulty: 'Beginner', rating: 4.6, isPaid: false },
        ],
    },
    {
        skill: 'css',
        displayName: 'CSS',
        category: 'Frontend',
        courses: [
            { title: 'CSS - The Complete Guide (incl. Flexbox, Grid & Sass)', url: 'https://www.udemy.com/course/css-the-complete-guide-incl-flexbox-grid-sass/', platform: 'Udemy', duration: '22 hours', difficulty: 'Beginner', rating: 4.7, isPaid: true },
            { title: 'Responsive Web Design Certification', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', platform: 'FreeCodeCamp', duration: 'Self-paced', difficulty: 'Beginner', rating: 4.8, isPaid: false },
        ],
    },
    {
        skill: 'git',
        displayName: 'Git',
        category: 'Tools',
        courses: [
            { title: 'The Git & Github Bootcamp', url: 'https://www.udemy.com/course/git-and-github-bootcamp/', platform: 'Udemy', duration: '17 hours', difficulty: 'Beginner', rating: 4.8, isPaid: true },
            { title: 'Git Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=8JJ101D3knE', platform: 'YouTube', duration: '1.5 hours', difficulty: 'Beginner', rating: 4.7, isPaid: false },
        ],
    },
    {
        skill: 'rest apis',
        displayName: 'REST APIs',
        category: 'Backend',
        courses: [
            { title: 'REST APIs with Flask and Python', url: 'https://www.udemy.com/course/rest-api-flask-and-python/', platform: 'Udemy', duration: '17 hours', difficulty: 'Intermediate', rating: 4.7, isPaid: true },
            { title: 'API Design Best Practices', url: 'https://www.youtube.com/watch?v=_gQaygjm_hg', platform: 'YouTube', duration: '2 hours', difficulty: 'Intermediate', rating: 4.5, isPaid: false },
        ],
    },
    {
        skill: 'system design',
        displayName: 'System Design',
        category: 'Architecture',
        courses: [
            { title: 'System Design Interview - An Insider Guide', url: 'https://www.udemy.com/course/system-design-interview-prep/', platform: 'Udemy', duration: '12 hours', difficulty: 'Advanced', rating: 4.6, isPaid: true },
            { title: 'System Design Primer - GitHub', url: 'https://github.com/donnemartin/system-design-primer', platform: 'YouTube', duration: 'Self-paced', difficulty: 'Intermediate', rating: 4.9, isPaid: false },
        ],
    },
    {
        skill: 'figma',
        displayName: 'Figma',
        category: 'Design',
        courses: [
            { title: 'Figma UI UX Design Essential Training', url: 'https://www.udemy.com/course/figma-ux-ui-design-user-experience-tutorial-course/', platform: 'Udemy', duration: '10 hours', difficulty: 'Beginner', rating: 4.7, isPaid: true },
            { title: 'Figma Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', platform: 'YouTube', duration: '2 hours', difficulty: 'Beginner', rating: 4.6, isPaid: false },
        ],
    },
    {
        skill: 'statistics',
        displayName: 'Statistics',
        category: 'Data Science',
        courses: [
            { title: 'Statistics for Data Science and Business Analysis', url: 'https://www.udemy.com/course/statistics-for-data-science-and-business-analysis/', platform: 'Udemy', duration: '9 hours', difficulty: 'Beginner', rating: 4.5, isPaid: true },
            { title: 'Statistics and Probability', url: 'https://www.khanacademy.org/math/statistics-probability', platform: 'YouTube', duration: 'Self-paced', difficulty: 'Beginner', rating: 4.8, isPaid: false },
        ],
    },
    {
        skill: 'linux',
        displayName: 'Linux',
        category: 'Systems',
        courses: [
            { title: 'Linux Command Line Basics', url: 'https://www.udemy.com/course/linux-command-line-volume1/', platform: 'Udemy', duration: '7 hours', difficulty: 'Beginner', rating: 4.6, isPaid: true },
            { title: 'Introduction to Linux - edX', url: 'https://www.edx.org/learn/linux', platform: 'edX', duration: '60 hours', difficulty: 'Beginner', rating: 4.7, isPaid: false },
        ],
    },
    {
        skill: 'terraform',
        displayName: 'Terraform',
        category: 'DevOps',
        courses: [
            { title: 'HashiCorp Certified: Terraform Associate', url: 'https://www.udemy.com/course/terraform-beginner-to-advanced/', platform: 'Udemy', duration: '12 hours', difficulty: 'Intermediate', rating: 4.7, isPaid: true },
            { title: 'Terraform Tutorial for Beginners', url: 'https://www.youtube.com/watch?v=SLB_c_ayRMo', platform: 'YouTube', duration: '4 hours', difficulty: 'Beginner', rating: 4.5, isPaid: false },
        ],
    },
    {
        skill: 'deep learning',
        displayName: 'Deep Learning',
        category: 'AI/ML',
        courses: [
            { title: 'Deep Learning Specialization', url: 'https://www.coursera.org/specializations/deep-learning', platform: 'Coursera', duration: '80 hours', difficulty: 'Advanced', rating: 4.9, isPaid: false },
            { title: 'PyTorch for Deep Learning Bootcamp', url: 'https://www.udemy.com/course/pytorch-for-deep-learning/', platform: 'Udemy', duration: '14 hours', difficulty: 'Intermediate', rating: 4.6, isPaid: true },
        ],
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Role.deleteMany({});
        await Recommendation.deleteMany({});
        console.log('🗑️  Cleared existing roles and recommendations');

        // Insert roles
        await Role.insertMany(roles);
        console.log(`✅ Seeded ${roles.length} industry roles`);

        // Insert recommendations
        await Recommendation.insertMany(recommendations);
        console.log(`✅ Seeded ${recommendations.length} skill recommendations`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('📋 Available career goals:');
        roles.forEach((r) => console.log(`   - ${r.name}`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        process.exit(1);
    }
};

seedDB();
