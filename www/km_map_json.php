<?php
// json_encode() options
   @define('JSON_UNESCAPED_SLASHES',      64);   // Since PHP 5.4.0
   @define('JSON_PRETTY_PRINT',           128);  // Since PHP 5.4.0
   @define('JSON_UNESCAPED_UNICODE',      256);  // Since PHP 5.4.0

   
require_once dirname(__FILE__).'/scripts/dbconn.php';
/**
 * @var
 */
//$fieldnames = array('Aanhef','Voornaam','Tussenvoegsel','Achternaam','Straat en huisnr', 'Postcode','Plaats','Website','Telefoon','Kunstvorm','Omschrijving van het werk');
//compose sql statement for user data
$sql = "SELECT d.id, d.voornaam, d.voorvoegsel, d.achternaam,
    a.straat, a.huisnr, a.postcode, a.plaats, l.omschrijving as land,
    d.website, m.beschrijving_werk, m.kraamnummer, k.omschrijving as kunstvorm
    FROM kmdb_deelnemer d inner join kmdb_deelnemer_markten m on (d.id = m.deeln_id)
    inner join kmdb_kunstvorm k on (d.kunstvorm = k.id)
    inner join kmdb_adres a on (d.adres = a.id)
    inner join kmdb_land l on (a.land = l.id)
    where m.markt_id = :kmyear and m.kraamnummer >0;";


$sql_coordinate ="SELECT X, Y FROM km_krnr_loc where krnr = :krnrvalue";


$stmt = $dbh->prepare($sql);
$stmt->bindParam('kmyear',$eventYear);


//debug
//var_dump($result);


//create empty arrays for json data
$featuresData = array();
$propertiesData = array();

//get user data from db
if ($stmt->execute()){
    //debug command
    //var_dump($stmt);

    //exit();
    //loop db data
     while ($row = $stmt->fetch()) {
        $stcoordinate=$dbh->prepare($sql_coordinate);
        $stcoordinate->bindParam('krnrvalue', $row['kraamnummer']);
        $coordinateX= 0;
        $coordinateY= 0;

        if ($stcoordinate->execute()){
            while ($coor_row = $stcoordinate->fetch()){
                $coordinateX =$coor_row['X'];
                $coordinateY =$coor_row['Y'];
            }
        }
        $coordinatesData = array( $coordinateX, $coordinateY );
    
        $propertiesData = array (
            'deelnemernummer' => $row['id'],
            'kunstenaar' => $row['voornaam'].' '.$row['voorvoegsel'].' '.$row['achternaam'],
            'adres' => $row['straat'].' '.$row['huisnr'].'</br >'.$row['postcode'].' '.$row['plaats'].'</br > '.$row['land'],
            'website' => $row['website'],
            'kunstvorm' => $row['kunstvorm'],
            'beschrijving werk' => urlencode($row['beschrijving_werk']),
            'kraamnummer' => $row['kraamnummer']
           );
        $featuresData[]= array( "type" => "Feature", 
             "properties" => $propertiesData , 
             "geometry" => array ( "type" => "Point", 
                 "coordinates" => $coordinatesData ) );           
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
header("Access-Control-Allow-Origin: *");
header("Content-type: text/json; charset=utf-8");

// encode all data to json
echo json_encode(array( "type"=>"FeatureCollection", 
    "features" => $featuresData), JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
?>