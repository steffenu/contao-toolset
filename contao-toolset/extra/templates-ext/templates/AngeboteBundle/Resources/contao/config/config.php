
<?php
// contao/config/config.php

use App\##NAME_BUNDLE##Bundle\Model\##NAME_BUNDLE##Model;

/**
 * Backend modules
 */
$GLOBALS['BE_MOD']['content']['##NAME_TABLE##_module'] = [
  'tables' => ['tl_##NAME_TABLE##'],
];

/**
 * Models
 */
$GLOBALS['TL_MODELS']['tl_##NAME_TABLE##'] = ##NAME_BUNDLE##Model::class;
