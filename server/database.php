        <?php
        /**
         * User: PJ Grondelaers
         * Date: 03/11/2015
         */

        //Revoke access when file directly accessed
        if (count(get_included_files()) == 1) {
            die('{"MessageCode":"403"}');
        }

        require_once 'connection.php';
        //require "lib/password.php";

        /**
         * Class Database
         * Contains all queries to the database
         */
        class Database
        {
			
			/***
			*
			* test function
			*/
			function test(){
					echo "Hello PJ";			
			}

            /**
             * Query Get All Rooms
             */
            function getAllRooms()
            {
                try {
                    $conn_obj = new connection();
                    $conn = $conn_obj->getDBConnection();
                    $sql = "SELECT *
                            FROM rooms WHERE ready = '0'";
                    $stmt = $conn->query($sql);
                    $resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    $resultArray = array('MessageCode' => '202' , 'Data' => $resultQuery);
                    $result_json = json_encode($resultArray);
                    echo $result_json;
                    $conn = null;
                } catch (Exception $e) {
                    echo '{"MessageCode":"503"}';
                }
            }
			
			/*
			* FUNCTION: createRoom
			* creates a room and adds a MASTER player
			*
			*/
			
			function createRoom($params)
			{
				//var_dump $params;
				$conn_obj = new connection();
                $conn = $conn_obj->getDBConnection();
				$roomName 	= $params["roomName"];
				$password 	= $params['password'];
				$mafia 	  	= $params['mafia'];
				$doctor   	= 1;//$params['doctor'];
				$detective 	= 1;//$params['detective'];
				$time 		= $params['time'];
				
				$playerName = $params['playerName'];
				$master = 1;
				
				$sql2 = "SELECT *
                            FROM rooms
                            WHERE name = '".$roomName."'";
				$stmt = $conn->query($sql2);
				$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
				
				if(count($resultQuery) == 0){
					$sql = "INSERT INTO rooms (name, password, mafia, doctor, detective, time) 
							VALUES ('".$roomName."', '".$password."', '".$mafia."', '".$doctor."', '".$detective."', '".$time."')";
					$stmt = $conn->query($sql);
					
					$sql2 = "SELECT *
								FROM rooms
								WHERE name = '".$roomName."'";
						$stmt = $conn->query($sql2);
						$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$sql3 = "INSERT INTO player (name, room_id, master) VALUES ('".$playerName."', '".$resultQuery[0]['id']."', '".$master."')";
					$stmt = $conn->query($sql3);
					
					$sql4 = "SELECT id
                            FROM player
                            WHERE name = '".$playerName."' AND room_id = '".$resultQuery[0]['id']."'";
					$stmt = $conn->query($sql4);
					$playerId = $stmt->fetchAll(PDO::FETCH_ASSOC);

					$resultArray = array('MessageCode' => '201' ,'playerId'=> $playerId[0]['id'], 'roomId' => $resultQuery[0]['id']);
                    $result_json = json_encode($resultArray);
                    echo $result_json;
										
				}else{
					echo '{"MessageCode":"501"}';
				}
				
				$conn = null;

			}
			function getWaiting($params){
				$conn_obj 	= new connection();
                $conn 		= $conn_obj->getDBConnection();
				$roomId		= $params["roomId"];
				
				$sql = "SELECT name
								FROM player
								WHERE room_id = '".$roomId."'";
				$stmt = $conn->query($sql);
				$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
				
				$sql2 = "SELECT * FROM rooms WHERE id = '".$roomId."'";
				$stmt2 = $conn->query($sql2);
				$resultQuery2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);
				
				$sql3 = "SELECT * FROM player WHERE room_id = '".$roomId."' AND master = '1'";
				$stmt3 = $conn->query($sql3);
				$resultQuery3 = $stmt3->fetchAll(PDO::FETCH_ASSOC);
				
				
				if(count($resultQuery2 )== 0){
					echo '{"MessageCode":"504"}'; //no Room
				}else{
					$resultArray = array('MessageCode' => '203' ,'Players' => $resultQuery, 'CountWaiting' => count($resultQuery), 'Ready'=>$resultQuery2[0]['ready'], 'MasterId' =>$resultQuery3[0]['id']);
					$result_json = json_encode($resultArray);
					echo $result_json;
				}
				
				$conn = null;
			}
			
			function updateRoom($params){
				//try {
					$conn_obj = new connection();
					$conn = $conn_obj->getDBConnection();
						
					$room_id 	= $params["room_id"];
					$status 	= $params["stauts"]; //0 night 		1 day
					$ready 		= $params["ready"]; // 0 waiting 	1 started
					
					$sql = "UPDATE rooms SET status='".$status."',ready='".$ready."' WHERE id='".$room_id."'";		
					$stmt = $conn->query($sql);				
					echo '{"MessageCode":"200"}';
				/*}catch (Exception $e) {
                    echo '{"MessageCode":"503"}';
				}*/
				$conn = null;
			}

			/*
			* 	FUNCTION: joinRoom
			*	RETURN: 200 OK
			*			505 Wrong password	
			*			504 Invalid room (not user foult)
			*   PARAMS: roomName
			*   		password
			*   		playerName
			*/
			
            function joinRoom($params)
            {
                try {
                    $conn_obj = new connection();
                    $conn = $conn_obj->getDBConnection();
					
					$roomId = $params["roomId"];
					$password = $params['password'];
					$playerName = $params['playerName'];
					
                    $sql = "SELECT *
                            FROM rooms
                            WHERE id = '".$roomId."'";
					$stmt = $conn->query($sql);
                    $resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					
					
								
					if(count($resultQuery) == 1){
						$sql2 = "SELECT *
							FROM player
							WHERE room_id = '".$resultQuery[0]['id']."' AND name = '".$playerName."'";
							$stmt2 = $conn->query($sql2);
							$resultQuery2= $stmt2->fetchAll(PDO::FETCH_ASSOC);
						if(count($resultQuery2) == 0){				
							if ($resultQuery[0]['password'] == $password) {
								
								$sql = "INSERT INTO player (name, room_id) VALUES ('".$playerName."', '".$resultQuery[0]['id']."')";
								$stmt = $conn->query($sql);
								//$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
								
								$sql4 = "Select * FROM player WHERE name = '".$playerName."' AND room_id = '".$roomId."'";
								$stmt4 = $conn->query($sql4);
								$resultQuery4 = $stmt4->fetchAll(PDO::FETCH_ASSOC);
								
								$resultArray = array('MessageCode' => '204' ,'PlayerId' => $resultQuery4[0]['id']);
								$result_json = json_encode($resultArray);
								echo $result_json;
								
							}else{
								echo '{"MessageCode":"505"}';
							}
						}else{
							echo'{"MessageCode:"501"}'; //playername already exist
						}
					}else{

						echo '{"MessageCode":"504"}';
					}					
					$conn = null;
				}
				catch (Exception $e) {
					echo $e;
                    echo '{"MessageCode":"503"}';
				}
				$conn = null;
            }
			
			/*
			* 	FUNCTION: leaveRoom
			*/
			function leaveRoom($params){
				
				$conn_obj = new connection();
                $conn = $conn_obj->getDBConnection();
				
				$playerId = $params["playerId"];
				$sql1 = "SELECT * FROM player WHERE id = '".$playerId."'";
				$stmt1 = $conn->query($sql1);
				$resultQuery = $stmt1->fetchAll(PDO::FETCH_ASSOC);
				if(count($resultQuery) == 0){
					echo '{"MessageCode":"504"}'; //player doesn't exist anymore
				}else 
				{
					if($resultQuery[0]['master'] == 1){ //Master so delete room
						$sql2 = "DELETE FROM rooms WHERE id='".$resultQuery[0]['room_id']."'";
						$stmt2 = $conn->query($sql2);	
						$sql = "DELETE FROM player WHERE id='".$playerId."'";
						$stmt = $conn->query($sql);
						echo '{"MessageCode":"205","RoomDeleted":"1"}';
					}else{
						$sql = "DELETE FROM player WHERE id='".$playerId."'";
						$stmt = $conn->query($sql);
						echo '{"MessageCode":"205","RoomDeleted":"0"}';
					}

					
				}
				
				$conn = null;
				
			}
			
			/*
			* 	FUNCTION: getPlayer
			*	RETURN: 200 OK
			*			503 Exception
			*   PARAMS: playerId
			*   		password
			*   		playerName
			*/
			function getPlayer($params)
            {
                try {
                    $conn_obj = new connection();
                    $conn = $conn_obj->getDBConnection();
					
					$playerId = $params["playerId"];

					$sql = "SELECT * FROM player WHERE id='".$playerId."'";

                    $stmt = $conn->query($sql);
                    $resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);

					$resultArray = array('MessageCode' => '207' , 'Data' => $resultQuery);
                    $result_json = json_encode($resultArray);
                    echo $result_json;
				}catch (Exception $e) {
                    echo '{"MessageCode":"503"}';
				}
				$conn = null;
            }
			
			
			/*
			* FUNCTION: setRoles
			*
			*/
			function setRoles($params){
				$conn_obj = new connection();
                $conn = $conn_obj->getDBConnection();					
				$roomId = $params["roomId"];				
				// get the players
				$sql = "SELECT * FROM player WHERE room_id='".$roomId."'";
				$stmt = $conn->query($sql);
                $resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
				$num_players = sizeof($resultQuery);
				// get the number of roles
				$sql2 = "SELECT * FROM rooms WHERE id='".$roomId."'";
				$stmt = $conn->query($sql2);
                $resultQuery2 = $stmt->fetchAll(PDO::FETCH_ASSOC);
				// get the roles settings
				$mafia 		= $resultQuery2[0]['mafia'];
				$doctor 	= $resultQuery2[0]['doctor'];
				$detective 	= $resultQuery2[0]['detective'];
				$villager 	= $num_players - $mafia - $doctor - $detective;
				if($villager < 1) // not enough players
				{
					echo '{"MessageCode":"504"}';
				}else{
					//1 mafia 2 doctor 3 detective 4 villager
					for($i = 0; $i < $num_players; $i++){
						$status_given = true;
						while($status_given){
							$role =  rand(1,4);
							switch($role){
								case 1: //mafia
									if($mafia != 0){
										$status_given = false;
										$player_role = "mafia";
										$mafia--;
									}
									break;
								case 2: //doctor
									if($doctor != 0){
										$status_given = false;
										$player_role = "doctor";	
										$doctor--;									
									}
									break;
								case 3:	//detective
									if($detective != 0){
										$status_given = false;
										$player_role = "detective";	
										$detective--;									
									}
									break;
								case 4:	//villager
									if($villager != 0){
										$status_given = false;
										$player_role = "villager";	
										$villager--;									
									}
									break;
							}
						}
						$sql4 = "UPDATE player SET role='".$player_role."' WHERE id='".$resultQuery[$i]['id']."'";		
						$stmt = $conn->query($sql4);

						
						//Update ROOM time and ready
						
						$time = $resultQuery2[0]['time'];
						$seconds = $time*60;
						$endTime = time()+$seconds;
						$sql5 = "UPDATE rooms SET ready='1', timestamp ='".$endTime."' WHERE id='".$roomId."'";		
						$stmt = $conn->query($sql5);	
					}
					echo '{"MessageCode":"206"}';
				}
				$conn = null;
			}
			
			/*
			* FUNCTION: updatePlayerStatus
			*
			*/
			
			function updatePlayerStatus($params){
				try {
					$conn_obj = new connection();
					$conn = $conn_obj->getDBConnection();
					
					$playerId 	= $params["playerId"];
					$status 	= $params["status"];

					$sql = "UPDATE player SET status='".$status."' WHERE id='".$playerId."'";		
					$stmt = $conn->query($sql);				
					echo '{"MessageCode":"200"}';
				}catch (Exception $e) {
                    echo '{"MessageCode":"503"}';
				}
				$conn = null;
			}
			
			/*
			* FUNCTION: updatePlayerTarget
			*
			*/
			
			function updatePlayerTarget($params){
				try {
					$conn_obj = new connection();
					$conn = $conn_obj->getDBConnection();
					
					$playerId 	= $params["playerId"];
					$target 	= $params["target"];

					$sql = "UPDATE player SET target='".$target."' WHERE id='".$playerId."'";		
					$stmt = $conn->query($sql);				
					echo '{"MessageCode":"211"}';
				}catch (Exception $e) {
                    echo '{"MessageCode":"503"}';
				}
				$conn = null;

			}
			
			/* TO DO:
			* just update player ready, not update room status as it has to be done in the 'new' function 
			* FUNCTION: updatePlayerReady
			*
			*/
			function updatePlayerReady($params){
				//check all the players ready and if everyone is ready then change room status
				try {
					$conn_obj = new connection();
					$conn = $conn_obj->getDBConnection();
					
					$playerId	= $params["playerId"];
					//$ready	 	= $params["ready"];
					$sql = "UPDATE player SET ready='1' WHERE id='".$playerId."'";		
					$stmt = $conn->query($sql);								
					echo '{"MessageCode":"210"}';		
				}catch (Exception $e) {
                    echo '{"MessageCode":"503"}';
				}
				$conn = null;
			}
			/*
			*Number of votes to each player
			* TO DO: 					//return the number of votes count to each player
			*/
			function getPlayersReady($params){
				$conn_obj = new connection();
				$conn = $conn_obj->getDBConnection();
					
				$room_id	= $params["roomId"];
				
				$sql = "Select * FROM rooms WHERE id='".$room_id."'";		
				$stmt = $conn->query($sql);	
				$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
				$status = $resultQuery[0]['status'];
				
				$sql = "Select * FROM player WHERE room_id='".$room_id."' AND status = '1'";		
				$stmt = $conn->query($sql);	
				$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
				$players_alive = count($resultQuery);
				
				$sql = "Select * FROM player WHERE room_id='".$room_id."' AND status = '1' AND ready = '1'";		
				$stmt = $conn->query($sql);	
				$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
				$players_voted = count($resultQuery);
				
				//get number of votes of each player
				$sql3 = "Select * FROM player WHERE room_id='".$room_id."' AND status = '1' AND ready = '1'";		
				$stmt3 = $conn->query($sql3);	
				$resultQuery3 = $stmt3->fetchAll(PDO::FETCH_ASSOC);
				$count1 = count($resultQuery3);
				$targets2 = array();
				$bigTargets = array();
				foreach ($resultQuery3 as $result) {
					if(!isset($targets2[$result['target']])) {
						$targets2[$result['target']] = 0;
					}
					$targets2[$result['target']]++;
				}			
				foreach($targets2 as $key => $value){
					$singleTarget = [];
					$singleTarget[$key] = $value;
					array_push($bigTargets, $singleTarget);
				}
				

				//get number of votes of each MAFIA player
				$sql4 = "Select * FROM player WHERE room_id='".$room_id."' AND role = 'mafia' AND status = '1' AND ready = '1'";		
				$stmt4 = $conn->query($sql4);	
				$resultQuery4 = $stmt4->fetchAll(PDO::FETCH_ASSOC);
				$count2 = count($resultQuery4);

				$targets_mafia = array();
				$big_magia_target = array();
				foreach ($resultQuery4 as $result) {
					if(!isset($targets_mafia[$result['target']])) {
						$targets_mafia[$result['target']] = 0;
					}
					$targets_mafia[$result['target']]++;
				}		
				foreach($targets_mafia as $key => $value){
					$singleTarget = [];
					$singleTarget[$key] = $value;
					array_push($big_magia_target, $singleTarget);
				}				
				if($count2 != 0){
					$value2 = max($targets_mafia);
					$player_killed = array_search($value2, $targets_mafia); 
				}
				//check Tie
				$i=0;
				foreach($targets_mafia as $key => $value){
					//echo $target;
					if($value2 == $value){
						$i++;
					}
				}
				
				$j = 0;
				if($count1 != 0){
					$value2 = max($targets2);
					foreach($targets2 as $key => $value){
						//echo $target;
						if($value2 == $value){
							$j++;
						}
					}
				}					
				$tie = 0;
				if($status == '1') { //night
					if($i > 1){
						$tie = 1;
					}
				}else{ //day	
					if($j > 1){
						$tie = 1;
					}
				}
				//$targets2 = json_encode($targets2);
				//$targets_mafia = json_encode($targets_mafia);
				
				
				//return players
				$sql = "Select id,name FROM player WHERE room_id='".$room_id."'";		
				$stmt = $conn->query($sql);	
				$playersAll = $stmt->fetchAll(PDO::FETCH_ASSOC);
				//$resultArray["Players"] = $resultQuery;
						
				if($players_alive == $players_voted){
					$resultArray = array('MessageCode' => '209' , 'Ready' => 1, 'Votes' => $bigTargets, 'Mafia' => $big_magia_target, 'Tie' => $tie, 'Players'=> $playersAll);
					//return the number of votes count to each player
					$result_json = json_encode($resultArray);
				}else{
					$resultArray = array('MessageCode' => '209' , 'Ready' => 0, 'Votes' => $bigTargets, 'Mafia' => $big_magia_target, 'Tie' => $tie, 'Players'=> $playersAll);
					$result_json = json_encode($resultArray);
				}
				echo $result_json;
			}
			
			/* TO DO:
			* checkGame votes, returns everyones target and reset the DB (el que esta a dalt)
						* reset ready, and kill player and remove target, for night check if healplayer blablabla check if day or  night
			* check if the game is over (OVER, 0/1) --> Room ready 2. If mafia is majority or mafia is dead
			* check if day / night: if night return healer ID and 1/0 if killed or healed or whatever
			* return Detective target and ID of the target of the detective
			* return Killed and the name of the player dead. chenge his status.
			* update endTime: time() + time of the DB.
			*/
			function playGame($params){
				$conn_obj = new connection();
				$conn = $conn_obj->getDBConnection();
					
				$room_id	= $params["roomId"];
				$sql = "Select * FROM rooms WHERE id='".$room_id."'";		
				$stmt = $conn->query($sql);	
				$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
				$status = $resultQuery[0]['status'];
				$resultArray = array();
				$resultArray['MessageCode'] = 212;						//Return Targets

				$sql = "Select * FROM player WHERE room_id='".$room_id."' and status = '1'";		
				$stmt = $conn->query($sql);	
				$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
				$targets1 = array();
				foreach ($resultQuery as $target) {
					if(!isset($targets1[$target['id']])) {			
						$targets1[$target['id']] = $target['target'];
					}
					$targets1[$target['id']] = $target['target'];
				}
				$targetsBig = array();
				foreach($targets1 as $key => $value){
					$singleTarget = [];
					$singleTarget[$key] = $value;
					array_push($targetsBig, $singleTarget);
				}		
				$resultArray['Targets'] = $targetsBig;						//Return Targets
				
				if($status == '1'){ //night
					//Mafia action
					$sql = "Select * FROM player WHERE room_id='".$room_id."' AND role = 'mafia' AND status = '1'";		
					$stmt = $conn->query($sql);	
					$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$targets = array();
					foreach ($resultQuery as $result) {
						if(!isset($targets[$result['target']])) {			
							$targets[$result['target']] = 0;
						}
						$targets[$result['target']]++;
					}
					$value = max($targets);
					$player_killed = array_search($value, $targets); 
					
					//Healer action
					$sql = "Select * FROM player WHERE room_id='".$room_id."' AND role = 'doctor'";		
					$stmt = $conn->query($sql);	
					$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$player_healed = 0;
					$player_healed = $resultQuery[0]['target'];

					if($player_killed == $player_healed){
						$sql = "UPDATE player SET status='1' WHERE id='".$player_healed."'";		//Ensure is alive
						$stmt = $conn->query($sql);
						$sql = "Select * FROM player WHERE id='".$player_healed."'";		
						$stmt = $conn->query($sql);	
						$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
						$resultArray["Healed"] = $resultQuery[0]['name']; //player has been killed but 'revived'
						$resultArray["Killed"] = 0;
					}else{
						//$sql = "UPDATE player SET status='0' WHERE id='".$player_killed."'";		//Kill player
						//$stmt = $conn->query($sql);
						$sql = "Select * FROM player WHERE id='".$player_killed."'";		
						$stmt = $conn->query($sql);	
						$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
						$resultArray["Killed"] = $resultQuery[0]['name'];
						$resultArray["Healed"] = 0; //player killed
					}	
					
					//Detective action
					$sql = "Select * FROM player WHERE role='detective' AND room_id='".$room_id."'";		
					$stmt = $conn->query($sql);	
					$detective = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$player_discovered = 0;
					if($detective[0]['status'] == '0'){
						$player_discovered = 0;
						$resultArray["DiscoveredRole"] = 0;
					}else{
						$player_discovered = $detective[0]['target']; // Discover player
						$sql = "Select * FROM player WHERE id='".$player_discovered."'";		
						$stmt = $conn->query($sql);	
						$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
						$resultArray["DiscoveredRole"] = $resultQuery[0]['role'];
					}
					$resultArray["Discovered"] = $player_discovered;
									
				}else{ //day
					// voting counting to kill a player
					$sql = "Select * FROM player WHERE room_id='".$room_id."' and status = '1'";		
					$stmt = $conn->query($sql);	
					$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$voting = array();
					foreach ($resultQuery as $vote) {
						if(!isset($voting[$vote['target']])) {			
							$voting[$vote['target']] = 0;
						}
						$voting[$vote['target']]++;
					}
					$value = max($voting);
					$player_killed = array_search($value, $voting); 
					//$sql = "UPDATE player SET status='0' WHERE id='".$player_killed."'";		//Kill player
					//$stmt = $conn->query($sql);
					$sql = "Select * FROM player WHERE id='".$player_killed."'";		
					$stmt = $conn->query($sql);	
					$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$resultArray["Killed"] = $resultQuery[0]['name'];
				}
						
				$sql = "Select id,name FROM player WHERE room_id='".$room_id."'";		
				$stmt = $conn->query($sql);	
				$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
				$resultArray["Players"] = $resultQuery;
				$result_json = json_encode($resultArray);
				echo $result_json;
				$conn = null;

			}
			
			function killPlayer($params){
				$conn_obj = new connection();
				$conn = $conn_obj->getDBConnection();
				
				$room_id		= $params["roomId"];
				$sql = "Select * FROM rooms WHERE id='".$room_id."'";		//get Time
				$stmt = $conn->query($sql);
				$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
				$status = $resultQuery[0]['status'];
					
				if($status == '1') //night
				{
					//KILL Player
					//Mafia action
					$sql = "Select * FROM player WHERE room_id='".$room_id."' AND role = 'mafia' AND status = '1'";		
					$stmt = $conn->query($sql);	
					$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$targets = array();
					foreach ($resultQuery as $result) {
						if(!isset($targets[$result['target']])) {			
							$targets[$result['target']] = 0;
						}
						$targets[$result['target']]++;
					}
					$value = max($targets);
					$player_killed = array_search($value, $targets); 
					//Healer action
					$sql = "Select * FROM player WHERE room_id='".$room_id."' AND role = 'doctor'";		
					$stmt = $conn->query($sql);	
					$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$player_healed = 0;
					$player_healed = $resultQuery[0]['target'];

					if($player_killed == $player_healed){
						$sql = "UPDATE player SET status='1' WHERE id='".$player_healed."'";		//Ensure is alive
						$stmt = $conn->query($sql);
					}else{
						$sql = "UPDATE player SET status='0' WHERE id='".$player_killed."'";		//Kill player
						$stmt = $conn->query($sql);
					}	
				}
				else if($status == '0') //day
				{ 
					//Kill player
					// voting counting to kill a player
					$sql = "Select * FROM player WHERE room_id='".$room_id."' and status = '1'";		
					$stmt = $conn->query($sql);	
					$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$voting = array();
					foreach ($resultQuery as $vote) {
						if(!isset($voting[$vote['target']])) {			
							$voting[$vote['target']] = 0;
						}
						$voting[$vote['target']]++;
					}
					$value = max($voting);
					$player_killed = array_search($value, $voting); 
					$sql = "UPDATE player SET status='0' WHERE id='".$player_killed."'";		//Kill player
					$stmt = $conn->query($sql);										
				}	
				$conn = null;
                echo '{"MessageCode":"220"}';
			}
			/*
			* checkGame
			*/
			
			function checkGame($params){
				$conn_obj 	= new connection();
				$conn 		= $conn_obj->getDBConnection();
				$room_id		= $params["roomId"];
				//update endTime
				$sql = "Select * FROM rooms WHERE id='".$room_id."'";		//get Time
				$stmt = $conn->query($sql);
				$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
				$status = $resultQuery[0]['status'];
				$time = 0;
				$time = $resultQuery[0]['time'];
				$endTime = 0;
				$endTime = time() + $time*60;
				$sql = "UPDATE rooms SET timestamp='".$endTime."' WHERE id='".$room_id."'";		//Update endtime
				$stmt = $conn->query($sql);
	
				$resultArray = array();
				$resultArray['MessageCode'] = 215;
				//check if game is over
				$sql = "SELECT * FROM player WHERE room_id = '".$room_id."' AND status = '1'";
				$stmt = $conn->query($sql);	
				$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
				$players_alive = count($resultQuery);
				$mafia = 0;
				$others = 0;
				foreach ($resultQuery as $player) {
					if($player['role']=="mafia"){
						$mafia ++;
					}else{
						$others ++;
					}
				}
				if($mafia == 0){
					//GAME IS ENDED WIN OTHERS
					$resultArray['Game'] = 1;
					//Update DB
					$sql = "UPDATE rooms SET ready='2' WHERE id='".$room_id."'";		//Update endtime
					$stmt = $conn->query($sql);	
				}else if($mafia > $others){
					//GAME IS ENDED WIN MAFIA
					$resultArray['Game'] = 2;
					//Update DB
					$sql = "UPDATE rooms SET ready='2' WHERE id='".$room_id."'";		//Update endtime
					$stmt = $conn->query($sql);									
				}else{ //STILL PLAYING
							
					$resultArray['Game'] = 0;
					
					//Get go
					$sql = "SELECT * FROM rooms WHERE id = '".$room_id."'";
					$stmt = $conn->query($sql);	
					$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$go = $resultQuery[0]['go'];
					
					//Get alive
					$sql = "SELECT * FROM player WHERE room_id = '".$room_id."' AND status = '1'";
					$stmt = $conn->query($sql);	
					$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$alive = count($resultQuery);
					
					//Get ready
					$sql = "SELECT * FROM player WHERE room_id = '".$room_id."' AND ready = '1' AND status ='1'";
					$stmt = $conn->query($sql);	
					$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$ready = count($resultQuery);
									//		echo $alive;
									//		echo $ready;
					if($alive == $ready)
					{
						if($status == '1' && $go == '0') //night
						{
								
							//Update Players DB
							$sql = "UPDATE player SET target='0', ready = '0' WHERE room_id = '".$room_id."'";		//Update endtime
							$stmt = $conn->query($sql);	
							
							//Update GO
							$sql = "UPDATE rooms SET go = '1' WHERE id = '".$room_id."'";		//Update go
							$stmt = $conn->query($sql);		
							
							//Update Room DB
							$sql = "UPDATE rooms SET status = '0' WHERE id = '".$room_id."'";		//Update to day
							$stmt = $conn->query($sql);	
						}
						else if($status == '0'&& $go == '1') //day
						{ 							
							
							//Update Players DB
							$sql = "UPDATE player SET target = '0', ready = '0' WHERE room_id = '".$room_id."'";		//Update endtime
							$stmt = $conn->query($sql);	
							
							//Update GO
							$sql = "UPDATE rooms SET go = '0' WHERE id = '".$room_id."'";		//Update go
							$stmt = $conn->query($sql);	
							
							//Update Room DB
							$sql = "UPDATE rooms SET status = '1' WHERE id = '".$room_id."'";	//Update to night
							$stmt = $conn->query($sql);	
						}						
					}			
				}
				$result_json = json_encode($resultArray);
				echo $result_json;
				$conn = null;

			}
			
			
			
			/*
			* Function healPlayer (return X if is dead or X2 if its not dead)
			* compare the ID with the target of Mafia players
			*/ 
			function healPlayer($params){
				try {
					$conn_obj = new connection();
					$conn = $conn_obj->getDBConnection();
					
					$player_id	= $params["playerId"];

					$sql = "Select * FROM player WHERE id='".$player_id."'";		
					$stmt = $conn->query($sql);	
					$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$room_id = $resultQuery[0]["room_id"];

					$sql = "Select * FROM player WHERE room_id='".$room_id."' AND role = 'mafia'";		
					$stmt = $conn->query($sql);	
					$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$count = count($resultQuery);
					$targets = array();
					foreach ($resultQuery as $result) {
						if(!isset($targets[$result['target']])) {
							$targets[$result['target']] = 0;
						}
						$targets[$result['target']]++;
					}
					$value = max($targets);
					$key = array_search($value, $targets);
					if($key == $player_id){
						$sql = "UPDATE player SET status='1' WHERE player_id='".$player_id."'";		//ensure is alive
						$stmt = $conn->query($sql);
						echo '{"MessageCode":"212"}'; //player has been killed but 'revived'
					}else{
						echo '{"MessageCode":"213"}'; //player wasn't killed, nothing happen
					}						
				}catch (Exception $e) {
                    echo '{"MessageCode":"503"}';
				}
				$conn = null;
			}
			

			/*
			* 
			* FUNCTION: createGame
			* 
			*/
			function createGame($params){
				try {
					$conn_obj 	= new connection();
					$conn 		= $conn_obj->getDBConnection();
					$roomId		= $params["roomId"];

					$playerName = $params['playerName'];
					$master = 1;
					$status = 1;
					$ready = 1;
					$sql = "INSERT INTO game (room_id, status, ready) VALUES ('".$roomId."','".$status."','".$ready."')"; // status = 1 night, read
					$stmt = $conn->query($sql);
					$stmt = $conn->query($sql);

					$conn = null;
					echo '{"MessageCode":"200"}';
				}catch (Exception $e) {
                    echo '{"MessageCode":"503"}';
				}
				$conn = null;

			}
			
			/*
			*
			* Function getVotes()
			*
			*/
			function getVotes($params){
			  try {
                    $conn_obj = new connection();
                    $conn = $conn_obj->getDBConnection();
					
					$playerId = $params["playerId"];
					$roomId = $params["room_id"];
					
					$sql = "SELECT * FROM player WHERE target='".$playerId."' AND status = 1"; //alive
                    $stmt = $conn->query($sql);
                    $resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$num_of_votes = sizeof($resultQuery);
					
					$sql2 = "SELECT * FROM player WHERE room_id='".$roomId."' AND status = 1"; //alive
					$stmt = $conn->query($sql2);
                    $resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$num_of_players = sizeof($resultQuery);
					$resultArray = array('MessageCode' => '200' , 'Votes' => $num_of_votes, 'AlivePlayers'=>$num_of_players);
                    $result_json = json_encode($resultArray);
                    echo $result_json;
				}catch (Exception $e) {
                    echo '{"MessageCode":"503"}';
				}
				$conn = null;
			}
			
			/*
			*
			* FUnCTION: getRoomStats
			* 
			*
			*/
			function getRoomStats($params){
				try {
                    $conn_obj = new connection();
                    $conn = $conn_obj->getDBConnection();
					
					$roomId = $params["roomId"];
					
					$sql = "SELECT * FROM player WHERE room_id='".$roomId."'"; //All players
                    $stmt = $conn->query($sql);
                    $resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$all_players = sizeof($resultQuery);
					
					$sql2 = "SELECT * FROM player WHERE room_id='".$roomId."' AND status = 1"; //alive
					$stmt = $conn->query($sql2);
                    $resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$num_of_players = sizeof($resultQuery);
					
					$sql3 = "SELECT * FROM rooms WHERE id='".$roomId."'"; //alive
					$stmt = $conn->query($sql3);
                    $resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
					$room_status = $resultQuery[0]['status'];
					
					$resultArray = array('MessageCode' => '200' , 'TotalPlayers' => $all_players, 'AlivePlayers'=>$num_of_players, 'Status'=>$room_status);
                    $result_json = json_encode($resultArray);
                    echo $result_json;
				}catch (Exception $e) {
					echo $e;
                    echo '{"MessageCode":"503"}';
				}
				$conn = null;				
			}
			/*
			*
			* getRoomPlayers
			*
			*/
			function getRoomPlayers($params){
				$conn_obj = new connection();
				$conn = $conn_obj->getDBConnection();
				$roomId = $params["roomId"];
				$sql = "SELECT * FROM player WHERE room_id='".$roomId."'"; //All players
				$stmt = $conn->query($sql);
				$resultQuery = $stmt->fetchAll(PDO::FETCH_ASSOC);
				
				$sql2 = "SELECT * FROM rooms WHERE id='".$roomId."'"; //All players
				$stmt2 = $conn->query($sql2);
				$resultQuery2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);
				
				$resultArray = array('MessageCode' => '208' , 'Data' => $resultQuery, 'EndTime' => $resultQuery2[0]['timestamp']);
				$result_json = json_encode($resultArray);
				echo $result_json;
			}
			
			function getServerTime(){
				$time1 = time();
				$time2 = $time1 + 300;
				$resultArray = array('Time' => $time1, 'EndTime' => $time2);
				$result_json = json_encode($resultArray);
				echo $result_json;			
			}
			
        }
