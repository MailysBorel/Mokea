<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';
$pdo = new PDO('mysql:host=localhost;dbname=sae_301-303', 'root', '');

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)){
    $sql = "SELECT id, firstname, lastname, email, password, address FROM users WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':email' => $data->email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if($user && password_verify($data->password, $user['password'])){
        // Remove password from response
        unset($user['password']);

        // Generate token
        $token = base64_encode(json_encode($user));

        http_response_code(200);
        echo json_encode([
            "message" => "Login successful.",
            "token" => $token,
            "user" => $user
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Login failed. Invalid email or password."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
?>
