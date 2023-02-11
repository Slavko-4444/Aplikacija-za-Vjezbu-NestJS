/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP DATABASE IF EXISTS `aplikacija`;
CREATE DATABASE IF NOT EXISTS `aplikacija` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `aplikacija`;

DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  `password_hash` varchar(128) NOT NULL DEFAULT '0',
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `administrator`;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`) VALUES
	(1, 'Slavko Sosic', '3A8126B96E4F91C37BBE44611FAF79550066331EDD3DD04A3A8FFE848D17E566C20AE8B79D3B05420DA021E7097AF8302FC41CB93E9488BD1A528440BC4513D2'),
	(2, 'Milos Sosic', 'kasdlfjasdofj918j'),
	(3, 'Milicasosic', '5C4A7B964370E387CC9B6B46EA7364AD7AA2B96A41EFB9755A16E2B513BB9C068DFAF459C4B7F51C64C3E7274C551AE143D95A2C1FAD833B2682EC0962352DC6'),
	(5, 'Senkasosic', '86224413BDA193E4F83B0FBA094FBD2AE5170BDE14F41192BC9A33FC952168743E67F7C9CBED82EFC7E1ACD16804EF46F328A922BAE2C59D3B06787675D56312'),
	(8, 'Miomirsosic', '9E35325373166CCFBF80C6B53FAEFD183D6BB76789A2CB54C0AD7C1B515B588261E4D309903A889A425E416DBBCA28126B2CA91AC375DDBFAA4BF3D9FEE5496E'),
	(10, 'Janjabatinic', 'F7EF3F5C7D2CBD20D6D64366BBBEE14B74212E4CE7512F2117962A3C738C8AB4CF60A81C8F5533636C6AD16C52DA14654B8838EDCF4D3655E3E98FE2438068A0'),
	(13, 'Savososic', 'DB3188B2BA2C2069FFEF103EA398E569227ABF687D33176064C46C8F1DDE3B8A8F08732F38B2AF79A449C982AB127C6D50B43BB1FE081F0B85543D751BDC8969'),
	(14, 'admin', 'C7AD44CBAD762A5DA0A452F9E854FDC1E0E7A52A38015F23F3EAB1D80B931DD472634DFAC71CD34EBC35D16AB7FB8A90C81F975113D6C7538DC69DD8DE9077EC');

DROP TABLE IF EXISTS `article`;
CREATE TABLE IF NOT EXISTS `article` (
  `article_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '0',
  `category_id` int unsigned NOT NULL DEFAULT '0',
  `excerpt` varchar(255) NOT NULL DEFAULT '0',
  `description` text NOT NULL,
  `status` enum('available','visible','hidden') NOT NULL DEFAULT 'available',
  `is_promoted` tinyint NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`article_id`),
  KEY `fk_article_category_id` (`category_id`),
  CONSTRAINT `fk_article_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `article`;
INSERT INTO `article` (`article_id`, `name`, `category_id`, `excerpt`, `description`, `status`, `is_promoted`, `created_at`) VALUES
	(1, 'ACME HDD 512GB', 5, 'Kratak opis', 'Detaljan opis', 'available', 0, '2015-11-15 11:41:10'),
	(2, 'ACME HD11 1TB', 5, 'Neki kraci tekst...', 'Neki malo duzi tekst o proizvodu..', 'available', 0, '2022-11-16 18:59:27'),
	(3, 'ACME HD11 2TB', 5, 'Kosovo je srce Srbije', 'Idem preko zemlje Srbije...', 'visible', 0, '2022-11-16 18:59:35'),
	(4, 'ACME HD11 1TB', 5, 'Neki kratak tekst...', 'Neki siri i detaljniji opis...', 'available', 0, '2022-11-16 19:03:09'),
	(5, 'Seagate ST6000DM003', 5, 'Seagate 6TB HDD', 'Neki siri i detaljniji opis...', 'available', 0, '2022-11-23 17:00:57'),
	(6, 'Seagate ST6000 1TB', 5, 'Seagate 1TB HDD', 'Neki siri i detaljniji opis...', 'available', 0, '2022-11-23 17:40:04');

DROP TABLE IF EXISTS `article_feature`;
CREATE TABLE IF NOT EXISTS `article_feature` (
  `article_feature_id` int unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int unsigned NOT NULL DEFAULT '0',
  `feature_id` int unsigned NOT NULL DEFAULT '0',
  `value` varchar(255) NOT NULL DEFAULT '0',
  PRIMARY KEY (`article_feature_id`),
  UNIQUE KEY `uq_article_feature_article_id_featuer_id` (`article_id`,`feature_id`) USING BTREE,
  KEY `fk_article_feature_feature_id` (`feature_id`) USING BTREE,
  CONSTRAINT `fk_article_feature_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_article_feature_feature_id` FOREIGN KEY (`feature_id`) REFERENCES `feature` (`feature_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `article_feature`;
