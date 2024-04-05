<?php

declare(strict_types=1);

namespace App\##NAME_BUNDLE##\Controller\ContentElement;

use Contao\ContentModel;
use Contao\FilesModel;
use Contao\ImageSizeModel;
use Contao\PageModel;
use Contao\CoreBundle\Controller\ContentElement\AbstractContentElementController;
use Contao\CoreBundle\ServiceAnnotation\ContentElement;
use Contao\Template;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Contao\BackendTemplate;
use Lupcom\LazyloadBundle\Image;
/**
 * Class ##NAME_CONTROLLER##Controller
 *
 * @ContentElement(##NAME_CONTROLLER##Controller::TYPE, category="Inhaltselemente", template="##NAME_TEMPLATE##")
 */
class ##NAME_CONTROLLER##Controller extends AbstractContentElementController
{
    public const TYPE = '##TYPE##';

    /**
     * Generate the content element
     */
    protected function getResponse(Template $template, ContentModel $model, Request $request): ?Response
    {   
        if (TL_MODE == 'BE') {
            $template = new \contao\BackendTemplate('be_wildcard');
            $template->title = "##BACKENDNAME##";
            $template->wildcard   = "##BACKENDNAME##";
        }
        
        $GLOBALS['TL_CSS']['customelement_css'] = 'web/bundles/customelements/css/customelements.css';



        return $template->getResponse();
    }

  
}
