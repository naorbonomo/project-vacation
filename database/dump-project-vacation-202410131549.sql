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
INSERT INTO `vacations` VALUES (21,'rome','A city steeped in history, featuring ancient ruins like the Colosseum, stunning art, and delicious Italian cuisine.','2024-10-16','2024-10-23',8000.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/e186c0d4-5ca0-4e08-9ff2-a1d069e4bb66.jpeg'),(22,'New York','The city that never sleeps, offering iconic landmarks like Times Square, Central Park, and a dynamic cultural scene.','2024-11-06','2024-11-09',213.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/b39c3889-03b4-4aed-b5e6-c629bc574e05.jpeg'),(23,'Tokyo','A bustling metropolis where tradition meets innovation, offering neon-lit streets, historic temples, and incredible cuisine.','2024-10-16','2024-10-20',1.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/9a10df2a-242c-47ae-bdd2-3edb14bc9103.webp'),(24,'Paris','The City of Light, famous for its romantic ambiance, historic landmarks like the Eiffel Tower, and rich culinary delights.','2024-10-10','2024-10-17',11.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/c578b48c-2ab6-4ac9-8150-5e6a9c98ebec.jpeg'),(28,'LA','The entertainment capital of the world, offering sunny beaches, Hollywood glamour, and diverse cultural experiences.','2024-10-10','2024-10-31',900.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/0ed97af0-9157-404f-a37a-b984256e1cbd.jpeg'),(29,'Rio de Janeiro','Known for its stunning beaches, the iconic Christ the Redeemer statue, and the lively energy of Carnival.','2024-10-17','2024-10-23',2.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/3668cde6-c0ed-4e55-939b-9af9115b240f.jpeg'),(30,'miami','A tropical paradise known for its white sandy beaches, vibrant nightlife, and the colorful art deco architecture of South Beach.','2024-10-16','2024-10-30',5432.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/4bbc3bbb-7293-411b-a903-df4186065c42.jpeg'),(31,'Orlando','Home to world-famous theme parks like Disney World and Universal Studios, perfect for family fun and adventure.','2024-10-17','2024-10-30',222.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/b3494a83-2a17-46a7-934a-730050cc0d39.jpeg'),(33,'Athens','The cradle of Western civilization, known for its ancient landmarks like the Acropolis and Parthenon, vibrant street life, and rich Greek heritage.','2024-10-10','2024-10-31',315.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/0cb0de49-4693-4c8b-82a0-5c097b68ef97.webp'),(34,'Barcelona','A vibrant city on the Mediterranean coast, known for its stunning architecture, including Gaudí\'s masterpieces, and lively beach culture.','2024-10-18','2024-10-31',123.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/800de272-1484-4a2a-b1d1-9c160f164af7.jpeg'),(35,'Dubai','A city of superlatives, offering luxury shopping, futuristic skyscrapers, and desert adventures.','2024-10-16','2024-11-09',4124.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/ca6bec93-bdce-42d5-a798-9f5a56e01463.jpeg'),(36,'Sydney','Australia\'s coastal gem, known for its iconic Opera House, beautiful beaches, and outdoor lifestyle.','2024-10-18','2024-10-31',1241.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/7778556a-4423-463c-a698-62691f1a1bc3.webp'),(37,'Bangkok','Thailand\'s bustling capital, offering vibrant street markets, ornate temples, and a rich culinary scene.','2025-01-01','2025-02-08',4753.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/fea94940-4674-4b63-9307-b7032e0da180.jpeg'),(38,'Cancun','A tropical haven on Mexico\'s Caribbean coast, famous for its turquoise waters, lively resorts, and ancient Mayan ruins.','2025-03-12','2025-07-24',7346.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/43ecd696-11b8-4c5d-9df8-9b859bc3eec2.jpeg'),(39,'Istanbul','A city where East meets West, known for its historic mosques, bustling bazaars, and stunning views of the Bosphorus.','2024-10-17','2024-11-09',846.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/4840bce5-7dcb-4842-a22a-a8c389a5471d.jpeg'),(40,'Bali','An Indonesian paradise offering lush landscapes, serene beaches, and a spiritual vibe with its many temples.','2024-10-19','2024-11-07',412.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/e31aaacd-1310-4ddc-9443-3d4f6a3f7256.webp'),(41,'Lisbon','Portugal\'s charming capital, known for its colorful tiles, historic tramways, and sweeping views of the Atlantic Ocean.','2024-11-07','2024-11-09',3456.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/427c4ecd-f291-4d3a-8fb3-7c6fe078bd39.jpeg'),(42,'Prague','A fairy-tale city in Central Europe, famous for its medieval architecture, charming cobblestone streets, and vibrant cultural scene.','2024-11-01','2024-11-04',74.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/8eb660b1-44f3-451c-8d3e-3e93fc8409b1.jpeg'),(43,'Santorini','A picturesque Greek island known for its white-washed buildings, stunning sunsets, and crystal-clear waters.','2024-11-05','2024-11-21',327.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/832f570c-8d87-48e6-b049-620f11f503c9.jpeg'),(44,'Eilat','A sunny resort city on the Red Sea in southern Israel, known for its crystal-clear waters, vibrant coral reefs, and stunning desert landscapes. Eilat offers a perfect mix of relaxation and adventure, with activities like snorkeling, diving, and hiking in the nearby mountains.','2024-10-14','2024-10-31',2.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/5da77b8d-e629-4c77-bbf4-e268c16e4f20.jpeg'),(45,'Ibiza','party 24/7','2024-10-23','2024-11-09',9009.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/7d164c96-168f-48df-b207-a66cc361678a.jpeg'),(47,'Jerusalem','A city steeped in history and spirituality, sacred to Judaism, Christianity, and Islam. With its ancient walls, sacred sites like the Western Wall and Dome of the Rock, and vibrant markets, Jerusalem is a unique blend of the past and the present.','2024-10-07','2024-11-01',1999.00,'https://s3.amazonaws.com/www.naorbonomo.com/images/22554d83-fbff-4947-bbe0-a2c3b4cbbb21.jpeg');
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

-- Dump completed on 2024-10-13 15:49:29
