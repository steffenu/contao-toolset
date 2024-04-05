<?php

declare(strict_types=1);


use Contao\ImageSizeModel; // fur content element multiple_images
use Contao\Backend;
use Contao\DataContainer;

// ##CONTROLLERS##
use App\CustomElementsBundle\Controller\ContentElement\Standart_HeadlineController;
use App\CustomElementsBundle\Controller\ContentElement\Standart_TextAbschnittController;




$strName = "tl_content";

/**
 * Content elements
 */

 $GLOBALS['TL_DCA'][$strName]['palettes'][Standart_TextAbschnittController::TYPE] = '{type_legend},type;{text_legend},background_select,headline,text_align,rte1;{template_legend:hide},customTpl;{expert_legend:hide},guests,cssID;{settings_legend:hide},elementID;{linkpicker_legend},linkpicker;'; 

 $GLOBALS['TL_DCA'][$strName]['palettes'][Standart_HeadlineController::TYPE] = '{type_legend},type;{text_legend},background_select,headline,text_align;{template_legend:hide},customTpl;{expert_legend:hide},guests,cssID;{settings_legend:hide},elementID;{linkpicker_legend},linkpicker;'; 


// DEFAULTS

$GLOBALS['TL_DCA'][$strName]['fields']['linkpicker'] = array(
  'label' => ["Button Url einfügen oder Seite wählen", ""],
  'exclude' => false,
  'inputType' => 'text',
  'eval' => array('readonly'=>false,'dcaPicker' => true, 'tl_class' => 'w50 clr'),
  'sql'                     => "varchar(255) NOT NULL default ''"

);

$GLOBALS['TL_DCA'][$strName]['fields']['services'] = array(
  'label' => &$GLOBALS['TL_LANG'][$strName]['partner'],
  'exclude' => false,
  'inputType' => 'multiColumnWizard',
  'eval' => array(
      'tl_class' => 'clr',
      'columnFields' => array(

          'title' => array(
              'label' => array('Titel', ''),
              'exclude' => false,
              'inputType' => 'text',
              'eval' => array(
            
                  'mandatory' =>    true
              ),
          ),
          'maintext' => array(
            'label' => array('Haupt-Text', ''),
            'exclude' => false,
            'inputType' => 'text',
            'eval' => array(

                'mandatory' =>    true
            ),
        ),
      )
  ),
  'sql' => "blob NULL",
); 

