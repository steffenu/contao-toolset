<?php

// ##CONTROLLERS##
use App\CustomElementsBundle\Controller\ContentElement\Standart_TextAbschnittController;
use App\CustomElementsBundle\Controller\ContentElement\Standart_HeadlineController;

$strName = 'tl_content';

// Legends
$GLOBALS['TL_LANG'][$strName]['lp_image_legend'] = 'Bild Einstellungen';
$GLOBALS['TL_LANG'][$strName]['midsection_legend'] = 'Mitte-Abschnitt';
$GLOBALS['TL_LANG'][$strName]['bottomimage_legend'] = 'Unteres Bild';
$GLOBALS['TL_LANG'][$strName]['werte_legend'] = 'Werte';
$GLOBALS['TL_LANG'][$strName]['images_legend'] = 'Bilder';

// Fields
// #########################################################


$GLOBALS['TL_LANG'][$strName]['lp_image_legend'] = 'Bild Einstellungen';
$GLOBALS['TL_LANG'][$strName]['linkpicker_legend'] = 'Url Picker Helper';
$GLOBALS['TL_LANG'][$strName]['settings_legend'] = 'Anker / Sprungmarke';
$GLOBALS['TL_LANG'][$strName]['lp_bildgroessen'] = ['Bildgrösse wählen', "Bildgrösse des Elementyps auswählen (identisch mit Elementyp Namen)"];


$GLOBALS['TL_LANG'][$strName]['headline1'] = ['Überschrift Teil 1'];
$GLOBALS['TL_LANG'][$strName]['headline2'] = ['Überschrift Teil 2','Dies ist der gefärbte Teil'];
$GLOBALS['TL_LANG'][$strName]['subtext'] = ['Subtext','Der Text direkt unter der Überschrift'];
$GLOBALS['TL_LANG'][$strName]['maintext'] = ['Haupt-Text'];
$GLOBALS['TL_LANG'][$strName]['elementID'] = ['Sprungmarke'];
$GLOBALS['TL_LANG'][$strName]['midsection'] = ['Mitte-Abschnitt'];
$GLOBALS['TL_LANG'][$strName]['image_position_select'] = ['Bildposition wählen' , 'Bildposition wählen' ];


// CONTENT ELEMENTS
$GLOBALS['TL_LANG']['CTE'][Standart_HeadlineController::TYPE] = ['Überschrift', ''];
$GLOBALS['TL_LANG']['CTE'][Standart_TextAbschnittController::TYPE] = ['Textabschnitt', ''];



