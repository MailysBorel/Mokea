<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';
$pdo = new PDO('mysql:host=localhost;dbname=sae_301-303', 'root', '');

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->firstname) && 
    !empty($data->lastname) && 
    !empty($data->email) && 
    !empty($data->password) && 
    !empty($data->address)
){
    // Hash password
    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

    $sql = "INSERT INTO users (firstname, lastname, email, password, address) VALUES (:firstname, :lastname, :email, :password, :address)";
    $stmt = $pdo->prepare($sql);

    if($stmt->execute([
        ':firstname' => $data->firstname,
        ':lastname' => $data->lastname,
        ':email' => $data->email,
        ':password' => $password_hash,
        ':address' => $data->address
    ])) {
        // Retrieve the created user (without password)
        $id = $pdo->lastInsertId();
        $user = [
            'id' => $id,
            'firstname' => $data->firstname,
            'lastname' => $data->lastname,
            'email' => $data->email,
            'address' => $data->address
        ];

        // Generate a fake token (in real app, use JWT)
        $token = base64_encode(json_encode($user));

        http_response_code(201);
        echo json_encode([
            "message" => "User created successfully.",
            "token" => $token,
            "user" => $user
        ]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to create user."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Unable to create user. Data is incomplete."]);
}
?>
