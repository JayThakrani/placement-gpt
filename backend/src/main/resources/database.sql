-- ====================================================
-- PLACEMENTGPT DATABASE SCHEMA & INITIAL SEED DATA
-- ====================================================

CREATE DATABASE IF NOT EXISTS placementgpt;
USE placementgpt;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    college VARCHAR(150),
    branch VARCHAR(100),
    semester INT,
    role VARCHAR(20) DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. APTITUDE QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS aptitude_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option VARCHAR(10) NOT NULL,
    explanation TEXT,
    category VARCHAR(100) DEFAULT 'General'
);

-- 3. CODING QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS coding_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    category VARCHAR(100) DEFAULT 'DSA',
    input_format TEXT,
    output_format TEXT,
    sample_input TEXT,
    sample_output TEXT
);

-- 4. TEST RESULTS TABLE
CREATE TABLE IF NOT EXISTS test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. CODING SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS coding_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES coding_questions(id) ON DELETE CASCADE
);


-- ====================================================
-- SEED DATA
-- ====================================================

-- Default Accounts
INSERT INTO users (name, email, password, college, branch, semester, role)
VALUES 
('System Admin', 'admin@placementgpt.com', 'admin123', 'IIT Bombay', 'Computer Science', 8, 'ADMIN'),
('Student User', 'student@placementgpt.com', 'student123', 'NIT Trichy', 'Information Technology', 6, 'STUDENT')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Sample Aptitude Questions
INSERT INTO aptitude_questions (question, option_a, option_b, option_c, option_d, correct_option, explanation, category)
VALUES
('A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?', '120 metres', '180 metres', '324 metres', '150 metres', 'option_d', 'Speed = 60 * (5/18) m/sec = 50/3 m/sec. Length = Speed * Time = (50/3) * 9 = 150 metres.', 'Quantitative'),
('Which number comes next in the series: 2, 6, 12, 20, 30, ?', '36', '40', '42', '48', 'option_c', 'The differences are +4, +6, +8, +10, +12. So 30 + 12 = 42.', 'Logical Reasoning'),
('Select the synonym of the word: PRAGMATIC', 'Idealistic', 'Practical', 'Theoretical', 'Irrational', 'option_b', 'Pragmatic means dealing with things sensibly and realistically.', 'Verbal Ability'),
('If A can finish a work in 10 days and B in 15 days, how many days will they take together?', '5 days', '6 days', '7.5 days', '8 days', 'option_b', '1/10 + 1/15 = 5/30 = 1/6. Total time = 6 days.', 'Quantitative');

-- Sample Coding Questions
INSERT INTO coding_questions (title, description, difficulty, category, input_format, output_format, sample_input, sample_output)
VALUES
('Two Sum', 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.', 'Easy', 'Arrays & Hashing', 'Line 1: space-separated array\nLine 2: target integer', 'Indices of two numbers', '2 7 11 15\n9', '0 1'),
('Reverse Linked List', 'Given the head of a singly linked list, reverse the list, and return the reversed list.', 'Easy', 'Linked Lists', 'Space separated integers representing elements of linked list', 'Space separated integers of reversed list', '1 2 3 4 5', '5 4 3 2 1'),
('Valid Parentheses', 'Given a string `s` containing just characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.', 'Medium', 'Stack', 'String s', 'true or false', '()[]{}', 'true');

-- Sample Activity / Stats
INSERT INTO test_results (user_id, score, total_questions) VALUES (2, 8, 10);
INSERT INTO coding_submissions (user_id, question_id, status) VALUES (2, 1, 'ACCEPTED');
