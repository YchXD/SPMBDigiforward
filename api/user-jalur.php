<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit();
    }

    $user_id = $_SESSION['user']['id'];

    try {
        $stmt = $pdo->prepare("
            SELECT j.* 
            FROM user_jalur uj
            INNER JOIN jalur j ON uj.jalur_id = j.id
            WHERE uj.user_id = ? AND uj.status = 'aktif'
            LIMIT 1
        ");
        $stmt->execute([$user_id]);
        $jalur = $stmt->fetch();

        if ($jalur) {
            echo json_encode(['success' => true, 'jalur' => $jalur]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Belum memilih jalur']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
