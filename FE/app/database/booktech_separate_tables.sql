-- =============================================
-- BookTech Database với bảng riêng biệt
-- Cấu trúc: roles, accounts, độc giả, thủ thư
-- =============================================

CREATE DATABASE IF NOT EXISTS booktech_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE booktech_db;

-- =============================================
-- Bảng Roles - Quản lý vai trò
-- =============================================
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSON, -- Lưu danh sách quyền dạng JSON
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_role_name (role_name),
    INDEX idx_active (is_active)
);

-- =============================================
-- Bảng Accounts - Tài khoản đăng nhập
-- =============================================
CREATE TABLE accounts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    
    -- Trạng thái tài khoản
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expires DATETIME,
    password_reset_token VARCHAR(255),
    password_reset_expires DATETIME,
    last_login DATETIME,
    login_attempts INT DEFAULT 0,
    locked_until DATETIME NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    
    -- Indexes
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role_id (role_id),
    INDEX idx_active (is_active),
    INDEX idx_last_login (last_login DESC)
);

-- =============================================
-- Bảng Độc giả - Thông tin độc giả
-- =============================================
CREATE TABLE doc_gia (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    account_id VARCHAR(36) NOT NULL UNIQUE,
    ma_doc_gia VARCHAR(20) NOT NULL UNIQUE,
    ho_ten VARCHAR(255) NOT NULL,
    ngay_sinh DATE,
    gioi_tinh ENUM('Nam', 'Nữ', 'Khác') DEFAULT 'Khác',
    so_dien_thoai VARCHAR(20),
    dia_chi TEXT,
    
    -- Thông tin học tập/công việc
    truong_hoc VARCHAR(255),
    lop_hoc VARCHAR(100),
    nganh_hoc VARCHAR(100),
    khoa VARCHAR(100),
    
    -- Thông tin thẻ thư viện
    ngay_cap_the DATE DEFAULT (CURDATE()),
    ngay_het_han DATE,
    trang_thai_the ENUM('Hoạt động', 'Tạm khóa', 'Hết hạn') DEFAULT 'Hoạt động',
    
    -- Thống kê đọc sách
    so_sach_dang_muon INT DEFAULT 0,
    so_sach_da_muon INT DEFAULT 0,
    so_lan_vi_pham INT DEFAULT 0,
    tien_phat DECIMAL(10,2) DEFAULT 0.00,
    
    -- Sở thích đọc
    the_loai_yeu_thich JSON,
    muc_tieu_doc_sach_nam INT DEFAULT 12,
    so_sach_da_doc_nam INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_ma_doc_gia (ma_doc_gia),
    INDEX idx_ho_ten (ho_ten),
    INDEX idx_account_id (account_id),
    INDEX idx_trang_thai_the (trang_thai_the),
    INDEX idx_ngay_het_han (ngay_het_han)
);

-- =============================================
-- Bảng Thủ thư - Thông tin nhân viên thư viện
-- =============================================
CREATE TABLE thu_thu (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    account_id VARCHAR(36) NOT NULL UNIQUE,
    ma_nhan_vien VARCHAR(20) NOT NULL UNIQUE,
    ho_ten VARCHAR(255) NOT NULL,
    ngay_sinh DATE,
    gioi_tinh ENUM('Nam', 'Nữ', 'Khác') DEFAULT 'Khác',
    so_dien_thoai VARCHAR(20),
    dia_chi TEXT,
    
    -- Thông tin công việc
    chuc_vu VARCHAR(100),
    phong_ban VARCHAR(100),
    ngay_vao_lam DATE,
    luong_co_ban DECIMAL(12,2),
    trang_thai_lam_viec ENUM('Đang làm việc', 'Nghỉ phép', 'Đã nghỉ việc') DEFAULT 'Đang làm việc',
    
    -- Thông tin liên hệ khẩn cấp
    nguoi_lien_he_khan_cap VARCHAR(255),
    sdt_khan_cap VARCHAR(20),
    
    -- Chuyên môn
    bang_cap VARCHAR(255),
    chuyen_nganh VARCHAR(255),
    kinh_nghiem_nam INT DEFAULT 0,
    
    -- Quyền hạn đặc biệt
    quyen_quan_ly_sach BOOLEAN DEFAULT TRUE,
    quyen_quan_ly_doc_gia BOOLEAN DEFAULT TRUE,
    quyen_bao_cao BOOLEAN DEFAULT FALSE,
    quyen_quan_tri BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_ma_nhan_vien (ma_nhan_vien),
    INDEX idx_ho_ten (ho_ten),
    INDEX idx_account_id (account_id),
    INDEX idx_chuc_vu (chuc_vu),
    INDEX idx_trang_thai (trang_thai_lam_viec)
);

