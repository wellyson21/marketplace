<?php

include_once('ComponentsApplication.class.php');

use application\basicsComponents\ComponentsApplication;
use classesSystem\controllers\View;
use classesSystem\utilities\Request;
use classesSystem\utilities\Firestore;
use classesSystem\utilities\Login;

class RoutesSystemApplication {

  private $urls = array();
  private $components = array();
  private $componentsInstance;
  private $systemName;

  public function __construct(){

    $this->urls = array(
      "baseUrl" => Request::SERVER('BASE_URL'),
      "appUrl" => Request::SERVER('APP_URL'),
      "managerUrl" => Request::SERVER('MANAGER_URL'),
      "systemUrl" => Request::SERVER('SYSTEM_URL')
    );

    $this->componentsInstance = new ComponentsApplication();

    $this->components = array(
      "header" => $this->componentsInstance->header(),
      "menu" => $this->componentsInstance->menu(),
      "footer" => $this->componentsInstance->footer(),
      "configs_head" => $this->componentsInstance->configs_head(),
      "default_files_css" => $this->componentsInstance->default_files_css(),
      "default_files_javascript" => $this->componentsInstance->default_files_javascript()
    );

    $model = new \classes\models\GeneralModel();
    $model = $model->getGeneralData();
    $this->systemName = @$model["systemName"];

    \classes\models\GeneralModel::update_site_map();
  }

  ///Primaries
  public function index(){

    $model = new \classes\models\HomeModel();

    $components = $this->components;
    $components["header"] = $this->componentsInstance->header(null,$model->getCategoriesData(),$model->getMainSlide());


    View::show('app:index',[
      "urls" => $this->urls,
      "components" => $components,
      "pageTitle" => "{$this->systemName}",
      "topProducts"=> $model->getTopProducts(),
      "blocksData"=> $model->getBlocksData()
    ]);
  }

  public function products(){

    $components = $this->components;
    $components["header"] = $this->componentsInstance->header([
      "pageTitle"=> "Produtos",
      "navigation"=>[
        ["url"=> Request::SERVER("BASE_URL"),"bar"=> "/","name"=>"Home"],
        ["url"=> Request::SERVER("BASE_URL"). "products","bar"=> "","name"=> "Produtos"]
      ]
    ]);

    $model = new \classes\models\ProductsModel();

    View::show('app:products',[
      "urls" => $this->urls,
      "components" => $components,
      "pageTitle" => "{$this->systemName} - Produtos",
      "categories"=> $model->getCategories()
    ]);

  }

  public function productDetails(){

    $model = new \classes\models\ProductsModel();
    $acmodel = new \classes\models\AccountModel();
    $product = $model->getProduct(Request::REQUEST("productId"),true);

    if(count($product) === 0 || !$product["visible"]){

      $page = Request::SERVER("BASE_URL") . "products/";
      header("location: {$page}");
      return;
    }

    $components = $this->components;
    $components["header"] = $this->componentsInstance->header([
      "pageTitle"=> $product["name"],
      "navigation"=>[
        ["url"=> Request::SERVER("BASE_URL"),"bar"=> "/","name"=>"Home"],
        ["url"=> Request::SERVER("BASE_URL"). "products","bar"=> "/","name"=> "produtos"],
        ["url"=> Request::SERVER("BASE_URL"). "products/" . Request::GET("productId"),"bar"=> "","name"=> "Detalhes"]
      ]
    ]);

    $isOwner = $product["advertiser"]["email"] === Request::SESSION("email");
    $hasPaid = false;
    if(!$isOwner){

      $hasPaid = $product["advertiser"]["from"] === "system" ? true : $acmodel->hasPayed($product["advertiser"]["email"]);
    }

    View::show('app:product-details',[
      "urls" => $this->urls,
      "components" => $components,
      "pageTitle" => $product["name"],
      "data"=> $product,
      "hasRegistered"=> $model->hasProposalRegistered(Request::REQUEST("productId")),
      "isOwner"=> $isOwner,
      "hasPaid"=> $hasPaid,
      "isLogged"=> Login::checkUser()
    ]);
  }

