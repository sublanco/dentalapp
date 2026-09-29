<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('odontograma_piezas', function (Blueprint $table) {
            $table->id();

            // Paciente al que pertenece la pieza dental
            $table->foreignId('paciente_id')
                ->constrained('pacientes')
                ->onDelete('cascade');

            // Número de la pieza dental: 11, 12, 21, 55, etc.
            $table->string('numero_pieza', 3);

            // Estado o tratamiento seleccionado
            $table->string('estado');

            // Observaciones opcionales
            $table->text('observaciones')->nullable();

            $table->timestamps();

            // Una sola marca por pieza y paciente
            $table->unique(
                ['paciente_id', 'numero_pieza']
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('odontograma_piezas');
    }
};