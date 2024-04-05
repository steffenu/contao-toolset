<?php

declare(strict_types=1);

namespace App\##NAME_BUNDLE##Bundle\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;

/**
 * Class ##NAME_BUNDLE##Extension
 */
class ##NAME_BUNDLE##Extension extends Extension
{

    /**
     * @throws \Exception
     */
    public function load(array $configs, ContainerBuilder $container): void
    {

        $loader = new YamlFileLoader(
            $container,
            new FileLocator(__DIR__ . '/../Resources/config')
        );

        //$loader->load('parameters.yml');
        $loader->load('services.yml');
        //$loader->load('listener.yml');

    }
}
