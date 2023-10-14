<?php
/**
 * Created by PhpStorm.
 * User: Lucas
 * Date: 11/08/2017
 * Time: 11:59
 */

namespace classesSystem\controllers;

use classesSystem\utilities\Request;
use classesSystem\crud\Create;

use PayPal\Api\FundingInstrument;
use PayPal\Api\PaymentExecution;
use PayPal\Rest\ApiContext;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Api\Amount;
use PayPal\Api\Details;
use PayPal\Api\Item;
use PayPal\Api\ItemList;
use PayPal\Api\Payee;
use PayPal\Api\Payer;
use PayPal\Api\Payment;
use PayPal\Api\RedirectUrls;
use PayPal\Api\Transaction;
use PayPal\Api\PaymentCard;
use PayPal\Api\PayoutItem;
use PayPal\Api\Payout;
use PayPal\Api\PayoutSenderBatchHeader;
use PayPal\Api\Currency;
use Paypal\Converter\FormatConverter;

class PayPal {

  public $API;
  private $ItemList;
  private $Details;
  public $Payer;
  private $Amount;
  public $Transaction;
  private $RedirectUrls;
  public $Payment;
  private $Card;
  
  private static $reference;
  
  private static $WebProfile;

  public function __construct($clientId, $clientSecret){
    $this->API = new ApiContext(
      new OAuthTokenCredential(
        $clientId,
        $clientSecret
      )
    );
    
    self::$reference = $this;

    self::setLocale("US");
  }

  /*** define payment method ***/
  public function setPaymentMethod($method = 'paypal'){

    $this->Payer = new Payer();
    $this->Payer->setPaymentMethod($method);

  }

  /*** set transaction item ***/
  public function setItem(array $items){
    $allItems = [];
    foreach($items as $key => $val){

      $item = new Item();
      $item->setCurrency($val['currency']);
      $item->setName($val['name']);
      $item->setQuantity(1);
//        $item->setQuantity(isset($val['quantity']) ? (int)$val['quantity'] : 1);
      $item->setPrice((double)$val['price']);
      array_push($allItems,$item);

    }

    $this->ItemList = new ItemList();
    $this->ItemList->setItems($allItems);
    $this->setAmount();

  }

  /*** set Redirect urls ****/
  public function setRedirectUrls($success,$cancel){

    $this->RedirectUrls = new RedirectUrls();
    $this->RedirectUrls->setReturnUrl($success)->setCancelUrl($cancel);

  }

  /*** Set Credit card ***/
  public function setCreditCard(Array $data){

    $this->Card = new PaymentCard();
    $this->Card->setNumber($data['number']);
    $this->Card->setExpireMonth($data['month']);
    $this->Card->setExpireYear($data['year']);
    $this->Card->setType($data['type']);
    $this->Card->setFirstName(isset($data['cvv']) ? $data['firstName'] : 'fffff');
    $this->Card->setLastName(isset($data['cvv']) ? $data['lastName'] : 'fffff');
    $this->Card->setCvv2(isset($data['cvv']) ? $data['cvv'] : '123');
    $this->Card->setBillingCountry(isset($data['country']) ? $data['country'] : 'BR');


    $fi = new FundingInstrument();
    $fi->setPaymentCard($this->Card);
    $this->Payer->setFundingInstruments([$fi]);

  }

  /*** Set Payment ***/
  public function setPayment($description,$intent = 'sale',$email_payee = false){

    $this->transaction($description);

    if($email_payee){
      $payee = new Payee();
      $payee->setEmail($email_payee);
      $this->Transaction->setPayee($payee);
    }

    $this->Payment = new Payment();
    $this->Payment->setIntent($intent);

    $this->Payment->setExperienceProfileId(self::$WebProfile->getId());

    $this->Payment->setPayer($this->Payer);

    $this->Payment->setTransactions([$this->Transaction]);

    $this->Payment->setRedirectUrls($this->RedirectUrls);

    return $this->createPayment();

  }
  
  public static function setLocale($locale = "US",$brand = null){
    
    $presentation = (new \PayPal\Api\Presentation())
    ->setLocaleCode($locale);
    
    if($brand != null){
      
      $presentation->setBrandName($brand);
    }
    
    $webProfile = (new \PayPal\Api\WebProfile())
    ->setName(uniqid())
    ->setPresentation($presentation);
    
    $createProfileResponse = $webProfile->create(self::$reference->API);
    $profileId = $createProfileResponse->getId();
    
    self::$WebProfile = $createProfileResponse;
  }

  /*** Payment finishing ***/
  public function finishingPayment(){

    $payment_id = Request::GET('paymentId');
    $payment = Payment::get($payment_id,$this->API);

    $execution = new PaymentExecution();
    $execution = $execution->setPayerId(Request::GET('PayerID'));

    try{

      $payment->execute($execution,$this->API);
      return true;

    }catch (\Exception $e){

      return false;
    }

  }

  /**** realiza pagamentos ****/
  public function payouts($items){

    $subject = isset($items[0]['subject']) ? $items[0]['subject'] : 'You have a payment';
    $note = isset($items[0]['note']) ? $items[0]['note'] : 'Thanks fo use we services.';

    $payouts = new Payout();
    $senderBatchHeader = new PayoutSenderBatchHeader();
    $senderBatchHeader->setSenderBatchId(uniqid());
    $senderBatchHeader->setEmailSubject($subject);
    $payouts->setSenderBatchHeader($senderBatchHeader);

    foreach ($items as $item){

      $receive = $item['receive'];
      $value = number_format($item['value'],2,'.',',');
      $amount = [
        'value' => $value * 1,
        'currency' => $item['currency']
      ];

      $senderItem = new PayoutItem();
      $senderItem->setRecipientType('Email')
        ->setNote($note)
        ->setReceiver($receive)
        ->setSenderItemId(uniqid())
        ->setAmount(new Currency(json_encode($amount)));

      $payouts->addItem($senderItem);

    }


    $output = $payouts->create(null,$this->API);
    return $output;

  }

  /*** Realiza conversões de moedas ****/
  public static function currency_convert($from,$to,$value){

	$from = strtoupper($from);
	$to = strtoupper($to);
	$value = (double)$value;
  
    $data = file_get_contents("https://pt.coinmill.com/{$from}_{$to}.html?{$from}={$value}");
	$startPos = strpos($data,'<div id="currencyBox1">');
	$data = substr($data,$startPos);
	$data = explode('</div>',$data)[0];
	preg_match("@value=\"[0-9\.]*\"@",$data, $converted);
	$data = $converted;
	$data = preg_replace("/[^0-9.]/", "", $data)[0];
	return number_format(round($data, 3),2);
  }

  /*** retorna api ***/
  public function getApi(){

    return $this->API;
  }

  private function transaction($description){

    $this->Transaction = new Transaction();
    $this->Transaction->setAmount($this->Amount)->setItemList($this->ItemList)->setDescription($description);

  }

  private function setAmount(){

    $this->Amount = new Amount();
    $this->Amount->setCurrency($this->ItemList->items[0]->currency);

    $price = 0;
    foreach($this->ItemList->items as $val){

      $price += $val->price * 1;

    }

    $this->Amount->setTotal($price);

  }

  private function createPayment(){

    $payment = $this->Payment;

    try{

      $payment = $payment->create($this->API);

    }catch (\Exception $e){

      exit();
    }

    return $payment->getApprovalLink();

  }

}