$GLOBALS['TL_DCA'][$strName]['fields']['elementID'] = array(
  'label'                   => &$GLOBALS['TL_LANG'][$strName]['elementID'],
  'exclude'                 => false,
  'inputType'               => 'text',
  'eval'                    => array('tl_class' => 'w50 dtop'),
  'sql'                     => "varchar(255) NOT NULL default ''"
);


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
$GLOBALS['TL_DCA'][$strName]['fields']['svg'] =  array(
  'label' => ["SVG auswählen"],
  'search' => true,
  'inputType' => 'fineUploader',
  'eval' => array(
    'fields' => ["title"],
    'mandatory' => false,
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
$GLOBALS['TL_DCA'][$strName]['fields']['lp_image_multi'] =  array(
  'label' => ["Bilder auswählen"],
  'search' => true,
  'inputType' => 'fineUploader',
  'eval' => array(
    'fields' => ["title","alt"],
    'mandatory' => true,
    'storeFile' => true, // Mandatory to store the file on the server
    'multiple' => true, // Allow multiple files to be uploaded
    'uploadFolder' => 'files/content', // Upload path (destination folder)
    'uploaderConfig' => 'debug: false', // Custom uploader configuration (JSON)
    'uploaderLimit' => 0, // Maximum files that can be uploaded
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
$GLOBALS['TL_DCA'][$strName]['fields']['lp_image_multi_locations'] =  array(
  'label' => ["Bilder auswählen"],
  'search' => true,
  'inputType' => 'fineUploader',
  'eval' => array(
    'fields' => ["title","alt","link","caption"],
    'mandatory' => true,
    'storeFile' => true, // Mandatory to store the file on the server
    'multiple' => true, // Allow multiple files to be uploaded
    'uploadFolder' => 'files/content/locations', // Upload path (destination folder)
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

$GLOBALS['TL_DCA'][$strName]['fields']['abstand_oben'] = array(
  'label'                   => &$GLOBALS['TL_LANG'][$strName]['infofeld_readonly'],
  'inputType'               => 'select',
  'options'                 =>["0","5","10","15","20","25","30","40","50","60","70","80","90","100","110","120","130","140","150"],
  'default'                 => "Bild links",
  'eval'                    => array('readonly'=>false,'tl_class' => 'w50 clr'),
  'sql'                     => "varchar(255) NOT NULL default ''"
);
$GLOBALS['TL_DCA'][$strName]['fields']['abstand_unten'] = array(
  'label'                   => &$GLOBALS['TL_LANG'][$strName]['infofeld_readonly'],
  'inputType'               => 'select',
  'options'                 =>["0","5","10","15","20","25","30","40","50","60","70","80","90","100","110","120","130","140","150"],
  'default'                 => "Bild links",
  'eval'                    => array('readonly'=>false,'tl_class' => 'w50 clr'),
  'sql'                     => "varchar(255) NOT NULL default ''"
);

$GLOBALS['TL_DCA'][$strName]['fields']['fontauswahl'] = array(
  'label' => ['Fontauswahl', 'Fontauswahl'],
  'inputType'               => 'select',
  'options'                 =>["Vultura-Regular","brandon-grotesque","gravesend-sans"],
  'default'                 => "Bild links",
  'eval'                    => array('readonly'=>false,'tl_class' => 'w50 clr'),
  'sql'                     => "varchar(255) NOT NULL default ''"
);

$GLOBALS['TL_DCA'][$strName]['fields']['link'] = array(
  'label'                   => ['Link',''],
  'inputType'               => 'text',
  'eval'                    => array('tl_class' => 'w50 clr'),
  'sql'                     => "varchar(255) NOT NULL default ''"
);


$GLOBALS['TL_DCA'][$strName]['fields']['image_position_select'] = array(
  'label'                   => &$GLOBALS['TL_LANG'][$strName]['infofeld_readonly'],
  'inputType'               => 'select',
  'options'                 =>["Bild links","Bild rechts"],
  'default'                 => "Bild links",
  'eval'                    => array('readonly'=>false,'tl_class' => 'w50 clr'),
  'sql'                     => "varchar(255) NOT NULL default ''"
);

$GLOBALS['TL_DCA'][$strName]['fields']['open_in_new_tab'] = array(
  'label' => ['In neuen Tab öffnen', 'In neuen Tab öffen'],
  'inputType' => 'checkbox',
  'sql' => [
      'type' => 'boolean',
      'default' => false,
  ],
);

$GLOBALS['TL_DCA'][$strName]['fields']['date_start'] = array(
  'inputType' => 'text',
  'eval'                    => array('rgxp' => 'date', 'doNotCopy' => true, 'datepicker' => true, 'tl_class' => 'w50 wizard'),
  'sql'                     => "int(10) unsigned NULL"
);

$GLOBALS['TL_DCA'][$strName]['fields']['date_end'] = array(
  'inputType' => 'text',
  'eval'                    => array('rgxp' => 'date', 'doNotCopy' => true, 'datepicker' => true, 'tl_class' => 'w50 wizard'),
  'sql'                     => "int(10) unsigned NULL"
);

$GLOBALS['TL_DCA'][$strName]['fields']['rte1'] = array(
  'label'                   => "Box Links",
  'exclude'                 => false,
  'inputType'               => 'textarea',
  'eval'                    => array('rte' => 'tinyMCE', 'tl_class' => 'clr'),
  'sql'                     => "mediumtext NULL"
);
$GLOBALS['TL_DCA'][$strName]['fields']['rte2'] = array(
  'label'                   => "Box Rechts",
  'exclude'                 => false,
  'inputType'               => 'textarea',
  'eval'                    => array('rte' => 'tinyMCE', 'tl_class' => 'clr'),
  'sql'                     => "mediumtext NULL"
);

$GLOBALS['TL_DCA'][$strName]['fields']['headline1'] = array(
  'label'                   => &$GLOBALS['TL_LANG'][$strName]['headline1'],
  'inputType'               => 'text',
  'eval'                    => array('tl_class' => 'w50 clr'),
  'sql'                     => "varchar(255) NOT NULL default ''"
);

$GLOBALS['TL_DCA'][$strName]['fields']['headline2'] = array(
  'label'                   => &$GLOBALS['TL_LANG'][$strName]['headline2'],
  'inputType'               => 'text',
  'eval'                    => array('tl_class' => 'w50 clr'),
  'sql'                     => "varchar(255) NOT NULL default ''"
);

$GLOBALS['TL_DCA'][$strName]['fields']['headline3'] = array(
  'label'                   => &$GLOBALS['TL_LANG'][$strName]['headline2'],
  'inputType'               => 'text',
  'eval'                    => array('tl_class' => 'w50 clr'),
  'sql'                     => "varchar(255) NOT NULL default ''"
);

$GLOBALS['TL_DCA'][$strName]['fields']['subtext'] = array(
  'label'                   => &$GLOBALS['TL_LANG'][$strName]['subtext'],
  'inputType'               => 'text',
  'eval'                    => array('tl_class' => 'w50 clr'),
  'sql'                     => "varchar(255) NOT NULL default ''"
);

$GLOBALS['TL_DCA'][$strName]['fields']['maintext'] = array(
  'label' => &$GLOBALS['TL_LANG'][$strName]['maintext'],
  'inputType'               => 'text',
  'eval'                    => array('rte' => 'tinyMCE','tl_class' => 'clr'),
  'sql'                     => "mediumtext NULL",
);


$GLOBALS['TL_DCA'][$strName]['fields']['headline_select'] = array(
  'label'                   => &$GLOBALS['TL_LANG'][$strName]['infofeld_readonly'],
  'inputType'               => 'select',
  'options'                 =>["h1","h2","h3"],
  'default'                 => "h2",
  'eval'                    => array('readonly'=>false,'tl_class' => 'w50 clr'),
  'sql'                     => "varchar(255) NOT NULL default ''"
);




