<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Wagon;
use App\Models\Chargement;
use App\Models\DetailChargement;

class WagonController extends Controller
{

    public function index() {
        $wagons = Wagon::orderByRaw('CAST(num_wagon AS INT)')->get();
        return response()->json(['success' => true, 'data' => $wagons]);
    }

    public function show($id) {
        $wagon = Wagon::find($id);
        if (!$wagon) {
            return response()->json(['success' => false, 'message' => 'Wagon not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $wagon]);
    }

    public function store(Request $request) {
    $validated = $request->validate([
        'num_wagon' => 'required|string|unique:wagons', // changed from Num_wagon
        'type_wagon' => 'required|string', // changed from Type_wagon
        'statut' => 'required|string' // changed from Statut
    ]);

    try {
        $wagon = Wagon::create([
            'num_wagon' => $validated['num_wagon'],
            'type_wagon' => $validated['type_wagon'],
            'statut' => $validated['statut']
        ]);

        return response()->json([
            'success' => true,
            'data' => $wagon
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to create wagon',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function update(Request $request, $id) {
    $wagon = Wagon::find($id);
    if (!$wagon) {
        return response()->json(['success' => false, 'message' => 'Wagon not found'], 404);
    }

    $validated = $request->validate([
        'num_wagon' => 'required|unique:wagons,num_wagon,'.$id.',id_wagon', // changed
        'type_wagon' => 'required',
        'statut' => 'required'
    ]);

    $wagon->update($validated);
    return response()->json(['success' => true, 'data' => $wagon]);
}

    public function destroy($id) {
        $wagon = Wagon::find($id);
        if (!$wagon) {
            return response()->json(['success' => false, 'message' => 'Wagon not found'], 404);
        }

        $wagon->delete();
        return response()->json(['success' => true, 'message' => 'Wagon deleted']);
    }

    public function getCompletedWagonsCount()
    {
        $count = Chargement::where('statut', 'sorti')->count();
        return response()->json(['count' => $count]);
    }
    public function getCookingWagonsCount()
    {
        $count = Wagon::whereIn('statut', ['en attente', 'en cuisson', 'prêt à sortir'])->count();
        return response()->json(['count' => $count]);
    }
    public function getDashboardStats()
{
    $cookingWagons = Wagon::where('statut', 'en cuisson')->count();
    $totalPieces = DetailChargement::whereHas('chargement', function($query) {
        $query->whereIn('statut', ['en attente', 'en cuisson', 'prêt à sortir']);
    })->sum('quantite');

    return response()->json([
        'cooking_wagons' => $cookingWagons,
        'total_pieces' => $totalPieces
    ]);
}
}
