<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Four;

class FourController extends Controller
{
    public function index() {
        $fours = Four::all();
        return response()->json($fours);
    }
    public function updateCadence(Request $request, $id)
{
    $request->validate([
        'new_cadence' => 'required|numeric|min:1'
    ]);

    try {
        $four = Four::updateCadence($id, $request->new_cadence);
        return response()->json([
            'success' => true,
            'four' => $four,
            'message' => 'Cadence et durée de cuisson mises à jour avec succès'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la mise à jour: ' . $e->getMessage()
        ], 500);
    }
}

}
