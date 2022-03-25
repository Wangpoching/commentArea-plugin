<?php
  // 檢查輸入是否被設置且不為空
  function is_set($input, $method) {
    if ($method === 'get') {
      return (isset($_GET[$input]) && strlen($_GET[$input]));
    } else if ($method === 'session') {
      return (isset($_SESSION[$input]) && strlen($_SESSION[$input]));  
    } else {
      return (isset($_POST[$input]) && strlen($_POST[$input]));
    }
  }