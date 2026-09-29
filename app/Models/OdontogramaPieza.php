<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OdontogramaPieza extends Model
{
    protected $table = 'odontograma_piezas';

    protected $fillable = [
        'paciente_id',
        'numero_pieza',
        'estado',
        'observaciones',
    ];

    /**
     * Una pieza del odontograma pertenece a un paciente.
     */
    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class);
    }
}