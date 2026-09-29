<?php

namespace App\Http\Controllers;

use App\Models\OdontogramaPieza;
use Illuminate\Http\Request;

class OdontogramaPiezaController extends Controller
{
    /**
     * Obtener todas las piezas del odontograma de un paciente.
     */
    public function index($pacienteId)
    {
        $piezas = OdontogramaPieza::where('paciente_id', $pacienteId)
            ->orderBy('numero_pieza')
            ->get();

        return response()->json($piezas);
    }

    /**
     * Guardar o actualizar una pieza del odontograma.
     */
    public function store(Request $request, $pacienteId)
    {
        $datos = $request->validate([
            'numero_pieza' => 'required|string|max:3',
            'estado' => 'required|string|max:255',
            'observaciones' => 'nullable|string',
        ]);

        $pieza = OdontogramaPieza::updateOrCreate(
            [
                'paciente_id' => $pacienteId,
                'numero_pieza' => $datos['numero_pieza'],
            ],
            [
                'estado' => $datos['estado'],
                'observaciones' => $datos['observaciones'] ?? null,
            ]
        );

        return response()->json($pieza, 201);
    }

    /**
     * Eliminar una pieza del odontograma.
     */
    public function destroy($id)
    {
        $pieza = OdontogramaPieza::findOrFail($id);

        $pieza->delete();

        return response()->json([
            'mensaje' => 'Pieza eliminada correctamente'
        ]);
    }
}