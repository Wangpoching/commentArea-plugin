<?php 
  require(dirname(__FILE__).'/conn.php');
  require(dirname(__FILE__).'/utils.php');
  header('Content-type: application/json;charset=utf-8');
  header('Access-Control-Allow-Origin: *');

  // 檢查資料是否完整
  if (!is_set('site_key','get')) {
    $json = array(
      'ok' => False,
      'message' => 'No site_key'
    );
    $response = json_encode($json);
    echo $response;
    die();
  }
  $site_key = $_GET['site_key'];

  // 獲取 limit 以及 offset 來取得留言
  if (!is_set('limit','get') || !is_set('offset','get')) {
    $sql = 'SELECT nickname, content, created_at FROM boching_discussions  WHERE site_key = ? ORDER BY id DESC';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $site_key);    
  } else {
    $limit = intval($_GET['limit']);
    $offset = intval($_GET['offset']);
    $sql = 'SELECT nickname, content, created_at FROM boching_discussions  WHERE site_key = ? ORDER BY id DESC limit ? offset ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sii', $site_key, $limit, $offset);
  }

  // 資料庫錯誤
  $result = $stmt->execute();
  if (!$result) {
    $json = array(
      'ok' => False,
      'message' => $conn->error
    );
    $response = json_encode($json);    
    echo $response;
    die();
  }

  // 成功獲取留言
  $result = $stmt->get_result();
  $discussions = array();
  while ($row = $result->fetch_assoc()) {
    array_push($discussions, array(
      'nickname' => $row['nickname'],
      'content' => $row['content'],
      'createdAt' => $row['created_at'],
    ));
  }
  $json = array(
    'ok' => True,
    'discussions' => $discussions
  );
  $response = json_encode($json);
  echo $response;
?>