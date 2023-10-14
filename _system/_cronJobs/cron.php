<?php

  require_once(dirname(__DIR__) . '/_cronJobs/classesCron/Cron.class.php');
  use _cronJobs\Cron;

  echo Cron::refreshValueCurrencies();