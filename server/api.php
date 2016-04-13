<?php
require '../vendor/autoload.php'; //same as include but if cant find file will not run scipt
//require '../vendor/slim/slim/Slim/Slim.php';
require '/accessToken.php';

$app = new \Slim\Slim();

//all the route
$app->get('/account/:userid', 'getUserAccount');
$app->post('/account', 'createNewAccount'); //Will create and return a new token and userid for the User, in the form of JSON_encode($array)
$app->delete('/account/:userid', 'deleteAccount'); //delete account by user id
$app->post('/account/facebookuser', "createFacebookAccount"); //create an account base on facebook login if he doesnt have account with us. Will also assign an accesstoken
//$app->delete('/account/facebookuser/:userid, "deleteFacebookAccount");

$app->post('/user/session', 'giveToken'); //authenticates credentials against database, gives token to client
//$app->post('/user/facebook/session', 'giveFbToken'); // same as above but for fb user

$app->get('/user/session', 'valifyToken'); //currently give back username if token/userid is valid. in Json format
$app->delete('/user/session', 'deleteToken'); //bascially logging out, delete the token for the user

//verify: each time a page is loaded, client send token and userid to server to verify. IF they have a userid set in the sessionStorage, if not skip
//			it work the same for fb user. If token is valid, give them to logged in page. Change the login/register to username, and other info

$app->group('/habit', function()use($app){
		$app->get('/user', 'getHabits');
		$app->post('/user', 'createHabit');
		$app->delete('/:habitid', 'delHabit');
		$app->put('/days/:habitid', 'completedDays');	//idempotent, even if they keep calling the same way the database stay the same. as oppose to post
	//	$app->delete('/days/:habitid', 'deleteDays');

});

$app->run();


