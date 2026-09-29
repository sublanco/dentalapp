<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('odontograma_piezas', function (Blueprint $table) {
            $table->string('cara', 20)->after('numero_pieza');
        });

        Schema::table('odontograma_piezas', function (Blueprint $table) {
            $table->dropUnique(
                'odontograma_piezas_paciente_id_numero_pieza_unique'
            );
        });

        Schema::table('odontograma_piezas', function (Blueprint $table) {
            $table->unique(
                ['paciente_id', 'numero_pieza', 'cara'],
                'odontograma_piezas_paciente_pieza_cara_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::table('odontograma_piezas', function (Blueprint $table) {
            $table->dropUnique(
                'odontograma_piezas_paciente_pieza_cara_unique'
            );
        });

        Schema::table('odontograma_piezas', function (Blueprint $table) {
            $table->dropColumn('cara');
        });

        Schema::table('odontograma_piezas', function (Blueprint $table) {
            $table->unique(
                ['paciente_id', 'numero_pieza'],
                'odontograma_piezas_paciente_id_numero_pieza_unique'
            );
        });
    }
};