-- =============================================
-- Insert dữ liệu mẫu
-- =============================================

-- Insert Roles
INSERT INTO roles (role_name, description, permissions) VALUES
('doc_gia', 'Độc giả thư viện', '["read_books", "borrow_books", "review_books", "favorite_books"]'),
('thu_thu', 'Thủ thư', '["manage_books", "manage_readers", "process_loans", "view_reports"]'),
('quan_ly', 'Quản lý thư viện', '["full_access", "manage_staff", "system_config", "advanced_reports"]'),
('admin', 'Quản trị hệ thống', '["system_admin", "user_management", "backup_restore", "security_config"]');

-- Insert sample accounts
-- Password cho tất cả: 123456 (đã hash)
INSERT INTO accounts (username, email, password_hash, role_id) VALUES
('admin', 'admin@booktech.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8xPBSxekm.', 4),
('quanly01', 'quanly@booktech.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8xPBSxekm.', 3),
('thuthu01', 'thuthu01@booktech.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8xPBSxekm.', 2),
('docgia01', 'docgia01@booktech.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8xPBSxekm.', 1);

-- Insert thủ thư mẫu
INSERT INTO thu_thu (account_id, ma_nhan_vien, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, chuc_vu, phong_ban, ngay_vao_lam) 
SELECT 
    a.id, 
    'TT001', 
    'Nguyễn Văn Thư', 
    '1990-05-15', 
    'Nam', 
    '0123456789', 
    'Thủ thư chính', 
    'Phòng Mượn Trả', 
    '2020-01-15'
FROM accounts a WHERE a.username = 'thuthu01';

-- Insert độc giả mẫu
INSERT INTO doc_gia (account_id, ma_doc_gia, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, truong_hoc, lop_hoc, ngay_het_han) 
SELECT 
    a.id, 
    'DG001', 
    'Trần Thị Đọc', 
    '2000-03-20', 
    'Nữ', 
    '0987654321', 
    'Đại học Công nghệ', 
    'CNTT K65', 
    DATE_ADD(CURDATE(), INTERVAL 1 YEAR)
FROM accounts a WHERE a.username = 'docgia01';

-- =============================================
-- Views hữu ích
-- =============================================

-- View thông tin đăng nhập đầy đủ
CREATE VIEW user_login_info AS
SELECT 
    a.id as account_id,
    a.username,
    a.email,
    a.password_hash,
    a.is_active,
    a.is_email_verified,
    a.last_login,
    r.role_name,
    r.permissions,
    CASE 
        WHEN r.role_name = 'doc_gia' THEN dg.ho_ten
        WHEN r.role_name IN ('thu_thu', 'quan_ly') THEN tt.ho_ten
        ELSE 'Admin User'
    END as full_name,
    CASE 
        WHEN r.role_name = 'doc_gia' THEN dg.ma_doc_gia
        WHEN r.role_name IN ('thu_thu', 'quan_ly') THEN tt.ma_nhan_vien
        ELSE NULL
    END as user_code,
    CASE 
        WHEN r.role_name = 'doc_gia' THEN dg.so_dien_thoai
        WHEN r.role_name IN ('thu_thu', 'quan_ly') THEN tt.so_dien_thoai
        ELSE NULL
    END as phone
FROM accounts a
JOIN roles r ON a.role_id = r.id
LEFT JOIN doc_gia dg ON a.id = dg.account_id
LEFT JOIN thu_thu tt ON a.id = tt.account_id
WHERE a.is_active = TRUE;

-- View thống kê độc giả
CREATE VIEW doc_gia_stats AS
SELECT 
    dg.*,
    a.username,
    a.email,
    a.last_login,
    DATEDIFF(dg.ngay_het_han, CURDATE()) as days_until_expire,
    CASE 
        WHEN dg.ngay_het_han < CURDATE() THEN 'Hết hạn'
        WHEN DATEDIFF(dg.ngay_het_han, CURDATE()) <= 30 THEN 'Sắp hết hạn'
        ELSE 'Còn hạn'
    END as card_status
FROM doc_gia dg
JOIN accounts a ON dg.account_id = a.id
WHERE a.is_active = TRUE;

