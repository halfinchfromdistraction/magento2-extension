<?php

/*
 * @author     M2E Pro Developers Team
 * @copyright  M2E LTD
 * @license    Commercial use is forbidden
 */

namespace Ess\M2ePro\Controller\Adminhtml\Amazon\Listing\Product\Variation;

use Ess\M2ePro\Controller\Adminhtml\Amazon\Main;

class GetSwitchToIndividualModePopUp extends Main
{
    public function execute()
    {
        $block = $this->createBlock('Amazon\Listing\Product\Variation\SwitchToIndividualPopup');

        $this->setAjaxContent($block);

        return $this->getResult();
    }
}