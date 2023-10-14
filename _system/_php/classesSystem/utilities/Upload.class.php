<?php
/**
 * Classe Upload = Responsável por gerenciar uploads de imagems, mídias e documentos.
 */

namespace classesSystem\utilities;

class Upload {

  private static $imgName = [];
  private static $imgPath = [];
  public static $statusUploadImage = [];

  private static $videoName = [];
  private static $videoPath = [];
  private static $audioName = [];
  private static $audioPath = [];
  private static $statusUploadMedia = [];

  private static $docName = [];
  private static $docPath = [];
  private static $statusUploadDoc = [];

  public static $dir = '_application/_medias/';

  public static function images($Directory, array $Data, $mult = false, $Width = null, $Height = null, $Fixed = false){

    self::clearProperties();

    $arrExtensions = ['image/jpg','image/jpeg','image/png','image/jpng','image/gif'];
    $maxSize = 5 * 1000 * 1000; // Limite de 5MB

    if($mult) {

      foreach($Data as $key => $value){

        $allowType = (array_search($Data[$key]['type'], $arrExtensions));

        $size = $Data[$key]['size'];
        $file = $Data[$key]['name'];

        if (gettype($allowType) == "integer") {

          if ($size <= $maxSize) {

            $arrayDir = explode('/',$Directory);
            $path = self::$dir;
            foreach ($arrayDir as $key2 => $dir){
              for($i = $key2;$i <= $key2;$i++){

                if($path[strlen($path)-1] == "/"){

                  $path .= $arrayDir[$i];
                }else{

                  $path .= '/'.$arrayDir[$i];
                }

                if(!is_dir($path)){
                  mkdir($path);
                }
              }
            }

            move_uploaded_file($Data[$key]['tmp_name'], $path . '/' . $file);
            self::resizeImg([$file, $Directory], $Width, $Height, $Fixed);

            self::$statusUploadImage = ['statusCode'=>1,'statusText'=>['lang'=>['pt'=>'Imagem enviada com sucesso','en'=>'Image uploaded successfully']]];

          } else {

            self::$statusUploadImage = ['statusCode'=>0,'statusText'=>['lang'=>['pt'=>'Tamanho máximo de 5MB excedido','en'=>'5MB max size exceeded']]];

          }
        } else {

          self::$statusUploadImage = ['statusCode'=>0,'statusText'=>['lang'=>['pt'=>'Formatoo não permitido. Extensões permitidas ".jpg, .png, .gif"','en'=>'Format not allowed. Permitted Extensions ".jpg, .png, .gif"']]];

        }

      }

    }
    else{

      $allowType = (array_search($Data['type'], $arrExtensions));
      $size = $Data['size'];
      $file = $Data['name'];

      if (gettype($allowType) == "integer") {
        if ($size <= $maxSize) {

          if (!is_dir(self::$dir . $Directory)) {

            mkdir(self::$dir . $Directory);
            move_uploaded_file($Data['tmp_name'], self::$dir . $Directory .'/'. $file);
            self::resizeImg([$file, $Directory], $Fixed, $Width, $Height, false);

          } else {

            move_uploaded_file($Data['tmp_name'], self::$dir . $Directory .'/'. $file);
            self::resizeImg([$file, $Directory], $Fixed, $Width, $Height, false);
          }

          self::$statusUploadImage = ['statusCode'=>1,'statusText'=>['lang'=>['pt'=>'Imagem enviada com sucesso','en'=>'Image uploaded successfully']]];

        } else {

          self::$statusUploadImage = ['statusCode'=>0,'statusText'=>['lang'=>['pt'=>'Tamanho máximo de 2MB excedido','en'=>'2MB max size exceeded']]];

        }
      } else {

        self::$statusUploadImage = ['statusCode'=>0,'statusText'=>['lang'=>['pt'=>'Formatoo não permitido. Extensões permitidas ".jpg, .png, .gif"','en'=>'Format not allowed. Permitted Extensions ".jpg, .png, .gif"']]];

      }
    }

  }

