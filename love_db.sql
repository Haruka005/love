-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 172.16.117.200    Database: love_db
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_verifications`
--

DROP TABLE IF EXISTS `email_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_verifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `email_verifications_user_id_foreign` (`user_id`),
  CONSTRAINT `email_verifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_verifications`
--

LOCK TABLES `email_verifications` WRITE;
/*!40000 ALTER TABLE `email_verifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_approval_status`
--

DROP TABLE IF EXISTS `m_approval_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_approval_status` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `m_approval_status_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_approval_status`
--

LOCK TABLES `m_approval_status` WRITE;
/*!40000 ALTER TABLE `m_approval_status` DISABLE KEYS */;
INSERT INTO `m_approval_status` VALUES (2,'承認済'),(1,'未承認'),(3,'非承認');
/*!40000 ALTER TABLE `m_approval_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_areas`
--

DROP TABLE IF EXISTS `m_areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_areas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `m_areas_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_areas`
--

LOCK TABLES `m_areas` WRITE;
/*!40000 ALTER TABLE `m_areas` DISABLE KEYS */;
INSERT INTO `m_areas` VALUES (2,'幌別'),(1,'登別'),(3,'鷲別');
/*!40000 ALTER TABLE `m_areas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_budgets`
--

DROP TABLE IF EXISTS `m_budgets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_budgets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `m_budgets_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_budgets`
--

LOCK TABLES `m_budgets` WRITE;
/*!40000 ALTER TABLE `m_budgets` DISABLE KEYS */;
INSERT INTO `m_budgets` VALUES (1,'~2000'),(2,'~4000'),(3,'5000~');
/*!40000 ALTER TABLE `m_budgets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_events`
--

DROP TABLE IF EXISTS `m_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `catchphrase` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `start_date` timestamp NOT NULL,
  `end_date` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_open_enrollment` int NOT NULL,
  `is_free_participation` tinyint(1) NOT NULL,
  `approval_status_id` bigint unsigned NOT NULL,
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `organizer` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `m_events_user_id_foreign` (`user_id`),
  KEY `m_events_approval_status_id_foreign` (`approval_status_id`),
  CONSTRAINT `m_events_approval_status_id_foreign` FOREIGN KEY (`approval_status_id`) REFERENCES `m_approval_status` (`id`) ON DELETE CASCADE,
  CONSTRAINT `m_events_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_events`
--

LOCK TABLES `m_events` WRITE;
/*!40000 ALTER TABLE `m_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `m_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_genres`
--

DROP TABLE IF EXISTS `m_genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_genres` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `m_genres_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_genres`
--

LOCK TABLES `m_genres` WRITE;
/*!40000 ALTER TABLE `m_genres` DISABLE KEYS */;
INSERT INTO `m_genres` VALUES (5,'スイーツ・デザート系'),(6,'その他'),(4,'ファストフード・軽食系'),(3,'中華・アジア系'),(1,'和食系'),(2,'洋食系');
/*!40000 ALTER TABLE `m_genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_pin_images`
--

DROP TABLE IF EXISTS `m_pin_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_pin_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_pin_images`
--

LOCK TABLES `m_pin_images` WRITE;
/*!40000 ALTER TABLE `m_pin_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `m_pin_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `m_restaurants`
--

DROP TABLE IF EXISTS `m_restaurants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `m_restaurants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `catchphrase` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `topimage_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image1_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image2_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image3_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area_id` bigint unsigned NOT NULL,
  `genre_id` bigint unsigned NOT NULL,
  `budget_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tel` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `holiday` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `business_hours` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `m_restaurants_url_unique` (`url`),
  KEY `fk_area` (`area_id`),
  KEY `fk_budget` (`budget_id`),
  KEY `m_restaurants_genre_id_foreign` (`genre_id`),
  CONSTRAINT `fk_area` FOREIGN KEY (`area_id`) REFERENCES `m_areas` (`id`),
  CONSTRAINT `fk_budget` FOREIGN KEY (`budget_id`) REFERENCES `m_budgets` (`id`),
  CONSTRAINT `m_restaurants_area_id_foreign` FOREIGN KEY (`area_id`) REFERENCES `m_areas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `m_restaurants_budget_id_foreign` FOREIGN KEY (`budget_id`) REFERENCES `m_budgets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `m_restaurants_genre_id_foreign` FOREIGN KEY (`genre_id`) REFERENCES `m_genres` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_restaurants`
--

LOCK TABLES `m_restaurants` WRITE;
/*!40000 ALTER TABLE `m_restaurants` DISABLE KEYS */;
INSERT INTO `m_restaurants` VALUES (1,1,'テスト12/05','テスト12/05',NULL,'www.onsen','http://localhost:8000/storage/user_images/1/restaurants/top/76ttd4bLWJbCrxdXcZMeNQFNTGSIn0syDsOfOrN6.png',NULL,NULL,NULL,1,5,1,'2025-12-05 14:21:45','2025-12-05 14:21:45',42.41230000,141.20630000,'登別市中央町4丁目11','00000000','水曜日','17:30 ～ 23:00（L.O. 22:00）'),(2,1,'テスト12/05','12/05','テスト','www.onsen1119','http://localhost:8000/storage/user_images/1/restaurants/top/xWqb65MkA1RrvoAuKTwi3rQBP5PVWYFuNtVV97VX.png','http://localhost:8000/storage/user_images/1/restaurants/detail/DJpExMkGVrZYWT6Sz36MB4pUynYq0nSrsHvf70T2.png','http://localhost:8000/storage/user_images/1/restaurants/detail/xW7WE5FIK5UIw4x3fI5E8T35Kz2ysTIIVKckmbDZ.png','http://localhost:8000/storage/user_images/1/restaurants/detail/sm0ZkgXA4PqTDHzRuFTSlj7MGSHNwPRBl5LepGEC.jpg',1,5,1,'2025-12-05 14:36:46','2025-12-05 14:36:46',42.41230000,141.20630000,'北海道登別市札内町184-3','000-0000-0000','木曜日・第3水曜日','17:30 ～ 23:00（L.O. 22:00）'),(3,1,'テスト12/05　３回目','テスト12/05　３回目','テスト12/05　３回目','テスト12/05　３回目','http://localhost:8000/storage/user_images/1/restaurants/top/QnIx8DKnK6CpvFzveZyduWbiTLoL01bjWnEiCs1y.png',NULL,NULL,NULL,1,5,2,'2025-12-05 14:38:18','2025-12-05 14:38:18',42.41230000,141.20630000,'テスト12/05　３回目','テスト12/05　３回目','木曜日・第3水曜日','17:30 ～ 23:00（L.O. 22:00）'),(4,1,'aa','aaa',NULL,'f','http://localhost:8000/storage/user_images/1/restaurants/top/34PfZ5EnDN9apYgYipv5l7h7ITGqZ0M0AkQBBLfh.png',NULL,NULL,NULL,1,1,3,'2025-12-05 15:01:27','2025-12-05 15:01:27',42.41230000,141.20630000,'ggg','666','n','7'),(5,1,'サイダー食堂','古民家で味わう、懐かしいサイダーと創作定食','極楽通り商店街近くのレトロな木造建築にある「サイダー食堂」は、日本全国のご当地サイダー25種類以上を揃え、湯上りの体に嬉しい爽快なドリンクと共に、伊達・室蘭など道南産の海産物や野菜を用いた「鬼の金棒メンチカツ定食」や「季節の登別御膳」などの創作和定食を提供するユニークな食堂です。','https://www.cider-shokudo.jp','http://localhost:8000/storage/user_images/1/restaurants/top/QPATjxrKlF3CGmyryiDsaGuG4YiAn4z6zVacBgjy.png',NULL,NULL,NULL,1,1,3,'2025-12-05 15:03:30','2025-12-05 15:03:30',42.41230000,141.20630000,'北海道登別市登別温泉町12-3','XXX-XXX-XXXX','水曜日、第2木曜日','11:00 〜 19:30 (L.O. 19:00)'),(6,1,'test12/08','test12/08','test12/08','test12/08','http://localhost:8000/storage/user_images/1/restaurants/top/Gym3eondGMWtdr1cWkmohnxL67NU46aE6I05bfr3.jpg',NULL,NULL,NULL,1,3,2,'2025-12-08 11:13:30','2025-12-08 11:13:30',42.41230000,141.20630000,'test12/08','000-0000-0000','test12/08','test12/08'),(7,1,'tesy1208','tesy1208','tesy1208','tesy1208','http://localhost:8000/storage/user_images/1/restaurants/top/QW2L3MgLk4R9tRuIzdrg9mFFsCSWmC9iyNSZ3y3A.jpg',NULL,NULL,NULL,1,1,2,'2025-12-08 11:49:03','2025-12-08 11:49:03',42.41230000,141.20630000,'tesy1208','tesy1208','tesy1208','tesy1208'),(8,1,'テスト12/08','テスト12/08','テスト12/08','テスト12/08','http://localhost:8000/storage/user_images/1/restaurants/top/s4PaYC0H2UgovW3x0ENzxHQbNY5wwt7zibma0d1G.jpg',NULL,NULL,NULL,1,1,2,'2025-12-08 11:53:26','2025-12-08 11:53:26',42.41230000,141.20630000,'テスト12/08','テスト12/08','テスト12/08','テスト12/08'),(9,1,'テスト12-/08','テスト12-/08',NULL,'テスト12-/08','http://localhost:8000/storage/user_images/1/restaurants/top/bvxglpEFOJhPCC6tEevfMpVZpf83A6DeuFlmJjTD.jpg',NULL,NULL,NULL,1,1,2,'2025-12-08 12:57:17','2025-12-08 12:57:17',42.41230000,141.20630000,'テスト12-/08','テスト12-/08','テスト12-/08','テスト12-/08');
/*!40000 ALTER TABLE `m_restaurants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (4,'0001_01_01_000001_create_cache_table',1),(5,'2025_10_17_044514_test_event',2),(6,'2025_10_17_050654_add_start_end_to_test_events_table',3),(7,'2025_10_17_055257_test_events',4),(8,'0001_01_01_000000_create_users_table',5),(9,'2025_09_19_015152_m_area',6),(10,'2025_09_19_015152_m_budget',7),(11,'2025_09_19_015152_genre',8),(14,'2025_09_19_015153_m_approval_status',9),(15,'2025_10_15_053756_m_pin_images',10),(16,'2025_09_19_015152_m_event',11),(17,'2025_09_19_015152_m_restaurant',12),(18,'2025_10_15_053923_t_favorites_ev',13),(20,'2025_10_15_053933_t_favorites_res',14),(21,'2025_09_19_015153_event_poling',15),(22,'2025_09_19_015156_review',16),(23,'2025_09_19_015154_t_inquiry',17),(24,'2025_09_19_015155_t_backup_history',18),(25,'2025_09_19_015155_restaurant_images',19),(26,'2025_09_19_015155_event_images',20),(27,'2025_09_19_015153_t_user_pin_setting',21),(28,'2025_09_19_015154_t_access_log',22),(29,'2025_09_19_015154_t_login_history',23),(30,'2025_10_31_005856_t_opening_hours',24),(31,'2025_10_31_005919_t_user_visits',25),(32,'2025_10_31_020515_password_reset_tokens',26),(33,'2025_10_31_020533_personal_access_tokens',27),(34,'2025_10_31_020747_email_verifications',28),(35,'2025_11_14_061235_create_token_table',29),(36,'2025_11_14_062623_add_token_to_token_table',30),(37,'0001_01_01_000002_create_jobs_table',31),(38,'2025_10_29_000000_create_t_events_table',31),(39,'2025_11_17_003946_add_is_locked_to_users_table',32),(40,'2025_11_17_020255_alter_token_set_default_expires_at',33),(41,'2025_11_18_024319_fix_restaurants_table',34);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `password_reset_tokens_email_foreign` (`email`),
  CONSTRAINT `password_reset_tokens_email_foreign` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('0EzyjZpAKGBg8Hj631U7Cz0XfGadtw8mGjvivLer',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMzZVaTFKSWVva3hZdWR1bWtpRmNmMnpmMzlxb0JKbVl0SkhDMmZLUSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765520423),('0T5eSRNhQyhh3Y8nL6ou90Dr00inJmBFBvvioFkB',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiTTllYWN2SnFZSE54RXI2NHp2WmJNcTkzbmwyb1l3Qms3ZnZHYW9EWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765522376),('1yYN4ZSfspknWaSL8LH09CCqUES1ixaol1yTCycq',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWUtHZTJ3RFp0NnZRdGhaSWN1ek5tT2NLVHBmdlRBMUVSQ0dDWXFPViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765522118),('2gdHpkouq1DqO2pcu0vMmwwq2hEGnuajbYJBEdWK',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YToyOntzOjY6Il90b2tlbiI7czo0MDoiSkVrYUJNSkhOaEl5MmZZOWhybHhvTGJJdkpONXpwakx5YWQzbXhsRCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1765520403),('2pyR3xyXUffJ0A2eebsMkjqod1fKyeNzci23fT6V',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiY3ZMcEI5dFhDVWpwblZaU0x0RnQ2NUw4ektCNHlUbGh3ZHBVWWx1USI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765522187),('2R5QMbm26algfvOFa1t3WIaZMKXBnvzElMTYRAmh',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiM0d0dUVWc0IxOXpKR2N0ZXBUNVc0V0txMFJlV25tWEdkcmN0d3pxaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765858057),('2tlViEE4JH0YbQUkB7my5sauiVVsSUNXP8Dm1mgP',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiTEtRVXlWTDdKemNlOGFveEJEWTZZNWdYTzBtN01hOWw3SzBBZk5OUSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765854543),('30Np3Lo3a42qipIMMzoPPHVoEamlpFcLfaoAdVd9',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoieE0ybkNMYUprQnlWdWN3bVdOeDQxc1NDM2hqRnBCTjNqTWRWVjFQUiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765520324),('5s5nZQyJsB8VUFeDSoFlMaF92yRfoHxQHnHDp0wR',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiUmVYWkVRRlJWd1ZCZzNQeGJGZVR1VG9rclc4WUFBdmJoSkJOVzNhNSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765866970),('5U9kNisCNHM7ANFqagwmTIq4xJ8h2NBZ4Argmqc8',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiY2NWZnRVZnVSTjZBOWpvOWdKNm52ZDNJNnNyR2s5NGtEZ2F6ckRlTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765521921),('6Cm3VeyCBlQCgC4FQbZT37IHv4bluXDzfdHVqZma',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiaHcydkJRRjM2djBuQUI4Y0RMaXJ0VElWckUyY0RyZFlHMzV5ZmdkMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765866843),('7FdiK9JbZ0aaX9eVvGRcKpgcOQl9TuNvCrFKE0Ut',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoicEZ0dDA5MHNHajhPSmNYVEFwT2hydGVlamFqems4c1VOcU1QUTNscyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765522186),('7sm2QyspZ7FthCkyYgnW8vWVFhkbZERYjTXdsrBX',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiM0ZGTnZRUkhqU1Zibmc0UThCb0hXNGRIN1Zya3dUbjl3WXZaaHdmeCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765520547),('9ehISvverSfetmSSWfdrTfKKXveYG3uUKeJsvpys',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZmFMNXVVb2dpbk9Jamtxbm1GenhNQU5XRkpkVkJVQnlUQlVYQjJjQiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765854544),('9G84ny7MFd0YutFQl4JbvWBhAhjS8T8gM7uqBWhS',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiYzhyc2xkQmFtNGJVbWJxdnNNbXZPSlBna3FJNlZuZTU4NEVTZWRiNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765522119),('9PtLa5kCJsuB0dIKuSrWzipjYEpJUZIb47o9J2Mp',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YToyOntzOjY6Il90b2tlbiI7czo0MDoiYkl3a0phR25PTmFWQ1N5eXJIc2t4dFU5SVo2eXY0UTE0R0tIM3I3USI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1765520552),('advV64IgTGMicKoQsCtVWtKRMXwgU7dV7FqOnaIM',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiakFVZjd6RnF0UW1EYUJMODduMEZuUG56bE5BblhHekh0eXQxMXpUaCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765521698),('am1AFvwvreZtzfrQpxQhiQCO04VEsIGgZqzcAMpW',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVUZ4YXFBbmtxS1l3UmVwNGxjT1daMmZweFpaeDZIdFdsZUN3cHNkNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765522120),('AUVPDGsekLndtrotf76M4Vp7zrsWv2rBIwCGY0Ev',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoidlBvVWJ3Qk5ITjFYVk5TNVVkaEpmaWREN0wwek5zYzNzems3ZXFnayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765520666),('B1fgeFXWGUJPPXdNqXCn7e6kx8lPfgnptS48D32V',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiNnFlRVR0MENZVnRKMURHMmlhYldkZGZiaUo5aFJINUVzZ3FHZHhKeSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765866971),('BYYPPdSXPtkkDNAcJQj1OYW3RtL5Iem25zfELoIX',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWkdTWmQwM3h3eDBZZ0JSUVJkc1pxM3RsZ1ZScmFuTERtSzZSbzdoOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765522116),('cCKF89nA9LTPRAupcOfPVJai5aO1ZTu3BxgF3rfn',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoidjVFWkZrTlk0V2NwMGZrSlFDd0NNcmhQTW8zcEthbm8zNjhyOTFvSCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765866969),('cwf1Up8cYv2UUkuvaXGswWB9ikb4lwcumGBj2gLk',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiSXdvRmRlTkZ6aVZCdXlnMWh3cm5rNVg3R3l5RExGYXR1S25ZQ2lmeiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765522375),('dezQJI4OLFWETiN6ddshT8r2yeJswb6uBe7yDPST',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoibWdtNHY2WTFHUVpnTFBCeVFzeDMwSjF2ZTVNWHZGcExBWUZqb09BRiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765520670),('e4seX60nuFzZOR9XvHTgNhEC25uU9SNMdUKdXTvE',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiaG9qRkp0TFludXdXZXZGWTNZUWdLcFYwcFJadWdsRW9kbVRRZFF4dCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765858056),('f5NvDon1tKS3AYTwRqKg27KnWeIAAgFockcuUhJ6',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZUgzZ1NDcXA0NEtXdkVCQXp0aVNIMnYyNVZLVzFwaldNZGRDTVkwQiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765522377),('fbaA1tHaPPmNFyjV9ryStCIjnyqzOhsWbRqYEewo',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMEg3c3hPaTR4QTBsZDJtTWxsaGJ0Zk5JbEc4cm1XSnd3YnJtUXhZaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765522190),('fe7MGogccGr5esSq2mgAa8UVBorbWgn3zX6KD2EK',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiUTdRU2JwWjdyMHU5Q1A4dlNNZkNxWERBQVBWdkRQYzU5Z29VaVVqeiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765522378),('FV131XlpcpCB3kz1CWJZvB46d6FOyijHcsi6obLy',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiTHBpaG9XRks3R2NWMU82OHh1SnBab1RyczVKdmt4MlVuOWtxVENRNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765520553),('gK3n5G6bYN80mFMCZT3crsVWsmpDVOHi4TnXaHLT',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWDFtZmxDUWh0OWIzaEdHUHFzYjFmVXNSdW10dHo5WFZJcUNCd1pxVyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTAiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765866863),('hpZDMCRTUXQyL29e1zBLkQzwS0wn9WRigSyLHRgT',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZWJ1RVNYeGtTQ1RISGVnODY4Y1VKR2l4SWpod2JnRGt6VEcyWHlQNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765520672),('hQSjqXWsQF7Qoff1ob59B71shXnBVR1qi8rSXNdX',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiSjlFb05PYmZBdzlWREUzcGdCQTFSS3J2QnJDT2FDamRhYnh3VjhzOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765520552),('HtSRTObZYFPv0RpxxoFME5JVWSo4MOKIWNjXuVRG',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVDcyWjZnZXJLRUl1bGs2RFhUNldFdU1FMDgzV01VNmJLZWRXZm93QyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765521918),('iiTx6h7w4zG7EmtH4uQ5D7CjIshdJDkJZyryhdx7',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVUczTTdtUU1XeGxabDQxNHFLcXFwdFJzWmtCMUlYbVdyWDlsQjRPeiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765858057),('IX5SPdHjwNl0gLhmFPfaHq8cJj6cAQBCzvdnapa5',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiTWZEMGxzaWlHekRWQ1NlWDAwNXJmZ1hVY0NFWnV5N05vWnoyVU5SNSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765520671),('J9BoChfKec5BOSzweVefej7Xy0VkUUkrTZC4jCUa',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZkdDa2hqdXBqMGRtS0xlRmdpb3VrY0JiQkMwRHNWRFZIa3dTbFhMMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765521697),('JrkAc14YMq35OtAjzQRI1B0Gz3pvIa0tetsSTe8h',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiUlJFem5UbDY3Tmx3VDlqRXZIeWlyNlpkQWxYUGlmZUJvakIyd1pnTSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765521695),('Kbier6ZieTwocsy2EVWmrjt9i2ZqNo3vAgfGokvj',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ0JKVTJPNEZpZkFyMlpXc1VmYnlic3dOV0UyaGN3WDhtRUVQcXNRSiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765863953),('kdyrkBajemIhIcHxkVmL9aoxeBMFEL9MbCPQ9FgU',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVkR3aHRaWlJrbXByN2RERjhaRnR5VTRyZGw1bHloRWFpUEFTU1JhZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765521919),('KIXarQ9D1br9HBKvthk4W4RuWT8hpfnPYk5HHex3',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ25ReHZpS1dWQm1GNUJueEhxOEhKWjhHZkNOVmdQZlEwRVBjUEpFMSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765854543),('KqiPjfSjhlPAX1wHBo4mLQKT7CF18sFZleSUKSCY',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiejJDN1hpTGFnMTF6NzlzSW1ydE1nS1ZucXJ2Y0toclNRaXh3c0NOcSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6OTU6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zdG9yYWdlL3VzZXJfaW1hZ2VzLzEvZXZlbnRzL3RYRlVxMHhuZ2p2M1RmZm9EZXNENFBuQjdYUnBzckFHZjRaRGFlb2ouanBnIjtzOjU6InJvdXRlIjtzOjEzOiJzdG9yYWdlLmxvY2FsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1765522381),('LLVeZu3CYDKCt4DBcox7W78zqUahlnEAJgEUuHso',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoid0RVTkRMRVF2ckRGRXdTRGhQWktseXc2TUdkVWd3WlBqMTJPdURENiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765520425),('M4bV3VtCBLr7RzkrrlixHTACJfr0rYYbEa0V1RZ3',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiYzd0ZXozNWJVNUQxd3B6M1hIbXNUOGoxV2p0Rm1WZ3h0Vk5UMnpKbCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765866842),('mG4BjlS0JOkLZsaDMvm8g2Izr5klTHdCyKutO2CX',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoibmtZUER2YVlsN2pPR1ZQUEJJeUtaYWU5cWtKR1hYa1JnNFZsSzBpZSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765521689),('Mh94fRpJuOXYQlWwRXnyXDRLBjLjUUgxgr1C5as0',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiNFA3d2p4anhSY0ZhajRnbXhhcGhpbFhHQ0tVeGF5bVRlVmVMOWgxWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765521689),('NehQbfjwpaZdvFnYsMpphi7LWCy4oHWOwKRJx7RV',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiY3NuNDVreVp2SmVCc3JjdUxlMnJ5dVdUcEx1aGVGT21XSmpabUFVcyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765522188),('NMBU1iK6yQimSUVAzNvmVTVXoaBh9uXTVHxQdUSY',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiRGZzSVV3Y3NvSEk2OHFGMWJna2ZjNWRud0VIbDZqeDhMN0Zzbm9IVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765521920),('oDvmpd3YStBtWgx0B624n2iBlzcRlbvaXc6pTmq8',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoieVI1NFVSZm9Db2U1Wjl1WFp3RDhMT1BhZkxnZ3pkY2FUeFUzZnYwNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765520675),('OfREFpr3Ml6y4Q4wwygNCqu3E5pIQ9rRbrAQDXEN',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiODdFd3ZCRUkxazB4cmZDYUlJakJqeTJzanQwU3RvOGJwVXJFTlQyVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765522116),('oKPmPXnnAun7RKmh3UOgWqpGdu3wVAbEdom2cr1g',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZXZJSXJ2RURycG9UbTFYVTNwMWhXeUVpT1Ayd0h0VGNtM0VNaTEzSiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765854544),('OoEu5YPsw4BnCEjo8g42be0LQSifEI21rnaUFt6D',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoia3ZrcHY4R1FhQXR0T29qbENCR2N0UVYzbE9qaVpqRVBuY2Q0ZGp3ViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765521694),('oZPYVto72IVm4DumBO51UtwEanbaPRwrIUVVGl8B',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoicEpZYVZFc2huTkI1VFBRMmhOU0c5MVpQRktHNzhiaHB6MktEcXdKQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765858056),('PCSWMDkYDjcuqXvp8zPWUwNfRJj7Vr5dwmcXstqB',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiRGV0VFV6MDVjQ0NMVXh3ckJmWVFFdEtXR1cxd0E1VXZYeXFyM1NDQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765858055),('pdcmExpzv0nM94iAfVmSFPvp0xv3ULB9PgDoVH5K',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoib0JTRFlkbnRCME43MlZtb2p0T3NFZ0x6ck14RklDZHZqT1cwM2pxaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765866841),('PEN0Ewm8kQhaL8n4BG6iWhezVObhGSjfg38cPlxG',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQkJXZzJ5VkMzb3NmdGoxMW0ydmdoelFNa1I3aEVIWjg2Y3VKUHNCVSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765521696),('PhVRVWwKzw5ZiAdAooqiBmxuuPLGAw2j3ZDyVMIz',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoic0hKR3lBUDJaUUdvdGZvTjlFdlJOSWtYMTJMbGt6V0dxNWdsOHZnYSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765866970),('PqRF2UQrhhUV1mAkJlr7D8XW7EBdWW7jAimqlpzi',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiY0FaRldZVjQ3MU96bmxzRmdKQ0NnYUhkcXYzSWVxZlplWlZ6VUtxUCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6OTU6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zdG9yYWdlL3VzZXJfaW1hZ2VzLzEvZXZlbnRzLzBDNjBVUWxUWTdSdGo2QXFUNDlNcXpTMVUyaXB6MnFVTXU1cnIzREcuanBnIjtzOjU6InJvdXRlIjtzOjEzOiJzdG9yYWdlLmxvY2FsIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1765520325),('qZISlA4QyWa6TZmSfSMYSK8PwJDurFZF7z88wGPG',NULL,'127.0.0.1','curl/8.5.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVnFtV3dpVmd1aHB5OXpHY0VyeTNVc3dJcERpMXdQNXdicGh6QUpvSiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765774718),('RbhsdJTvBPnq0a761D1ydDRmgUARWU4pmC76FNeS',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoidTlCS0FrazBDV2FxQXE0Qnc5RzgxMENxYUM2V2RWNUtNYnFNNGJoYiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765520312),('rNUoNUa68JPMo3bZ5MzwKPEU56i08AdTz0WLiZkY',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQUxhZ2RvcUJsd0NBcDJTY0FxUW1ZbVliOWl1R3Y2OWpWSE5sSkM0eiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765520580),('RrKLfTZwEPKdw341ZvJ9UmPz3TgurlEbMeRPfrzA',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoibVJHMjYxV0VWNTM3RDg4dW5EM2E3NnJEb2ZjRkxXWnlWdGlxbHpVUyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTEiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765866853),('SeKZKS7Vy2rmv2aUISNFNx8384athplpynCRlgPV',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWlU3S1RISnNXUHZkdFJ5ZWxDQ2NmNUtKVG56aWEwM0lzdUhNVHdJNSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765522117),('SVrXEhedk5IVBdFm8gZbZGUJctY3eR7X1L0DHuek',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQURrZU5PNTRnNXI2cWxCcVpFQTBBNGMzNm9LT0FBMHhpZVNkVWxOYSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765521917),('TDNuL5OrTSKcMWBvmpoqPrQHjEEULEBw7kJybu0C',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiUGNyTjE0ZGNlVmxnaXhvNDhJcW1SNzFSNUNSZWJDSUZFM0VmYXRqbCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765520323),('tOvDHgkaSVqj7krMAuFKBeUzJLN2vonRERGNmXxY',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQTJESW5LZ09LeWRDblVlZW56NUkwSzh4RnhQSmRHNXZCM3JVQnR2eSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765522378),('TvLouCwdky9SXR0mXMsJ5pgDb9nhVurWUyINhm2f',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoicDNaR2JJVzJJNTFwdTljOHZEd0s0M2tOWkQ0OEVseHhSNDRVWUhoSiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765521690),('U1BFPTiOKuXQaxiAXujokBUW5cP5Af7LCHkvSJM3',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoialhSNHo1emUwbGRSN0JWbDhKdk1yTUphc0ZzS3BtaWFDV1BLZVVSNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMDgiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765866860),('UmPcZd4duVA91VmoLsgIaO9TNCycdMNVGUCPmTA9',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiU0p0STZFandyZWtDYjV5WlJ1cm8yc3d3aEVHNzdDdkE4d2gyRHczMSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765520554),('v53UBqlWwbu8LUFUlT2Z2zwKBrj0DSNUvhUkZQPT',NULL,'127.0.0.1','curl/8.5.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ09lQkdhVjZDbk5HMzV3YUZQUkY5SFRsSnNhTmRjaE45YjVBUElOUiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765773648),('v7t4vzVAMC75sKTHsiY9ki1FPdBKHSquIK5hpoZA',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoia2hqeGNqS1M2V0NlWEZkWmwweXA0Z3NQUUQxaUxuTnBmUUhNU0VSSiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765522379),('V9wG6B3Lg4gaJwgQnCzqIHx3ZzGym8p7f7mg4Fmc',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWEk2bTlsRnVCOVFDTFFSUmxXcWpjekh3SmpBb1JJeTFDOTd5ZXNzWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765521693),('VdXh6dJQZQmJtfYIyBmVSFj5mNuq2biCReViXYl4',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoibkQzTHZWUDZLMkhqSjh4UEZrd24yZkE5cXlSWEtzb2Z3RkZzd0cyQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765521919),('vegHKTwDzxOfWoNdLHFnj6JU7PtLDrZEsNtkyh5c',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiTTlrbEJkc2xIWFZOVjRoN2syVEJPdnhhZDlvVWFEZUZRbE1RM05yViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765521698),('w6S3xzi9YFeDiudwJt41Lf9zyYDPCX2ufaveis7m',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YToyOntzOjY6Il90b2tlbiI7czo0MDoiUU1iUXNoV2JjTWFTdkxuUk1tS1lReEhpaVhaTk0wUXh4UkVnRjV6TiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1765520424),('WHb6alpZyxsDvQIzPlusFhsAN0h96SvdBsaZrB2w',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiRFZ0SHFhZjh0Y3JoQWdMSWZUU092Z2F5RnBxUm5DcG10Zlh5Zm4zWSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765522188),('wSDBlqY4NsaLTOJcZSFgZg07zAHmTlGgng4HExG3',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWDV1eWU5RUc0SlBJTWdacmdtcjMxb1FWeEk5WlRhYUlCVDZMd1F5OCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765520674),('Wzs5RrpQtBqxzjZMzpDfYzTSsAeWJWzWSqoqops4',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiVFNncmltYzMyRXZYTnpRRVR5ZW1SV1hEV1o3UHVUc25wVG9ETzJHNyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765866842),('WzXkxFq9SBQ5rFM2INVkYUxh6BtfSitRCVQOKswO',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiaU0zUmFHU2hHUkVza3QzbEIzRDdvZnFRQ1E1cFB4MzdnOUpINUZrNiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzL3VwY29taW5nIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1765521691),('XmpPQ3TWE7QZ9thaW0CdFZKt6sBsWLsPrDiOuTu0',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiakFhSWlTQ0R3RFFYRWpHZ0VEVEUzcXVPOEFxUGRycnk4TXNtMEljSiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765520554),('Yiwfi33B3wuoCyfopuYghtRGZWDwerZlI7jbmw5k',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZllPMjBKc3RHS0tsaEVlTVk1TUlhRkF2Vm44dXBJSmhwU3J2SWdLTCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMDciO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765866857),('Z8r22XKlh5m9zd48nYvp4KXB9aMXTrevGiLseN3I',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoibjRRbk5TZFVqelRZdnpXUUlyVlVmS1NQRmQ0ZGRGRGpEQjcyVm1yeCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765521699),('ZkJTozDYWWx7pqKSfxpX3noaKn137r1XgG9etcaq',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiZnZPMzVkOFNOWG1aYzM5YWI4TXFRcDNrcFlpb0lPdVFQWVM2d2xxSyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765866856),('zTVdx8Bqiw68avmmsnSG7dYY4yRCoAH1VyXkMMpC',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiNjJIYmF1WG9FYVhDV2NPVWM3ZXBoaXB4Wk44SjdJZTdMdVd4NU9OVyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765858055),('ZwJFWwGCbsVqpbpnlCMQnn0N8o2Tb6T9v85runka',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoidUNJNFM3WHZYZzZWUlJlZ1NjeTRTQmR2Tkl6RXVJdlEweWtVdWNFZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvcmVzdGF1cmFudHMiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765520672),('zYGwiJJ9QUNribIVg0N8jCEOLrtsS4All2BT4rE6',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiem5iY3hMZ1FaUzFPRXhoOTVvMDdSdklxTUlUM0F6QnZvclpFSjI2WiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMDkiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765866862),('zzPdrLi5oj0KtWFU75meYXbKlj7AoqSlWNpFa5eM',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiMGZKNHZJejFrTFNOUkZHWHRoaXRweG4wUzRIWGtzRVFNNGlVVFB6cSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvZXZlbnRzLzIwMjUvMTIiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1765522189);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_access_logs`
--

DROP TABLE IF EXISTS `t_access_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_access_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `accessed_at` timestamp NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `t_access_logs_user_id_foreign` (`user_id`),
  CONSTRAINT `t_access_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_access_logs`
--

LOCK TABLES `t_access_logs` WRITE;
/*!40000 ALTER TABLE `t_access_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_access_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_backup_historys`
--

DROP TABLE IF EXISTS `t_backup_historys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_backup_historys` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `executed_at` datetime NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` int NOT NULL,
  `status` tinyint(1) NOT NULL,
  `massage` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_backup_historys`
--

LOCK TABLES `t_backup_historys` WRITE;
/*!40000 ALTER TABLE `t_backup_historys` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_backup_historys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_event_images`
--

DROP TABLE IF EXISTS `t_event_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_event_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `event_id` bigint unsigned NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_event_images_url_unique` (`url`),
  KEY `t_event_images_event_id_foreign` (`event_id`),
  CONSTRAINT `t_event_images_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `m_events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_event_images`
--

LOCK TABLES `t_event_images` WRITE;
/*!40000 ALTER TABLE `t_event_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_event_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_event_pollings`
--

DROP TABLE IF EXISTS `t_event_pollings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_event_pollings` (
  `user_id` bigint unsigned NOT NULL,
  `event_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `can_go` tinyint(1) NOT NULL,
  PRIMARY KEY (`user_id`,`event_id`),
  KEY `t_event_pollings_event_id_foreign` (`event_id`),
  CONSTRAINT `t_event_pollings_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `m_events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `t_event_pollings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_event_pollings`
--

LOCK TABLES `t_event_pollings` WRITE;
/*!40000 ALTER TABLE `t_event_pollings` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_event_pollings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_events`
--

DROP TABLE IF EXISTS `t_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `catchphrase` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organizer` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_free_participation` tinyint(1) NOT NULL DEFAULT '0',
  `is_open_enrollment` tinyint(1) NOT NULL DEFAULT '1',
  `approval_status_id` tinyint unsigned DEFAULT NULL,
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_events`
--

LOCK TABLES `t_events` WRITE;
/*!40000 ALTER TABLE `t_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_favorites_ev`
--

DROP TABLE IF EXISTS `t_favorites_ev`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_favorites_ev` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `event_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_favorites_ev_user_id_unique` (`user_id`),
  UNIQUE KEY `t_favorites_ev_event_id_unique` (`event_id`),
  CONSTRAINT `t_favorites_ev_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `m_events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `t_favorites_ev_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_favorites_ev`
--

LOCK TABLES `t_favorites_ev` WRITE;
/*!40000 ALTER TABLE `t_favorites_ev` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_favorites_ev` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_favorites_res`
--

DROP TABLE IF EXISTS `t_favorites_res`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_favorites_res` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `restaurant_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_favorites_res_user_id_unique` (`user_id`),
  UNIQUE KEY `t_favorites_res_restaurant_id_unique` (`restaurant_id`),
  CONSTRAINT `t_favorites_res_restaurant_id_foreign` FOREIGN KEY (`restaurant_id`) REFERENCES `m_restaurants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `t_favorites_res_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_favorites_res`
--

LOCK TABLES `t_favorites_res` WRITE;
/*!40000 ALTER TABLE `t_favorites_res` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_favorites_res` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_inquirys`
--

DROP TABLE IF EXISTS `t_inquirys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_inquirys` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_inquirys`
--

LOCK TABLES `t_inquirys` WRITE;
/*!40000 ALTER TABLE `t_inquirys` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_inquirys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_login_historys`
--

DROP TABLE IF EXISTS `t_login_historys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_login_historys` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `login_at` timestamp NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_success` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `t_login_historys_user_id_foreign` (`user_id`),
  CONSTRAINT `t_login_historys_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_login_historys`
--

LOCK TABLES `t_login_historys` WRITE;
/*!40000 ALTER TABLE `t_login_historys` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_login_historys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_opening_hours`
--

DROP TABLE IF EXISTS `t_opening_hours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_opening_hours` (
  `restaurant_id` bigint unsigned NOT NULL,
  `day_of_week` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL,
  `open_time` time NOT NULL,
  `end_time` time NOT NULL,
  `is_closed` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`restaurant_id`,`day_of_week`),
  CONSTRAINT `t_opening_hours_restaurant_id_foreign` FOREIGN KEY (`restaurant_id`) REFERENCES `m_restaurants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_opening_hours`
--

LOCK TABLES `t_opening_hours` WRITE;
/*!40000 ALTER TABLE `t_opening_hours` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_opening_hours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_restaurant`
--

DROP TABLE IF EXISTS `t_restaurant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_restaurant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `catchphrase` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `topimage_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_paths` text COLLATE utf8mb4_unicode_ci,
  `area_id` int DEFAULT NULL,
  `genre_id` json DEFAULT NULL,
  `budget_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_restaurant`
--

LOCK TABLES `t_restaurant` WRITE;
/*!40000 ALTER TABLE `t_restaurant` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_restaurant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_restaurant_images`
--

DROP TABLE IF EXISTS `t_restaurant_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_restaurant_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `restaurant_id` bigint unsigned NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_restaurant_images_url_unique` (`url`),
  KEY `t_restaurant_images_restaurant_id_foreign` (`restaurant_id`),
  CONSTRAINT `t_restaurant_images_restaurant_id_foreign` FOREIGN KEY (`restaurant_id`) REFERENCES `m_restaurants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_restaurant_images`
--

LOCK TABLES `t_restaurant_images` WRITE;
/*!40000 ALTER TABLE `t_restaurant_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_restaurant_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_reviews`
--

DROP TABLE IF EXISTS `t_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_reviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `restaurant_id` bigint unsigned NOT NULL,
  `stamp_type` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `t_reviews_user_id_foreign` (`user_id`),
  KEY `t_reviews_restaurant_id_foreign` (`restaurant_id`),
  CONSTRAINT `t_reviews_restaurant_id_foreign` FOREIGN KEY (`restaurant_id`) REFERENCES `m_restaurants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `t_reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_reviews`
--

LOCK TABLES `t_reviews` WRITE;
/*!40000 ALTER TABLE `t_reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_user_pins`
--

DROP TABLE IF EXISTS `t_user_pins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_user_pins` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `restaurant_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `pin_color` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `t_user_pins_restaurant_id_foreign` (`restaurant_id`),
  KEY `t_user_pins_user_id_foreign` (`user_id`),
  CONSTRAINT `t_user_pins_restaurant_id_foreign` FOREIGN KEY (`restaurant_id`) REFERENCES `m_restaurants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `t_user_pins_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_user_pins`
--

LOCK TABLES `t_user_pins` WRITE;
/*!40000 ALTER TABLE `t_user_pins` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_user_pins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_user_visits`
--

DROP TABLE IF EXISTS `t_user_visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_user_visits` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `restaurant_id` bigint unsigned NOT NULL,
  `status` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `t_user_visits_user_id_foreign` (`user_id`),
  KEY `t_user_visits_restaurant_id_foreign` (`restaurant_id`),
  CONSTRAINT `t_user_visits_restaurant_id_foreign` FOREIGN KEY (`restaurant_id`) REFERENCES `m_restaurants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `t_user_visits_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_user_visits`
--

LOCK TABLES `t_user_visits` WRITE;
/*!40000 ALTER TABLE `t_user_visits` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_user_visits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
INSERT INTO `test` VALUES (1,'sample1','2025-09-16 02:32:31','2025-09-16 02:32:31');
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_events`
--

DROP TABLE IF EXISTS `test_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `catchphrase` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `is_free_participation` tinyint(1) DEFAULT '0',
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `organizer` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_open_enrollment` tinyint(1) DEFAULT '0',
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `approval_status_id` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_events`
--

LOCK TABLES `test_events` WRITE;
/*!40000 ALTER TABLE `test_events` DISABLE KEYS */;
INSERT INTO `test_events` VALUES (1,1,'2025-12-05 13:51:25','2025-12-08 11:06:11','クリスマス市in登別','温泉とセットで楽しむ！登別でしか味わえない特別なクリスマス体験','2025-12-20 12:00:00','2025-12-25 20:00:00','','クリスマス市 in 登別」では、湯けむりとキャンドルが彩る幻想的な会場で、クリスマス仕様に装飾された鬼像を眺めつつ、北海道産食材を使ったグリューワインや海鮮アヒージョなどの限定メニュー、地元作家による特産品、そして週末に開催されるクリスマスキャロルやアイヌ音楽のステージイベントを楽しめます。','登別温泉街','会場は屋外であり、12月の登別は大変冷え込みます。十分な防寒着（帽子、手袋、厚手のコート）をご用意ください。\r\nクリスマス市で体が冷えた際は、会場周辺の温泉旅館にて日帰り入浴（別途料金）をご利用いただけます。',1,'https://www.noboribetsu-christmas.jp','登別市',1,NULL,1),(3,1,'2025-12-08 17:39:30','2025-12-08 17:39:57','テスト1208','テスト1208','2025-12-09 09:00:00','2025-12-10 15:00:00','http://localhost:8000/storage/user_images/1/events/tXFUq0xngjv3TffoDesD4PnB7XRpsrAGf4ZDaeoj.jpg','テスト1208','テスト1208','テスト1208',1,'テスト1208','テスト1208',1,NULL,1),(4,1,'2025-12-08 17:40:58','2025-12-08 17:41:28','テスト1208','テスト1208','2025-12-07 17:40:00','2025-12-08 17:41:00','http://localhost:8000/storage/user_images/1/events/sXsN5xfMLt0SekmxOXe3clAXwEeRJBLEpFUArsAC.jpg','テスト1208','テスト1208','テスト1208',1,'テスト1208','テスト1208',1,'muri',2),(5,1,'2025-12-08 17:48:44','2025-12-08 17:50:58','地獄谷ナイトウォーク','湯けむりと鬼が舞う夜','2025-12-08 01:00:00','2025-12-10 01:00:00','http://localhost:8000/storage/user_images/1/events/0C60UQlTY7Rtj6AqT49MqzS1U2ipz2qUMu5rr3DG.jpg','test','登別地獄谷','test',0,'www.onsen','登別温泉街',1,NULL,1),(6,1,'2025-12-12 10:02:15','2025-12-12 10:02:15','test12/12','test12/12','2025-12-12 10:00:00','2025-12-15 10:00:00','http://localhost:8000/storage/user_images/1/events/o0VHV4WLITbqcysSclDXlvnupV3DY1HrUri8NA9C.png','test12/12','test12/12','test12/12',0,'test12/12','test12/12',1,NULL,0);
/*!40000 ALTER TABLE `test_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token_expires_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expired_flg` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_token_unique` (`token`),
  KEY `token_user_id_foreign` (`user_id`),
  CONSTRAINT `token_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
INSERT INTO `token` VALUES (6,1,'5f459d3cbd1f7a58523278c7b20ac865aebdbf722b2d28e1a6589bb72977df2a','2025-12-05 12:16:40','2025-12-05 11:42:10',0,'2025-12-05 11:16:40','2025-12-05 11:42:10'),(7,1,'fa5ee0a431a9eae88be7227ad0bc166fa43499223d6487b57222cade9b58a28e','2025-12-05 12:32:00','2025-12-05 11:40:14',0,'2025-12-05 11:32:00','2025-12-05 11:40:14'),(13,1,'2d88be810a659ac1e765a40634dacd21a16bc3b6b0a7a5a559c939b694f63d84','2025-12-05 15:35:42','2025-12-05 15:13:51',0,'2025-12-05 14:35:42','2025-12-05 15:13:51'),(14,1,'e059cba365ab8c413330079967627dce2c0f89b051c7fd34a938aa7b68e7c3cf','2025-12-05 05:59:49','2025-12-05 05:59:49',0,'2025-12-05 05:59:49','2025-12-05 05:59:49'),(15,1,'26e8772ca17f0fadaa718b07f970a3950f4ba60f842f5d93e1a8fc28ac6feb76','2025-12-05 05:59:54','2025-12-05 05:59:54',0,'2025-12-05 05:59:54','2025-12-05 05:59:54'),(16,1,'de5cbffdb9a0e35952ef275220d11a832e0576f56e1d9500a6e04c3c5119f75b','2025-12-05 05:59:58','2025-12-05 05:59:59',0,'2025-12-05 05:59:59','2025-12-05 05:59:59'),(17,1,'b3aaa847a3bec9740d07f89e70e25b82147fe31510737208851020af0bfd5ca2','2025-12-05 16:00:24','2025-12-05 15:00:24',0,'2025-12-05 15:00:24','2025-12-05 15:00:24'),(19,1,'c130a50e7e45f6165fb0fc897dc2dde628a5255ae469fd335317787b276343f1','2025-12-08 12:00:34','2025-12-08 11:12:28',0,'2025-12-08 11:00:34','2025-12-08 11:12:28'),(22,1,'063181aec06bd38c2261f19ce709232fef6ce82129c672abf682f39a589349e5','2025-12-08 16:45:21','2025-12-08 16:30:09',0,'2025-12-08 15:45:21','2025-12-08 16:30:09'),(23,1,'96f15be2f11864f88a83b8ba64bbcfcb976f9b5562e45d3acd37dff2258eca6f','2025-12-08 16:56:20','2025-12-08 15:56:45',0,'2025-12-08 15:56:20','2025-12-08 15:56:45'),(24,1,'ce86d483f38eb8262d9e9dc73bb1193e474679f61a7fca62766477ecd2a0b5af','2025-12-08 17:36:33','2025-12-08 16:36:33',0,'2025-12-08 16:36:33','2025-12-08 16:36:33'),(25,1,'e791689f603eee01267603428e9c2a78f1025641f498c760bfa5a6a0d06d3c91','2025-12-08 17:36:34','2025-12-08 17:05:39',0,'2025-12-08 16:36:34','2025-12-08 17:05:39'),(26,1,'0a839406231323ba67062502fc5bc300b264f23df4a51881a5cf9741d9ce302d','2025-12-08 18:11:27','2025-12-08 17:20:09',0,'2025-12-08 17:11:27','2025-12-08 17:20:09'),(27,1,'f9483b26b89dfcad2e03736a3c1997e8503bf6746dc93cc797d632fbc9f81159','2025-12-08 18:20:22','2025-12-08 17:51:31',0,'2025-12-08 17:20:22','2025-12-08 17:51:31'),(28,1,'cdb3fab7d9ebc2a248b3f70fe60ad110a0bcd27df1e5cc49792a6c7bf491c9d7','2025-12-10 13:49:22','2025-12-10 12:49:22',0,'2025-12-10 12:49:22','2025-12-10 12:49:22'),(29,1,'4fb6948a608a233d74eecf811f59861766f5bcee61ab3b386ca82589626d38f5','2025-12-10 17:12:13','2025-12-10 16:12:13',0,'2025-12-10 16:12:13','2025-12-10 16:12:13'),(30,1,'13458bd187f5acde7516e16b507db7328b4375b0cafec5062ac2245769757325','2025-12-10 17:12:16','2025-12-10 16:39:47',0,'2025-12-10 16:12:16','2025-12-10 16:39:47'),(31,1,'d8dd8761c5050a44cf3181ea4a7a0508a73a110a5574466a6cdf4233b0794ca3','2025-12-11 12:21:37','2025-12-11 11:21:37',0,'2025-12-11 11:21:37','2025-12-11 11:21:37'),(32,1,'2a85e90b62d7a2f0a00a6fc6c892fe2312bec3b05b110b0809c6bd0fced0ef57','2025-12-12 10:55:35','2025-12-12 10:30:19',0,'2025-12-12 09:55:35','2025-12-12 10:30:19');
/*!40000 ALTER TABLE `token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `has_restaurant_folder` tinyint(1) NOT NULL DEFAULT '0',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `has_image_folder` tinyint(1) DEFAULT '0',
  `user_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `login_attempts` int NOT NULL DEFAULT '0',
  `is_locked` tinyint(1) NOT NULL DEFAULT '0',
  `locked_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'love','test@example.com',1,NULL,'$2y$12$fIzp6fP4K2QX43TLxvVgYur2r5z277RB4zfjxBtK8BXUj.Me/I.BC',NULL,'2025-12-05 10:53:34','2025-12-05 14:19:03',1,'1',0,0,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-17 10:36:51
