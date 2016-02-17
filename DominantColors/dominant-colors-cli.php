<?php 
	// Make sure at least one file is being passed as an argument
	if (count($argv) == 1) {
		throw new Exception("Error: Must pass at least one file path to argv.");
	} 
	$file_paths = array_slice($argv, 1, count($argv));
	foreach ($file_paths as $file) {
		//Check if the file exists
		if (!file_exists($file)) {
			throw new Exception("Error: File at path $file does not exist.");
		}
		//Check to make sure the file is an image of the appropriate extension.
		if (!(preg_match('/.png/i', $file) || preg_match('/.jpg/i', $file) || preg_match('/.jpeg/i', $file))) {
			throw new Exception("Error: Invalid file type for $file. Must be jpeg or png");
		}
		// Main logic 
		$f_name = basename($file);
		echo "Processing " . $f_name . "....\n\n";
		$path_info = pathinfo($file);
		$image = $path_info['extension'] == 'png' ? imagecreatefrompng($file): imagecreatefromjpeg($file);
		$hex_array = get_color_values($image);
		$top_five = get_dominant_five($hex_array);
		$json_obj = get_img_info($f_name, $top_five);
		echo $json_obj . "\n\n";
	}
	// Returns an array representing all of the pixels and their respective #hex values. 
	function get_color_values($image) {
		$image_x = imagesx($image);
		$image_y = imagesy($image);
		$hex_array = array();
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
		return $hex_array;
	}
	// Converts array of rgb values to hexadecimal in string form
	function rgb_to_hex($rgb) {
		$hex = '#';
		for ($i = 0; $i < count($rgb); $i++) {
			$hex .= str_pad(dechex($rgb[$i]), 2, '0', STR_PAD_LEFT);
		}
		return $hex;
	}
	// Gets the 5 (or less) most occuring colors
	function get_dominant_five($color_array) {
		$color_occurences= array_count_values($color_array);
		arsort($color_occurences);
		$slice = (count($color_occurences) >= 5) ? 5: count($color_occurences);
		$dominant_five = array_slice($color_occurences, 0, $slice);
		return $dominant_five;
	}
	// Creates json object to print 
	function get_img_info($file, $dom_colors) {
		$img_info = array();
		$img_info['file'] = $file;
		$inc = 1;
		foreach ($dom_colors as $color => $val) {
			$img_info['color' . $inc] = $color;
			$inc++;
		}
		return json_encode($img_info);
	}
?>