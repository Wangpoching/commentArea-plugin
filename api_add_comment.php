<?php 
  require(dirname(__FILE__).'/conn.php');
  require(dirname(__FILE__).'/utils.php');
  header('Content-type: application/json;charset=utf-8');
  header('Access-Control-Allow-Origin: *');
  $json = array();

  // 檢查資料是否完整
  if (!is_set('site_key','post') || !is_set('nickname','post') || !is_set('content','post')) {
    $json['ok'] = False;
    $json['message'] = 'Please input missing fields.';
    $response = json_encode($json);
    echo $response;
    die();
  }
  $site_key = $_POST['site_key'];
  $nickname = $_POST['nickname'];
  $content = $_POST['content'];

  // 在資料庫新增留言  
  $sql = 'INSERT INTO boching_discussions (site_key, nickname, content) VALUES (?, ?, ?)';
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('sss', $site_key, $nickname, $content);
  $result = $stmt->execute();
  // 資料庫錯誤
  if (!$result) {
    $json['ok'] = False;
    $json['message'] = $conn->error;
    $response = json_encode($json);
    echo $response;
    die();
  }
  // 成功新增
  $json['ok'] = True;
  $json['message'] = 'success';
  $response = json_encode($json);
  echo $response;
?>