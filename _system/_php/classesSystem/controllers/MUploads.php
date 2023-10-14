<?php
namespace classesSystem\models;
use classesSystem\utilities\Upload;
use classesSystem\utilities\Request;


class MUploads{

  private function __construct(){}

  public static function saveMedias($baseUrl = null){
    $mimeType = Request::POST('mediaType');
    Upload::$dir = '_application/_medias/';
    $year = date('Y-m');

    if($mimeType === 'image'){
      Upload::images('_images/'.$year, $_FILES['images']);
      return Upload::getImgName();

    }else if($mimeType === 'audio'){
      Upload::medias('_audios/'.$year, $_FILES['audios']);
      return Upload::getAudioName();

    }else if($mimeType === 'video'){
      Upload::medias('_videos/'.$year, $_FILES['videos']);
      return Upload::getVideoName();

    }else if($mimeType === 'txt'){
      Upload::docs('_documents/'.$year, $_FILES['txts']);
      return Upload::getDocName();

    }
  }

}