  public function contact(){

    $model = new \classes\models\ContactModel();
    $components = $this->components;
    $components["header"] = $this->componentsInstance->header([
      "pageTitle"=> "Contato",
      "navigation"=>[
        ["url"=> Request::SERVER("BASE_URL"),"bar"=> "/","name"=>"Home"],
        ["url"=> Request::SERVER("BASE_URL"). "contact","bar"=> "","name"=> "Contato"]
      ]
    ]);

    View::show('app:contacts',[
      "urls" => $this->urls,
      "components" => $components,
      "pageTitle" => "{$this->systemName} - Contatos",
      "data"=> $model->getContactData()
    ]);
  }

  public function about(){

    $model = new \classes\models\AboutModel();
    $components = $this->components;
    $components["header"] = $this->componentsInstance->header([
      "pageTitle"=> "Sobre",
      "navigation"=>[
        ["url"=> Request::SERVER("BASE_URL"),"bar"=> "/","name"=>"Home"],
        ["url"=> Request::SERVER("BASE_URL"). "about","bar"=> "","name"=> "Sobre"]
      ]
    ]);

    View::show('app:about',[
      "urls" => $this->urls,
      "components" => $components,
      "pageTitle" => "{$this->systemName} - Sobre",
      "data"=> $model->getAboutData()
    ]);
  }

  public function account(){

    if(!Login::checkUser()){

      $index = Request::SERVER("BASE_URL");
      header("location: {$index}");
    }

    $components = $this->components;
    // $components["header"] = $this->componentsInstance->header([
    //   "pageTitle"=> "Minha Conta",
    //   "navigation"=>[
    //     ["url"=> Request::SERVER("BASE_URL"),"bar"=> "/","name"=>"Home"],
    //     ["url"=> Request::SERVER("BASE_URL"). "account","bar"=> "","name"=> "Minha Conta"]
    //   ]
    // ]);

    View::show('app:account',[
      "urls" => $this->urls,
      "components" => $components,
      "pageTitle" => "Account"
    ]);
  }

  ///Authentication
  public function login(){

    if(Login::checkUser()){

      $index = Request::SERVER("BASE_URL");
      header("location: {$index}");
    }

    $components = $this->components;
    $components["header"] = $this->componentsInstance->header([
      "pageTitle"=> "Login",
      "navigation"=>[
        ["url"=> Request::SERVER("BASE_URL"),"bar"=> "/","name"=>"Home"],
        ["url"=> Request::SERVER("BASE_URL"). "login","bar"=> "","name"=> "Login"]
      ]
    ]);

    View::show('app:login',[
      "urls" => $this->urls,
      "components" => $components,
      "pageTitle" => "{$this->systemName} - Login"
    ]);
  }


  /*************************************************** Ajax Routes ****************************************************/
  //Make Login or Register
  public function ajaxAuthentication(){

    $action = Request::POST("action");
    $name = strtolower(trim(Request::POST("name")));
    $email = strtolower(trim(Request::POST("email")));
    $password = trim(Request::POST("password"));

    if($action === "login"){

      Login::$tableLogin = "Profiles";
      Login::$db_provider = "firebase";
      Login::$session_fields = ["email"];

      echo Login::authenticate([
        "email"=> $email,
        "password"=> $password
      ]);

    }else if($action === "register"){

      Login::$tableLogin = "Profiles";
      Login::$db_provider = "firebase";
      Login::$session_set_data = ["email"=> $email];

      $profiles = new Firestore("Profiles");
      $profiles = $profiles->getDocuments([
        "where"=> ["field"=> "email","operator"=> "==","value"=> $email]
      ]);

      if(count($profiles) === 0){
        $status = Login::setUser([
          "email"=> $email,
          "password"=> $password,
          "name"=> $name,
          "advertsEnabled"=> true,
          "photo"=> "https://firebasestorage.googleapis.com/v0/b/madefrio-977a2.appspot.com/o/placeholders%2Fprofile.png?alt=media",
          "contacts"=>[
            "phone"=> ""
          ],
          "address"=>[
            "country"=> "",
            "state"=> "",
            "city"=> "",
            "addressLine"=> "",
            "postalCode"=> ""
          ],
        ]);

        if($status){

          $ac = new \classes\models\AccountModel();
          $ac->addPayment($email);
          \classes\models\HomeModel::subscribeNewsletter($email);
        }

        echo $status;
      }else{

        echo 2;
      }
    }else if($action === "logout"){

      Login::logout();
    }

  }