-- =============================================
-- Stored Procedures cho đăng nhập
-- =============================================

DELIMITER //

-- Procedure đăng nhập
CREATE PROCEDURE LoginUser(
    IN p_username_or_email VARCHAR(255),
    IN p_password_hash VARCHAR(255)
)
BEGIN
    DECLARE v_account_exists INT DEFAULT 0;
    DECLARE v_account_id VARCHAR(36);
    
    -- Kiểm tra tài khoản tồn tại
    SELECT COUNT(*), id INTO v_account_exists, v_account_id
    FROM accounts 
    WHERE (username = p_username_or_email OR email = p_username_or_email)
    AND password_hash = p_password_hash
    AND is_active = TRUE;
    
    IF v_account_exists > 0 THEN
        -- Cập nhật last_login
        UPDATE accounts 
        SET last_login = NOW(), login_attempts = 0 
        WHERE id = v_account_id;
        
        -- Trả về thông tin user
        SELECT * FROM user_login_info WHERE account_id = v_account_id;
    ELSE
        -- Tăng số lần đăng nhập sai (nếu tài khoản tồn tại)
        UPDATE accounts 
        SET login_attempts = login_attempts + 1,
            locked_until = CASE 
                WHEN login_attempts >= 4 THEN DATE_ADD(NOW(), INTERVAL 15 MINUTE)
                ELSE locked_until
            END
        WHERE (username = p_username_or_email OR email = p_username_or_email);
        
        SELECT NULL as account_id, 'Invalid credentials' as error_message;
    END IF;
END//

-- Procedure lấy thông tin user theo ID
CREATE PROCEDURE GetUserById(IN p_account_id VARCHAR(36))
BEGIN
    SELECT * FROM user_login_info WHERE account_id = p_account_id;
END//

-- Procedure cập nhật thông tin profile
CREATE PROCEDURE UpdateUserProfile(
    IN p_account_id VARCHAR(36),
    IN p_ho_ten VARCHAR(255),
    IN p_so_dien_thoai VARCHAR(20),
    IN p_dia_chi TEXT
)
BEGIN
    DECLARE v_role_name VARCHAR(50);
    
    -- Lấy role của user
    SELECT r.role_name INTO v_role_name
    FROM accounts a 
    JOIN roles r ON a.role_id = r.id 
    WHERE a.id = p_account_id;
    
    -- Cập nhật theo role
    IF v_role_name = 'doc_gia' THEN
        UPDATE doc_gia 
        SET ho_ten = p_ho_ten, so_dien_thoai = p_so_dien_thoai, dia_chi = p_dia_chi
        WHERE account_id = p_account_id;
    ELSEIF v_role_name IN ('thu_thu', 'quan_ly') THEN
        UPDATE thu_thu 
        SET ho_ten = p_ho_ten, so_dien_thoai = p_so_dien_thoai, dia_chi = p_dia_chi
        WHERE account_id = p_account_id;
    END IF;
END//

DELIMITER ;

-- =============================================
-- Triggers
-- =============================================

-- Trigger tự động tạo mã độc giả
DELIMITER //
CREATE TRIGGER auto_generate_ma_doc_gia
BEFORE INSERT ON doc_gia
FOR EACH ROW
BEGIN
    DECLARE next_number INT;
    
    IF NEW.ma_doc_gia IS NULL OR NEW.ma_doc_gia = '' THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(ma_doc_gia, 3) AS UNSIGNED)), 0) + 1 
        INTO next_number 
        FROM doc_gia 
        WHERE ma_doc_gia REGEXP '^DG[0-9]+$';
        
        SET NEW.ma_doc_gia = CONCAT('DG', LPAD(next_number, 3, '0'));
    END IF;
END//

-- Trigger tự động tạo mã nhân viên
CREATE TRIGGER auto_generate_ma_nhan_vien
BEFORE INSERT ON thu_thu
FOR EACH ROW
BEGIN
    DECLARE next_number INT;
    
    IF NEW.ma_nhan_vien IS NULL OR NEW.ma_nhan_vien = '' THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(ma_nhan_vien, 3) AS UNSIGNED)), 0) + 1 
        INTO next_number 
        FROM thu_thu 
        WHERE ma_nhan_vien REGEXP '^TT[0-9]+$';
        
        SET NEW.ma_nhan_vien = CONCAT('TT', LPAD(next_number, 3, '0'));
    END IF;
END//

DELIMITER ;

SELECT 'BookTech Database with separate tables created successfully!' as message;
