<?php

namespace App\Http\Controllers;

use App\Models\Consulta;
use Illuminate\Http\Request;

class ConsultaController extends Controller
{
    // =========================================
    // LISTAR CONSULTAS
    // =========================================


public function index()
{
    $consultas = Consulta::with([
        'paciente',
        'anuladaPor:id,name'
    ])
        ->orderBy('fecha_consulta', 'desc')
        ->get();

    $consultas->each(function ($consulta) {
        $responsable = $consulta->anuladaPor;

        $consulta->unsetRelation('anuladaPor');

        $consulta->setAttribute(
            'usuario_anulacion',
            $responsable ? [
                'id' => $responsable->id,
                'name' => $responsable->name,
            ] : null
        );
    });

    return response()->json($consultas);
}
   // =========================================
    // CREAR CONSULTA
    // =========================================

    public function store(Request $request)
    {
        $datos = $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
            'fecha_consulta' => 'required|date',
            'motivo_consulta' => 'required|string',
            'diagnostico' => 'nullable|string',
            'tratamiento' => 'nullable|string',
            'observaciones' => 'nullable|string',
        ]);

        $consulta = Consulta::create($datos);

        return response()->json(
            $consulta->load('paciente'),
            201
        );
    }

    // =========================================
    // MOSTRAR UNA CONSULTA
    // =========================================

    public function show($id)
    {
        $consulta = Consulta::with('paciente')
            ->findOrFail($id);

        return response()->json($consulta);
    }

    // =========================================
    // ACTUALIZAR CONSULTA
    // =========================================

    public function update(Request $request, $id)
    {
        $consulta = Consulta::findOrFail($id);

if ($consulta->anulada) {
    return response()->json([
        'mensaje' => 'No se puede modificar una consulta anulada.'
    ], 409);
}


        $datos = $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
            'fecha_consulta' => 'required|date',
            'motivo_consulta' => 'required|string',
            'diagnostico' => 'nullable|string',
            'tratamiento' => 'nullable|string',
            'observaciones' => 'nullable|string',
        ]);

        $consulta->update($datos);

        return response()->json(
            $consulta->load('paciente')
        );
    }

    // =========================================
    // ELIMINAR CONSULTA
    // =========================================

   

public function destroy(Request $request, $id)
{
    $consulta = Consulta::findOrFail($id);

    if ($consulta->anulada) {
        return response()->json([
            'mensaje' => 'Esta consulta ya está anulada'
        ], 409);
    }

    $datos = $request->validate([
        'motivo_anulacion' => 'required|string|max:1000',
    ]);

    $consulta->update([
        'anulada' => true,
        'fecha_anulacion' => now(),
        'motivo_anulacion' => $datos['motivo_anulacion'],
        'anulada_por' => $request->user()->id,
    ]);

    return response()->json([
        'mensaje' => 'Consulta anulada correctamente',
        'consulta' => $consulta->fresh()
    ]);
}



}