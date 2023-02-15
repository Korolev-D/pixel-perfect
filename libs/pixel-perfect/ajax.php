<?php require_once($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog.php");
global $APPLICATION;
$APPLICATION->RestartBuffer();
const TYPES = array("jpg", "png");
$sPathImages = $_SERVER["DOCUMENT_ROOT"] . SITE_TEMPLATE_PATH . "/libs/pixel-perfect/images/";
opendir($sPathImages) or die("Ошибка при открытии папки!");
$arFiles = scandir($sPathImages);
$arImages = array();
foreach($arFiles as $arFile){
    if($arFile === "." || $arFile === "..") continue;
    $arParts = explode(".", $arFile);
    $sExtension = strtolower(array_pop($arParts));
    if(in_array($sExtension, TYPES)){
        list ($iWidth, $iHeight) = getimagesize($sPathImages . "/" . $arFile);
        $arImages[] = array(
            "WIDTH" => $iWidth,
            "HEIGHT" => $iHeight,
            "SRC" => SITE_TEMPLATE_PATH . "/libs/pixel-perfect/images/" . $arFile
        );
    }
}
if(!empty($arImages)){
    usort($arImages, function($arFirst, $arSecond){
        return ($arFirst["WIDTH"] - $arSecond["WIDTH"]);
    });
}
$arResponse = array(
    "status" => true,
    "error" => "",
    "images" => $arImages
);
echo json_encode($arResponse, JSON_UNESCAPED_UNICODE);
CMain::FinalActions();