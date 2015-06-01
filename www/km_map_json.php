<?php


require_once '/scripts/dbconn.php';
/**
 * @var
 */
$fieldnames = array('Aanhef','Voornaam','Tussenvoegsel','Achternaam','Straat en huisnr', 'Postcode','Plaats','Website','Telefoon','Kunstvorm','Omschrijving van het werk');
//compose sql statement for user data
$sql    = "SELECT w.id,w.krnr,w.email,w.publicatienaam,w.kunstvorm,w.krsoort,d.sub_id,d.field_name, d.field_val 
    FROM wp_kmdbsubmissions w inner join wp_kmdbdata d on w.id = d.sub_id 
    where w.marktjaar = '".$eventYear."' and (
    d.field_name in ('".implode("','",$fieldnames)."')
    or (d.field_name like 'Afbeelding%') and d.field_val <> '')
    order by w.id asc;";

$sql_coordinate ="SELECT X, Y FROM km_krnr_loc where kmid = :kmidvalue";
//debug command
//echo $sql;

//exit();

$stmt = $dbh->prepare($sql);
//debug
//var_dump($result);


//create empty arrays for json data
$featuresData = array();
$propertiesData = array();
$userid = 0;
$userid_prev = 0;
//get user data from db
if ($stmt->execute()){
    //loop db data
     while ($row = $stmt->fetch()) {
         //set user id for grouping
        $userid = $row['id'];
        //when the user id did not changed get the next custom property
        if ($userid == $userid_prev) {
            $value = $row['field_name'];
            //save only the predefined property
            if (in_array($value,$fieldnames)){
                $propertiesData[$value]= urlencode($row['field_val']);
            }        
        } 
        // the user id is not equal a new set of user data is created
        else {
            //for the first user do not save the previous data (empty)
            if (!empty($propertiesData)){
                //save data from previous user id
                //coordinate data
               /*
                * @todo  get coordinate data from db
                */
               $stcoordinate=$dbh->prepare($sql_coordinate);
               $stcoordinate->bindParam('kmidvalue',$userid_prev);
               $coordinateX= 0;
               $coordinateY= 0;
               
               if ($stcoordinate->execute()){
                   while ($coor_row = $stcoordinate->fetch()){
                       $coordinateX =$coor_row['X'];
                       $coordinateY =$coor_row['Y'];
                   }
               }
               $coordinatesData = array( $coordinateX, $coordinateY );

               $featuresData[]= array( "type" => "Feature", 
                    "properties" => $propertiesData , 
                    "geometry" => array ( "type" => "Point", 
                        "coordinates" => $coordinatesData ) );
            }          
           //start with data for next user id 
           $propertiesData = array (
                    'id' => $row['id'],
                    'krnr' => $row['krnr'],
                    'email' => $row['email'],
                    'kunstvorm' => $row['kunstvorm'],
                    'krsoort' => $row['krsoort']);
           
        }

        $userid_prev = $userid;
    }
}

//Leaflet json format for a json layer on a map
//{
//"type": "FeatureCollection",
//                                           
//      "features": [
//		{ "type": "Feature", 
//                  "properties": { "property1": value1, "property2": value2, "property..": "value.."}, 
//		"geometry": { "type": "Point", "coordinates": [ 5.1.., 52... ] } },//              
//		]
//	}
// json header
header("Content-type: text/json; charset=utf-8");
// encode all data to json
echo json_encode(array( "type"=>"FeatureCollection", 
    "features" => $featuresData), JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
?>