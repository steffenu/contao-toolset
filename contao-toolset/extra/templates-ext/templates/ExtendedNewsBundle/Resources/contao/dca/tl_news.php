<?php

 use Contao\CoreBundle\DataContainer\PaletteManipulator;

 $strName = "tl_news";

 $GLOBALS['TL_DCA']['tl_news']['list']['operations']['edit'] = array('label' => &$GLOBALS['TL_LANG']['tl_news']['edit'], 'href' => 'act=edit', 'icon' => 'edit.gif');
 unset($GLOBALS['TL_DCA']['tl_news']['list']['operations']['editheader']);

 $GLOBALS['TL_DCA'][$strName]['fields']['lp_image'] =  array(
  'label' => ["Bild auswählen"],
  'search' => true,
  'inputType' => 'fineUploader',
  'eval' => array(
    'fields' => ["title" , "alt"],
    'mandatory' => true,
    'storeFile' => true, // Mandatory to store the file on the server
    'multiple' => false, // Allow multiple files to be uploaded
    'uploadFolder' => 'files/content', // Upload path (destination folder)
    'uploaderConfig' => 'debug: false', // Custom uploader configuration (JSON)
    'uploaderLimit' => 1, // Maximum files that can be uploaded
    'addToDbafs' => true, // Add files to the database assisted file system
    'extensions' => "jpeg,jpg,png,svg,gif", // Allowed extension types
    'maxlength' => 1024000, // Maximum file size
    'doNotOverwrite' => false, // Do not overwrite files in destination folder
    'chunking' => true, // Enable chunking
    'chunkSize' => 1000000, // Chunk size in bytes
    'tl_class' => 'clr',
    'fieldType' => 'radio',
    'filesOnly' => true,
  ),

  'sql' => "blob NULL"
  //'relation'  => array('type' => 'hasOne', 'load' => 'lazy')
);

$GLOBALS['TL_DCA'][$strName]['fields']['location'] = array(
  'label'                   => &$GLOBALS['TL_LANG'][$strName]['elementID'],
  'exclude'                 => false,
  'inputType'               => 'text',
  'eval'                    => array('tl_class' => 'w50'),
  'sql'                     => "varchar(255) NOT NULL default ''"
);

$GLOBALS['TL_DCA'][$strName]['fields']['lp_image_multi_gallerie'] =  array(
  'label' => ["Bilder auswählen"],
  'search' => true,
  'inputType' => 'fineUploader',
  'eval' => array(
    'fields' => ["title","alt"],
    'mandatory' => true,
    'storeFile' => true, // Mandatory to store the file on the server
    'multiple' => true, // Allow multiple files to be uploaded
    'uploadFolder' => 'files/content/gallerie', // Upload path (destination folder)
    'uploaderConfig' => 'debug: false', // Custom uploader configuration (JSON)
    'uploaderLimit' => 5, // Maximum files that can be uploaded
    'addToDbafs' => true, // Add files to the database assisted file system
    'extensions' => "jpeg,jpg,png,svg,gif", // Allowed extension types
    'maxlength' => 1024000, // Maximum file size
    'doNotOverwrite' => false, // Do not overwrite files in destination folder
    'chunking' => true, // Enable chunking
    'chunkSize' => 1000000, // Chunk size in bytes
    'tl_class' => 'clr',
    'fieldType' => 'checkbox',
    'filesOnly' => true,
  ),

  'sql' => "blob NULL"
  //'relation'  => array('type' => 'hasOne', 'load' => 'lazy')
);



// Das default Bild hinzufügen mit uploader Bundle austauschen
PaletteManipulator::create()
  // apply the field "custom_field" after the field "username"
  ->addField('lp_image', 'teaser')
  ->addField('lp_image_multi_gallerie', 'lp_image')
  ->addField('location', 'author')
  ->removeField('addImage', 'image_legend')
  // now the field is registered in the PaletteManipulator
  // but it still has to be registered in the globals array:
  ->applyToPalette('default', 'tl_news');

  ;
