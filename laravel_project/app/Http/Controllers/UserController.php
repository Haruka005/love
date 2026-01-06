<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Token;
use App\Mail\WelcomeMail;
use App\Mail\ResetPasswordMail;
use App\Mail\ChangeEmailMail;
use Carbon\Carbon;

class UserController extends Controller
{
    // 新規登録
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required', 'string', 'min:12',
                'regex:/[A-Z]/', 'regex:/[a-z]/',
                'regex:/[0-9]/', 'regex:/[!@&?]/'
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '入力エラーがあります',
                'errors'  => $validator->errors()
            ], 422);
        }

        return DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'user_status' => 1,
            ]);

            $verificationUrl = URL::temporarySignedRoute(
                'verification.verify',
                now()->addMinutes(60),
                ['id' => $user->id, 'hash' => sha1($user->getEmailForVerification())]
            );

            Mail::to($user->email)->send(new WelcomeMail($user, $verificationUrl));

            return response()->json([
                'message' => '登録完了',
                'user'    => [
                    'name'  => $user->name,
                    'email' => $user->email,
                ]
            ], 201);
        });
    }

    // ログイン
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '入力エラーがあります',
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'メールアドレスまたはパスワードが違います'], 401);
        }

        if ($user->is_locked) {
            if ($user->locked_at && $user->locked_at->addMinutes(5)->isFuture()) {
                return response()->json(['message' => 'アカウントがロック中です'], 403);
            } else {
                $user->update(['is_locked' => false, 'login_attempts' => 0, 'locked_at' => null]);
            }
        }

        if (Hash::check($request->password, $user->password)) {
            $token = bin2hex(random_bytes(32));
            Token::create([
                'user_id' => $user->id,
                'token' => $token,
                'token_expires_at' => now()->addHour(1),
                'last_used_at' => now(),
            ]);

            return response()->json([
                'message' => 'ログイン成功',
                'token'   => $token,
                'user'    => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ], 200);
        } else {
            $user->login_attempts++;
            if ($user->login_attempts >= 5) {
                $user->update(['is_locked' => true, 'locked_at' => now()]);
            } else {
                $user->save();
            }

            $msg = $user->is_locked ? 'アカウントロックしました' : 'メールアドレスまたはパスワードが違います';
            return response()->json(['message' => $msg], 401);
        }
    }

    public function me(Request $request)
    {
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $tokenValue = substr($authHeader, 7);
        $tokenRecord = Token::where('token', $tokenValue)
                            ->where('token_expires_at', '>', now())
                            ->first();

        if (!$tokenRecord) {
            return response()->json(['message' => 'Unauthenticated. Invalid token.'], 401);
        }

        $user = $tokenRecord->user;
        $tokenRecord->update(['last_used_at' => now()]);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ], 200);
    }

    public function getUsers()
    {
        $users = User::select('id', 'name', 'email', 'user_status', 'created_at')->get();
        return response()->json(['message' => 'ユーザー一覧取得成功', 'users' => $users], 200);
    }

    public function getUser($id)
    {
        $user = User::select('id', 'name', 'email', 'user_status')->find($id);
        if (!$user) {
            return response()->json(['message' => 'ユーザーが見つかりません'], 404);
        }
        return response()->json(['message' => 'ユーザー取得成功', 'user' => $user], 200);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'ユーザーが見つかりません'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'user_status' => 'required|in:0,1,2',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => '入力エラーがあります', 'errors' => $validator->errors()], 422);
        }

        $user->update($request->only(['name', 'email', 'user_status']));

        return response()->json(['message' => 'ユーザー情報を更新しました', 'user' => $user], 200);
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'email' => $request->email,
                'token' => Hash::make($token),
                'created_at' => now(),
                'expires_at' => now()->addMinutes(60),
            ]
        );

        $resetUrl = "http://localhost:3000/password-reset?token={$token}&email={$request->email}";
        Mail::to($request->email)->send(new ResetPasswordMail($resetUrl));

        return response()->json(['message' => '再設定メールを送信しました。']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:12|confirmed',
        ]);

        $resetData = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (!$resetData || !Hash::check($request->token, $resetData->token)) {
            return response()->json(['message' => 'トークンが無効です。'], 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'パスワードを再設定しました。']);
    }

    public function requestChange(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'new_email' => 'required|email|unique:users,email',
            'password' => 'required',
        ]);

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Password mismatch'], 401);
        }

        DB::table('t_email_change_requests')->where('user_id', $user->id)->delete();

        $token = Str::random(64);
        DB::table('t_email_change_requests')->insert([
            'user_id' => $user->id,
            'new_email' => $request->new_email,
            'token' => $token,
            'created_at' => now(),
            'expires_at' => now()->addHours(24),
        ]);

        $link = url("/api/email-change/confirm?token={$token}");
        Mail::to($request->new_email)->send(new ChangeEmailMail($link));

        return response()->json(['message' => '確認メールを送信しました']);
    }

    public function confirmChange(Request $request)
    {
        $token = $request->query('token');

        $requestData = DB::table('t_email_change_requests')
            ->where('token', $token)
            ->where('expires_at', '>', now())
            ->first();

        if (!$requestData) {
            return response()->json(['message' => 'トークンが無効か、期限切れです'], 400);
        }

        $user = User::find($requestData->user_id);
        if ($user) {
            $user->email = $requestData->new_email;
            $user->save();
        }

        DB::table('t_email_change_requests')->where('token', $token)->delete();

        return redirect('http://localhost:3000/email-change-success');
    }
}
