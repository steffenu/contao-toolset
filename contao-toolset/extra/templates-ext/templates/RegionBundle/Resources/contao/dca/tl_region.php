<?php

declare(strict_types=1);

use Contao\ImageSizeModel; // fur content element LP_Image
use Contao\Backend;
use Contao\DataContainer;
use Contao\DC_Table;
use Contao\Input;
use Contao\Database;
use Contao\Image;
use Contao\Versions;
use Contao\StringUtil;


$strName = 'tl_##NAME_TABLE##';

/**
 * Table tl_##NAME_TABLE##_category
 */
$GLOBALS['TL_DCA'][$strName] = [
  'config' => [
      'dataContainer' => DC_Table::class,
      'enableVersioning' => true,
      'ptable' => 'tl_##NAME_TABLE##_category',
      'sql' => [
          'keys' => [
              'id' => 'primary',
              'pid'        => "index"
          ],
      ],
/*       'onload_callback' => [
          function () {
              $db = Database::getInstance();
              $pid = Input::get('pid');
              dump($pid);
              if (empty($pid)) {
                  return;
              }
              $result = $db->prepare('SELECT `category_name` FROM `tl_##NAME_TABLE##_category` WHERE `id` = ?')
                           ->execute([$pid]);
              $prefix = strtoupper(substr($result->name, 0, 2));
              $GLOBALS['TL_DCA']['tl_parts']['fields']['number']['default'] = $prefix;
          },
      ]  */
  ],
  'list' => [
      'sorting' => [
          'mode' => 4,
          'fields' => ['title'],
          'headerFields' => ['category_name'], // von parent tabelle
          'panelLayout' => 'search,limit',
          'child_record_callback' => function (array $row) {
              return '<div class="tl_content_left">'.$row['title'].'</div>';
          },
      ],
      'operations' => [
          'edit' => [
              'href' => 'act=edit',
              'icon' => 'edit.svg',
          ],

          'show' => [
              'href' => 'act=show',
              'icon' => 'show.svg'
          ],
          'delete' => [
            'href' => 'act=delete',
            'icon' => 'delete.svg',
        ],
          'toggle' => array
          (
             
              'icon'                => 'visible.svg',
              'attributes'          => 'onclick="Backend.getScrollOffset();return AjaxRequest.toggleVisibility(this,%s)"',
              'button_callback'     => array('tl_##NAME_TABLE##', 'toggleIcon'),
              'showInHeader'        => true,
          ),
      ],
  ],
  'fields' => [
      'id' => [
          'sql' => ['type' => 'integer', 'unsigned' => true, 'autoincrement' => true],
      ],
      'pid' => [
          'foreignKey' => 'tl_##NAME_TABLE##_category.category_name',
          'sql' => ['type' => 'integer', 'unsigned' => true, 'default' => 0],
          'relation' => ['type'=>'belongsTo', 'load'=>'lazy']
      ],
      'tstamp' => [
          'sql' => ['type' => 'integer', 'unsigned' => true, 'default' => 0]
      ],
      'title' => [
          'search' => true,
          'flag' => 1,
          'inputType' => 'text',
          'eval' => ['tl_class' => 'w50', 'maxlength' => 255],
          'sql' => ['type' => 'string', 'length' => 255, 'default' => '']
      ],
      'author' => array
      (
          'default'                 => Contao\BackendUser::getInstance()->id,
          'exclude'                 => true,
          'search'                  => true,
          'filter'                  => true,
          'sorting'                 => true,
          'flag'                    => 11,
          'inputType'               => 'select',
          'foreignKey'              => 'tl_user.name',
          'eval'                    => array('doNotCopy'=>true, 'chosen'=>true, 'mandatory'=>true, 'includeBlankOption'=>true, 'tl_class'=>'w50'),
          'sql'                     => "int(10) unsigned NOT NULL default 0",
          'relation'                => array('type'=>'hasOne', 'load'=>'lazy')
      ),
      'alias' => [
        'label' => &$GLOBALS['TL_LANG']['tl_newseventboxes']['alias'],
        'exclude' => true,
        'inputType' => 'text',
        'eval' => ['doNotCopy' => true, 'unique' => true, 'maxlength' => 128, 'tl_class' => 'w50'],
        'save_callback' => [['tl_##NAME_TABLE##', 'generateAlias']],
        'sql' => "varchar(255) COLLATE utf8_bin NOT NULL default ''"
    ],
      'lp_image' => [
      
        'label' => &$GLOBALS['TL_LANG'][$strName]['lp_image'],
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
       
    ],
      'headline' => [
            'label'                   => &$GLOBALS['TL_LANG'][$strName]['headline'],
            'inputType'               => 'text',
            'eval'                    => array('tl_class' => 'w50 clr'),
            'sql'                     => "varchar(255) NOT NULL default ''"
    ],
      'headline_detail' => [
            'label'                   => &$GLOBALS['TL_LANG'][$strName]['headline_detail'],
            'inputType'               => 'text',
            'eval'                    => array('tl_class' => 'w50 clr'),
            'sql'                     => "varchar(255) NOT NULL default ''"
    ],
      'maintext' => [
      
            'label' => &$GLOBALS['TL_LANG'][$strName]['maintext'],
            'inputType'               => 'text',
            'eval'                    => array('rte' => 'tinyMCE','tl_class' => 'clr'),
            'sql'                     => "mediumtext NULL",
    ],
      'maintext_detail' => [
      
            'label' => &$GLOBALS['TL_LANG'][$strName]['maintext_detail'],
            'inputType'               => 'text',
            'eval'                    => array('rte' => 'tinyMCE','tl_class' => 'clr'),
            'sql'                     => "mediumtext NULL",
    ],
      'link' => [
        'label' => &$GLOBALS['TL_LANG'][$strName]['link'],
        'inputType'               => 'text',
        'eval'                    => array('tl_class' => 'w50 clr'),
        'sql'                     => "varchar(255) NOT NULL default ''"
       
    ],
    'published' => array(
        'filter'      => true,
        'flag'        => 2,
        'inputType'   => 'checkbox',
        'eval'        => array('doNotCopy' => true, 'tl_class' => 'w50'),
        'eval' => ['tl_class' => 'clr', 'maxlength' => 255 ],
        'sql' => "int(10) unsigned NOT NULL default 0",
    ),
    'publish_start' => [
        'search' => true,
        'flag' => 1,
        'inputType' => 'text',
        'eval'                    => array('doNotCopy' => true, 'datepicker' => true, 'tl_class' => 'w50 wizard'),
        'sql'                     => "int(10) unsigned NOT NULL default '0'"
    ],
    'publish_end' => [
        'search' => true,
        'flag' => 1,
        'inputType' => 'text',
        'eval'                    => array('doNotCopy' => true, 'datepicker' => true, 'tl_class' => 'w50 wizard'),
        'sql'                     => "int(10) unsigned NOT NULL default '0'"
    ],
  ],
  'palettes' => [
      'default' => '{title_legend},title,alias,author;{list_legend},lp_image,headline,maintext,link;{detail_legend},maintext_detail,headline_detail;{publish_legend},published'
  ],
];


