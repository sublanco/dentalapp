<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\HistoriaClinicaController;
use App\Http\Controllers\ConsultaController;
use App\Http\Controllers\OdontogramaPiezaController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/pacientes', [PacienteController::class, 'index']);
Route::post('/pacientes', [PacienteController::class, 'store']);
Route::get('/pacientes/{id}', [PacienteController::class, 'show']);
Route::put('/pacientes/{id}', [PacienteController::class, 'update']);
Route::delete('/pacientes/{id}', [PacienteController::class, 'destroy']);

Route::apiResource('historias-clinicas', HistoriaClinicaController::class);
Route::apiResource('consultas', ConsultaController::class);
Route::get('/pacientes/{pacienteId}/odontograma',[OdontogramaPiezaController::class, 'index']);

Route::post('/pacientes/{pacienteId}/odontograma',[OdontogramaPiezaController::class, 'store']);

Route::delete('/odontograma-piezas/{id}',[OdontogramaPiezaController::class, 'destroy']);