//facebook
//require 'facebookini.php';
//facebook stuff
function completedDays($habitid){
	$app =\Slim\Slim::getInstance();
	$completed = $app->request->params('completed');
	//should also try, userid and token
	//then check if the habitid belong to that user before updating
	$completed = json_decode($completed);

	try{
		$db = getDB();
		$result = $db->prepare("INSERT IGNORE INTO habit_dates (habitid, completed_Days) VALUES (:id, :day)");
		foreach($completed as $day){
			$result->bindValue('id', $habitid, PDO::PARAM_STR);
			$result->bindValue('day', $day, PDO::PARAM_STR);
			$result->execute();
		}

	}catch(PDOException $e){
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
	echo "it is done";
}



function delHabit($habitid){
	$app = \Slim\Slim::getInstance();
//should also try, userid and token
//then check if the habitid belong to that user before deleting
		try{
		$db = getDB();
		$query = "Delete FROM habit
					WHERE habitid = '$habitid'";

		$result = $db->query($query);
		}catch(PDOException $e){
			echo '{"error":{"text":'. $e->getMessage() .'}}';
		}
		echo "it is done";
}

function createHabit(){
	$app = \Slim\Slim::getInstance();
	$userid = $app->request->params('userid');
	//$token = $app->request->params('token');
	$description = $app->request->params('description');
	$frequency = $app->request->params('frequency');
	$startDay = $app->request->params('startDay');
	$days = $app->request->params('days'); // a string consist of 1-7. each digits represent a day in the week, no order

	//valid the user, make sure token not expire and legit
	// $result = accessToken::validate($userid, $accessToken);
	// if (!$result){//the token is not valid
	// 	echo json_encode(array("error" => "invalid"));
	// 	exit;
	// }
	$db = getDB();
	$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false); //since we are using prepare here
	try {
		$result = $db->prepare("INSERT INTO Habit(habitid, userid, description, startDate, frequency, day)
		VALUES (:habitid, :userid, :description, :startDate, :frequency, :day)");

		$result->execute(array(
			"habitid" => NULL,
			"userid" => $userid,
			"description" => $description,
			"startDate" => $startDay,
			"frequency" => $frequency,
			"day" => $days
		));


		$habitid = $db->lastInsertId();
		//$completed = $app->request->params('completed');





	}



	catch(Exception $e) {
		echo 'Exception -> ';
		var_dump($e->getMessage());
	}
}


function getHabits(){

	$app = \Slim\Slim::getInstance();
	$userid = $app->request->params('userid');
	//$query = "Select * From habit where userid = '$userid'";
	//should verify token too
	$db = getDB();

	$result = $db->prepare("Select * From habit where userid = ?");
	$result->execute(array($userid));
	$result->setFetchmode(PDO::FETCH_ASSOC);



	echo json_encode($result->fetchAll());
}

function deleteToken(){
	$app = \Slim\Slim::getInstance();
	$userid = $app->request->params('userid');
	try{
		$db = getDB();
		//$query = "DELETE access FROM access WHERE userid = '$userid'";
		//$db->query($query);
		$result = $db->prepare("DELETE access FROM access WHERE userid = ?");
		$result->execute(array($userid));


	}catch(PDOEXCEPTION $e){
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function valifyToken(){
	$app = \Slim\Slim::getInstance();
	$userid = $app->request->params('userid');
	$accessToken = $app->request->params('accessToken');

	//valid the user, make sure token not expire and legit
	$result = accessToken::validate($userid, $accessToken);
	if (!$result){//the token is not valid
		echo json_encode(array("error" => "invalid"));
		exit;
	}


	try{
		$db = getDB();
		$query = "SELECT username FROM accounts WHERE userid = '$userid'";
		$result = $db->query($query);
		$result->setFetchMode(PDO::FETCH_ASSOC);

		echo json_encode($result->fetch());


	}catch(PDOEXCEPTION $e){
		echo '{"error":{"text":'. $e->getMessage() .'}}';

	}






}

function giveToken(){
	$app = \Slim\Slim::getInstance();

	$result = json_decode($app->request->getBody(), true);
	$name= $result["username"];
	$password = $result["password"];

	//check legit
	$db = getDB();
	$query = "SELECT userid, salt, password FROM accounts WHERE username = '$name'";

	try{
		$result = $db->query($query);
		$result->setFetchMode(PDO::FETCH_ASSOC);
		$result = $result->fetch();

		if (!empty($result)){

			$userid = $result["userid"];
			$salt = $result["salt"];
			$hashed_pw = $result["password"];

			$password = crypt($password, $salt);

			if ($password === $hashed_pw){
				//legit
				//this create a new token, if there is already a token in db, it will be replaced.
				//should happen because when user log out token should be destroyed from db
				$token = accessToken::newToken($userid);
				$array = array("userid" => $userid, "token" => $token);

				echo json_encode($array);

			}else{
				//wrong password
				echo "hello";
			}

		}else{
			//no such username
			echo "hellosss";

		}


		return json_encode( array("error"=> "wrong password or username doesnt exist") );

	}catch (PDOEXCEPTION $e){
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}

}


function createFacebookAccount(){

	$app = \Slim\Slim::getInstance();
	$db = getDB();


	$userid = $app->request->params('userid');
	$token = $app->request->params('accessToken');



	$fb = new Facebook\Facebook([
	  'app_id' => '845375052240600',
	  'app_secret' => 'df60e0d8daf0e093daf655c07fa44185',
	  'default_graph_version' => 'v2.5',
	]);


	$fb->setDefaultAccessToken($token);

	try {
	  $response = $fb->get('/me');
	  $userNode = $response->getGraphUser();
	} catch(Facebook\Exceptions\FacebookResponseException $e) {
	  // When Graph returns an error
	  echo 'Graph returned an error: ' . $e->getMessage();
	  exit;
	} catch(Facebook\Exceptions\FacebookSDKException $e) {
	  // When validation fails or other local issues
	  echo 'Facebook SDK returned an error: ' . $e->getMessage();
	  exit;
	}

	//if got here that means the user is real, userid match fb token, checked by fb

	if (account_Exist("userid", $userid)){
		// "old user, no need to create new account"; but still have to give token
		$token = accessToken::newToken($userid);
		$array = array("userid" => $userid, "token" => $token);

		echo json_encode($array);


	}else{
		//new user to this website
		$username = $userNode->getName();
		$datejoin = date('Y-m-d H:i:s');
		$query = "INSERT INTO accounts (username, userid, email, datejoin, salt, password)
			value
			('$username', '$userid', NULL, '$datejoin', NULL, NULL)";

		try{
			$result=$db->query($query);

			$token = accessToken::newToken($userid);
			$array = array("userid" => $userid, "token" => $token);

			echo json_encode($array);

		}catch(PDOEXCEPTION $e){
			echo '{"error":{"text":'. $e->getMessage() .'}}';

		}

	}


}



function getDB(){

	$hostname = "localhost";
	$databaseName = "health";
	$loginName = "root";
	$password = "";

	$connection = new PDO("mysql:host=$hostname;dbname=$databaseName", $loginName, $password);
	$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $connection;
}

function deleteAccount($userid){

	$app = \Slim\Slim::getInstance();

	try{
	$db = getDB();
	$query = "	Delete accounts
				FROM accounts
				WHERE userid = '$userid'";

	$result = $db->query($query);
	}catch(PDOException $e){
		echo '{"error":{"text":'. $e->getMessage() .'}}';

	}
	echo "it is done";

}

function createNewAccount(){

	$app = \Slim\Slim::getInstance();

	try{
		$db = getDB();


		$name = $app->request->params('name');
		$pw =  $app->request->params('password');
		$email =  $app->request->params('email');
		$date = date('Y-m-d H:i:s');


		$user_exist = account_Exist("username", $name);
		$email_exist = account_Exist("email", $email);

		if ($user_exist || $email_exist){
			if ($user_exist && $email_exist){
				$err_msg =  array('error' => 'username and email in use');
				echo json_encode($err_msg);
			}else if ($user_exist){
				$err_msg =  array('error' => 'username in use');
				echo json_encode($err_msg);
			}else{
				$err_msg =  array('error' => 'email in use');
				echo json_encode($err_msg);
			}

		}else{

			//Encrypt password and create unique ID
			$salt = mcrypt_create_iv(32, MCRYPT_RAND);
			$password = crypt($pw, $salt);
			$userId = uniqid(rand(), true);

			$query = "INSERT INTO accounts (username, userid, email, datejoin, salt, password)
			value
			('$name', '$userId', '$email', '$date', '$salt', '$password' )";

			$db->query($query);

			//create token and give it to him
			//this create a new token, and put it in db
			$token = accessToken::newToken($userId);
			$array = array("userid" => $userId, "token" => $token);

			echo json_encode($array);


		}

	}catch(PDOException $e){

			echo '{"error":{"text":'. $e->getMessage() .'}}';
	}


}


function account_Exist($condition, $value){

	try{
		$db = getDB();

		$query = "SELECT * FROM accounts where $condition = '$value'";

		$result = $db->query($query);
		$result->setFetchMode(PDO::FETCH_ASSOC);
	}catch(PDOException $e){
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}

	return !empty($result->fetch());

}



function getUserAccount($userid){

	$app = \Slim\Slim::getInstance();

	try{
		$db = getDB();



		$headers = $app->request->headers;



		$req = $app->request;
		var_dump($req);


		$query = "SELECT * FROM accounts WHERE userid = '$id'";


		$result = $db->query($query);
		$result->setFetchMode(PDO::FETCH_ASSOC);



		return json_encode($result->fetch());


	}catch(PDOEXCEPTION $e){
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}

}


?>