class tl_##NAME_TABLE## extends Backend
{
    public function toggleIcon($row, $href, $label, $title, $icon, $attributes)
    {
        if (strlen(Input::get('id'))) {
            $this->toggleVisibility(Input::get('tid'), (Input::get('state') == 1));
            //$this->redirect($this->getReferer());
        }
        $href .= '&amp;tid=' . $row['id'] . '&amp;state=' . ($row['published'] ? '' : 1);
        if (!$row['published']) {
            $icon = 'invisible.gif';
        }
        return '<a href="' . $this->addToUrl($href) . '" title="' . specialchars($title) . '"' . $attributes . '>' . Image::getHtml($icon, $label) . '</a> ';
    }

    public function toggleVisibility($intId, $blnVisible)
    {
        $objVersions = new Versions('tl_##NAME_TABLE##', $intId);
        $objVersions->initialize();

        if (is_array($GLOBALS['TL_DCA']['tl_##NAME_TABLE##']['fields']['published']['save_callback'])) {
            foreach ($GLOBALS['TL_DCA']['tl_##NAME_TABLE##']['fields']['published']['save_callback'] as $callback) {
                if (is_array($callback)) {
                    $this->import($callback[0]);
                    $blnVisible = $this->$callback[0]->$callback[1]($blnVisible, $this);
                } elseif (is_callable($callback)) {
                    $blnVisible = $callback($blnVisible, $this);
                }
            }
        }



        if ($blnVisible == false) {
            $this->Database->prepare("UPDATE tl_##NAME_TABLE## SET tstamp=" . time() . ", published='" . 0 . "' WHERE id=?")
            ->execute($intId);
        } else {


            $this->Database->prepare("UPDATE tl_##NAME_TABLE## SET tstamp=" . time() . ", published='" . 1 . "' WHERE id=?")
            ->execute($intId);
        }
        
    

        $objVersions->create();
/*         $this->log('A new version of record "tl_##NAME_TABLE##.id=' . $intId . '" has been created' . $this->getParentEntries('tl_career', $intId), __METHOD__, TL_GENERAL); */
    }


    public function generateAlias($varValue, DataContainer $dc)
    {
        $autoAlias = false;

        // Generate alias if there is none
        if ($varValue == '') {
            $autoAlias = true;
            $varValue = StringUtil::generateAlias($dc->activeRecord->title);
        }

        $objAlias = $this->Database->prepare("SELECT id FROM " . $dc->table . " WHERE id=? OR alias=?")
            ->execute($dc->id, $varValue);

        // Check whether the page alias exists
        if ($objAlias->numRows > 1) {
            if (!$autoAlias) {
                throw new Exception(sprintf($GLOBALS['TL_LANG']['ERR']['aliasExists'], $varValue));
            }

            $varValue .= '-' . $dc->id;
        }

        return str_replace(array('ä', 'ü', 'ö', 'ß'), array('ae', 'ue', 'oe', 'ss'), $varValue);
    }

}







