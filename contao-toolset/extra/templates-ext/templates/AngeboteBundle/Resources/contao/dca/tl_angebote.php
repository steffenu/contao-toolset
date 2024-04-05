<?php

use Contao\Backend;
use Contao\Input;
use Contao\Versions;
use Contao\Image;

$GLOBALS['TL_DCA']['tl_##NAME_TABLE##'] = [
    'config' => [
        'dataContainer' => 'Table',
        'switchToEdit' => true,
        'enableVersioning' => true,
        'sql' => [
            'keys' => [
                'id' => 'primary',
            ]
        ]
    ],
    'list' => [
        'sorting' => [
            'mode' => 2,
            'fields' => ['infobanner_text'],
            'headerFields' => ['infobanner_text'],
            'disableGrouping' => true,
        ],
        'label' => [
            'fields' => ['infobanner_text'],
            'label_callback' => array('tl_##NAME_TABLE##', 'list'),
        ],
        'operations' => [
            'editheader' => [
                'label' => &$GLOBALS['TL_LANG']['tl_##NAME_TABLE##']['editheader'],
                'href' => 'act=edit',
                'icon' => 'header.gif',
            ],
            'toggle' => [
                'label'               => &$GLOBALS['TL_LANG']['tl_##NAME_TABLE##']['toggle'],
                'icon'                => 'visible.gif',
                'attributes'          => 'onclick="Backend.getScrollOffset();return AjaxRequest.toggleVisibility(this,%s)"',
                'button_callback'     => array('tl_##NAME_TABLE##', 'toggleIcon')
            ],
            'delete' => [
                'label' => &$GLOBALS['TL_LANG']['tl_##NAME_TABLE##']['delete'],
                'href' => 'act=delete',
                'icon' => 'delete.gif',
                'attributes' => 'onclick="if(!confirm(\'' . $GLOBALS['TL_LANG']['MSC']['deleteConfirm'] . '\'))return false;Backend.getScrollOffset()"',
            ]
        ]
    ],
    'palettes' => [
        'default' => '
            {infobanner_legend},
            infobanner_text;
            {publish_legend},
            published'
    ],
    'fields' => [
        'id' => [
            'sql' => "int(10) unsigned NOT NULL auto_increment"
        ],
        'tstamp' => [
            'sql' => "int(10) unsigned NOT NULL default '0'"
        ],
        'infobanner_text' => [
            'search' => true,
            'flag' => 1,
            'inputType' => 'textarea',
            'eval' => ['tl_class' => 'long clr', 'maxlength' => 500 ],
            'sql' => ['type' => 'string', 'length' => 500, 'default' => '']
        ],
        'published' => [
            'label'                   => &$GLOBALS['TL_LANG']['tl_##NAME_TABLE##']['published'],
            'exclude'                 => true,
            'inputType'               => 'checkbox',
            'eval'                    => array('doNotCopy' => true),
            'sql'                     => "char(1) NOT NULL default ''"
        ],
    ]
];


class tl_##NAME_TABLE## extends Backend
{


    public function list($arrRow)
    {
        return '<div class="tl_content_left">' . $arrRow['infobanner_text'] . '</div>';
    }

    public function toggleIcon($row, $href, $label, $title, $icon, $attributes)
    {
        if (strlen(Input::get('tid'))) {
            $this->toggleVisibility(Input::get('tid'), (Input::get('state') == 1));
            $this->redirect($this->getReferer());
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
        $this->Database->prepare("UPDATE tl_##NAME_TABLE## SET tstamp=" . time() . ", published='" . ($blnVisible ? 1 : '') . "' WHERE id=?")
            ->execute($intId);

        $objVersions->create();
        $this->log('A new version of record "tl_##NAME_TABLE##.id=' . $intId . '" has been created' . $this->getParentEntries('tl_career', $intId), __METHOD__, TL_GENERAL);
    }
}
