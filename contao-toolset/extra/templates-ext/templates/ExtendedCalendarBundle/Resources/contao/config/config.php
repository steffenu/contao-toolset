<?php
use App\ExtendedCalendarBundle\Modules\ModuleCalendar;
use App\ExtendedCalendarBundle\Modules\ModuleEventlist;

/* $GLOBALS['FE_MOD']['events']['calendar'] = ModuleCalendar::class;
$GLOBALS['FE_MOD']['eventlist']['events'] = ModuleEventlist::class;
 */

// Front end modules
$GLOBALS['FE_MOD']['events'] = array
(
	'calendar'    => ModuleCalendar::class,

	'eventlist'   => ModuleEventlist::class,

);