INSERT INTO `article_feature` (`article_feature_id`, `article_id`, `feature_id`, `value`) VALUES
	(1, 1, 1, '512GB'),
	(2, 1, 2, 'SATA 3'),
	(3, 1, 3, 'SSD'),
	(4, 2, 1, '1TB'),
	(5, 2, 3, 'SSD'),
	(8, 4, 1, '1TB'),
	(9, 4, 3, 'SSD'),
	(10, 5, 1, '6TB'),
	(11, 5, 2, 'SATA'),
	(12, 5, 3, 'HardDisk'),
	(13, 6, 1, '1TB'),
	(14, 6, 2, 'SATA'),
	(15, 6, 3, 'HardDisk'),
	(16, 3, 1, '1024GB'),
	(17, 3, 2, 'SATA 3.0');

DROP TABLE IF EXISTS `article_price`;
CREATE TABLE IF NOT EXISTS `article_price` (
  `article_price_id` int unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int unsigned NOT NULL DEFAULT '0',
  `price` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`article_price_id`),
  KEY `fk_article_price_article_id` (`article_id`),
  CONSTRAINT `fk_article_price_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `article_price`;
INSERT INTO `article_price` (`article_price_id`, `article_id`, `price`, `created_at`) VALUES
	(1, 2, 53.12, '2022-11-16 18:59:27'),
	(2, 3, 53.12, '2022-11-16 18:59:35'),
	(3, 4, 56.23, '2022-11-16 19:03:09'),
	(4, 5, 179.23, '2022-11-23 17:00:57'),
	(5, 6, 89.23, '2022-11-23 17:40:04'),
	(6, 3, 65.45, '2023-02-06 18:41:42');

DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `cart_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_id`) USING BTREE,
  KEY `fk_cart_user_id` (`user_id`),
  CONSTRAINT `fk_cart_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `cart`;

DROP TABLE IF EXISTS `cart_article`;
CREATE TABLE IF NOT EXISTS `cart_article` (
  `cart_article_id` int unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` int unsigned NOT NULL DEFAULT '0',
  `article_id` int unsigned NOT NULL DEFAULT '0',
  `quantity` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`cart_article_id`),
  UNIQUE KEY `uq_cart_article_cart_id_article_id` (`cart_id`,`article_id`),
  KEY `fk_cart_article_article_id` (`article_id`),
  CONSTRAINT `fk_cart_article_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`),
  CONSTRAINT `fk_cart_article_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `cart_article`;

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  `image_path` varchar(128) NOT NULL DEFAULT '0',
  `parent_category_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`),
  UNIQUE KEY `uq_category_image_path` (`image_path`),
  KEY `fk_category_parent_category_id` (`parent_category_id`),
  CONSTRAINT `fk_category_parent_category_id` FOREIGN KEY (`parent_category_id`) REFERENCES `category` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `category`;
INSERT INTO `category` (`category_id`, `name`, `image_path`, `parent_category_id`) VALUES
	(1, 'Racunarske komponente', 'assets/pc.jpg', NULL),
	(2, 'Kucna elektronika', 'assets/home.jpg', NULL),
	(3, 'Laptop racunari', 'assets/pc/laptop.jpg', 1),
	(4, 'Memorijski mediji', 'assets/pc/memory.jpg', 1),
	(5, 'Hard diskovi', 'assets/pc/memory/hdd.jpg', 4);

