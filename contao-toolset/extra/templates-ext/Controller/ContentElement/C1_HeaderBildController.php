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
use Contao\BackendTemplate;
use Lupcom\LazyloadBundle\Image;
/**
 * Class C1_HeaderBild
 *
 * @ContentElement(C1_HeaderBild::TYPE, category="Inhaltselemente", template="c1_headerbild")
 */
class C1_HeaderBild extends AbstractContentElementController
{
    public const TYPE = 'c1_headerbild';

    /**
     * Generate the content element
     */
    protected function getResponse(Template $template, ContentModel $model, Request $request): ?Response
    {   
        if (TL_MODE == 'BE') {
            $template = new \contao\BackendTemplate('be_wildcard');
            $template->title = "HeaderBild";
            $template->wildcard   = "HeaderBild";
        }
        
        $GLOBALS['TL_CSS']['customelement_css'] = 'web/bundles/customelements/css/customelements.css';



        return $template->getResponse();
    }

  
}
