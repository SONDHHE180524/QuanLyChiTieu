--1 Tạo database
CREATE DATABASE QuanLyChiTieuDB;
GO
USE QuanLyChiTieuDB;
GO

--2 Bảng Users 
CREATE TABLE Users (
     Id INT PRIMARY KEY IDENTITY(1,1),
	 FullName NVARCHAR(100) NOT NULL,
	 Email VARCHAR(100) UNIQUE NOT NULL,
	 PasswordHash NVARCHAR(MAX) NOT NULL,
	 CreatedAt DATETIME DEFAULT GETDATE()
);

--3 Bảng Danh mục(ăn uống,tiền điện,...)
CREATE TABLE Categories(
     Id INT PRIMARY KEY IDENTITY(1,1),
	 Name NVARCHAR(100) NOT NULL,
	 Type NVARCHAR(10) NOT NULL,--Thu hoặc Chi
	 Icon NVARCHAR(50),
	 IsDefault BIT DEFAULT 0--Danh mục của hệ thống hay người dùng tự tạo
);

--4 Bảng giao dịch
CREATE TABLE Transactions (
     Id INT PRIMARY KEY IDENTITY(1,1),
	 UserId INT NOT NULL,
	 CategoryId INT NOT NULL,
	 Amount DECIMAL(18,2) NOT NULL,
	 TransactionDate DATETIME NOT NULL,
	 Note NVARCHAR(200),
	 CreatedAt DATETIME DEFAULT GETDATE(),

	 CONSTRAINT FK_Transaction_User FOREIGN KEY(UserId) REFERENCES Users(Id),
	 CONSTRAINT FK_Transaction_Category FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);

-- Thêm danh mục mặc định
INSERT INTO Categories (Name, Type, Icon, IsDefault) VALUES 
(N'Lương hàng tháng', 'Thu', 'cash', 1),
(N'Tiền thưởng', 'Thu', 'gift', 1),
(N'Ăn uống', 'Chi', 'restaurant', 1),
(N'Tiền điện/nước', 'Chi', 'flash', 1),
(N'Xăng xe', 'Chi', 'car', 1),
(N'Giải trí', 'Chi', 'game-controller', 1);

-- Thêm một người dùng mẫu (Mật khẩu giả định)
INSERT INTO Users (FullName, Email, PasswordHash) VALUES 
(N'Hoàng Sơn', 'danghoangson2752k4@gmail.com', 'hashed_password_here'),
(N'Phương Anh', 'panh12052004@gmail.com', 'hashed_password_here');


-- Bảng lưu OTP để reset mật khẩu
CREATE TABLE PasswordResetOtps (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    OtpCode VARCHAR(6) NOT NULL,
    ExpiryTime DATETIME NOT NULL,
    IsUsed BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_PasswordResetOtp_User FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Index để tìm nhanh
CREATE INDEX IX_PasswordResetOtps_Email ON PasswordResetOtps(Email);
CREATE INDEX IX_PasswordResetOtps_ExpiryTime ON PasswordResetOtps(ExpiryTime);

ALTER TABLE [dbo].[Users] ADD [AvatarUrl] NVARCHAR(500) NULL;
