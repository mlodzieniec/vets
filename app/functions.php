<?php

class functions {

    /**
     * Dodanie obrazka do katalogu ze zdjęciami
     * @param string $base64_string Zdjęcie zakodowane w base64
     * @param string $output_file Ścieżka do pliku
     */
    public static function base64_to_jpeg($base64_string, $output_file) {
        // open the output file for writing
        $ifp = fopen($output_file, 'wb');
        
        // split the string on commas
        // $data[ 0 ] == "data:image/png;base64"
        // $data[ 1 ] == <actual base64 string>
        $data = explode(',', $base64_string);

        // we could add validation here with ensuring count( $data ) > 1
        fwrite($ifp, base64_decode($data[1]));

        // clean up the file resource
        fclose($ifp);

        return $output_file;
    }

    /**
     * Funkcja służąca do wycięcia stosownego pola obrazka na podstawie zaznaczenia z J'cropa
     * 
     * @param string $src Pełna ścieżka do pliku
     * @param string $name Nazwa pliku
     * @param type $type mime type obrazka
     * @param type $scale skala przeliczana na podstawie wartości prawdziwej szerokości oraz tej ustawionej w html (200/x)
     * @param type $x 
     * @param type $y
     * @param type $w
     * @param type $h
     */
    public static function cropImage($src, $name, $type, $scale, $x, $y, $w, $h){
        $quality = 100;

        if($type == 'image/jpeg' || $type == 'image/jpg'){
            $img = imagecreatefromjpeg($src);
        } else if($type == 'image/png'){
            $img = imagecreatefrompng($src);
        }

        $dst = ImageCreateTrueColor($w * $scale, $h * $scale);

//        die(var_dump('$dst'));
        
        imagecopyresampled($dst, $img, 0, 0, $x * $scale, $y * $scale, $w * $scale, $h * $scale, $w * $scale, $h * $scale);
        
//        $xyz = $_SERVER['DOCUMENT_ROOT'] . "/uploads/person/" . $name;
        imagejpeg($dst, $src , $quality);
    }
    
    /**
     * Funkcja zwraca pełną scieżke do pliku jeśli znajduje się w odpowiednim katalogu
     * 
     * @param string $directory Nazwa katalogu w uploads, w którym szukamy pliku (person lub upload)
     * @param string $photoName Nazwa pliku
     * @return string
     */
    public static function pathToUploadIfExists($directory, $photoName) {
        $filePath = '';

        if (file_exists($_SERVER['DOCUMENT_ROOT'] . "/uploads/" . $directory . "/" . $photoName)) {
            $filePath = "/uploads/" . $directory . "/" . $photoName;
        }

        return $filePath;
    }

    public static function isEmpty($name, $value) {
        if (empty($value)) {
            return true;
        } else {
            return false;
        }
    }

    public static function minLength($name, $value, $amount = 3) {
        if (strlen($value) < $amount) {
            return true;
        } else {
            return false;
        }
    }

    public static function maxLength($name, $value, $amount = 50) {
        if (strlen($value) > $amount) {
            return true;
        } else {
            return false;
        }
    }

}