  //Request Reset Password
  public function requestRestPassword(){

    $email = strtolower(trim(Request::POST("email") . ""));

    $collection = new Firestore("Profiles");
     $profile = $collection->getDocuments([
      "where"=> ["field"=> "email","operator"=> "==","value"=> $email]
    ]);

     if(count($profile)){

       $emailCoded = sha1($email);
       $collection->setCollection("RecoverPassword");
       $collection->newDocument(["time"=> time(),"email"=> $email,"profileId"=> $profile[0]["id"]],$emailCoded);

       $gm = new \classes\models\GeneralModel();
       $gm = $gm->getGeneralData();
       $mail = new \classesSystem\utilities\Mail();

       $mail->login($gm["mail"]["email"],$gm["mail"]["password"]);
       $mail->setFrom(Request::POST("email"));
       $mail->setMessage("Recuperação de senha","Solicitação de recuperação de senha:<br/>Segue o link: ". Request::SERVER("BASE_URL")."resetPassword/{$emailCoded}/");
       $mail->addAddress($email);
       $mail->send();

      echo 1;
     }else{

       echo 0;
     }

  }

  //Reset Password
  public function resetPassword(){

    $emailCoded = strtolower(trim(Request::GET("emailCode")));
    $collection = new Firestore("RecoverPassword");

    $request = $collection->getDocuments([
      "docName"=> $emailCoded
    ]);

    if(is_array($request) && count($request) > 0){


      if($request["profileId"]){

        $newPassword = \classes\utilities\GenerateCode::getPassword();

        $collection->setCollection("Profiles");
        $collection->updateDocument(["password"=> $newPassword],$request["profileId"]);

        $collection->setCollection("RecoverPassword");
        $collection->dropDocument($emailCoded);

        $gm = new \classes\models\GeneralModel();
        $gm = $gm->getGeneralData();
        $mail = new \classesSystem\utilities\Mail();

        $mail->login($gm["mail"]["email"],$gm["mail"]["password"]);
        $mail->setFrom(Request::POST("email"));
        $mail->setMessage("Recuperação de senha","Sua nova Senha: {$newPassword}");
        $mail->addAddress($request["email"]);

        echo $mail->send();
      }
    }

    $index = Request::SERVER("BASE_URL");
    header("location: {$index}");
  }

  //Get products
  public function productsAjax(){

    $model = new \classes\models\ProductsModel();

    if(!empty(Request::REQUEST("isSearch"))){

      $model->queryByName(Request::REQUEST());
    }else if(!empty(Request::REQUEST("categories"))){

      echo json_encode($model->getCategories());
    }else{

      $model->getProducts(Request::REQUEST());
    }
  }

  //Send message from contact form
  public function sendMessage(){

    $gm = new \classes\models\GeneralModel();
    $gm = $gm->getGeneralData();
    $mail = new \classesSystem\utilities\Mail();

    $mail->login($gm["mail"]["email"],$gm["mail"]["password"]);
    $mail->setFrom(Request::POST("email"));
    $mail->setMessage(Request::POST("subject"),Request::POST("message"));
    $mail->addAddress($gm["mail"]["email"]);

    echo $mail->send() ? 1 : 0;
  }


  //Subscribe to receive news
  public function subscribeNewsletter(){

    echo \classes\models\HomeModel::subscribeNewsletter(Request::POST("email"));
  }

  //// Account Routes Handlers ///
  public function ajaxAdverts(){

    if(!Login::checkUser()){ return; }

    $action = Request::POST("action");
    $model = new \classes\models\AccountModel();


    if($action === "get"){

      $offset = Request::POST("offset");
      echo json_encode($model->getAdverts(null,$offset,true));
    }else if($action === "add"){

      $data = json_decode(Request::POST("advert"),true);
      echo json_encode($model->addAdvert($data));
    }else if($action === "update"){

      $data = json_decode(Request::POST("advert"),true);
      echo json_encode($model->updateAdvert($data));
    }else if($action === "remove"){

      $id = Request::POST("id");
      echo json_encode($model->removeAdvert($id));
    }

  }

