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
        $consultas = Consulta::with('paciente')
            ->orderBy('fecha_consulta', 'desc')
            ->get();

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

    public function destroy($id)
    {
        $consulta = Consulta::findOrFail($id);

        $consulta->delete();

        return response()->json([
            'mensaje' => 'Consulta eliminada correctamente'
        ]);
    }
}