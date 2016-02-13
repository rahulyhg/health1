<?php
	
	//this class doesnt know if the user is an actual user in accounts
	//Token is good for 1h, so 3600seconds. Time is measured in second time()
	//this vs self, self refer to current class, this refer to current object
	class accessToken{

		//will call when
		public static function newToken($userid){
			
			
			$accesstoken = bin2hex(openssl_random_pseudo_bytes(16));
			$date= time();
			
			
			try{
			  $db = self::getDB();
			  $query = "INSERT INTO access (userid, accessToken, time) VALUE ('$userid', '$accesstoken', '$date') 
			  			ON DUPLICATE KEY UPDATE accessToken = '$accesstoken', time = '$date'";
			  
			  $result = $db->query($query);
			  
			}catch(PDOEXCEPTION $e){
				
			}
			
			return $accesstoken;
			
		}
			
	
		
		//return false if token expired or invalid
		public static function validate($userid, $accesstoken){
			
			try{
				
				$db = self::getDB();
				
				$query = "SELECT * FROM access WHERE userid = '$userid'";
					
				$result = $db->query($query);
				$result->setFetchMode(PDO::FETCH_ASSOC);
				
				$result = $result->fetch();
			
				
				$real_accesstoken =  $result["accesstoken"];
				$db_userID = $result["userid"];
				$time = $result["time"];
				
			
				$now = time();
				
				if ($time+3600 > $now){ //the token in database still within time limit, valid
							

					
				  if ($accesstoken === $real_accesstoken){
					  return true;	
					  
				  }
				}
				return false;
				
				
			}catch(PDOEXCEPTION $e){
				echo "wrong access token";
				
			}
			
			
			
		}
		

		private function getDB(){
		  $hostname = "localhost";
		  $databaseName = "health";
		  $loginName = "root";
		  $password = "";
		  
		  $connection = new PDO("mysql:host=$hostname;dbname=$databaseName", $loginName, $password);
		  $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		  return $connection;	
			
		}
		
	}
//
//echo "hello";
//$obj = new accessToken("10153763977581655");
//		$date = date('Y-m-d H:i:s');
//echo accessToken::validate("838656b418fa7d2a10.90681499", "ac41ae464873e17b685981069685797e");

//echo "world";

?>