<?php

/*
 * This file is part of Contao.
 *
 * (c) Leo Feyer
 *
 * @license LGPL-3.0-or-later
 */

namespace App\ExtendedCalendarBundle\Modules;

use Contao\CoreBundle\Exception\PageNotFoundException;
use App\ExtendedCalendarBundle\Classes\Events;
use Contao\BackendTemplate;
use Contao\Date;
use Contao\Environment;
use Contao\FrontendTemplate;
use Contao\Input;
use Contao\PageModel;
use Contao\StringUtil;
use Contao\System;
use Contao\CalendarEventsModel;
use Contao\FilesModel;

/**
 * Front end module "calendar".
 *
 * @property int    $cal_startDay
 * @property array  $cal_calendar
 * @property string $cal_ctemplate
 * @property string $cal_featured
 */
class ModuleCalendar extends Events
{
	/**
	 * Current date object
	 * @var Date
	 */
	protected $Date;

	/**
	 * Redirect URL
	 * @var string
	 */
	protected $strLink;

	/**
	 * Template
	 * @var string
	 */
	protected $strTemplate = 'mod_calendar';

	/**
	 * Do not show the module if no calendar has been selected
	 *
	 * @return string
	 */
	public function generate()
	{
		$request = System::getContainer()->get('request_stack')->getCurrentRequest();

		if ($request && System::getContainer()->get('contao.routing.scope_matcher')->isBackendRequest($request))
		{
			$objTemplate = new BackendTemplate('be_wildcard');
			$objTemplate->wildcard = '### ' . $GLOBALS['TL_LANG']['FMD']['calendar'][0] . ' ###';
			$objTemplate->title = $this->headline;
			$objTemplate->id = $this->id;
			$objTemplate->link = $this->name;
			$objTemplate->href = StringUtil::specialcharsUrl(System::getContainer()->get('router')->generate('contao_backend', array('do'=>'themes', 'table'=>'tl_module', 'act'=>'edit', 'id'=>$this->id)));

			return $objTemplate->parse();
		}

		$this->cal_calendar = $this->sortOutProtected(StringUtil::deserialize($this->cal_calendar, true));

		// Return if there are no calendars
		if (empty($this->cal_calendar) || !\is_array($this->cal_calendar))
		{
			return '';
		}

		$this->strUrl = preg_replace('/\?.*$/', '', Environment::get('request'));
		$this->strLink = $this->strUrl;

		if (($objTarget = $this->objModel->getRelated('jumpTo')) instanceof PageModel)
		{
			/** @var PageModel $objTarget */
			$this->strLink = $objTarget->getFrontendUrl();
		}

		// Tag the calendars (see #2137)
		if (System::getContainer()->has('fos_http_cache.http.symfony_response_tagger'))
		{
			$responseTagger = System::getContainer()->get('fos_http_cache.http.symfony_response_tagger');
			$responseTagger->addTags(array_map(static function ($id) { return 'contao.db.tl_calendar.' . $id; }, $this->cal_calendar));
		}

		return parent::generate();
	}

