-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 25, 2025 at 01:12 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `AdminID` int(10) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `UpdatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`AdminID`, `Name`, `Email`, `Password`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 'System Admin', 'admin@freshflow.com', 'admin123', '2025-06-23 02:30:00', '2025-06-23 02:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `alert`
--

CREATE TABLE `alert` (
  `AlertID` int(11) NOT NULL,
  `AlertDetail` varchar(255) NOT NULL,
  `StaffID` int(11) DEFAULT NULL,
  `ManagerID` int(11) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `automation_log`
--

CREATE TABLE `automation_log` (
  `LogID` int(11) NOT NULL,
  `ProductID` int(10) UNSIGNED NOT NULL,
  `ActionType` varchar(50) NOT NULL,
  `ActionDetails` text DEFAULT NULL,
  `ExecutedAt` datetime DEFAULT current_timestamp(),
  `StaffID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chart`
--

CREATE TABLE `chart` (
  `ChartID` int(10) UNSIGNED NOT NULL,
  `ChartDate` date NOT NULL,
  `ChartDetails` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `compost`
--

CREATE TABLE `compost` (
  `CompostID` int(11) NOT NULL,
  `CompostDate` date NOT NULL,
  `CompostDetails` text DEFAULT NULL,
  `Quantity` decimal(10,2) DEFAULT 0.00,
  `Status` varchar(50) DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `discount`
--

CREATE TABLE `discount` (
  `DiscountID` int(11) NOT NULL,
  `Percent` decimal(5,2) NOT NULL,
  `StartDate` datetime NOT NULL,
  `EndDate` datetime NOT NULL,
  `StaffID` int(11) NOT NULL,
  `ProductID` int(10) UNSIGNED DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donation`
--

CREATE TABLE `donation` (
  `DonationID` int(11) NOT NULL,
  `Amount` double NOT NULL,
  `Date` date NOT NULL,
  `StaffID` int(11) NOT NULL,
  `Organization` varchar(255) DEFAULT NULL,
  `Status` varchar(50) DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `Fb_ID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Content` text NOT NULL,
  `Status` varchar(255) NOT NULL DEFAULT 'pending',
  `AdminID` int(11) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `UpdatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`Fb_ID`, `Name`, `Content`, `Status`, `AdminID`, `CreatedAt`, `UpdatedAt`) VALUES
(9, 'Vinoth Naidu', '2121', 'reviewed', NULL, '2025-06-25 02:00:06', '2025-06-25 02:02:12'),
(10, 'Vinoth Naidu', 'Test', 'pending', NULL, '2025-06-25 05:45:23', '2025-06-25 05:45:23');

-- --------------------------------------------------------

--
-- Table structure for table `manager`
--

CREATE TABLE `manager` (
  `ManagerID` int(10) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `UpdatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Status` varchar(50) DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `manager`
--

INSERT INTO `manager` (`ManagerID`, `Name`, `Email`, `Password`, `CreatedAt`, `UpdatedAt`, `Status`) VALUES
(7, 'Vinoth Naidu', 'joker21@gmail.com', '$2b$10$zGnzxdXIKr.HGkwfZtLc1enp5miDWr6rtevDo3kIN/GeUGG7bGdda', '2025-06-24 17:58:03', '2025-06-24 17:58:03', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `NotificationID` int(11) NOT NULL,
  `RecipientID` int(11) NOT NULL,
  `RecipientType` varchar(20) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Message` text NOT NULL,
  `Type` varchar(50) NOT NULL,
  `IsRead` tinyint(1) DEFAULT 0,
  `RelatedID` int(11) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`NotificationID`, `RecipientID`, `RecipientType`, `Title`, `Message`, `Type`, `IsRead`, `RelatedID`, `CreatedAt`) VALUES
