const QUESTIONS_DB = {
    'html': [
        { q: 'What does HTML stand for?', o: ['Hyper Text Markup Language', 'Hyperlinks and Text Markup Language', 'Home Tool Markup Language', 'Hyper Text Makeup Language'], a: 0 },
        { q: 'Which tag is used for the largest heading?', o: ['<h6>', '<head>', '<h1>', '<header>'], a: 2 },
        { q: 'Which attribute specifies an image source?', o: ['alt', 'src', 'href', 'link'], a: 1 },
        { q: 'Which tag defines an unordered list?', o: ['<ol>', '<ul>', '<li>', '<list>'], a: 1 },
        { q: 'What is the correct HTML element for inserting a line break?', o: ['<lb>', '<break>', '<br>', '<newline>'], a: 2 }
    ],
    'css': [
        { q: 'What does CSS stand for?', o: ['Cascading Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'], a: 0 },
        { q: 'Which property is used to change the background color?', o: ['color', 'bgcolor', 'background-color', 'background'], a: 2 },
        { q: 'How do you select an element with id "demo"?', o: ['.demo', '#demo', '*demo', 'demo'], a: 1 },
        { q: 'Which property controls the text size?', o: ['font-style', 'text-size', 'font-size', 'text-style'], a: 2 },
        { q: 'How do you make a list that lists its items with squares?', o: ['list-type: square', 'list-style-type: square', 'list: square', 'list-s: square'], a: 1 }
    ],
    'javascript': [
        { q: 'Inside which HTML element do we put the JavaScript?', o: ['<javascript>', '<scripting>', '<js>', '<script>'], a: 3 },
        { q: 'How do you write "Hello World" in an alert box?', o: ['msg("Hello World");', 'alert("Hello World");', 'msgBox("Hello World");', 'alertBox("Hello World");'], a: 1 },
        { q: 'How do you create a function in JavaScript?', o: ['function = myFunction()', 'function myFunction()', 'function:myFunction()', 'create myFunction()'], a: 1 },
        { q: 'How do you call a function named "myFunction"?', o: ['call myFunction()', 'call function myFunction()', 'myFunction()', 'Run.myFunction()'], a: 2 },
        { q: 'How to write an IF statement in JavaScript?', o: ['if i = 5 then', 'if i == 5 then', 'if (i == 5)', 'if i = 5'], a: 2 }
    ],
    'react': [
        { q: 'What is a React Component?', o: ['A function that returns HTML', 'A class that extends HTML', 'A CSS file', 'A database model'], a: 0 },
        { q: 'Which hook is used for state management?', o: ['useEffect', 'useState', 'useContext', 'useReducer'], a: 1 },
        { q: 'What is the virtual DOM?', o: ['A direct copy of the real DOM', 'A lightweight copy of the DOM', 'A separate browser window', 'A server-side process'], a: 1 },
        { q: 'How do you pass data to a child component?', o: ['State', 'Props', 'Context', 'Redux'], a: 1 },
        { q: 'What is JSX?', o: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'], a: 0 }
    ],
    'node': [
        { q: 'What is Node.js?', o: ['A frontend framework', 'A database', 'A JavaScript runtime environment', 'A text editor'], a: 2 },
        { q: 'Which module is used to create a web server?', o: ['http', 'fs', 'url', 'path'], a: 0 },
        { q: 'How do you install a package using NPM?', o: ['npm get <package>', 'npm install <package>', 'npm download <package>', 'npm add <package>'], a: 1 },
        { q: 'What is callback hell?', o: ['Excessive nesting of callbacks', 'A failed API call', 'A database error', 'A syntax error'], a: 0 },
        { q: 'Which object is global in Node.js?', o: ['window', 'document', 'process', 'navigator'], a: 2 }
    ],
    'python': [
        { q: 'What is the correct file extension for Python files?', o: ['.pt', '.pyt', '.py', '.p'], a: 2 },
        { q: 'How do you create a variable with the numeric value 5?', o: ['x = 5', 'x = int(5)', 'int x = 5', 'Both A and B'], a: 3 },
        { q: 'Which method can be used to return a string without any whitespace at the beginning or the end?', o: ['trim()', 'strip()', 'len()', 'ptrim()'], a: 1 },
        { q: 'Which collection is ordered, changeable, and allows duplicate members?', o: ['List', 'Tuple', 'Set', 'Dictionary'], a: 0 },
        { q: 'How do you start a for loop?', o: ['for x in y:', 'for x in y', 'forEach x in y:', 'for x loop y:'], a: 0 }
    ],
    'sql': [
        { q: 'What does SQL stand for?', o: ['Structured Question Language', 'Structured Query Language', 'Strong Question Language', 'Structured Query List'], a: 1 },
        { q: 'Which statement is used to extract data from a database?', o: ['GET', 'OPEN', 'EXTRACT', 'SELECT'], a: 3 },
        { q: 'Which statement is used to update data in a database?', o: ['SAVE', 'MODIFY', 'UPDATE', 'CHANGE'], a: 2 },
        { q: 'Which statement is used to delete data from a database?', o: ['REMOVE', 'DELETE', 'COLLAPSE', 'DROP'], a: 1 },
        { q: 'Which operator is used to select values within a range?', o: ['BETWEEN', 'RANGE', 'WITHIN', 'IN'], a: 0 }
    ],
    'git': [
        { q: 'What connects a local repo to a remote one?', o: ['git push', 'git remote add origin', 'git clone', 'git pull'], a: 1 },
        { q: 'Which command creates a new branch?', o: ['git branch <name>', 'git checkout -b <name>', 'Both A and B', 'git create <name>'], a: 2 },
        { q: 'What is a "commit"?', o: ['Sending code to server', 'Saving code changes locally', 'Deleting code', 'Merging branches'], a: 1 },
        { q: 'Which command downloads dependencies?', o: ['git install', 'npm install', 'python install', 'make install'], a: 1 }, // Trick question but relevant for dev
        { q: 'What does "git pull" do?', o: ['Uploads changes', 'Downloads and merges changes', 'Deletes local changes', 'Creates a backup'], a: 1 }
    ]
};

const GENERIC = [
    { q: 'What is the primary goal of this topic?', o: ['To confuse developers', 'To solve a specific problem efficiently', 'To increase code complexity', 'To use more memory'], a: 1 },
    { q: 'Which is a best practice regarding this topic?', o: ['Write code quickly without testing', 'Keep code modular and readable', 'Use copy-paste exclusively', 'Ignore documentation'], a: 1 },
    { q: 'Why is testing important?', o: ['It slows down development', 'It ensures code reliability', 'It is optional', 'It checks spelling'], a: 1 },
    { q: 'What is the first step in debugging?', o: ['Rewrite the whole code', 'Blame the compiler', 'Reproduce the issue', 'Ask on StackOverflow immediately'], a: 2 },
    { q: 'Why use version control?', o: ['To look cool', 'To track changes and collaborate', 'To use more disk space', 'To slow down deployment'], a: 1 }
];

exports.generateQuiz = (topic = '', count = 3) => {
    const key = Object.keys(QUESTIONS_DB).find(k => topic.toLowerCase().includes(k));
    let pool = key ? QUESTIONS_DB[key] : GENERIC;

    // Shuffle and pick 3
    const shuffled = pool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(q => ({
        question: q.q,
        options: q.o,
        correctIndex: q.a,
        explanation: 'Review the topic documentation for more details.'
    }));
};