	/**
	 * Generate the module
	 */
	protected function compile()
	{
		$month = Input::get('month');
		$day = Input::get('day');

		// Create the date object
		try
		{
			if (\is_string($month))
			{
				$this->Date = new Date($month, 'Ym');
			}
			elseif (\is_string($day))
			{
				$this->Date = new Date($day, 'Ymd');
			}
			else
			{
				$this->Date = new Date();
			}
		}
		catch (\OutOfBoundsException $e)
		{
			throw new PageNotFoundException('Page not found: ' . Environment::get('uri'));
		}

		$time = Date::floorToMinute();

		// Find the boundaries
		$blnShowUnpublished = System::getContainer()->get('contao.security.token_checker')->isPreviewMode();
		$objMinMax = $this->Database->query("SELECT MIN(startTime) AS dateFrom, MAX(endTime) AS dateTo, MAX(repeatEnd) AS repeatUntil FROM tl_calendar_events WHERE pid IN(" . implode(',', array_map('\intval', $this->cal_calendar)) . ")" . (!$blnShowUnpublished ? " AND published='1' AND (start='' OR start<=$time) AND (stop='' OR stop>$time)" : ""));
		$dateFrom = $objMinMax->dateFrom;
		$dateTo = $objMinMax->dateTo;
		$repeatUntil = $objMinMax->repeatUntil;

		if (isset($GLOBALS['TL_HOOKS']['findCalendarBoundaries']) && \is_array($GLOBALS['TL_HOOKS']['findCalendarBoundaries']))
		{
			foreach ($GLOBALS['TL_HOOKS']['findCalendarBoundaries'] as $callback)
			{
				$this->import($callback[0]);
				$this->{$callback[0]}->{$callback[1]}($dateFrom, $dateTo, $repeatUntil, $this);
			}
		}

		$firstMonth = date('Ym', min($dateFrom, $time));
		$lastMonth = date('Ym', max($dateTo, $repeatUntil, $time));

		// The given month is out of scope
		if ($month && ($month < $firstMonth || $month > $lastMonth))
		{
			throw new PageNotFoundException('Page not found: ' . Environment::get('uri'));
		}

		// The given day is out of scope
		if ($day && ($day < date('Ymd', min($dateFrom, $time)) || $day > date('Ymd', max($dateTo, $repeatUntil, $time))))
		{
			throw new PageNotFoundException('Page not found: ' . Environment::get('uri'));
		}

		// Store year and month
		$intYear = date('Y', $this->Date->tstamp);
		$intMonth = date('m', $this->Date->tstamp);

		$objTemplate = new FrontendTemplate($this->cal_ctemplate ?: 'cal_default');
		$objTemplate->intYear = $intYear;
		$objTemplate->intMonth = $intMonth;

		// Previous month
		$prevMonth = ($intMonth == 1) ? 12 : ($intMonth - 1);
		$prevYear = ($intMonth == 1) ? ($intYear - 1) : $intYear;
		$lblPrevious = $GLOBALS['TL_LANG']['MONTHS'][($prevMonth - 1)] . ' ' . $prevYear;
		$intPrevYm = (int) ($prevYear . str_pad($prevMonth, 2, 0, STR_PAD_LEFT));

		// Only generate a link if there are events (see #4160)
		if ($intPrevYm >= $firstMonth)
		{
			$objTemplate->prevHref = $this->strUrl . '?month=' . $intPrevYm;
			$objTemplate->prevTitle = StringUtil::specialchars($lblPrevious);
			$objTemplate->prevLink = $GLOBALS['TL_LANG']['MSC']['cal_previous'] . ' ' . $lblPrevious;
			$objTemplate->prevLabel = $GLOBALS['TL_LANG']['MSC']['cal_previous'];
		}

		// Current month
		$objTemplate->current = $GLOBALS['TL_LANG']['MONTHS'][(date('m', $this->Date->tstamp) - 1)] . ' ' . date('Y', $this->Date->tstamp);

		// Next month
		$nextMonth = ($intMonth == 12) ? 1 : ($intMonth + 1);
		$nextYear = ($intMonth == 12) ? ($intYear + 1) : $intYear;
		$lblNext = $GLOBALS['TL_LANG']['MONTHS'][($nextMonth - 1)] . ' ' . $nextYear;
		$intNextYm = $nextYear . str_pad($nextMonth, 2, 0, STR_PAD_LEFT);

		// Only generate a link if there are events (see #4160)
		if ($intNextYm <= $lastMonth)
		{
			$objTemplate->nextHref = $this->strUrl . '?month=' . $intNextYm;
			$objTemplate->nextTitle = StringUtil::specialchars($lblNext);
			$objTemplate->nextLink = $lblNext . ' ' . $GLOBALS['TL_LANG']['MSC']['cal_next'];
			$objTemplate->nextLabel = $GLOBALS['TL_LANG']['MSC']['cal_next'];
		}

		// Set the week start day
		if (!$this->cal_startDay)
		{
			$this->cal_startDay = 0;
		}

		// 1. GET ALL EVENT DATA
		// ########################################
		$dataArray = [];

			// NOTE : CANT CONVERT BINARY TO JSON . NEED TO FILTER OUT OR CONVERT TO STRING

			// Loop through each model in the collection and extract the data
			foreach (CalendarEventsModel::findAll() as $model) {
			
				// Get the data array from the model
				$data = $model->row();

				// Define an array of keys to exclude
				$keysToExclude = ['singleSRC', 'imagemargin', 'size'];

				// Remove the specified keys from the array
				foreach ($keysToExclude as $key) {
						unset($data[$key]);
				}

				// Define an array of keys to exclude
				$keysToFilter = ['teaser'];

				// ensure that tinymce ouput which gets converted to json is html safe
				/* use dangerouslySetInnerHTML in react 
				to use the tinymce output
			
				    <div className="calendar__eventteaser" dangerouslySetInnerHTML={{ __html: event.teaser}}></div>
				*/
				foreach ($keysToFilter as $key) {
					$data[$key] = json_encode($data[$key]);
			}
				

				// replace lp_image binary with string path.
				$data['lp_image'] = FilesModel::findById($data['lp_image'])->path; 

				// Add the data to the array
				$dataArray[] = $data;
		}
		
			// Convert the array to a JSON string
			$jsonData = json_encode($dataArray);

			dump($dataArray);

		// 2. GENERATE NEXT 50 Weeks with dates for each day
		// ########################################
			$m = new \Moment\Moment(); // current date
			$weekdayNumbers = [1, 2, 3, 4, 5, 6, 7];

			$weeks = [];

			for ($i = 0; $i < 50; $i++) {
			$startOfWeek = $m->startOf('week');

			$week_dates = $startOfWeek->getMomentsByWeekdays($weekdayNumbers, 1);

			array_unshift($week_dates, clone $startOfWeek); // push startofWeek into first position

			array_push($weeks ,$week_dates); // push week_dates into $week array

			$m->addWeeks(1);

}  
			//dump($weeks[0]);

		// Convert the array to a JSON string
		$jsonData_weeks = json_encode($weeks);
		//dump($jsonData_weeks);

		$objTemplate->events = $jsonData;
		$objTemplate->weeks = $jsonData_weeks;
/* 		$objTemplate->days = $this->compileDays(); */
/* 		$objTemplate->weeks = $this->compileWeeks(); */
		$objTemplate->substr = $GLOBALS['TL_LANG']['MSC']['dayShortLength'];

		$this->Template->calendar = $objTemplate->parse();
	}

