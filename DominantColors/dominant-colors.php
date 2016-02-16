<?php
// This should be set to the file path
$file = '';
if (!empty($file)) {
	$file_path = pathinfo($file);
	$image = $file_path['extension'] == 'png' ? imagecreatefrompng($file): imagecreatefromjpeg($file);
	$image_x = imagesx($image);
	$image_y = imagesy($image);
	$hex_array = array();
	// Gets rgb vals per pixel, then fills hex_array with the equivalent hex value
	for ($x = 0; $x < $image_x; $x++) {
		for ($y = 0; $y < $image_y; $y++) {
			$color = imagecolorat($image, $x, $y);
			$red = ($color >> 16) & 0xFF;
			$green = ($color >> 8) & 0xFF;
			$blue = ($color & 0xFF);
			$hex = rgb_to_hex(array($red, $green, $blue));
			array_push($hex_array, $hex);
		}
	}
} 
// Converts array of rgb values to a hex string
function rgb_to_hex($rgb) { 
	$hex = '#';
	for ($i = 0; $i < count($rgb); $i++) {
		$hex .= str_pad(dechex($rgb[$i]), 2, '0', STR_PAD_LEFT);
	}
	return $hex;
}
// Uses some handy native functions to sort our array of hex values by occurences and returns the top 5
function get_dominant_five_colors($color_array) { 
	$color_occurences= array_count_values($color_array);
	arsort($color_occurences);
	$dominant_five = array_slice($color_occurences, 0, 5);
	return $dominant_five;
} 
?>
<!DOCTYPE HTML>
<html>
<head>
	<title>Dominant Colors</title>
</head>
<body>
	<div style="text-align:center">
<?php 
	if (!empty($file)) {
		echo "<h1>Top 5 colors for $file</h1>";
		echo "<img src='$file'/><br/>";
	} else {
		echo "<h1>Please set the file path.</h1>";
	}
	$top_five = !isset($hex_array) ? array(): get_dominant_five_colors($hex_array);
	foreach ($top_five as $key => $val) {
		echo "<span style='margin:5px;background:$key'>$key</span>";
	}
?>
	</div>
</body>
</html>
