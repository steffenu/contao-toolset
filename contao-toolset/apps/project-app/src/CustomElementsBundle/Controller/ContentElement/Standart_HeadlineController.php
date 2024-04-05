<?php

declare(strict_types=1);

namespace App\CustomElementsBundle\Controller\ContentElement;

use Contao\ContentModel;
use Contao\FilesModel;
use Contao\ImageSizeModel;
use Contao\PageModel;
use Contao\CoreBundle\Controller\ContentElement\AbstractContentElementController;
use Contao\CoreBundle\ServiceAnnotation\ContentElement;
use Contao\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use \Contao\StringUtil;

use Lupcom\LazyloadBundle\Image;
/**
 * Class Standart_HeadlineController
 *
 * @ContentElement(Standart_HeadlineController::TYPE, category="Standart Inhaltselemente", template="ce_standart_headline")
 */
class Standart_HeadlineController extends AbstractContentElementController
{
    public const TYPE = 'standart_headline';

    /**
     * Generate the content element
     */
    protected function getResponse(Template $template, ContentModel $model, Request $request): ?Response
    {   

        if (TL_MODE == 'BE') {
            $template = new \contao\BackendTemplate('be_wildcard');
            $template->title = "Überschrift";
            $template->wildcard   = unserialize($model->headline)['value'];
            
        }

        $GLOBALS['TL_CSS']['customelement_css'] = 'web/bundles/customelements/css/customelements.css';

        //$test =  \Contao\StringUtil::deserialize($model->partner);
        //dump($test);

        return $template->getResponse();
    }


}