  public static function medias($Directory, $Data,$mult = false){

    self::clearProperties();

    $allowed_types = ['video/mp4','video/mpg','video/ogg','video/mpeg','video/avi','video/wav','audio/mp3','audio/ogg','audio/mp4'];

    foreach($Data as $key => $value) {

      if($mult) {
        foreach ($value as $key2 => $item) {
          $fileName = $Data['name'][$key2];
          $fileType = $Data['type'][$key2];

          $extension = substr($fileName, strrpos($fileName, '.'));
          $dirTmp = $Data['tmp_name'][$key2];

          $fileName = sha1($fileName) . time() . date('His') . $extension;

          if (in_array($fileType, $allowed_types)) {

            $arrayDir = explode('/', $Directory);
            $path = self::$dir;
            foreach ($arrayDir as $key => $dir) {
              for ($i = $key; $i <= $key; $i++) {
                if($path[strlen($path)] == "/"){

                  $path .= $arrayDir[$i];
                }else{

                  $path .= '/'.$arrayDir[$i];
                }
                if (!is_dir($path)) {
                  mkdir($path);
                }
              }
            }

            move_uploaded_file($dirTmp, $path . '/' . $fileName);

            if (preg_match("@video/@", $fileType)) {

              array_push(self::$videoName,$fileName);
              array_push(self::$videoPath, $path . '/' . $fileName);
            } else if (preg_match("@audio/@", $fileType)) {

              array_push(self::$audioName,$fileName);
              array_push(self::$audioPath, $path . '/' . $fileName);
            }


          }

        }
      }else{


        $fileName = $Data['name'];
        $fileType = $Data['type'];

        $extension = substr($fileName, strrpos($fileName, '.'));
        $dirTmp = $Data['tmp_name'];

        $fileName = sha1($fileName) . time() . date('His') . $extension;

        if (in_array($fileType, $allowed_types)) {

          $arrayDir = explode('/', $Directory);
          $path = self::$dir;
          foreach ($arrayDir as $key2 => $dir) {
            for ($i = $key2; $i <= $key2; $i++) {
              if($path[strlen($path)] == "/"){

                $path .= $arrayDir[$i];
              }else{

                $path .= '/'.$arrayDir[$i];
              }
              if (!is_dir($path)) {
                mkdir($path);
              }
            }
          }

          move_uploaded_file($dirTmp, $path . '/' . $fileName);

          if (preg_match("@video/@", $fileType)) {

            self::$videoName = $fileName;
            self::$videoPath = $path . '/' . $fileName;
          } else if (preg_match("@audio/@", $fileType)) {

            self::$audioName = $fileName;
            self::$audioPath = $path . '/' . $fileName;
          }

        }


      }
      break;
    }
  }

  public static function docs($Directory, $Data,$mult = true){

    self::clearProperties();

    $fileMaxSize = 10 * 1000 * 1000;

    foreach($Data as $key => $value) {

      if($mult) {
        foreach ($value as $key2 => $item) {
          $fileName = $Data['name'][$key2];
          $extension = substr($fileName, strrpos($fileName, '.'));

          $fileType = $Data['type'][$key2];
          $fileSize = $Data['size'][$key2];

          $dirTmp = $Data['tmp_name'][$key2];

          $arrType = ['text/plain', 'application/msword', 'application/pdf', 'application/x-zip-compressed'];

          if (in_array($fileType, $arrType)) {
            $acceptType = true;
          } else {
            $acceptType = false;
          }

          if (($fileSize <= $fileMaxSize) && $acceptType) {
            $fileName = sha1($fileName) . time() . date('His') . $extension;


            $arrayDir = explode('/', $Directory);
            $path = self::$dir;
            foreach ($arrayDir as $key => $dir) {
              for ($i = $key; $i <= $key; $i++) {
                $path .= '/' . $arrayDir[$i];
                if (!is_dir($path)) {
                  mkdir($path);
                }
              }
            }

            move_uploaded_file($dirTmp, $path . '/' . $fileName);
            array_push(self::$docName, $fileName);
            array_push(self::$docPath, $path . '/' . $fileName);

          } else {
            if ($acceptType) {
              echo 'Tipo de Tamanho do aqui inválido. Limite de 10MB';
            } else {
              echo 'Tipo de arquivo inválido. Permitido .TXT, .DOCX, .PDF';
            }
          }
        }
      }else{


        $fileName = $Data['name'];
        $extension = substr($fileName, strrpos($fileName, '.'));

        $fileType = $Data['type'];
        $fileSize = $Data['size'];

        $dirTmp = $Data['tmp_name'];

        $arrType = ['text/plain', 'application/msword', 'application/pdf', 'application/x-zip-compressed','application/octet-stream'];

        if (in_array($fileType, $arrType)) {
          $acceptType = true;
        } else {
          $acceptType = false;
        }

        if (($fileSize <= $fileMaxSize) && $acceptType) {
          $fileName = sha1($fileName) . time() . date('His') . $extension;

          $arrayDir = explode('/', $Directory);
          $path = self::$dir;
          foreach ($arrayDir as $key2 => $dir) {
            for ($i = $key2; $i <= $key2; $i++) {
              $path .= '/' . $arrayDir[$i];
              if (!is_dir($path)) {
                mkdir($path);
              }
            }
          }

          move_uploaded_file($dirTmp, $path . '/' . $fileName);
          self::$docName =  $fileName;
          self::$docPath =  $path . '/' . $fileName;

        } else {
          if ($acceptType) {
            echo 'Tipo de Tamanho do aqui inválido. Limite de 10MB';
          } else {
            echo 'Tipo de arquivo inválido. Permitido .TXT, .DOCX, .PDF, .ZIP and .RAR';
          }
        }

      }

      break;
    }
  }

