-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: love_db
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
INSERT INTO `m_events` VALUES (1,'(テスト)登別夏祭り','登別の夏を盛り上げよう！','御神輿の参加者を募集しています。','https://www.youtube.com/?reload=9&app=desktop&hl=ja',1,'2025-08-01 10:00:00','2025-08-01 21:00:00',NULL,NULL,1,1,1,NULL,'登別市');
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `m_restaurants`
--

LOCK TABLES `m_restaurants` WRITE;
/*!40000 ALTER TABLE `m_restaurants` DISABLE KEYS */;
INSERT INTO `m_restaurants` VALUES (1,0,'ポムポムの樹','カレーライスが有名です！',NULL,'http://www.nkhs.ac.jp/index.html','',NULL,NULL,NULL,1,2,1,NULL,NULL,42.45100445,141.11156963,'北海道登別市','000-000-000'),(2,2,'テスト11/17','美味しいよ','来てね！！','www.onsen11','http://localhost:8000/storage/user_images/2/restaurants/top/XEaZPckPNhQwngDkjMRQ76SD00JlF5v95PrIiohK.png',NULL,NULL,NULL,1,5,1,'2025-11-17 06:36:22','2025-11-17 06:36:22',42.41230000,141.20630000,'北海道登別市札内町184-3','000-0000-0000'),(3,2,'テスト11/19','美味しいよ','来てね！！','www.onsen1119','http://localhost:8000/storage/user_images/2/restaurants/top/5DAZqwGOsKKtdzlCrLpsUJUx0vOyHVD8dsZ3P2Ma.jpg',NULL,NULL,NULL,1,5,1,'2025-11-19 01:47:47','2025-11-19 01:47:47',42.41230000,141.20630000,'北海道登別市札内町一八四番地','000-0000-0000');
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
INSERT INTO `sessions` VALUES ('2QQ3ivHyFRlRGteT7WVgaPwPajl1VEmNR4ftEPPx',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:145.0) Gecko/20100101 Firefox/145.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWjBlc1JPZ3hFb0pWbUs5ZGx5a0ZMVHRmSWZ1Z1l0ekZldXg2MTd3eCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1763706031),('84S0DO5yg0J8XV4ap2eYcLrodVD0a2gSkKNlFEVq',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:145.0) Gecko/20100101 Firefox/145.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWE5VMDFLbWtpMFVkaGFKNHBxdXRITnhTNUtyVmt6eHY4eFAyMlVUMiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1763514707),('CeTveBVsZzmPZOxlz7u3bacPNlXiVdw99NTIaL1F',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:145.0) Gecko/20100101 Firefox/145.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQUt4S3ZVVnRaa01QS2NkVFF6SlRWbm0zWU5WdDhWMUJuTDJ4ajdKciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1763514398),('CpRmW7LEvWQkrd0I6unQvPzn7vRSjnayssGmQfK3',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiWGNEeWpTcjZBUHRnYlFCVnZScFltZEZtU0ZLZkd2cHFDWVVCQ0ZEUCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1763455970),('L3pc3jITkTW0NTZBZTKhQKkdZT1gUbPPydgKzDYP',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:145.0) Gecko/20100101 Firefox/145.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoicURLNU5qNWo1VTRIMkY5U1lHR0hFOHByU0t0NUJ1V0ZzOHZEQWM1ViI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1763706031),('p9WgvqBoIeo2pisW1HCsjtNr5Mu1L3y12ByxajkY',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiT2Fvclk5VjhtMGNSWTRtTE82elJrT0k4Z2VtUWttaXpoOFZUYmZTbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1763512905),('pLYDTMcOaqxkEnbtuXs4h4eAPhm5l9sHMM5KoiXj',NULL,'127.0.0.1','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:145.0) Gecko/20100101 Firefox/145.0','YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ2ljZUNFOURPMTdNVVNXRTRmaDg3Mld4QVd4NmhIbTNQTm9TZVM3NSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=',1763516018);
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
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `is_free_participation` tinyint(1) DEFAULT '0',
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organizer` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_open_enrollment` tinyint(1) DEFAULT '0',
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `approval_status_id` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_events`
--

LOCK TABLES `test_events` WRITE;
/*!40000 ALTER TABLE `test_events` DISABLE KEYS */;
INSERT INTO `test_events` VALUES (1,NULL,'2025-10-17 06:17:00','2025-10-17 06:17:00','春の桜まつり','満開の桜とともに春を感じよう！','2025-04-05 10:00:00','2025-04-10 18:00:00',NULL,NULL,NULL,NULL,0,NULL,NULL,0,NULL,0),(2,NULL,'2025-10-17 06:17:00','2025-10-17 06:17:00','夏のビアガーデン','冷たいビールで夏を乗り切れ！','2025-07-15 17:00:00','2025-08-31 22:00:00',NULL,NULL,NULL,NULL,0,NULL,NULL,0,NULL,0),(3,NULL,'2025-10-17 06:17:00','2025-10-17 06:17:00','秋のハロウィンフェスタ','仮装して街を楽しもう！','2025-10-25 12:00:00','2025-10-31 21:00:00',NULL,NULL,NULL,NULL,0,NULL,NULL,0,NULL,0),(4,NULL,'2025-10-17 06:17:00','2025-10-17 06:17:00','年越しカウントダウン','新年のお祝いをしよう！','2025-12-31 23:30:00','2026-01-01 01:30:00',NULL,NULL,NULL,NULL,0,NULL,NULL,0,NULL,0),(5,1,'2025-11-06 06:46:02','2025-11-06 06:46:02','マリンパークスニクス','楽しもう','2025-11-05 00:00:00','2025-11-06 00:00:00','http://localhost:8000/storage/user_images/1/events/G1MPF4i41BVYVZJggBQ0DpzWQ2hdzAbk9MKHziUL.jpg','スニーカー必須','マリンパークスニクス周辺','スニーカー必須',0,'www','iidada',1,NULL,0),(6,1,'2025-11-06 06:48:59','2025-11-06 06:48:59','のぼりべつみんなで観光','楽しもう','2025-11-05 00:00:00','2025-11-06 00:00:00','http://localhost:8000/storage/user_images/1/events/9IPbiVGbviOWeZzUT3pOrQySHox89bJeQmUTdM45.png','上靴必須','マリンパークスニクス周辺','上靴必須',0,'www','iidadaDA',1,NULL,0),(7,2,'2025-11-06 08:27:42','2025-11-06 08:27:42','豆まき','節分登別鬼をやっつけよ～！！','2026-02-10 00:00:00','2026-02-10 00:00:00','http://localhost:8000/storage/user_images/2/events/a5UNvufr0J5ZZUo6WGvTHStpRkGq81T4RnFEpD3y.png','手ぶらOK','登別温泉','豆が体に当たる危険があります\r\nご了承ください',1,'www','登別温泉街',1,NULL,0),(8,2,'2025-11-07 00:35:36','2025-11-07 00:35:36','登別豆まき','豆まき楽しもう！！','2026-02-10 00:00:00','2026-02-10 00:00:00','http://localhost:8000/storage/user_images/2/events/Va2VvqXJFrT4ejQPwYvlHRJwqYJHeF4eAKaR34y3.png','スニーカー必須','登別温泉街','豆まき力みすぎ注意',1,'www','登別温泉街',1,NULL,0),(9,2,'2025-11-07 05:46:33','2025-11-07 05:46:33','テスト11/07','楽しもう','2025-11-07 00:00:00','2025-11-10 00:00:00','http://localhost:8000/storage/user_images/2/events/5x3Voq3mOqP1Z6NOPmwKQrcf4eY6dZmrFVvY7p43.png','スニーカー必須','登別温泉街','スニーカー必須',0,'www','iidadaDA',1,NULL,0),(10,3,'2025-11-07 06:32:42','2025-11-07 06:32:42','のぼりべつみんなで観光','楽しもう','2025-11-05 00:00:00','2025-11-06 00:00:00','http://localhost:8000/storage/user_images/3/events/l9714b01mSEiI0JeIXSaqTZmC3rjhJDFSssDEqJQ.jpg','11','マリンパークスニクス周辺','11',0,'www','iidadaDA',1,NULL,0),(11,3,'2025-11-07 06:59:15','2025-11-07 06:59:15','のぼりべつみんなで観光','豆まき楽しもう！！','2025-11-05 00:00:00','2025-11-06 00:00:00','http://localhost:8000/storage/user_images/3/events/YQ0MLwddO4THYB9RIo7H7u4FbyQG4iboVZZ8F8e2.jpg','スニーカー必須','登別温泉街','スニーカー必須',0,'www','登別温泉街',1,NULL,0),(12,2,'2025-11-10 01:02:27','2025-11-10 01:02:27','豆まき大会','沢山豆をまこう！！！','2026-11-10 00:00:00','2026-02-10 00:00:00','http://localhost:8000/storage/user_images/2/events/sI9bUGUqhWMtpDVNKITjERIt46HjD8RO1EfTzGP7.jpg','豆は持参不要です。','登別温泉街','動きやすい服装で来てください！！',1,'www.onsen','登別温泉街',1,NULL,0),(13,2,'2025-11-19 02:12:19','2025-11-19 02:12:19','テスト11/19','楽しもう','2025-11-19 00:00:00','2025-11-20 00:00:00','http://localhost:8000/storage/user_images/2/events/QzEG3XyXq83koiSKA3CQgaJUrUI4uQ1bsq9B0YZV.jpg','楽しもう！来てね！！','登別温泉街','動きやすい服装で！！',0,'www.onsen1119','登別温泉街',1,NULL,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
INSERT INTO `token` VALUES (2,1,'8ececc94f9c1a91aaac53115d33c9540f2175034de84b3ef07fb1f764afad31f','2025-11-17 02:06:27','2025-11-17 02:06:27',0,'2025-11-17 02:06:27','2025-11-17 02:06:27'),(4,1,'cc88e750500b44d96997077d0d4ad5529f73b636a77330ab32800e5e13c2ed4b','2025-11-17 02:21:36','2025-11-17 02:21:36',0,'2025-11-17 02:21:36','2025-11-17 02:21:36'),(12,1,'f07a9aa0f110737ff0aeb3da90223a95c2c220cd6e973f060170ae61a3904778','2025-11-17 05:10:23','2025-11-17 05:10:24',0,'2025-11-17 05:10:24','2025-11-17 05:10:24'),(13,1,'08919f01353dd61851045d7407cfa4401d435efe36649dd9e39a400321af2902','2025-11-17 06:18:35','2025-11-17 06:18:35',0,'2025-11-17 06:18:35','2025-11-17 06:18:35'),(14,1,'67dde856b1abffcec31f7118ba3ce91ba0e17fdcd9b40ffb3448a9646f09edf4','2025-11-17 06:25:34','2025-11-17 06:25:35',0,'2025-11-17 06:25:35','2025-11-17 06:25:35'),(15,1,'99b5432eeaf5b0f67623c004c65e662346c577dae19f4b3cd7a357a4927ac26d','2025-11-17 06:27:40','2025-11-17 06:27:40',0,'2025-11-17 06:27:40','2025-11-17 06:27:40'),(16,1,'a6d0e975f240122835ebc2ba8670f16cb2fe1e596d9cc032dc7f5baa36f5eb36','2025-11-17 06:29:34','2025-11-17 06:29:34',0,'2025-11-17 06:29:34','2025-11-17 06:29:34'),(17,1,'4f0fdefe16a71c73bed8c4267481c54926cc0a349be40ded4ee7f94a4ab2f8ef','2025-11-17 06:31:34','2025-11-17 06:31:35',0,'2025-11-17 06:31:35','2025-11-17 06:31:35'),(18,1,'12d3ff46b26e3d09e8966e62f48cc86f720b656fe813b0cefa8134b924ed3f0d','2025-11-17 06:34:18','2025-11-17 06:34:18',0,'2025-11-17 06:34:18','2025-11-17 06:34:18'),(19,1,'9b1a79539d739facdbf734df5e1811987c14278fde85625ce333ed07818ec573','2025-11-17 06:36:01','2025-11-17 06:36:01',0,'2025-11-17 06:36:01','2025-11-17 06:36:01'),(20,1,'da56047b878896e776eaa910f3db8f87a316ee4c0f3935d370825796c7fcb0e7','2025-11-17 06:40:35','2025-11-17 06:40:35',0,'2025-11-17 06:40:35','2025-11-17 06:40:35'),(21,1,'6c15cab8ed0dddce8dc09439e056aa958c786a11125a9e153abfccd4838d6925','2025-11-18 02:28:21','2025-11-18 02:28:21',0,'2025-11-18 02:28:21','2025-11-18 02:28:21'),(22,1,'0507322b6eae6a2c3e4254c04a0972dd4313cbda1cf941b08fe3893ce33a944c','2025-11-18 02:50:20','2025-11-18 02:50:20',0,'2025-11-18 02:50:20','2025-11-18 02:50:20'),(23,1,'ef25bb576f3cf03f78c4c31215414cbbc79ce8396a387833914b725e13cd71f9','2025-11-18 06:26:05','2025-11-18 06:26:06',0,'2025-11-18 06:26:06','2025-11-18 06:26:06'),(27,4,'0b91c2438e1ea45f261e4a46de6f5dc40297ce8a9d3b65e078e7186ca1953b59','2025-11-21 04:27:39','2025-11-21 04:27:39',0,'2025-11-21 04:27:39','2025-11-21 04:27:39'),(28,4,'e2b866a944439a5c57e240271a2b2e22a8e5b20892aabb066995d14c69cd88e6','2025-11-21 04:27:48','2025-11-21 04:27:48',0,'2025-11-21 04:27:48','2025-11-21 04:27:48'),(29,4,'10315e94880a3990cb74eeb6820581e391c759377f1b6ba76192b674e06216df','2025-11-21 04:27:56','2025-11-21 04:27:56',0,'2025-11-21 04:27:56','2025-11-21 04:27:56'),(30,4,'7a758b1aae09cf9ae3e6642dd99b661223a23e194a5f40c97953a71bf5d17321','2025-11-21 04:28:07','2025-11-21 04:28:07',0,'2025-11-21 04:28:07','2025-11-21 04:28:07'),(31,4,'cae617a8240312e813ef3853167245882df1a7433740211af6f951be188ea830','2025-11-21 04:29:42','2025-11-21 04:29:42',0,'2025-11-21 04:29:42','2025-11-21 04:29:42'),(35,1,'6a2c5d62519ab04ec63fda4b38330e48e8a1ddf43393f3822a007ed18a7328f3','2025-11-21 04:47:04','2025-11-21 04:47:03',0,'2025-11-21 04:47:03','2025-11-21 04:47:03'),(36,5,'d07a4561ee52c77429d9dd81731bcd392f2eebfe3de9e6078bd030bba6646b50','2025-11-21 04:53:14','2025-11-21 04:53:13',0,'2025-11-21 04:53:13','2025-11-21 04:53:13'),(37,3,'11597e196d09b24c5c269e1424e36a10d8a5361e8b7a7faf6583fc330a95f5b0','2025-11-21 06:24:48','2025-11-21 05:24:48',0,'2025-11-21 05:24:48','2025-11-21 05:24:48'),(38,4,'11d27acd06c395c41eb843d5226e870ef5db8d49e5b9e4030cb2344ce1513d10','2025-11-21 06:30:54','2025-11-21 05:30:54',0,'2025-11-21 05:30:54','2025-11-21 05:30:54'),(40,3,'6be67c02e46fcde118af7842ff9b4c2ba04a352af93b5bd5b13f9cacad337f88','2025-11-21 06:40:51','2025-11-21 05:40:51',0,'2025-11-21 05:40:51','2025-11-21 05:40:51'),(44,1,'6d020e69625d045683afd0bd5a1187c78f712b6b2b1ec8badc4b94dc009c36fa','2025-11-21 06:41:35','2025-11-21 05:41:35',0,'2025-11-21 05:41:35','2025-11-21 05:41:35'),(45,1,'bec7dc11790cdefa9dfdb44443d560ea974f57f05bd2832de66de932f7876c29','2025-11-21 06:41:36','2025-11-21 05:41:36',0,'2025-11-21 05:41:36','2025-11-21 05:41:36'),(55,1,'b6c7640d2fc645dc807910529d02529421aec0f3b873921f21d440ff028587dc','2025-11-21 07:16:35','2025-11-21 06:16:35',0,'2025-11-21 06:16:35','2025-11-21 06:16:35'),(56,1,'c1b6fd1b7c767f4e002d6452e5837e849e59a175fb72aa986d9e658cc30b5750','2025-11-21 07:17:22','2025-11-21 06:17:22',0,'2025-11-21 06:17:22','2025-11-21 06:17:22'),(58,4,'293d7dd65f354a06d83019ff6617bc97836c1a0cba7e825adc2592cfeef863e0','2025-11-21 06:29:55','2025-11-21 06:28:55',0,'2025-11-21 06:28:55','2025-11-21 06:28:55'),(61,1,'a07960b05821cc4f310f78dd425a34905e392c399f00a86c4e3b3cbf2d2e005a','2025-11-21 07:35:45','2025-11-21 06:35:45',0,'2025-11-21 06:35:45','2025-11-21 06:35:45'),(62,1,'0536c8ffb0a892bf9c872c298329c6ceb7356d17d6091d3d5aba7b6d55f69c10','2025-11-21 07:42:02','2025-11-21 06:42:02',0,'2025-11-21 06:42:02','2025-11-21 06:42:02'),(63,3,'e319d1260b05d1398186562e6c0fd94c2d3dd031381604d2e078b4b355bafaf9','2025-11-21 06:48:08','2025-11-21 06:48:07',0,'2025-11-21 06:48:07','2025-11-21 06:48:07'),(65,1,'33775b3156e84b1a281bfbea7e59d061d9d786a104c8a92a3b8bc917765ba4d6','2025-11-21 07:56:41','2025-11-21 06:56:41',0,'2025-11-21 06:56:41','2025-11-21 06:56:41'),(66,1,'8b537e7a130e858be2a15600c29dfb7d86289abdc4ae1dc7a983b0c11bf8e8ea','2025-11-21 08:04:38','2025-11-21 07:04:38',0,'2025-11-21 07:04:38','2025-11-21 07:04:38'),(69,1,'d759ad168c98f10b067ecd3f55eecc70283c76a80af91fe5f91862b5c27d8ac5','2025-11-21 08:34:13','2025-11-21 07:34:13',0,'2025-11-21 07:34:13','2025-11-21 07:34:13'),(70,1,'118a00b45adad36cdf1aeecb2a72f575b13fed9e38683c377ba22e866aedaab8','2025-11-21 08:35:59','2025-11-21 07:35:59',0,'2025-11-21 07:35:59','2025-11-21 07:35:59'),(71,1,'1914dc4b2dcb578a5e1d6c667d76a3c7e1fdbb8b127d29ea009a3659b8e3d6ed','2025-11-21 08:42:39','2025-11-21 07:42:39',0,'2025-11-21 07:42:39','2025-11-21 07:42:39'),(73,1,'70ab2282a7c7a5ae8f00c226aa6abc051635d3eb42053eee3bb916be3e52bc51','2025-11-21 17:52:59','2025-11-21 16:52:59',0,'2025-11-21 16:52:59','2025-11-21 16:52:59'),(74,1,'17d44833a3e5baf26f56f3d424b69e41e595439343427e2e19aafbe54e64be96','2025-11-21 18:07:52','2025-11-21 17:07:52',0,'2025-11-21 17:07:52','2025-11-21 17:07:52'),(75,1,'280ac1064caa72a4a65ae364f6d77245c7175825728c5dd5f7700f22fd799ea4','2025-11-21 18:08:27','2025-11-21 17:08:27',0,'2025-11-21 17:08:27','2025-11-21 17:08:27'),(76,1,'facc3e6ed88187dfdfd9a94caa82462d9ce74444fe808ffe4091d3f2279ac7d8','2025-11-21 18:11:33','2025-11-21 17:11:33',0,'2025-11-21 17:11:33','2025-11-21 17:11:33'),(77,1,'b5a8b3aa395e066a69f99a74af857fb025109c935cf2d96938b5ee40d2ef144e','2025-11-21 18:15:08','2025-11-21 17:15:08',0,'2025-11-21 17:15:08','2025-11-21 17:15:08'),(78,1,'a41730c2bfdbf0b5f19014abae321619bb52db1d1388360f00a84ae418ef3f89','2025-11-21 18:15:59','2025-11-21 17:15:59',0,'2025-11-21 17:15:59','2025-11-21 17:15:59'),(79,1,'01cd86517a443ac581f425615f5aaec930c5892bcddd2eaea1b190753a5c4936','2025-11-21 18:16:52','2025-11-21 17:16:52',0,'2025-11-21 17:16:52','2025-11-21 17:16:52'),(80,1,'d88b2ba4ce1d5d1182f260c530bfa51fff60c75edcfd520084154155e573b618','2025-11-21 18:21:04','2025-11-21 17:21:04',0,'2025-11-21 17:21:04','2025-11-21 17:21:04'),(82,1,'77e845168bb0586b94e97765be33f7b30e92ff7803d5b0e15ffe105009a1b66f','2025-11-21 18:29:17','2025-11-21 17:29:17',0,'2025-11-21 17:29:17','2025-11-21 17:29:17'),(83,1,'5e0f4beea5dbc8202a361b753d5a31d4b0c81b678d40b0418d22728e3903aa7c','2025-11-21 18:34:50','2025-11-21 17:34:50',0,'2025-11-21 17:34:50','2025-11-21 17:34:50'),(84,1,'b577475f6d31975c1d7c4c4943944f5a96c7f2afca91415042e628706879d09b','2025-11-21 18:39:36','2025-11-21 17:39:36',0,'2025-11-21 17:39:36','2025-11-21 17:39:36'),(85,1,'8f277ceed5d3019ad648e6b726bb7028f733bb4b03e906ab58b974612e3ec071','2025-11-21 18:41:07','2025-11-21 17:41:07',0,'2025-11-21 17:41:07','2025-11-21 17:41:07'),(86,1,'b180ade78a03e7799c1eac84ceb55b8a2b8eb5d20c11705b94cc07d2dd01288f','2025-11-21 08:44:29','2025-11-21 08:44:29',0,'2025-11-21 08:44:29','2025-11-21 08:44:29'),(87,1,'d2a539349779a086a4ea091cb475eb9f8f674cd4b203133c52ea7bfd98d1d3bf','2025-11-21 08:44:33','2025-11-21 08:44:33',0,'2025-11-21 08:44:33','2025-11-21 08:44:33'),(88,1,'77431da7b181eab3015efcbda7a31ea6fb087805a4ace2dde8c900c43a5f919e','2025-11-21 08:44:34','2025-11-21 08:44:34',0,'2025-11-21 08:44:34','2025-11-21 08:44:34'),(89,1,'0b4c9fba0b67d469d1f9a8efe86524f029cfe9c9ce4a4ea211febc417ea26b8e','2025-11-21 08:44:36','2025-11-21 08:44:36',0,'2025-11-21 08:44:36','2025-11-21 08:44:36'),(90,1,'a1cc7e074e1c9829ca6a8b759bd35b27ce6362b15c10bd6693092de6d8466794','2025-11-21 18:45:00','2025-11-21 17:45:00',0,'2025-11-21 17:45:00','2025-11-21 17:45:00'),(91,1,'a7551edc3624ec6f0fbd3e6df7f578254158a5324ae2ed5ec4edce34eed8f37b','2025-11-21 08:46:56','2025-11-21 08:46:56',0,'2025-11-21 08:46:56','2025-11-21 08:46:56'),(92,1,'e5f52ac6f6762b745f3b7c89e540f99932a03ea6dea4cd01b791116922ae961c','2025-11-21 08:46:59','2025-11-21 08:46:59',0,'2025-11-21 08:46:59','2025-11-21 08:46:59'),(93,1,'63c0f9e39a3cff43654b0d6385f30e6071a82f756243ebf761020c63685a15b6','2025-11-21 08:47:17','2025-11-21 08:47:17',0,'2025-11-21 08:47:17','2025-11-21 08:47:17'),(94,1,'b5150d56dd0816792a518358cb9bbc5b385532c7d4b788ca11f0b13c5fc58a96','2025-11-21 08:47:18','2025-11-21 08:47:18',0,'2025-11-21 08:47:18','2025-11-21 08:47:18'),(95,1,'c923a795a6417764ece8339598f6bc2025f9ea9958a144f379a927af7700dd3a','2025-11-21 08:47:19','2025-11-21 08:47:19',0,'2025-11-21 08:47:19','2025-11-21 08:47:19'),(96,1,'916032a452d38842f3128c31b3b344ab446764c1aaf3ed447a527f480452d85a','2025-11-21 08:47:19','2025-11-21 08:47:19',0,'2025-11-21 08:47:19','2025-11-21 08:47:19'),(97,1,'9cd3b879f1b27cdf79e6027e39606b8099f1f12ed14acedea6511f414481b0e9','2025-11-21 08:47:20','2025-11-21 08:47:20',0,'2025-11-21 08:47:20','2025-11-21 08:47:20'),(98,1,'11df588fcadded75b80fa1cb32b6cd67953fbf412ed01d4f1678aca3cc62a487','2025-11-21 08:47:20','2025-11-21 08:47:20',0,'2025-11-21 08:47:20','2025-11-21 08:47:20'),(99,1,'5d1e825f7a890f4da8ae46db735a6fd26e270823c024247744065dca0dca5bc2','2025-11-21 18:47:34','2025-11-21 17:47:34',0,'2025-11-21 17:47:34','2025-11-21 17:47:34'),(101,1,'d10748af88a994e968d6aaba5b38e91082a04cac8a5a3047b5c4387411cd48fd','2025-11-21 08:48:14','2025-11-21 08:48:14',0,'2025-11-21 08:48:14','2025-11-21 08:48:14'),(102,1,'958cc4b2067c30bd9eb53dc16b10bb89c98f98e64e5275283559517f3935f335','2025-11-21 18:49:22','2025-11-21 17:49:22',0,'2025-11-21 17:49:22','2025-11-21 17:49:22'),(105,1,'dfa9a9b7f0a16b2f0f84180e95837dd8a82ca97a0ef296578eea738abdcfe90f','2025-11-24 11:40:47','2025-11-24 10:40:47',0,'2025-11-24 10:40:47','2025-11-24 10:40:47'),(106,1,'4b3211ef61d51e3bddd1632fb44e805ca115af66bb2ba107597266413e78eef5','2025-12-01 11:32:27','2025-12-01 10:32:27',0,'2025-12-01 10:32:27','2025-12-01 10:32:27'),(107,1,'c38497c35686a894811942cc8402676542e68383ca3ff916b7188b37961f64fb','2025-12-01 11:58:03','2025-12-01 10:58:03',0,'2025-12-01 10:58:03','2025-12-01 10:58:03'),(108,1,'f003b26bb100231a50063131c2f41eb5037dc23f002f1bef7d149d4624520a5f','2025-12-01 11:59:04','2025-12-01 10:59:04',0,'2025-12-01 10:59:04','2025-12-01 10:59:04'),(109,1,'1120288816aacca4cfe4c2c29fb0604008537cc10e9464be4e35bc2fd3b3769d','2025-12-01 12:01:43','2025-12-01 11:01:43',0,'2025-12-01 11:01:43','2025-12-01 11:01:43'),(110,1,'f155164f794d408f7a6f45929f47dfd2b44fa730574ce64a09fda8f9848ab724','2025-12-01 12:03:28','2025-12-01 11:03:28',0,'2025-12-01 11:03:28','2025-12-01 11:03:28'),(111,1,'fe3a7e752d61b4af4490bfef26c43643024931c3df71e0fcb4984049b2586fa3','2025-12-01 12:06:36','2025-12-01 11:06:36',0,'2025-12-01 11:06:36','2025-12-01 11:06:36'),(112,1,'1acfe8e33566f49fb8b3feb67651ee64f9a1afb0f8acc79ef2cfe8caedfe6edf','2025-12-01 12:10:20','2025-12-01 11:10:20',0,'2025-12-01 11:10:20','2025-12-01 11:10:20'),(113,1,'a785667a977f15cb66b3fdb95e451074a30b2ba2811b3bd1bd053609dd1f4d50','2025-12-01 12:15:34','2025-12-01 11:15:34',0,'2025-12-01 11:15:34','2025-12-01 11:15:34'),(114,1,'dec4a8433022bdcbbe043a49daf9ce09e20bc8911eb3b6452a41970562befb84','2025-12-01 12:19:32','2025-12-01 11:19:32',0,'2025-12-01 11:19:32','2025-12-01 11:19:32'),(115,1,'75be805276271006f0492eabd7b592d1d963aefb74e433efba7d1e75c7ca6daf','2025-12-01 12:23:26','2025-12-01 11:23:26',0,'2025-12-01 11:23:26','2025-12-01 11:23:26'),(116,1,'67ddfa21364956693fdc5ea961a1465d98774188cd19cee477034684f6aee3b5','2025-12-01 12:26:23','2025-12-01 11:26:23',0,'2025-12-01 11:26:23','2025-12-01 11:26:23'),(117,1,'7d04fed1fcc957725768243d19751b7b01e6f27d50d0eab19588c6a728406617','2025-12-01 12:30:09','2025-12-01 11:30:09',0,'2025-12-01 11:30:09','2025-12-01 11:30:09'),(118,1,'799b2c718ac9faf5935c2f6d32cf167f13f0be814d774d90866bb365605a6cb6','2025-12-01 12:32:33','2025-12-01 11:32:33',0,'2025-12-01 11:32:33','2025-12-01 11:32:33'),(119,1,'baee5fe8906023b712b3edd5efeab498e31db7bb83558d63c3c6bc1111e40dcb','2025-12-01 12:38:33','2025-12-01 11:38:33',0,'2025-12-01 11:38:33','2025-12-01 11:38:33'),(120,1,'5bba29bada9629cbe43624b6b2a29da58a5713e2c77953a84d340652ebed2e57','2025-12-01 12:42:13','2025-12-01 11:42:13',0,'2025-12-01 11:42:13','2025-12-01 11:42:13'),(121,1,'7d4a48451c3c6e99f9498a643bd5de33362142eda8bd43f4e67e0ae9eaab1301','2025-12-01 14:11:09','2025-12-01 13:11:09',0,'2025-12-01 13:11:09','2025-12-01 13:11:09'),(122,1,'1f30a3215d7fe3a2d36eb120297100a56d1e0f70865d716ea5fee39e13f36d94','2025-12-01 14:15:35','2025-12-01 13:15:35',0,'2025-12-01 13:15:35','2025-12-01 13:15:35'),(126,1,'460c33f6d8d3d6045c36f1dcd7fdfd392f83d2200ed0bd83ae781e423a6b6cc0','2025-12-01 14:31:24','2025-12-01 13:31:24',0,'2025-12-01 13:31:24','2025-12-01 13:31:24'),(128,2,'2ceb349d80a2cef518aee0052442c0333c03f1782704ebc31426a2eb745e12ce','2025-12-03 01:42:27','2025-12-03 00:42:27',0,'2025-12-03 00:42:27','2025-12-03 00:42:27'),(129,1,'2fc0f0573c2cfd09497d71c8a171077f2c1b15c5547681de6efce96a9d4ae77c','2025-12-03 11:15:47','2025-12-03 10:15:47',0,'2025-12-03 10:15:47','2025-12-03 10:15:47'),(130,1,'3f32c93c4e9a354d5a2fb648ed066721852c851b24357a1cf5129ccdefde3c29','2025-12-03 11:23:18','2025-12-03 10:23:18',0,'2025-12-03 10:23:18','2025-12-03 10:23:18'),(131,1,'9085d2015696dd1798d1387a29e5c2ec10dab31c0ed129e8f4f5a018805fe602','2025-12-03 11:31:28','2025-12-03 10:31:28',0,'2025-12-03 10:31:28','2025-12-03 10:31:28'),(132,1,'5ed1bb48f2407e074df9ba4d68b3664206a5c3607d79edaf80d2fdfcd3887d17','2025-12-03 11:34:25','2025-12-03 10:34:25',0,'2025-12-03 10:34:25','2025-12-03 10:34:25'),(133,1,'f526cbebee68e5df5fa5d285bcf7b00ea12fad59920bdfdace09b8e8d374a7b7','2025-12-03 11:42:46','2025-12-03 10:42:46',0,'2025-12-03 10:42:46','2025-12-03 10:42:46'),(134,1,'b29cc2d10f405723dc39b5b763ba61cedcbd26c5ec23d9a5419f0b420acc463f','2025-12-03 11:48:34','2025-12-03 10:48:34',0,'2025-12-03 10:48:34','2025-12-03 10:48:34'),(135,1,'764a03902b366d11ca3e7e245a6c0df15d03ad91e6bf1b1954c86448c0973151','2025-12-03 11:51:30','2025-12-03 10:51:30',0,'2025-12-03 10:51:30','2025-12-03 10:51:30');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'iida','test@example.com',0,NULL,'$2y$12$iRnUULFuxvh/Oh5dzPDOkej72Z8kJRWb.lN68RaibxGyHaayOQI.2',NULL,'2025-10-30 05:22:24','2025-11-21 06:16:27',1,NULL,1,0,NULL),(2,'lovesan','test2@example.com',1,NULL,'$2y$12$BKZL07RQoxKoFVO6L0KYyuDX9pV4SsiXHHKAypiHWxNsl8yHSPX2O',NULL,'2025-11-06 08:23:56','2025-11-17 06:17:58',1,'1',1,0,NULL),(3,'haruka','test3@example.com',0,NULL,'$2y$12$MFc9XBIGpOGA/.mTasvnTu.2y.mWcD/gtMAQH3gMZwfMIQB2twEhS',NULL,'2025-11-07 05:53:21','2025-11-07 05:57:06',1,'1',0,0,NULL),(4,'user4','test4@example.com',0,NULL,'$2y$12$1hFRjpnwlpDsYFzSzs0NhuBACeAyhQr/z6sVuoTipo8l12yy4VwNq',NULL,'2025-11-21 02:01:59','2025-11-21 02:01:59',0,'1',0,0,NULL),(5,'user5','test5@example.com',0,NULL,'$2y$12$Yankpda6FyJUJciTM1R9B.iGWLT8LE2zjxYpqn0lqr6kObxcsZeuu',NULL,'2025-11-21 04:52:50','2025-11-21 04:52:50',0,'1',0,0,NULL);
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

-- Dump completed on 2025-12-03 10:52:36
