USE accident_local;

CREATE TABLE customer (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(30),
    insurance VARCHAR(100)
);

CREATE TABLE car (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT,
    number VARCHAR(30),
    model VARCHAR(100),
    year INT,
    CONSTRAINT fk_car_customer FOREIGN KEY (customer_id) REFERENCES customer(id)
);

CREATE TABLE accident (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    car_id BIGINT,
    date DATE,
    location VARCHAR(100),
    description TEXT,
    status VARCHAR(30),
    CONSTRAINT fk_accident_car FOREIGN KEY (car_id) REFERENCES car(id)
);

CREATE TABLE estimate (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    accident_id BIGINT,
    total_cost INT,
    created_at DATETIME,
    CONSTRAINT fk_estimate_accident FOREIGN KEY (accident_id) REFERENCES accident(id)
);

CREATE TABLE repair (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    accident_id BIGINT,
    item VARCHAR(100),
    cost INT,
    description TEXT,
    CONSTRAINT fk_repair_accident FOREIGN KEY (accident_id) REFERENCES accident(id)
);

CREATE TABLE accounting (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    type VARCHAR(30),
    amount INT,
    description TEXT,
    accident_id BIGINT,
    CONSTRAINT fk_accounting_accident FOREIGN KEY (accident_id) REFERENCES accident(id)
);