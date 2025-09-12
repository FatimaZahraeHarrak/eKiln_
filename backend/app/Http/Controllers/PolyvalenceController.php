<?php

namespace App\Http\Controllers;

use App\Models\Polyvalence;
use Illuminate\Http\Request;

class PolyvalenceController extends Controller
{
    /**
     * Store newly created polyvalence records
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_famille' => 'required|exists:familles,id_famille',
            'id_user' => 'required|exists:users,id_user',
        ]);

        // Vérifie si la polyvalence existe déjà
        $exists = Polyvalence::where('id_famille', $validated['id_famille'])
                            ->where('id_user', $validated['id_user'])
                            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Cette polyvalence existe déjà'], 409);
        }

        $polyvalence = Polyvalence::create($validated);

        return response()->json($polyvalence, 201);
    }

    /**
     * Get polyvalences for a specific user
     */
    public function show($userId)
    {
        $polyvalences = Polyvalence::with('famille')
                                  ->where('id_user', $userId)
                                  ->get();

        return response()->json($polyvalences);
    }

    /**
     * Remove a polyvalence record
     */
    public function destroy($id)
    {
        $polyvalence = Polyvalence::findOrFail($id);
        $polyvalence->delete();

        return response()->json(null, 204);
    }
}
