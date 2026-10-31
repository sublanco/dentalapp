
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\HistoriaClinicaController;
use App\Http\Controllers\ConsultaController;
use App\Http\Controllers\OdontogramaPiezaController;

// Inicio de sesión público
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {

    // Autenticación
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Pacientes
    Route::get('/pacientes', [PacienteController::class, 'index']);
    Route::post('/pacientes', [PacienteController::class, 'store']);
    Route::get('/pacientes/{id}', [PacienteController::class, 'show']);
    Route::put('/pacientes/{id}', [PacienteController::class, 'update']);
    Route::delete('/pacientes/{id}', [PacienteController::class, 'destroy']);

    // Historias clínicas
    Route::apiResource('historias-clinicas', HistoriaClinicaController::class);

    // Consultas
    Route::apiResource('consultas', ConsultaController::class);

    // Odontograma
    Route::get('/pacientes/{pacienteId}/odontograma', [OdontogramaPiezaController::class, 'index']);
    Route::post('/pacientes/{pacienteId}/odontograma', [OdontogramaPiezaController::class, 'store']);
    Route::delete('/odontograma-piezas/{id}', [OdontogramaPiezaController::class, 'destroy']);

});
