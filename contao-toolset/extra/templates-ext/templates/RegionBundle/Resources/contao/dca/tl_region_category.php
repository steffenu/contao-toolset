<?php

declare(strict_types=1);

use Contao\ImageSizeModel; // fur content element LP_Image
use Contao\Backend;
use Contao\DataContainer;
use Contao\DC_Table;
use Contao\Input;

$strName = 'tl_##NAME_TABLE##_category';

/**
 * Table tl_##NAME_TABLE##_category
 */
$GLOBALS['TL_DCA'][$strName] = [
    'config' => [
        'dataContainer' => 'Table',
        'ctable' => ['tl_##NAME_TABLE##'],
        'enableVersioning' => true,
        'switchToEdit' => true,
        'sql' => [
            'keys' => [
                'id' => 'primary',
            ],
        ], 
    ],
    'list' => [
        'sorting' => [
            'mode' => 1,
            'fields' => ['category_name'],
            'flag' => 1,
            'panelLayout' => 'search,limit'
        ],
        'label' => [
            'fields' => ['category_name'],
            'format' => '%s',
        ],
        'operations' => [
            'edit' => [
                'href' => 'table=tl_##NAME_TABLE##',
                'icon' => 'edit.svg',
            ],
            'editheader' => [
                'href' => 'act=edit',
                'icon' => 'header.svg',
            ],
            'delete' => [
                'href' => 'act=delete',
                'icon' => 'delete.svg',
            ],
            'show' => [
                'href' => 'act=show',
                'icon' => 'show.svg'
            ],
        ],
    ],
    'fields' => [
        'id' => [
            'sql' => ['type' => 'integer', 'unsigned' => true, 'autoincrement' => true],
        ],
        'tstamp' => [
            'sql' => ['type' => 'integer', 'unsigned' => true, 'default' => 0]
        ],
        'category_name' => [
            'search' => true,
            'inputType' => 'text',
            'eval' => ['tl_class' => 'w50', 'maxlength' => 255, 'mandatory' => true],
            'sql' => ['type' => 'string', 'length' => 255, 'default' => '']
        ],
    ],
    'palettes' => [
        'default' => '{title_legend},category_name;'
    ],
];


class tl_##NAME_TABLE##_category extends Backend
{


    public function getBildgroessen($dc)
    {

    }

}