	/**
	 * Return the week days and labels as array
	 *
	 * @return array
	 */
	protected function compileDays()
	{
		$arrDays = array();

		for ($i=0; $i<7; $i++)
		{
			$strClass = '';
			$intCurrentDay = ($i + $this->cal_startDay) % 7;

			if ($i == 0)
			{
				$strClass .= ' col_first';
			}
			elseif ($i == 6)
			{
				$strClass .= ' col_last';
			}

			if ($intCurrentDay == 0 || $intCurrentDay == 6)
			{
				$strClass .= ' weekend';
			}

			$arrDays[$intCurrentDay] = array
			(
				'class' => $strClass,
				'name' => $GLOBALS['TL_LANG']['DAYS'][$intCurrentDay]
			);
		}

		return $arrDays;
	}

	/**
	 * Return all weeks of the current month as array
	 *
	 * @return array
	 */
	protected function compileWeeks()
	{
		$intDaysInMonth = date('t', $this->Date->monthBegin);
		$intFirstDayOffset = date('w', $this->Date->monthBegin) - $this->cal_startDay;

		if ($intFirstDayOffset < 0)
		{
			$intFirstDayOffset += 7;
		}

		// Handle featured events
		$blnFeatured = null;

		if ($this->cal_featured == 'featured')
		{
			$blnFeatured = true;
		}
		elseif ($this->cal_featured == 'unfeatured')
		{
			$blnFeatured = false;
		}

		$intColumnCount = -1;
		$intNumberOfRows = ceil(($intDaysInMonth + $intFirstDayOffset) / 7);
		$arrAllEvents = $this->getAllEvents($this->cal_calendar, $this->Date->monthBegin, $this->Date->monthEnd, $blnFeatured);
		$arrDays = array();

		// Compile days
		for ($i=1; $i<=($intNumberOfRows * 7); $i++)
		{
			$intWeek = floor(++$intColumnCount / 7);
			$intDay = $i - $intFirstDayOffset;
			$intCurrentDay = ($i + $this->cal_startDay) % 7;

			$strWeekClass = 'week_' . $intWeek;
			$strWeekClass .= ($intWeek == 0) ? ' first' : '';
			$strWeekClass .= ($intWeek == ($intNumberOfRows - 1)) ? ' last' : '';

			$strClass = ($intCurrentDay < 2) ? ' weekend' : '';
			$strClass .= ($i == 1 || $i == 8 || $i == 15 || $i == 22 || $i == 29 || $i == 36) ? ' col_first' : '';
			$strClass .= ($i == 7 || $i == 14 || $i == 21 || $i == 28 || $i == 35 || $i == 42) ? ' col_last' : '';

			// Add timestamp to all cells
			$arrDays[$strWeekClass][$i]['timestamp'] = strtotime(($intDay - 1) . ' day', $this->Date->monthBegin);

			// Empty cell
			if ($intDay < 1 || $intDay > $intDaysInMonth)
			{
				$arrDays[$strWeekClass][$i]['label'] = '&nbsp;';
				$arrDays[$strWeekClass][$i]['class'] = 'days empty' . $strClass;
				$arrDays[$strWeekClass][$i]['events'] = array();

				continue;
			}

			$intKey = date('Ym', $this->Date->tstamp) . ((\strlen($intDay) < 2) ? '0' . $intDay : $intDay);
			$strClass .= ($intKey == date('Ymd')) ? ' today' : '';

			// Mark the selected day (see #1784)
			if ($intKey == Input::get('day'))
			{
				$strClass .= ' selected';
			}

			// Inactive days
			if (empty($intKey) || !isset($arrAllEvents[$intKey]))
			{
				$arrDays[$strWeekClass][$i]['label'] = $intDay;
				$arrDays[$strWeekClass][$i]['class'] = 'days' . $strClass;
				$arrDays[$strWeekClass][$i]['events'] = array();

				continue;
			}

			$arrEvents = array();

			// Get all events of a day
			foreach ($arrAllEvents[$intKey] as $v)
			{
				foreach ($v as $vv)
				{
					$arrEvents[] = $vv;
				}
			}

			$arrDays[$strWeekClass][$i]['label'] = $intDay;
			$arrDays[$strWeekClass][$i]['class'] = 'days active' . $strClass;
			$arrDays[$strWeekClass][$i]['href'] = $this->strLink . '?day=' . $intKey;
			$arrDays[$strWeekClass][$i]['title'] = sprintf(StringUtil::specialchars($GLOBALS['TL_LANG']['MSC']['cal_events']), \count($arrEvents));
			$arrDays[$strWeekClass][$i]['events'] = $arrEvents;
		}

		return $arrDays;
	}
}

class_alias(ModuleCalendar::class, 'ModuleCalendar');
