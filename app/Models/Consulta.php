<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consulta extends Model
{
    protected $fillable = [
        'paciente_id',
        'fecha_consulta',
        'motivo_consulta',
        'diagnostico',
        'tratamiento',
        'observaciones',
        'anulada',
        'fecha_anulacion',
        'motivo_anulacion',
        'anulada_por',
    ];

    protected $casts = [
        'anulada' => 'boolean',
        'fecha_anulacion' => 'datetime',
    ];

    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class);
    }

    public function anuladaPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'anulada_por');
    }
}
