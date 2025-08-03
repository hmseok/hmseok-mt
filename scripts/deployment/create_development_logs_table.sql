-- 개발 기록 테이블 생성
CREATE TABLE IF NOT EXISTS development_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATETIME NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    category VARCHAR(50),
    status VARCHAR(50),
    author VARCHAR(100),
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);

-- 인덱스 생성
CREATE INDEX idx_development_logs_date ON development_logs(date);
CREATE INDEX idx_development_logs_category ON development_logs(category);
CREATE INDEX idx_development_logs_status ON development_logs(status);
CREATE INDEX idx_development_logs_author ON development_logs(author); 