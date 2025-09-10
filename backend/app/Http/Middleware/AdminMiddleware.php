<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if( ($request->user() && $request->user()->role === 'admin')|| ($request->user() && $request->user()->role === 'chef d\'equipe')) {
            return $next($request);
        }

        return response()->json(['message' => 'Accès refusé. Admin uniquement.'], 403);
    }
}
