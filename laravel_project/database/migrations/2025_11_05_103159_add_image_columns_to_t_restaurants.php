<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('t_restaurants', function (Blueprint $table) {
            $table->string('topimage_path')->nullable()->after('url');
            $table->text('image_paths')->nullable()->after('topimage_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('t_restaurants', function (Blueprint $table) {
            $table->dropColumn(['topimage_path', 'image_paths']);
        });
    }
};