(1, 1, 'Admin', 'New Feedback', 'New feedback from Manager1', 'feedback', 1, 1, '2025-06-23 15:40:38'),
(2, 2, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 0, 5, '2025-06-23 15:41:26'),
(3, 1, 'Manager', 'New Donation Request', 'Staff1 requested donation for Organic Apples', 'donation_request', 0, 10, '2025-06-23 16:05:22'),
(4, 1, 'Manager', 'Auto Discount Applied', 'Whole Wheat Bread automatically discounted by 50%', 'auto_discount', 0, 2, '2025-06-23 16:10:15'),
(5, 1, 'Manager', 'Urgent Donation Request', 'Fresh Milk expires in 1 day and needs urgent donation approval', 'auto_donation_request', 0, 4, '2025-06-23 16:12:30'),
(6, 1, 'Manager', 'Compost Request', 'Banana Muffin has expired and needs compost approval', 'auto_compost_request', 0, 3, '2025-06-23 16:15:00'),
(7, 1, 'Admin', 'New Feedback', 'New feedback from Ling Yik Fong', 'feedback', 1, 2, '2025-06-23 16:15:22'),
(8, 3, 'Staff', 'Request Approved', 'Your Compost request has been approved', 'request_update', 0, 7, '2025-06-23 16:18:00'),
(9, 1, 'Manager', 'New Donation Request', 'Ling Yue Yi requested donation for Soy Milk', 'donation_request', 0, 9, '2025-06-23 16:25:00'),
(10, 1, 'Admin', 'New Feedback', 'New feedback from Staff1', 'feedback', 1, 4, '2025-06-23 16:25:30'),
(11, 3, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 0, 11, '2025-06-23 17:57:17'),
(12, 1, 'Manager', 'Urgent Donation Request', 'Chicken expires in 1 day and needs urgent donation approval', 'donation_request', 0, 13, '2025-06-23 19:00:00'),
(13, 9, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 0, 13, '2025-06-23 20:53:50'),
(14, 3, 'Manager', 'Urgent Donation Request', 'Chicken expires tomorrow and needs urgent donation approval', 'auto_donation_request', 0, 21, '2025-06-23 23:57:34'),
(15, 10, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 21, '2025-06-23 23:58:21'),
(16, 3, 'Manager', 'Compost Request', 'Apple has expired and needs compost approval', 'auto_compost_request', 0, 22, '2025-06-24 00:00:00'),
(17, 3, 'Manager', 'Auto Discount Applied', 'Apple automatically discounted by 50% (expires in 3 days)', 'auto_discount', 0, 25, '2025-06-24 00:00:13'),
(18, 3, 'Manager', 'Urgent Donation Request', 'Mutton expires tomorrow and needs urgent donation approval', 'auto_donation_request', 0, 23, '2025-06-24 00:00:33'),
(19, 10, 'Staff', 'Request Approved', 'Your Compost request has been approved', 'request_update', 1, 22, '2025-06-24 00:01:40'),
(20, 10, 'Staff', 'Request Rejected', 'Your Donation request has been rejected', 'request_update', 1, 23, '2025-06-24 00:01:46'),
(21, 3, 'Manager', 'Auto Discount Applied', 'Banana Muffin automatically discounted by 50% (expires in 3 days)', 'auto_discount', 0, 27, '2025-06-24 00:14:55'),
(22, 3, 'Manager', 'Compost Request', 'Chicken has expired and needs compost approval', 'auto_compost_request', 0, 24, '2025-06-24 00:16:13'),
(23, 10, 'Staff', 'Request Approved', 'Your Compost request has been approved', 'request_update', 1, 24, '2025-06-24 00:16:54'),
(24, 4, 'Manager', 'New Donation Request', 'Vinoth Naidu requested donation for Apple', 'donation_request', 0, 25, '2025-06-24 03:39:33'),
(25, 10, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 25, '2025-06-24 03:40:21'),
(26, 4, 'Manager', 'Urgent Donation Request', 'Banana Muffin expires tomorrow and needs urgent donation approval', 'auto_donation_request', 0, 26, '2025-06-24 03:41:55'),
(27, 4, 'Manager', 'New Donation Request', 'Vinoth Naidu requested donation for Apple', 'donation_request', 0, 27, '2025-06-24 03:42:10'),
(28, 4, 'Manager', 'Compost Request', '1111 has expired and needs compost approval', 'auto_compost_request', 0, 28, '2025-06-24 03:42:37'),
(29, 4, 'Manager', 'Urgent Donation Request', 'Apple expires tomorrow and needs urgent donation approval', 'auto_donation_request', 0, 29, '2025-06-24 03:43:06'),
(30, 10, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 29, '2025-06-24 03:43:54'),
(31, 10, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 26, '2025-06-24 03:43:55'),
(32, 10, 'Staff', 'Request Approved', 'Your Compost request has been approved', 'request_update', 1, 28, '2025-06-24 03:43:56'),
(33, 10, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 27, '2025-06-24 03:43:57'),
(34, 1, 'Admin', 'New Feedback', 'New feedback from Joker', 'feedback', 1, 6, '2025-06-24 03:45:15'),
(35, 4, 'Manager', 'Compost Request', 'Chicken has expired and needs compost approval', 'auto_compost_request', 0, 30, '2025-06-24 04:07:36'),
(36, 4, 'Manager', 'Compost Request', 'Chicken has expired and needs compost approval', 'auto_compost_request', 1, 31, '2025-06-24 04:08:37'),
(37, 10, 'Staff', 'Request Rejected', 'Your Compost request has been rejected', 'request_update', 1, 30, '2025-06-24 04:09:13'),
(38, 10, 'Staff', 'Request Rejected', 'Your Compost request has been rejected', 'request_update', 1, 31, '2025-06-24 04:09:14'),
(39, 4, 'Manager', 'Urgent Donation Request', 'Chicken expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 32, '2025-06-24 04:10:00'),
(40, 10, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 32, '2025-06-24 04:10:16'),
(41, 4, 'Manager', 'Auto Discount Applied', 'Apple automatically discounted by 50% (expires in 3 days)', 'auto_discount', 1, 35, '2025-06-24 04:11:02'),
(42, 4, 'Manager', 'New Donation Request', 'Vinoth Naidu requested donation for Apple', 'donation_request', 1, 33, '2025-06-24 04:11:56'),
(43, 4, 'Manager', 'Auto Discount Applied', 'Durian automatically discounted by 50% (expires in 2 days)', 'auto_discount', 1, 36, '2025-06-24 04:24:58'),
(44, 4, 'Manager', 'Urgent Donation Request', 'Durian expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 34, '2025-06-24 04:27:33'),
(45, 10, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 34, '2025-06-24 04:33:26'),
(46, 10, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 33, '2025-06-24 04:33:34'),
(47, 4, 'Manager', 'Urgent Donation Request', 'Apple expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 35, '2025-06-24 04:34:13'),
(48, 10, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 35, '2025-06-24 04:34:24'),
(49, 4, 'Manager', 'Urgent Donation Request', 'Chicken expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 36, '2025-06-24 04:35:44'),
(50, 10, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 36, '2025-06-24 04:35:50'),
(51, 4, 'Manager', 'Auto Discount Applied', 'Apple automatically discounted by 50% (expires in 3 days)', 'auto_discount', 1, 39, '2025-06-24 04:36:46'),
(52, 4, 'Manager', 'New Donation Request', 'Vinoth Naidu requested donation for Apple', 'donation_request', 1, 37, '2025-06-24 04:37:17'),
(53, 10, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 37, '2025-06-24 04:37:25'),
(54, 4, 'Manager', 'New Donation Request', 'Vinoth Naidu requested donation for Apple', 'donation_request', 1, 38, '2025-06-24 04:37:40'),
(55, 10, 'Staff', 'Request Rejected', 'Your Donation request has been rejected', 'request_update', 1, 38, '2025-06-24 04:37:51'),
(56, 4, 'Manager', 'Urgent Donation Request', 'Chicken expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 39, '2025-06-24 16:40:26'),
(57, 10, 'Staff', 'Request Rejected', 'Your Donation request has been rejected', 'request_update', 1, 39, '2025-06-24 16:40:59'),
(58, 4, 'Manager', 'Auto Discount Applied', 'Fried rice automatically discounted by 50% (expires in 2 days)', 'auto_discount', 1, 41, '2025-06-24 16:43:08'),
(59, 4, 'Manager', 'New Donation Request', 'Vinoth Naidu requested donation for Fried rice', 'donation_request', 1, 40, '2025-06-24 16:43:38'),
(60, 10, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 40, '2025-06-24 16:43:47'),
(61, 4, 'Manager', 'New Suggestion', 'New compost suggestion: Chicken Processing', 'new_suggestion', 1, 13, '2025-06-24 17:35:30'),
(62, 5, 'Manager', 'Auto Discount Applied', 'Chicken automatically discounted by 50% (expires in 2 days)', 'auto_discount', 1, 42, '2025-06-24 17:52:05'),
(63, 4, 'Manager', 'New Donation Request', 'Vinoth Naidu requested donation for Chicken', 'donation_request', 0, 41, '2025-06-24 17:52:31'),
(64, 5, 'Manager', 'Auto Discount Applied', 'Chicken automatically discounted by 50% (expires in 2 days)', 'auto_discount', 0, 43, '2025-06-24 17:54:48'),
(65, 7, 'Manager', 'Auto Discount Applied', 'Chicken automatically discounted by 50% (expires in 3 days)', 'auto_discount', 1, 44, '2025-06-24 17:58:52'),
(66, 7, 'Manager', 'New Donation Request', 'Joker requested donation for Chicken', 'donation_request', 1, 42, '2025-06-24 17:59:21'),
(67, 23, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 42, '2025-06-24 17:59:27'),
(68, 7, 'Manager', 'Compost Request', 'Banana Muffin has expired and needs compost approval', 'auto_compost_request', 1, 43, '2025-06-24 21:06:26'),
(69, 23, 'Staff', 'Request Approved', 'Your Compost request has been approved', 'request_update', 1, 43, '2025-06-24 21:07:09'),
(70, 7, 'Manager', 'Compost Request', 'Banana Muffin has expired and needs compost approval', 'auto_compost_request', 1, 44, '2025-06-24 21:08:24'),
(71, 23, 'Staff', 'Request Approved', 'Your Compost request has been approved', 'request_update', 1, 44, '2025-06-24 21:08:41'),
(72, 7, 'Manager', 'Urgent Donation Request', 'Banana Muffin expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 45, '2025-06-24 21:28:07'),
(73, 23, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 45, '2025-06-24 21:28:15'),
(74, 7, 'Manager', 'New Suggestion', 'New donation suggestion: Banana Muffin Processing', 'new_suggestion', 1, 14, '2025-06-24 21:28:30'),
(75, 1, 'Admin', 'New Feedback', 'New feedback from Vinoth Naidu', 'feedback', 1, 7, '2025-06-24 21:28:47'),
(76, 7, 'Manager', 'Auto Discount Applied', 'Chicken automatically discounted by 50% (expires in 2 days)', 'auto_discount', 1, 48, '2025-06-24 21:43:23'),
(77, 7, 'Manager', 'Compost Request', 'Apple has expired and needs compost approval', 'auto_compost_request', 1, 46, '2025-06-24 21:48:47'),
(78, 23, 'Staff', 'Request Approved', 'Your Compost request has been approved', 'request_update', 1, 46, '2025-06-24 21:48:59'),
(79, 7, 'Manager', 'New Suggestion', 'New compost suggestion: Apple Processing', 'new_suggestion', 1, 15, '2025-06-24 21:49:14'),
(80, 7, 'Manager', 'Urgent Donation Request', 'Chicken expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 47, '2025-06-24 22:00:20'),
(81, 23, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 47, '2025-06-24 22:00:40'),
(82, 7, 'Manager', 'Compost Request', 'Chicken has expired and needs compost approval', 'auto_compost_request', 1, 48, '2025-06-24 23:14:08'),
(83, 7, 'Manager', 'Auto Discount Applied', 'Chicken automatically discounted by 50% (expires in 2 days)', 'auto_discount', 1, 51, '2025-06-24 23:26:32'),
(84, 7, 'Manager', 'Urgent Donation Request', 'Chicken expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 49, '2025-06-24 23:39:59'),
(85, 7, 'Manager', 'Compost Request', 'Chicken expires today and needs compost approval', 'auto_compost_request', 1, 50, '2025-06-25 00:00:00'),
(86, 7, 'Manager', 'Urgent Donation Request', 'Chicken expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 51, '2025-06-25 00:28:27'),
(87, 28, 'Staff', 'Request Rejected', 'Your Donation request has been rejected', 'request_update', 1, 51, '2025-06-25 00:31:27'),
(88, 28, 'Staff', 'Request Rejected', 'Your Donation request has been rejected', 'request_update', 1, 49, '2025-06-25 00:31:29'),
(89, 28, 'Staff', 'Request Rejected', 'Your Compost request has been rejected', 'request_update', 1, 50, '2025-06-25 00:31:29'),
(90, 7, 'Manager', 'Auto Discount Applied', 'Chicken automatically discounted by 50% (expires in 2 days)', 'auto_discount', 1, 52, '2025-06-25 00:34:55'),
(91, 7, 'Manager', 'New Donation Request', 'Joker requested donation for Chicken', 'donation_request', 1, 52, '2025-06-25 00:35:04'),
(92, 28, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 52, '2025-06-25 00:35:19'),
(93, 7, 'Manager', 'Compost Request', 'Apple has expired and needs compost approval', 'auto_compost_request', 1, 53, '2025-06-25 00:35:58'),
(94, 28, 'Staff', 'Request Approved', 'Your Compost request has been approved', 'request_update', 1, 53, '2025-06-25 00:36:08'),
(95, 7, 'Manager', 'Compost Request', 'Apple has expired and needs compost approval', 'auto_compost_request', 1, 54, '2025-06-25 00:50:19'),
(96, 28, 'Staff', 'Request Approved', 'Your Compost request has been approved', 'request_update', 1, 54, '2025-06-25 00:50:29'),
(97, 7, 'Manager', 'Urgent Donation Request', 'Apple expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 55, '2025-06-25 00:57:15'),
(98, 28, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 55, '2025-06-25 00:57:24'),
(99, 1, 'Admin', 'New Feedback', 'New feedback from Vinoth Naidu', 'feedback', 1, 8, '2025-06-25 01:00:35'),
(100, 7, 'Manager', 'Urgent Donation Request', 'Apple expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 56, '2025-06-25 01:19:30'),
(101, 28, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 56, '2025-06-25 01:19:38'),
(102, 7, 'Manager', 'Urgent Donation Request', 'Spinach expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 57, '2025-06-25 01:39:38'),
(103, 28, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 57, '2025-06-25 01:39:50'),
(104, 7, 'Manager', 'Urgent Donation Request', 'Chicken expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 58, '2025-06-25 01:55:31'),
(105, 28, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 58, '2025-06-25 01:56:04'),
(106, 1, 'Admin', 'New Feedback', 'New feedback from Vinoth Naidu', 'feedback', 1, 9, '2025-06-25 02:00:07'),
(107, 7, 'Manager', 'Compost Request', 'Chicken has expired and needs compost approval', 'auto_compost_request', 1, 59, '2025-06-25 02:03:00'),
(108, 28, 'Staff', 'Request Approved', 'Your Compost request has been approved', 'request_update', 1, 59, '2025-06-25 02:03:10'),
(109, 7, 'Manager', 'Urgent Donation Request', 'wq expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 60, '2025-06-25 02:40:34'),
(110, 28, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 60, '2025-06-25 02:40:39'),
(111, 7, 'Manager', 'Compost Request', 'Chicken has expired and needs compost approval', 'auto_compost_request', 1, 61, '2025-06-25 02:54:58'),
(112, 7, 'Manager', 'Auto Discount Applied', 'Chicken automatically discounted by 50%', 'auto_discount', 1, 61, '2025-06-25 02:55:41'),
(113, 28, 'Staff', 'Request Approved', 'Your Compost request has been approved', 'request_update', 1, 61, '2025-06-25 03:43:58'),
(114, 7, 'Manager', 'Auto Discount Applied', 'ytytyt automatically discounted by 50%', 'auto_discount', 1, 62, '2025-06-25 04:38:34'),
(115, 7, 'Manager', 'New Donation Request', 'Joker requested donation for ytytyt', 'donation_request', 1, 62, '2025-06-25 04:38:47'),
(116, 28, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 62, '2025-06-25 04:39:03'),
(117, 7, 'Manager', 'Urgent Donation Request', 'Banana Muffin expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 63, '2025-06-25 05:05:52'),
(118, 28, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 63, '2025-06-25 05:06:01'),
(119, 7, 'Manager', 'New Suggestion from Admin', 'Admin created new Compost suggestion: Chicken Processing for Klang Lama', 'new_suggestion', 1, 16, '2025-06-25 05:06:26'),
(120, 7, 'Manager', 'Urgent Donation Request', 'Chicken expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 64, '2025-06-25 05:18:07'),
(121, 28, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 64, '2025-06-25 05:18:15'),
(122, 1, 'Admin', 'New Feedback', 'New feedback from Vinoth Naidu', 'feedback', 0, 10, '2025-06-25 05:45:23'),
(123, 7, 'Manager', 'Auto Discount Applied', 'Chicken automatically discounted by 50%', 'auto_discount', 1, 64, '2025-06-25 05:46:06'),
(124, 7, 'Manager', 'New Donation Request', 'Joker requested donation for Chicken', 'donation_request', 1, 65, '2025-06-25 05:46:51'),
(125, 28, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 65, '2025-06-25 05:47:01'),
(126, 7, 'Manager', 'Compost Request', 'Fish has expired and needs compost approval', 'auto_compost_request', 1, 66, '2025-06-25 05:47:33'),
(127, 28, 'Staff', 'Request Approved', 'Your Compost request has been approved', 'request_update', 1, 66, '2025-06-25 05:47:44'),
(128, 7, 'Manager', 'New Suggestion from Admin', 'Admin created new Compost suggestion: Fish Processing for Klang Lama', 'new_suggestion', 1, 17, '2025-06-25 05:47:54'),
(129, 7, 'Manager', 'Compost Request', 'Fish has expired and needs compost approval', 'auto_compost_request', 1, 67, '2025-06-25 05:52:50'),
(130, 28, 'Staff', 'Request Approved', 'Your Compost request has been approved', 'request_update', 1, 67, '2025-06-25 05:53:11'),
(131, 7, 'Manager', 'Urgent Donation Request', 'Fish expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 68, '2025-06-25 05:53:42'),
(132, 28, 'Staff', 'Request Approved', 'Your Donation request has been approved', 'request_update', 1, 68, '2025-06-25 05:54:05'),
(133, 7, 'Manager', 'Urgent Donation Request', 'Banana expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 69, '2025-06-25 05:55:54'),
(134, 7, 'Manager', 'Auto Discount Applied', 'Banana automatically discounted by 50%', 'auto_discount', 1, 67, '2025-06-25 05:56:04'),
(135, 7, 'Manager', 'New Suggestion from Admin', 'Admin created new Donation suggestion: Fish Processing for Klang Lama', 'new_suggestion', 1, 18, '2025-06-25 05:57:46'),
(136, 1, 'Admin', 'New Feedback', 'New feedback from Vinoth Naidu', 'feedback', 0, 11, '2025-06-25 05:58:18'),
(137, 7, 'Manager', 'Auto Discount Applied', 'Fish automatically discounted by 50%', 'auto_discount', 1, 66, '2025-06-25 06:11:56'),
(138, 7, 'Manager', 'Auto Discount Applied', 'Fish automatically discounted by 50%', 'auto_discount', 1, 65, '2025-06-25 06:12:06'),
(139, 7, 'Manager', 'Compost Request', 'Chicken has expired and needs compost approval', 'auto_compost_request', 1, 70, '2025-06-25 06:15:44'),
(140, 7, 'Manager', 'Urgent Donation Request', 'Fish expires tomorrow and needs urgent donation approval', 'auto_donation_request', 1, 71, '2025-06-25 06:15:54');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `ProductID` int(10) UNSIGNED NOT NULL,
  `ProductName` varchar(255) NOT NULL,
  `ProductCategory` varchar(255) NOT NULL,
  `ProductQuantity` int(10) NOT NULL,
  `Price` decimal(10,2) NOT NULL,
  `ShelfLife` int(11) NOT NULL,
  `ProdDate` datetime NOT NULL,
  `EndDate` datetime NOT NULL,
  `Status` varchar(255) NOT NULL,
  `StaffID` int(11) NOT NULL,
  `OriginalPrice` decimal(10,2) NOT NULL DEFAULT 0.00,
  `DiscountApplied` tinyint(1) DEFAULT 0,
  `DiscountPercentage` decimal(5,2) DEFAULT 0.00,
  `AutoDonationRequested` tinyint(1) DEFAULT 0,
  `AutoCompostRequested` tinyint(1) DEFAULT 0,
  `UpdatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `AdminRead` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`ProductID`, `ProductName`, `ProductCategory`, `ProductQuantity`, `Price`, `ShelfLife`, `ProdDate`, `EndDate`, `Status`, `StaffID`, `OriginalPrice`, `DiscountApplied`, `DiscountPercentage`, `AutoDonationRequested`, `AutoCompostRequested`, `UpdatedAt`, `AdminRead`) VALUES
(64, 'Chicken', 'Meat', 21, 21.00, 0, '2025-06-24 00:00:00', '2025-06-24 00:00:00', 'Expired', 28, 21.00, 0, 0.00, 0, 1, '2025-06-25 06:15:44', 1),
(65, 'Fish', 'Meat', 21, 21.00, 0, '2025-06-24 00:00:00', '2025-06-26 00:00:00', 'Good', 28, 21.00, 0, 0.00, 1, 0, '2025-06-25 06:55:31', 1),
(66, 'Fish', 'Meat', 21, 50.00, 0, '2025-06-24 00:00:00', '2025-06-27 00:00:00', 'Good', 28, 100.00, 1, 50.00, 0, 0, '2025-06-25 06:11:56', 0),
(67, 'Banana', 'Fruit', 21, 10.50, 0, '2025-06-23 00:00:00', '2025-06-27 00:00:00', 'Good', 28, 21.00, 1, 50.00, 0, 0, '2025-06-25 05:56:04', 0);

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `ReportID` int(11) NOT NULL,
  `Reportcol` varchar(45) DEFAULT NULL,
  `Title` varchar(255) DEFAULT NULL,
  `StartDate` datetime NOT NULL,
  `EndDate` datetime NOT NULL,
  `Content` text DEFAULT NULL,
  `Chart_ChartID` int(10) UNSIGNED NOT NULL,
  `GeneratedBy` varchar(255) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `request`
--

CREATE TABLE `request` (
  `RequestID` int(11) NOT NULL,
  `Type` varchar(255) NOT NULL,
  `Content` varchar(255) NOT NULL,
  `Quantity` int(10) NOT NULL,
  `RequestDate` date NOT NULL,
  `ApproveDate` date DEFAULT NULL,
  `Status` varchar(100) NOT NULL DEFAULT 'pending',
  `StaffID` int(11) NOT NULL,
  `SuggestionID` int(10) UNSIGNED DEFAULT NULL,
  `ManagerID` int(11) NOT NULL,
  `CompostID` int(11) DEFAULT NULL,
  `DonationID` int(11) DEFAULT NULL,
  `ProductID` int(10) UNSIGNED DEFAULT NULL,
  `IsAutoGenerated` tinyint(1) DEFAULT 0,
  `Priority` varchar(50) DEFAULT 'normal',
  `Notes` text DEFAULT NULL,
  `UpdatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `IsRead` tinyint(1) DEFAULT 0,
  `AdminRead` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `request`
--

INSERT INTO `request` (`RequestID`, `Type`, `Content`, `Quantity`, `RequestDate`, `ApproveDate`, `Status`, `StaffID`, `SuggestionID`, `ManagerID`, `CompostID`, `DonationID`, `ProductID`, `IsAutoGenerated`, `Priority`, `Notes`, `UpdatedAt`, `IsRead`, `AdminRead`) VALUES
(56, 'Donation', 'Apple • 21 units (Auto-generated - expires tomorrow)', 21, '2025-06-25', '2025-06-25', 'approved', 28, NULL, 7, NULL, NULL, NULL, 1, 'urgent', 'Auto-generated donation request - expires tomorrow', '2025-06-25 01:19:37', 0, 0),
(57, 'Donation', 'Spinach • 21 units (Auto-generated - expires tomorrow)', 21, '2025-06-25', '2025-06-25', 'approved', 28, NULL, 7, NULL, NULL, NULL, 1, 'urgent', 'Auto-generated donation request - expires tomorrow', '2025-06-25 01:39:50', 0, 0),
(58, 'Donation', 'Chicken • 21 units (Auto-generated - expires tomorrow)', 21, '2025-06-25', '2025-06-25', 'approved', 28, NULL, 7, NULL, NULL, NULL, 1, 'urgent', 'Auto-generated donation request - expires tomorrow', '2025-06-25 01:56:04', 0, 0),
(59, 'Compost', 'Chicken • 21 units (Auto-generated - expired)', 21, '2025-06-25', '2025-06-25', 'approved', 28, NULL, 7, NULL, NULL, NULL, 1, 'normal', 'Auto-generated compost request - expired', '2025-06-25 02:03:10', 0, 0),
(60, 'Donation', 'wq • 21 units (Auto-generated - expires tomorrow)', 21, '2025-06-25', '2025-06-25', 'approved', 28, NULL, 7, NULL, NULL, NULL, 1, 'urgent', 'Auto-generated donation request - expires tomorrow', '2025-06-25 02:40:39', 0, 0),
(61, 'Compost', 'Chicken • -12 units (Auto-generated - expired)', -12, '2025-06-25', '2025-06-25', 'approved', 28, NULL, 7, NULL, NULL, NULL, 1, 'normal', 'Auto-generated compost request - expired', '2025-06-25 03:43:58', 0, 0),
(62, 'Donation', 'ytytyt • 21 (to MMU)', 21, '2025-06-25', '2025-06-25', 'approved', 28, NULL, 7, NULL, NULL, NULL, 0, 'normal', 'Goat', '2025-06-25 04:39:03', 0, 0),
(63, 'Donation', 'Banana Muffin • 21 units (Auto-generated - expires tomorrow)', 21, '2025-06-25', '2025-06-25', 'approved', 28, NULL, 7, NULL, NULL, NULL, 1, 'urgent', 'Auto-generated donation request - expires tomorrow', '2025-06-25 05:06:01', 0, 0),
(64, 'Donation', 'Chicken • 21 units (Auto-generated - expires tomorrow)', 21, '2025-06-25', '2025-06-25', 'approved', 28, NULL, 7, NULL, NULL, NULL, 1, 'urgent', 'Auto-generated donation request - expires tomorrow', '2025-06-25 05:45:40', 0, 1),
(65, 'Donation', 'Chicken • 21 (to MMU)', 21, '2025-06-25', '2025-06-25', 'approved', 28, NULL, 7, NULL, NULL, 64, 0, 'normal', 'Goat', '2025-06-25 05:47:01', 0, 0),
(66, 'Compost', 'Fish • 21 units (Auto-generated - expired)', 21, '2025-06-25', '2025-06-25', 'approved', 28, NULL, 7, NULL, NULL, 65, 1, 'normal', 'Auto-generated compost request - expired', '2025-06-25 05:47:44', 0, 0),
(67, 'Compost', 'Fish • 21 units (Auto-generated - expired)', 21, '2025-06-25', '2025-06-25', 'approved', 28, NULL, 7, NULL, NULL, 66, 1, 'normal', 'Auto-generated compost request - expired', '2025-06-25 05:53:11', 0, 0),
(68, 'Donation', 'Fish • 21 units (Auto-generated - expires tomorrow)', 21, '2025-06-25', '2025-06-25', 'approved', 28, NULL, 7, NULL, NULL, 65, 1, 'urgent', 'Auto-generated donation request - expires tomorrow', '2025-06-25 05:54:05', 0, 0),
(69, 'Donation', 'Banana • 21 units (Auto-generated - expires tomorrow)', 21, '2025-06-25', NULL, 'pending', 28, NULL, 7, NULL, NULL, 67, 1, 'urgent', 'Auto-generated donation request - expires tomorrow', '2025-06-25 05:55:54', 0, 0),
(70, 'Compost', 'Chicken • 21 units (Auto-generated - expired)', 21, '2025-06-25', NULL, 'pending', 28, NULL, 7, NULL, NULL, 64, 1, 'normal', 'Auto-generated compost request - expired', '2025-06-25 06:15:44', 0, 0),
(71, 'Donation', 'Fish • 21 units (Auto-generated - expires tomorrow)', 21, '2025-06-25', NULL, 'pending', 28, NULL, 7, NULL, NULL, 65, 1, 'urgent', 'Auto-generated donation request - expires tomorrow', '2025-06-25 06:55:32', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `StaffID` int(11) NOT NULL,
  `Name` varchar(45) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Role` varchar(255) DEFAULT 'Staff',
  `Status` varchar(255) NOT NULL DEFAULT 'active',
  `AdminID` int(11) DEFAULT NULL,
  `ManagerID` int(11) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `LastLogin` datetime DEFAULT NULL,
  `UpdatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`StaffID`, `Name`, `Email`, `Password`, `Role`, `Status`, `AdminID`, `ManagerID`, `CreatedAt`, `LastLogin`, `UpdatedAt`) VALUES
(28, 'Joker', 'joker211@gmail.com', '$2b$10$Ui8dIdQWP6elbhVSq49Ux.VlNXGfvirJslAnXi1Wzf9/KkiEZd4eu', 'Staff', 'active', NULL, 7, '2025-06-24 23:26:03', '2025-06-25 05:07:36', '2025-06-25 05:27:52'),
(37, 'VV', 'vvinsaothds2102@gmail.com', '$2b$10$0spPb56XWrrjJGE6DkvAY.JeYAxwSZIH7EufFCTFnMjm6/5YA6NWC', 'Manager', 'active', NULL, 7, '2025-06-25 05:59:12', NULL, '2025-06-25 06:01:07');

-- --------------------------------------------------------

--
-- Table structure for table `store`
--

CREATE TABLE `store` (
  `StoreID` int(10) NOT NULL,
  `StoreName` varchar(255) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `ContactEmail` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `store`
--

INSERT INTO `store` (`StoreID`, `StoreName`, `ProductID`, `Location`, `ContactEmail`) VALUES
(1, 'FreshFlow Main Store', 1, 'Kuala Lumpur Central', 'main@freshflow.com'),
(2, 'FreshFlow Cyberjaya Branch', 6, 'Cyberjaya Technology Park', 'cyberjaya@freshflow.com');

-- --------------------------------------------------------

--
-- Table structure for table `suggestion`
--

CREATE TABLE `suggestion` (
  `SuggestionID` int(10) UNSIGNED NOT NULL,
  `SuggestionTitle` varchar(225) NOT NULL,
  `Type` varchar(255) NOT NULL,
  `Organization` varchar(255) DEFAULT NULL,
  `Address` varchar(255) NOT NULL,
  `AdminID` int(10) NOT NULL,
  `ManagerID` int(10) NOT NULL,
  `RequestID` int(11) DEFAULT NULL,
  `Status` varchar(50) DEFAULT 'active',
  `CreatedAt` datetime DEFAULT current_timestamp(),
  `UpdatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suggestion`
--

INSERT INTO `suggestion` (`SuggestionID`, `SuggestionTitle`, `Type`, `Organization`, `Address`, `AdminID`, `ManagerID`, `RequestID`, `Status`, `CreatedAt`, `UpdatedAt`, `Notes`) VALUES
(1, 'Local Food Bank - Main', 'Donation', 'KL Food Bank Association', 'Jalan Klang Lama, KL', 1, 1, NULL, 'read', '2025-06-23 07:14:15', '2025-06-24 16:29:09', NULL),
(2, 'Community Center Pantry', 'Donation', 'Taman Desa Community Center', 'Taman Desa, KL', 1, 1, NULL, 'read', '2025-06-23 07:14:15', '2025-06-24 16:29:08', NULL),
(3, 'Homeless Shelter', 'Donation', 'KL Homeless Shelter', 'Chow Kit, KL', 1, 1, NULL, 'read', '2025-06-23 07:14:15', '2025-06-24 16:29:09', NULL),
(4, 'University Food Drive', 'Donation', 'MMU Student Council', 'Cyberjaya, Selangor', 1, 1, NULL, 'read', '2025-06-23 07:14:15', '2025-06-24 16:29:10', NULL),
(5, 'Senior Citizens Center', 'Donation', 'KL Golden Age Center', 'Bangsar, KL', 1, 1, NULL, 'read', '2025-06-23 16:40:00', '2025-06-24 16:29:09', NULL),
(6, 'School Nutrition Program', 'Donation', 'SK Taman Melawati', 'Taman Melawati, KL', 1, 1, NULL, 'read', '2025-06-23 16:42:00', '2025-06-24 16:29:09', NULL),
(7, 'Organic Waste Processing', 'Compost', 'Green Earth Composting', 'Shah Alam Industrial Area', 1, 1, NULL, 'read', '2025-06-23 07:14:15', '2025-06-24 16:29:12', NULL),
(8, 'City Council Compost Program', 'Compost', 'DBKL Waste Management', 'Setapak, KL', 1, 1, NULL, 'read', '2025-06-23 07:14:15', '2025-06-24 16:29:10', NULL),
(9, 'University Research Farm', 'Compost', 'UPM Agricultural Research', 'Serdang, Selangor', 1, 1, NULL, 'read', '2025-06-23 07:14:15', '2025-06-24 16:29:12', NULL),
(10, 'Community Garden Initiative', 'Compost', 'Petaling Jaya Community Garden', 'Petaling Jaya, Selangor', 1, 1, NULL, 'read', '2025-06-23 07:14:15', '2025-06-24 16:29:11', NULL),
(11, 'Eco-Composting Facility', 'Compost', 'Subang EcoCenter', 'Subang Jaya, Selangor', 1, 2, NULL, 'read', '2025-06-23 16:45:00', '2025-06-24 16:29:11', NULL),
(12, 'Health Center Food Program', 'Donation', 'Community Health Clinic', 'Wangsa Maju, KL', 1, 2, NULL, 'read', '2025-06-23 16:47:00', '2025-06-24 16:29:08', NULL),
(13, 'Chicken Processing', 'Compost', 'Klang Lama', 'Klang Lama', 1, 4, NULL, 'read', '2025-06-24 17:35:30', '2025-06-24 17:36:12', 'Product: Chicken (21 units, expires 2025-06-25)'),
(14, 'Banana Muffin Processing', 'Donation', 'Klang Lama', 'Klang Lama', 1, 7, NULL, 'read', '2025-06-24 21:28:30', '2025-06-24 21:50:53', 'Product: Banana Muffin (21 units, expires 2025-06-25)'),
(15, 'Apple Processing', 'Compost', 'Klang Lama', 'Klang Lama', 1, 7, NULL, 'read', '2025-06-24 21:49:14', '2025-06-24 21:50:54', 'Product: Apple (2121 units, expires 2025-06-22)'),
(16, 'Chicken Processing', 'Compost', 'Klang Lama', 'Klang Lama', 1, 7, NULL, 'active', '2025-06-25 05:06:25', '2025-06-25 05:06:25', 'Product: Chicken (21 kg, expires 2025-06-23)'),
(17, 'Fish Processing', 'Compost', 'Klang Lama', 'Klang Lama', 1, 7, NULL, 'read', '2025-06-25 05:47:54', '2025-06-25 05:57:55', 'Product: Fish (21 kg, expires 2025-06-23)'),
(18, 'Fish Processing', 'Donation', 'Klang Lama', 'Klang Lama', 1, 7, NULL, 'active', '2025-06-25 05:57:46', '2025-06-25 05:57:46', 'Product: Fish (21 kg, expires 2025-06-26)');

-- --------------------------------------------------------

--
-- Table structure for table `waste`
--

CREATE TABLE `waste` (
  `WasteID` int(11) NOT NULL,
  `Type` varchar(255) NOT NULL,
  `Quantity` double(10,2) NOT NULL,
  `Wastecol` varchar(45) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `ProductID` int(10) UNSIGNED DEFAULT NULL,
  `DisposalMethod` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `waste`
--

INSERT INTO `waste` (`WasteID`, `Type`, `Quantity`, `Wastecol`, `Date`, `ProductID`, `DisposalMethod`) VALUES
(25, 'Donation', 21.00, 'Meat', '2025-06-25', 64, 'Food Bank'),
(26, 'Compost', 21.00, 'Meat', '2025-06-25', 65, 'Organic Composting'),
(27, 'Compost', 21.00, 'Meat', '2025-06-25', 66, 'Organic Composting'),
(28, 'Donation', 21.00, 'Meat', '2025-06-25', 65, 'Food Bank');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`AdminID`),
  ADD UNIQUE KEY `Email_UNIQUE` (`Email`),
  ADD KEY `idx_admin_email` (`Email`);

--
-- Indexes for table `alert`
--
ALTER TABLE `alert`
  ADD PRIMARY KEY (`AlertID`),
  ADD UNIQUE KEY `AlertID_UNIQUE` (`AlertID`),
  ADD KEY `fk_Alert_Staff` (`StaffID`),
  ADD KEY `fk_Alert_Manager` (`ManagerID`);

--
-- Indexes for table `automation_log`
--
ALTER TABLE `automation_log`
  ADD PRIMARY KEY (`LogID`),
  ADD KEY `idx_automation_product` (`ProductID`),
  ADD KEY `idx_automation_staff` (`StaffID`),
  ADD KEY `idx_automation_type` (`ActionType`),
  ADD KEY `idx_automation_date` (`ExecutedAt`);

--
-- Indexes for table `chart`
--
ALTER TABLE `chart`
  ADD PRIMARY KEY (`ChartID`);

--
-- Indexes for table `compost`
--
ALTER TABLE `compost`
  ADD PRIMARY KEY (`CompostID`),
  ADD UNIQUE KEY `CompostID_UNIQUE` (`CompostID`),
  ADD KEY `idx_compost_date` (`CompostDate`),
  ADD KEY `idx_compost_status` (`Status`);

--
-- Indexes for table `discount`
--
ALTER TABLE `discount`
  ADD PRIMARY KEY (`DiscountID`),
  ADD UNIQUE KEY `DiscountID_UNIQUE` (`DiscountID`),
  ADD KEY `fk_Discount_Staff` (`StaffID`),
  ADD KEY `fk_Discount_Product` (`ProductID`),
  ADD KEY `idx_discount_dates` (`StartDate`,`EndDate`);

--
-- Indexes for table `donation`
--
ALTER TABLE `donation`
  ADD PRIMARY KEY (`DonationID`),
  ADD KEY `fk_Donation_Staff` (`StaffID`),
  ADD KEY `idx_donation_date` (`Date`),
  ADD KEY `idx_donation_status` (`Status`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`Fb_ID`),
  ADD KEY `fk_Feedback_Admin` (`AdminID`),
  ADD KEY `idx_feedback_status` (`Status`),
  ADD KEY `idx_feedback_created` (`CreatedAt`),
  ADD KEY `idx_feedback_name` (`Name`);

--
-- Indexes for table `manager`
--
ALTER TABLE `manager`
  ADD PRIMARY KEY (`ManagerID`),
  ADD UNIQUE KEY `Email_UNIQUE` (`Email`),
  ADD KEY `idx_manager_email` (`Email`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`NotificationID`),
  ADD KEY `idx_recipient` (`RecipientID`,`RecipientType`),
  ADD KEY `idx_created` (`CreatedAt`),
  ADD KEY `idx_read_status` (`IsRead`),
  ADD KEY `idx_notification_type` (`Type`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`ProductID`),
  ADD UNIQUE KEY `ProductID_UNIQUE` (`ProductID`),
  ADD KEY `fk_Product_Staff` (`StaffID`),
  ADD KEY `idx_product_expiry` (`EndDate`,`Status`),
  ADD KEY `idx_product_discount` (`DiscountApplied`,`EndDate`),
  ADD KEY `idx_product_automation` (`AutoDonationRequested`,`AutoCompostRequested`),
  ADD KEY `idx_product_status` (`Status`),
  ADD KEY `idx_product_category` (`ProductCategory`),
  ADD KEY `idx_product_updated` (`UpdatedAt`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`ReportID`,`Chart_ChartID`),
  ADD UNIQUE KEY `ReportID_UNIQUE` (`ReportID`),
  ADD KEY `fk_Report_Chart1_idx` (`Chart_ChartID`),
  ADD KEY `idx_report_dates` (`StartDate`,`EndDate`);

--
-- Indexes for table `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`RequestID`),
  ADD KEY `idx_compost_id` (`CompostID`),
  ADD KEY `idx_donation_id` (`DonationID`),
  ADD KEY `fk_request_staff` (`StaffID`),
  ADD KEY `fk_request_manager` (`ManagerID`),
  ADD KEY `fk_request_suggestion` (`SuggestionID`),
  ADD KEY `fk_request_product` (`ProductID`),
  ADD KEY `idx_request_status` (`Status`,`Type`),
  ADD KEY `idx_request_auto` (`IsAutoGenerated`,`Status`),
  ADD KEY `idx_request_priority` (`Priority`),
  ADD KEY `idx_request_date` (`RequestDate`),
  ADD KEY `idx_request_approve_date` (`ApproveDate`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`StaffID`),
  ADD UNIQUE KEY `Email_UNIQUE` (`Email`),
  ADD KEY `fk_Staff_Admin` (`AdminID`),
  ADD KEY `fk_Staff_Manager` (`ManagerID`),
  ADD KEY `idx_staff_email` (`Email`),
  ADD KEY `idx_staff_status` (`Status`),
  ADD KEY `idx_staff_role` (`Role`),
  ADD KEY `idx_staff_last_login` (`LastLogin`);

--
-- Indexes for table `store`
--
ALTER TABLE `store`
  ADD PRIMARY KEY (`StoreID`),
  ADD KEY `idx_store_product` (`ProductID`);

--
-- Indexes for table `suggestion`
--
ALTER TABLE `suggestion`
  ADD PRIMARY KEY (`SuggestionID`),
  ADD KEY `idx_suggestion_type` (`Type`),
  ADD KEY `idx_suggestion_status` (`Status`),
  ADD KEY `idx_suggestion_admin` (`AdminID`),
  ADD KEY `idx_suggestion_manager` (`ManagerID`);

--
-- Indexes for table `waste`
--
ALTER TABLE `waste`
  ADD PRIMARY KEY (`WasteID`),
  ADD KEY `idx_waste_type` (`Type`),
  ADD KEY `idx_waste_date` (`Date`),
  ADD KEY `fk_waste_product` (`ProductID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `AdminID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `alert`
--
ALTER TABLE `alert`
  MODIFY `AlertID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `automation_log`
--
ALTER TABLE `automation_log`
  MODIFY `LogID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `chart`
--
ALTER TABLE `chart`
  MODIFY `ChartID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `compost`
--
ALTER TABLE `compost`
  MODIFY `CompostID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `discount`
--
ALTER TABLE `discount`
  MODIFY `DiscountID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `donation`
--
ALTER TABLE `donation`
  MODIFY `DonationID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `Fb_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `manager`
--
ALTER TABLE `manager`
  MODIFY `ManagerID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `NotificationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `ProductID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `ReportID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `request`
--
ALTER TABLE `request`
  MODIFY `RequestID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `StaffID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `store`
--
ALTER TABLE `store`
  MODIFY `StoreID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `suggestion`
--
ALTER TABLE `suggestion`
  MODIFY `SuggestionID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `waste`
--
ALTER TABLE `waste`
  MODIFY `WasteID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `automation_log`
--
ALTER TABLE `automation_log`
  ADD CONSTRAINT `fk_automation_product` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_automation_staff` FOREIGN KEY (`StaffID`) REFERENCES `staff` (`StaffID`) ON DELETE SET NULL;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `fk_Product_Staff` FOREIGN KEY (`StaffID`) REFERENCES `staff` (`StaffID`) ON DELETE CASCADE;

--
-- Constraints for table `request`
--
ALTER TABLE `request`
  ADD CONSTRAINT `fk_request_manager` FOREIGN KEY (`ManagerID`) REFERENCES `manager` (`ManagerID`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_request_product` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_request_staff` FOREIGN KEY (`StaffID`) REFERENCES `staff` (`StaffID`) ON DELETE CASCADE;

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `fk_Staff_Manager` FOREIGN KEY (`ManagerID`) REFERENCES `manager` (`ManagerID`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
