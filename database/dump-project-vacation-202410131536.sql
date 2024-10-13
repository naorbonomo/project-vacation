-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: database-1.chmew2kikv5i.us-east-1.rds.amazonaws.com    Database: project-vacation
-- ------------------------------------------------------
-- Server version	8.0.35

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `followers`
--

DROP TABLE IF EXISTS `followers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `followers` (
  `user_id` int NOT NULL,
  `vacation_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`vacation_id`),
  KEY `vacation_id` (`vacation_id`),
  CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`vacation_id`) REFERENCES `vacations` (`vacation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `followers`
--

LOCK TABLES `followers` WRITE;
/*!40000 ALTER TABLE `followers` DISABLE KEYS */;
INSERT INTO `followers` VALUES (6,21),(18,21),(6,22),(15,22),(6,23),(15,23),(18,23),(39,23),(6,24),(15,24),(17,24),(18,24),(39,24),(39,28),(17,29),(6,30),(18,30),(6,31),(18,31),(15,33),(39,33),(18,35),(39,35),(39,37),(18,41),(39,44),(39,47);
/*!40000 ALTER TABLE `followers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Regular User','Admin') NOT NULL DEFAULT 'Regular User',
  `token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `users_chk_1` CHECK ((char_length(`password`) >= 4))
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'John','Doe','john@example.com','password123','Regular User',NULL),(2,'Jane','Smith','jane@example.com','password456','Regular User',NULL),(3,'Admin','User','admin@example.com','adminpass','Admin',NULL),(4,'Naor','Bonomo','NaorBonomo@gmail.com','$2b$10$2BSYnC6.J0yaaeg1HS2PUe9TgFvjmfvg2bKIYDrfw6ZDXyalQIhF2','Admin',NULL),(6,'נאור','בונומו','NaorBonomo2@gmail.com','$2b$10$J1KR2QDXyhcxqSolCE42zOX4vgHcrp/NoFULYkfcNv6OhI3DK8g92','Regular User',NULL),(15,'Naor3','Bonomo3','NaorBonomo3@gmail.com','$2b$10$R4o2V17N2UJELzyYBkdueeO1BaSwF6W1P502VTNZ7q3.hfy4zzt.a','Regular User',NULL),(16,'Naor','Bonomo','naorbonomo4@gmail.com','$2b$10$PrDdcehVAT0AITI7gdL5XODCvc6m5BCnK5iq/oaZWi4984Acerh9i','Regular User',NULL),(17,'Naor7','Bonomo7','NaorBonomo7@gmail.com','$2b$10$25eOMAgt4QIE7u77vvrMhuG9UzhJsfX5nt616saLA2G./hxevr19u','Regular User',NULL),(18,'Aviram','Yagena','aviramyagena@gmail.com','$2b$10$oP33.3K5le6ocZRpqcnnv.RPYAOKDUBmb6tgbNbjTpsuIrK9LKsjO','Regular User',NULL),(34,'Naor','Bonomo','naorbonomo9@gmail.com','$2b$10$00qf/KFP1mjIzChgirZM0uK7SlRVbhhQ/4fdeYISycZXl6f8QHyP6','Regular User',NULL),(39,'shimi','mimi','mimi@shimi.com','$2b$10$47uRNC6NZxJ0/dyF6ZoxW.KehGKuG95WBI4T60LdBHo.mJLCnJJRK','Regular User',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacations`
--

DROP TABLE IF EXISTS `vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacations` (
  `vacation_id` int NOT NULL AUTO_INCREMENT,
  `destination` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_filename` varchar(255) NOT NULL,
  PRIMARY KEY (`vacation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacations`
--

LOCK TABLES `vacations` WRITE;
/*!40000 ALTER TABLE `vacations` DISABLE KEYS */;
INSERT INTO `vacations` VALUES (21,'rome','A city steeped in history, featuring ancient ruins like the Colosseum, stunning art, and delicious Italian cuisine.','2024-10-16','2024-10-23',8000.00,'https://project-vacation.s3.amazonaws.com/images/40c2582c-af4d-496b-868c-5596c7006432.jpeg'),(22,'New York','The city that never sleeps, offering iconic landmarks like Times Square, Central Park, and a dynamic cultural scene.','2024-11-06','2024-11-09',213.00,'https://project-vacation.s3.amazonaws.com/images/beca264a-0ba3-446e-9a2b-f2945a7a604d.jpeg'),(23,'Tokyo','A bustling metropolis where tradition meets innovation, offering neon-lit streets, historic temples, and incredible cuisine.','2024-10-16','2024-10-20',1.00,'https://project-vacation.s3.amazonaws.com/images/05521320-cdf7-4b4c-aed9-fb02c2ac215a.webp'),(24,'Paris','The City of Light, famous for its romantic ambiance, historic landmarks like the Eiffel Tower, and rich culinary delights.','2024-10-10','2024-10-17',11.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/c578b48c-2ab6-4ac9-8150-5e6a9c98ebec.jpeg'),(28,'LA','The entertainment capital of the world, offering sunny beaches, Hollywood glamour, and diverse cultural experiences.','2024-10-10','2024-10-31',900.00,'https://project-vacation.s3.amazonaws.com/images/1f9eb9c8-2fcd-4853-ba2c-c87502626457.jpeg'),(29,'Rio de Janeiro','Known for its stunning beaches, the iconic Christ the Redeemer statue, and the lively energy of Carnival.','2024-10-17','2024-10-23',2.00,'https://project-vacation.s3.amazonaws.com/images/f85c05f4-6c6a-4945-ba7e-0df8aa88923c.jpeg'),(30,'miami','A tropical paradise known for its white sandy beaches, vibrant nightlife, and the colorful art deco architecture of South Beach.','2024-10-16','2024-10-30',5432.00,'https://project-vacation.s3.amazonaws.com/images/8928dd2c-2adf-4283-82a2-5d02b1621c2e.jpeg'),(31,'Orlando','Home to world-famous theme parks like Disney World and Universal Studios, perfect for family fun and adventure.','2024-10-17','2024-10-30',222.00,'https://project-vacation.s3.amazonaws.com/images/9faa2879-3713-48c7-949e-65fdda410b61.jpeg'),(33,'Athens','The cradle of Western civilization, known for its ancient landmarks like the Acropolis and Parthenon, vibrant street life, and rich Greek heritage.','2024-10-10','2024-10-31',315.00,'https://project-vacation.s3.amazonaws.com/images/870c2f4e-9779-48c6-a55d-46f624458e61.webp'),(34,'Barcelona','A vibrant city on the Mediterranean coast, known for its stunning architecture, including Gaudí\'s masterpieces, and lively beach culture.','2024-10-18','2024-10-31',123.00,'https://project-vacation.s3.amazonaws.com/images/bf6fef67-515b-44a7-873b-467724bbdbac.jpeg'),(35,'Dubai','A city of superlatives, offering luxury shopping, futuristic skyscrapers, and desert adventures.','2024-10-16','2024-11-09',4124.00,'https://project-vacation.s3.amazonaws.com/images/5b2d352d-903a-46cd-9122-92aeeba59d94.jpeg'),(36,'Sydney','Australia\'s coastal gem, known for its iconic Opera House, beautiful beaches, and outdoor lifestyle.','2024-10-18','2024-10-31',1241.00,'https://project-vacation.s3.amazonaws.com/images/d3d813b5-142b-416c-b72f-e198ef491fc3.webp'),(37,'Bangkok','Thailand\'s bustling capital, offering vibrant street markets, ornate temples, and a rich culinary scene.','2025-01-01','2025-02-08',4753.00,'https://project-vacation.s3.amazonaws.com/images/ca533d68-02a4-42a5-b12f-fb1720bd7073.jpeg'),(38,'Cancun','A tropical haven on Mexico\'s Caribbean coast, famous for its turquoise waters, lively resorts, and ancient Mayan ruins.','2025-03-12','2025-07-24',7346.00,'https://project-vacation.s3.amazonaws.com/images/790f5f4e-b2e5-4893-a6f1-f737aec91de1.jpeg'),(39,'Istanbul','A city where East meets West, known for its historic mosques, bustling bazaars, and stunning views of the Bosphorus.','2024-10-17','2024-11-09',846.00,'https://project-vacation.s3.amazonaws.com/images/99248886-f7b0-4958-ab65-60e8c659fb33.jpeg'),(40,'Bali','An Indonesian paradise offering lush landscapes, serene beaches, and a spiritual vibe with its many temples.','2024-10-19','2024-11-07',412.00,'https://project-vacation.s3.amazonaws.com/images/28a5aa3e-5ca4-4f6c-ac52-587353cd77b9.webp'),(41,'Lisbon','Portugal\'s charming capital, known for its colorful tiles, historic tramways, and sweeping views of the Atlantic Ocean.','2024-11-07','2024-11-09',3456.00,'https://project-vacation.s3.amazonaws.com/images/6d8101b1-1a5c-4d37-a797-fe1589e7324e.jpeg'),(42,'Prague','A fairy-tale city in Central Europe, famous for its medieval architecture, charming cobblestone streets, and vibrant cultural scene.','2024-11-01','2024-11-04',74.00,'https://project-vacation.s3.amazonaws.com/images/ac7ddcbc-d218-4fc9-95fd-7afac57e0f17.jpeg'),(43,'Santorini','A picturesque Greek island known for its white-washed buildings, stunning sunsets, and crystal-clear waters.','2024-11-05','2024-11-21',327.00,'https://project-vacation.s3.amazonaws.com/images/df602e00-4afb-405f-a1fe-75aae950dd60.jpeg'),(44,'Eilat','A sunny resort city on the Red Sea in southern Israel, known for its crystal-clear waters, vibrant coral reefs, and stunning desert landscapes. Eilat offers a perfect mix of relaxation and adventure, with activities like snorkeling, diving, and hiking in the nearby mountains.','2024-10-14','2024-10-31',2.00,'https://project-vacation.s3.amazonaws.com/images/bf6920b9-8f80-45fc-9bdf-61b51893d1be.jpeg'),(45,'Ibiza','party 24/7','2024-10-23','2024-11-09',9009.00,'https://project-vacation.s3.amazonaws.com/images/14ce32a5-41f2-440a-9687-8d1264a75a71.jpeg'),(47,'Jerusalem','A city steeped in history and spirituality, sacred to Judaism, Christianity, and Islam. With its ancient walls, sacred sites like the Western Wall and Dome of the Rock, and vibrant markets, Jerusalem is a unique blend of the past and the present.','2024-10-07','2024-11-01',1999.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/22554d83-fbff-4947-bbe0-a2c3b4cbbb21.jpeg');
/*!40000 ALTER TABLE `vacations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'project-vacation'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-13 15:36:32