DROP TABLE IF EXISTS `feature`;
CREATE TABLE IF NOT EXISTS `feature` (
  `feature_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '0',
  `category_id` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`feature_id`),
  UNIQUE KEY `uq_feature_name_category_id` (`name`,`category_id`),
  KEY `fk_feature_category_id` (`category_id`),
  CONSTRAINT `fk_feature_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `feature`;
INSERT INTO `feature` (`feature_id`, `name`, `category_id`) VALUES
	(12, 'Boja', 3),
	(6, 'cijena', 3),
	(11, 'Graficka karta', 2),
	(13, 'HDMI', 3),
	(1, 'Kapacitet', 5),
	(3, 'Kategorija', 5),
	(4, 'Napon', 5),
	(5, 'Proizvodjac', 3),
	(10, 'RAM memorija', 3),
	(8, 'Rezolucija', 3),
	(2, 'Tip', 5),
	(9, 'Tip procesora', 3);

DROP TABLE IF EXISTS `order`;
CREATE TABLE IF NOT EXISTS `order` (
  `order_id` int unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cart_id` int unsigned NOT NULL DEFAULT '0',
  `status` enum('pending','rejected','accepted','shipped') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `uq_order_cart_id` (`cart_id`),
  CONSTRAINT `fk_order_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `order`;

DROP TABLE IF EXISTS `photo`;
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int unsigned NOT NULL DEFAULT '0',
  `image_path` varchar(128) NOT NULL DEFAULT '0',
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uq_photo_image_path` (`image_path`),
  KEY `fk_photo_article_id` (`article_id`),
  CONSTRAINT `fk_photo_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `photo`;
INSERT INTO `photo` (`photo_id`, `article_id`, `image_path`) VALUES
	(10, 1, '20221121-2679212855-download.jpg'),
	(11, 1, '20221127-9261561077-download.jpg'),
	(12, 1, '2022125-1788342462-patriot-ssd-1tb-m.2-nvme-pcie-p30-0.jpg'),
	(13, 1, '2022125-0026784323-ultra-3d-sata-iii-ssd-right.png'),
	(14, 1, '2022125-6217226025-ultra-3d-sata-iii-ssd-right.png'),
	(15, 1, '2022125-1206328131-ultra-3d-sata-iii-ssd-right.png'),
	(16, 1, '2022125-5517870741-patriot-ssd-1tb-m.2-nvme-pcie-p30-0.jpg'),
	(17, 1, '2022125-5188557178-patriot-ssd-1tb-m.2-nvme-pcie-p30-0.jpg'),
	(18, 1, '2022125-2855491772-patriot-ssd-1tb-m.2-nvme-pcie-p30-0.jpg'),
	(20, 1, '2022126-6771017615-ultra-3d-sata-iii-ssd-right.png'),
	(21, 1, '2022126-5271249333-4gb_ram_.ddr4jpg.jpg'),
	(22, 1, '2022126-4944463231-6gb_ram_.ddr4jpg.jpg'),
	(23, 1, '2022126-8619524880-ultra-3d-sata-iii-ssd-right.png');

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL DEFAULT '0',
  `password_hash` varchar(128) NOT NULL DEFAULT '0',
  `forename` varchar(64) NOT NULL DEFAULT '0',
  `surname` varchar(64) NOT NULL DEFAULT '0',
  `phone_number` varchar(64) NOT NULL DEFAULT '0',
  `postal_address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_email` (`email`),
  UNIQUE KEY `uq_user_phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELETE FROM `user`;
INSERT INTO `user` (`user_id`, `email`, `password_hash`, `forename`, `surname`, `phone_number`, `postal_address`) VALUES
	(1, 'sosicmilica2@gmail.com', '7B929709D2E6F9F139E4025123188EC1FFC90A23550B1734B3D40B200617AF925A22D58CCA535FB574EF2E8E32E533ADCB5D5E3E721688746F556700AF03FC47', 'Sosic', 'Milica', '068-843-802', 'Ul. Njegoseva 48'),
	(2, 'sosicslavko8@gmail.com', '60E1087C07AF7D7B957651A83B7431F396F95C977DA3024036CEB3AF2EEB2510100AD20C8C36F66D2B6090ED0EA3FB3153B6EF4538871C02BEE684D4CC98324D', 'Sosic', 'Slavko', '068-640-262', 'Ul. Dusana Tomovica bb'),
	(3, 'milossosic542@gmail.com', '6DDCB12CB2DE8C79E93F146A09A3583B7F3B7CF1C43E4E86DD5F2FDD344DA0F35DDBF11E5026CC7894C9387606E6F7B97A25A234162691B6AD9540BF5E6BFCA4', 'Sosic', 'Milos', '068-520-174', 'Ul. Studenska 14');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
