<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Token;

class CheckToken
{
    public function handle(Request $request, Closure $next)
    {
        $header = $request->header('Authorization');

        if (!$header || !preg_match('/Bearer\s+(.+)/', $header, $matches)) {
            return response()->json(['error' => 'Token required'], 401);
        }

        $token = $matches[1];

        $record = Token::where('token', $token)->first();

        if (!$record) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        if ($record->expired_flg) {
            return response()->json(['error' => 'Token expired'], 401);
        }

        return $next($request);
    }
}
