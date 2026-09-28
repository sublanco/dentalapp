<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\HistoriaClinicaController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/pacientes', [PacienteController::class, 'index']);
Route::post('/pacientes', [PacienteController::class, 'store']);
Route::get('/pacientes/{id}', [PacienteController::class, 'show']);
Route::put('/pacientes/{id}', [PacienteController::class, 'update']);
Route::delete('/pacientes/{id}', [PacienteController::class, 'destroy']);

Route::apiResource('historias-clinicas', HistoriaClinicaController::class);

