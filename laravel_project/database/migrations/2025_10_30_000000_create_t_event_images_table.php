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
        Schema::create('t_event_images', function (Blueprint $table) {
            $table->id(); // 画像ID
            $table->unsignedBigInteger('event_id'); // 紐づくイベントID
            $table->string('image_path', 255); // 画像ファイルのパス
            $table->timestamps(); // created_at, updated_at

            // 外部キー制約
            $table->foreign('event_id')->references('id')->on('t_events')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_event_images');
    }
};