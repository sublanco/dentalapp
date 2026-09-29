<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consultas', function (Blueprint $table) {
            $table->id();

            // Relación con el paciente
            $table->foreignId('paciente_id')
                ->constrained('pacientes')
                ->onDelete('cascade');

            // Datos de la consulta
            $table->date('fecha_consulta');
            $table->text('motivo_consulta');
            $table->text('diagnostico')->nullable();
            $table->text('tratamiento')->nullable();
            $table->text('observaciones')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consultas');
    }
};