  private static function resizeImg($dataImg, $fixed = false, $width = null, $height = null, $mult = true){
    $image = $dataImg[0];
    $imageDir = self::$dir . $dataImg[1].'/';
    $imageExt = strtolower(substr($image,strrpos($image,'.')));
    $imageOrigin = null;

    switch ($imageExt){
      case '.jpeg':
      case '.jpg':{

        $imageOrigin = @imagecreatefromjpeg($imageDir . $image);
        break;
      }
      case '.png':
      case '.jpng':{

        $imageOrigin = @imagecreatefrompng($imageDir . $image);
        break;
      }
      case '.gif':{

        $imageOrigin = @imagecreatefromgif($imageDir . $image);
        break;
      }
    }

    if($imageOrigin == null){return;}

    $originX = imagesx($imageOrigin);
    $originY = imagesy($imageOrigin);

    if($fixed && $width && $height){
      $imageX = $width;
      $imageY = $height;
    }else if(!$fixed && $width && $height){
      $imageX = ($originX * $width / 100);
      $imageY = ($originY * $height / 100);
    }else{
      $imageX = $originX;
      $imageY = $originY;
    }

    $newName = sha1($image).date('Ymdhis').$imageExt;
    $newPath = $imageDir.$newName;

    if($imageExt === '.png' || $imageExt === '.jpng'){
      $newImage = imagecreatetruecolor($imageX,$imageY);
      imagesavealpha($newImage,true);
      $transColor = imagecolorallocatealpha($newImage,0,0,0,127);
      imagefill($newImage,0,0,$transColor);
    }else if($imageExt === '.gif'){
      $newImage = imagecreate($imageX,$imageY);
    }else{
      $newImage = imagecreatetruecolor($imageX,$imageY);
    }

    imagecopyresampled($newImage,$imageOrigin, 0, 0, 0, 0, $imageX, $imageY, $originX, $originY);

    switch ($imageExt){
      case '.jpeg':
      case '.jpg':{
        imagejpeg($newImage,$newPath);
        break;
      }
      case '.png':
      case '.jpng':{
        imagepng($newImage,$newPath);
        break;
      }
      case '.gif':{
        imagegif($newImage,$newPath);
        break;
      }
    }

    if($mult){

      array_push(self::$imgName, $newName);
      array_push(self::$imgPath, $newPath);
    }else{

      self::$imgName = $newName;
      self::$imgPath = $newPath;
    }

    imagedestroy($imageOrigin);
    imagedestroy($newImage);
    unlink($imageDir.$image);
  }

  public static function getImgName($path = false){

    return $path ? self::$imgPath : self::$imgName;
  }

  public static function getDocName($path = false){

    return $path ? self::$docPath : self::$docName;
  }

  public static function getVideoName($path = false){

    return $path ? self::$videoPath : self::$videoName;
  }

  public static function getAudioName($path = false){

    return $path ? self::$audioPath : self::$audioName;
  }

  private static function clearProperties(){

    self::$imgName = [];
    self::$imgPath = [];
    self::$videoName = [];
    self::$videoPath = [];
    self::$audioName = [];
    self::$audioPath = [];
    self::$docName = [];
    self::$docPath = [];
  }

}