  public function ajaxProposals(){

    if(!Login::checkUser()){ return; }

    $action = Request::POST("action");
    $model = new \classes\models\AccountModel();

    if($action === "get"){

      $type = Request::POST("type");
      $offset = Request::POST("offset");
      echo json_encode($model->getProposals($type,null, $offset));
    }else if($action === "add"){

      $pmodel = new \classes\models\ProductsModel();
      $id = Request::POST("productId");
      $price = Request::POST("price");
      if(!$pmodel->hasProposalRegistered($id)){

        echo $model->addProposal($id,$price);
      }
    }else if($action === "remove"){

      $id = Request::POST("id");
      $productId = Request::POST("productId");
      echo $model->removeProposal($id, $productId);
    }
  }

  public function ajaxProfile(){

    if(!Login::checkUser()){ return; }

    $action = Request::POST("action");
    $model = new \classes\models\AccountModel();

    if($action === "get"){

      echo json_encode($model->getProfile());
    }else if($action === "update"){

      $data = json_decode(Request::POST("profile"),true);
      echo json_encode($model->setProfile($data));
    }

  }

  public function ajaxAccountGeneral(){

    if(!Login::checkUser()){ return; }

    $action = Request::POST("action");
    $model = new \classes\models\AccountModel();

    if($action === "getFee"){

      echo $model->getMonthlyFee();
    }else if($action === "checkPayment"){

      echo $model->hasPayed();
    }else if($action === "all"){

      echo json_encode(["fee"=> $model->getMonthlyFee(),"hasPayed"=> $model->hasPayed()]);
    }
  }

  public function ajaxAccountProfileGeneral(){

    if(!Login::checkUser()){ return; }

    $model = new \classes\models\AccountModel();
    echo json_encode(["profile"=>$model->getProfile(),"general"=> ["fee"=> $model->getMonthlyFee(),"hasPayed"=> $model->hasPayed()]]);
  }


  //// Paypal Payment ////
  public function payTax(){

    if(!Login::checkUser()){

      $index = Request::SERVER("BASE_URL");
      header("location: {$index}");
    }

    $generalModel = new \classes\models\GeneralModel();
    $generalModel = $generalModel->getGeneralData();

    $fee = $generalModel["monthlyFee"];

    $paypal_settings = $generalModel["paypal"];
    $clientId= $paypal_settings['clientId'];
    $clientSecret = $paypal_settings['appSecret'];

    $paypal = new \classesSystem\controllers\PayPal($clientId,$clientSecret);

    if(Request::POST('action') === 'buy'){

      $amount = $fee;
      $currency = "BRL";

      $paypal->setPaymentMethod();

      $paypal->setItem([
        ['currency'=>$currency,'name'=>'Pagar taxa de postagem de anúncios.','price'=>$amount]
      ]);

      $paypal->setRedirectUrls(Request::SERVER('BASE_URL').'paypal?success=true',Request::SERVER('BASE_URL').'student?error=true');
      \classesSystem\controllers\PayPal::setLocale("PT_br",$generalModel["systemName"]);
      $redirect_url = $paypal->setPayment('Mensalidade do serciço de anúncios.','sale');
      Request::SESSION('paypalCustomerEmail', Request::SESSION("email"));
      echo $redirect_url;

    }else if(Request::GET('success')){

      if($paypal->finishingPayment()){

        $model = new \classes\models\AccountModel();
        $model->addPayment();

        @session_start();
        unset($_SESSION["paypalCustomerEmail"]);
        header('location: '.Request::SERVER('BASE_URL').'account/#!/adverts/');
      }else{

        @session_start();
        unset($_SESSION["paypalCustomerEmail"]);
        header('location: '.Request::SERVER('BASE_URL').'account/#!/adverts/');
      }
    }else if(Request::GET('error')){

      @session_start();
      unset($_SESSION["paypalCustomerEmail"]);
      header('location: '.Request::SERVER('BASE_URL').'account/#!/adverts/');
    }

  }


  //// Translate ////
  public function translate(){

    new \classesSystem\utilities\Translate();
  }


}
