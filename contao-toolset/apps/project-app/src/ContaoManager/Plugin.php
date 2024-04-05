<?php

declare(strict_types=1);


namespace App\ContaoManager;

##IMPORT_BUNDLES##
use Contao\CoreBundle\ContaoCoreBundle;
use Contao\ManagerPlugin\Bundle\BundlePluginInterface;
use Contao\ManagerPlugin\Bundle\Config\BundleConfig;
use Contao\ManagerPlugin\Bundle\Parser\ParserInterface;
use App\CustomElementsBundle\CustomElementsBundle;



/**
 * Class Plugin
 */
class Plugin implements BundlePluginInterface
{
    /**
     * @return array
     */
    public function getBundles(ParserInterface $parser)
    {
        return [
            ##APPEND_BUNDLES##
            BundleConfig::create(CustomElementsBundle::class)
            ->setLoadAfter([ContaoCoreBundle::class]),

        ];
    }
}

